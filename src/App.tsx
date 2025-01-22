import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Volume2, VolumeX, Circle } from 'lucide-react';
import { storyPages } from './data/story';
import type { StoryState } from './types';

function App() {
  const [state, setState] = useState<StoryState>({
    currentPage: 0,
    textRevealIndex: 0,
    bottomTextRevealIndex: 0,
    showChoices: false,
    useVoice: null,
    isPlaying: false,
    isTransitioning: false
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentPage = state.currentPage === 0 ? null : storyPages.find(page => page.id === state.currentPage);
  
  useEffect(() => {
    if (state.currentPage === 0 || !currentPage) return;
    
    if (state.useVoice && currentPage.audio && !state.isPlaying) {
      audioRef.current = new Audio(currentPage.audio);
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }

    const text = currentPage.text;
    if (state.textRevealIndex < text.length) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          textRevealIndex: prev.textRevealIndex + 1
        }));
      }, 20);
      return () => clearTimeout(timer);
    } else if (!currentPage.choices) {
      setState(prev => ({ ...prev, showChoices: true }));
    }
  }, [currentPage, state.textRevealIndex, state.useVoice, state.isPlaying]);

  // Effect for bottom text reveal
  useEffect(() => {
    if (state.currentPage === 0 || !currentPage) return;
    
    const isTopTextComplete = state.textRevealIndex >= currentPage.text.length;
    if (!isTopTextComplete) return;

    const nextPage = !currentPage.choices ? storyPages.find(page => page.id > currentPage.id) : null;
    if (!nextPage) return;

    const bottomText = nextPage.text;
    if (state.bottomTextRevealIndex < bottomText.length) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          bottomTextRevealIndex: prev.bottomTextRevealIndex + 1
        }));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [currentPage, state.textRevealIndex, state.bottomTextRevealIndex]);

  const handleNextPage = async (nextPageId?: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!nextPageId) {
      const nextPage = storyPages.find(page => page.id > state.currentPage);
      if (!nextPage) return;
      nextPageId = nextPage.id;
    }

    // Start transition
    setState(prev => ({ ...prev, isTransitioning: true }));

    // Wait for fade to black
    await new Promise(resolve => setTimeout(resolve, 500));

    setState({
      currentPage: nextPageId,
      textRevealIndex: 0,
      bottomTextRevealIndex: 0,
      showChoices: false,
      useVoice: state.useVoice,
      isPlaying: false,
      isTransitioning: false
    });
  };

  const handleVoicePreference = (useVoice: boolean) => {
    setState({
      currentPage: 1,
      textRevealIndex: 0,
      bottomTextRevealIndex: 0,
      showChoices: false,
      useVoice,
      isPlaying: false,
      isTransitioning: false
    });
  };

  // Cover Page
  if (state.currentPage === 0) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570)'
          }}
        />
        
        <div className="relative h-full flex flex-col items-center justify-center text-white space-y-12">
          <h1 className="text-6xl font-serif">The Journey Begins</h1>
          
          <div className="flex flex-col items-center space-y-8 opacity-0 animate-fade-in">
            <p className="text-2xl">How would you like to experience the story?</p>
            
            <div className="flex space-x-6">
              <button
                onClick={() => handleVoicePreference(true)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-all"
              >
                <Volume2 size={24} />
                <span>Read to me</span>
              </button>
              
              <button
                onClick={() => handleVoicePreference(false)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-all"
              >
                <VolumeX size={24} />
                <span>I'll read myself</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPage) return null;

  const revealedText = currentPage.text.slice(0, state.textRevealIndex);
  const isTextFullyRevealed = state.textRevealIndex >= currentPage.text.length;

  // Find the next page for continuation text
  const nextPage = !currentPage.choices ? storyPages.find(page => page.id > currentPage.id) : null;
  const bottomRevealedText = nextPage ? nextPage.text.slice(0, state.bottomTextRevealIndex) : '';

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center ${state.isTransitioning ? 'fade-to-black' : 'fade-from-black'}`}
        style={{ 
          backgroundImage: `url(${currentPage.image})`
        }}
      />

      {/* Black overlay for transition */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          state.isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
      />

      <div className="relative h-full flex flex-col justify-between p-8">
        {/* Top text box */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative text-2xl font-serif transition-opacity duration-500">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm -m-4 rounded-lg" />
            <p className="relative text-white p-4 leading-relaxed">
              {revealedText}
            </p>
          </div>
        </div>

        {/* Bottom section with text box and navigation */}
        <div className="w-full max-w-4xl mx-auto flex justify-between items-end">
          {/* Bottom text box */}
          <div className="flex-grow relative text-xl font-serif mr-8">
            {isTextFullyRevealed && (
              <>
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm -m-4 rounded-lg" />
                <div className="relative text-white p-4">
                  {currentPage.choices ? (
                    <div className="space-y-2">
                      {currentPage.choices.map((choice, index) => (
                        <p key={index} className="leading-relaxed">
                          {index + 1}) {choice.text}
                        </p>
                      ))}
                    </div>
                  ) : nextPage ? (
                    <p className="leading-relaxed">{bottomRevealedText}</p>
                  ) : (
                    <p className="leading-relaxed">The end of your journey awaits...</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Navigation circles */}
          {isTextFullyRevealed && (
            <div className="flex flex-col gap-3">
              {currentPage.choices ? (
                currentPage.choices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleNextPage(currentPage.choices![index].nextPageId)}
                    className="w-12 h-12 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                  >
                    {index + 1}
                  </button>
                ))
              ) : nextPage ? (
                <button
                  onClick={() => handleNextPage()}
                  className="w-12 h-12 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;