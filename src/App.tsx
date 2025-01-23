import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';
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

  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [textOpacity, setTextOpacity] = useState(0);
  const [buttonsOpacity, setButtonsOpacity] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canStartReveal, setCanStartReveal] = useState(false);
  const [coverOverlayOpacity, setCoverOverlayOpacity] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentPage = state.currentPage === 0 ? null : storyPages.find(page => page.id === state.currentPage);
  
  // Handle cover page fade in
  useEffect(() => {
    if (state.currentPage !== 0) return;
    
    const timer = setTimeout(() => {
      setCoverOverlayOpacity(0);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [state.currentPage]);

  // Preload image
  useEffect(() => {
    if (state.currentPage === 0 || !currentPage) return;
    
    setImageLoaded(false);
    setOverlayOpacity(1);
    setTextOpacity(0);
    setButtonsOpacity(0);
    
    const img = new Image();
    img.src = currentPage.image;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [state.currentPage]);

  // Handle loading sequence
  useEffect(() => {
    if (!imageLoaded || state.currentPage === 0) return;

    // Start fading out the black overlay
    const fadeOutOverlay = setTimeout(() => {
      setOverlayOpacity(0);
    }, 500);

    // Start fading in the text
    const fadeInText = setTimeout(() => {
      setTextOpacity(1);
    }, 500);

    // Start fading in the buttons
    const fadeInButtons = setTimeout(() => {
      setButtonsOpacity(1);
      setCanStartReveal(true);
    }, 500);

    return () => {
      clearTimeout(fadeOutOverlay);
      clearTimeout(fadeInText);
      clearTimeout(fadeInButtons);
    };
  }, [imageLoaded]);

  useEffect(() => {
    if (!canStartReveal || state.currentPage === 0 || !currentPage) return;
    
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
    }
  }, [state.currentPage, state.textRevealIndex, state.useVoice, state.isPlaying, canStartReveal]);

  useEffect(() => {
    if (state.currentPage === 0 || !currentPage) return;
    
    const isTopTextComplete = state.textRevealIndex >= currentPage.text.length;
    if (!isTopTextComplete) return;

    let bottomText = '';
    if (currentPage.choices) {
      bottomText = currentPage.choices.map((choice, index) => `${index + 1}) ${choice.text}`).join('\n');
    } else {
      const nextPage = storyPages.find(page => page.id > currentPage.id);
      if (!nextPage) {
        bottomText = 'Start over?';
      } else {
        bottomText = nextPage.text;
      }
    }

    if (state.bottomTextRevealIndex < bottomText.length) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          bottomTextRevealIndex: prev.bottomTextRevealIndex + 1
        }));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [state.currentPage, state.textRevealIndex, state.bottomTextRevealIndex]);

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

    setCanStartReveal(false);
    setTextOpacity(0);
    setButtonsOpacity(0);
    setOverlayOpacity(1);
    
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

  const handleStartOver = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setCanStartReveal(false);
    setTextOpacity(0);
    setButtonsOpacity(0);
    setOverlayOpacity(1);
    setCoverOverlayOpacity(1);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setState({
      currentPage: 0,
      textRevealIndex: 0,
      bottomTextRevealIndex: 0,
      showChoices: false,
      useVoice: null,
      isPlaying: false,
      isTransitioning: false
    });
  };

  const handleVoicePreference = async (useVoice: boolean) => {
    setCanStartReveal(false);
    setTextOpacity(0);
    setButtonsOpacity(0);
    setOverlayOpacity(1);
    setCoverOverlayOpacity(1);

    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for fade-out to complete

    setState({
      currentPage: 1,
      textRevealIndex: 0,
      bottomTextRevealIndex: 0,
      showChoices: false,
      useVoice,
      isPlaying: false,
      isTransitioning: false
    });

    setOverlayOpacity(0);
  };

  // Cover Page
  if (state.currentPage === 0) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity duration-1000"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570)',
            opacity: 1 - coverOverlayOpacity
          }}
        />
        
        {/* Black overlay */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-1000"
          style={{ opacity: coverOverlayOpacity }}
        />
        
        <div className="relative h-full flex flex-col items-center justify-center text-white space-y-12">
          <h1 className="text-6xl font-serif animate-fade-in-heading">The Journey Begins</h1>
          
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

  let bottomText = '';
  let revealedBottomText = '';
  const nextPage = !currentPage.choices ? storyPages.find(page => page.id > currentPage.id) : null;

  if (currentPage.choices) {
    bottomText = currentPage.choices.map((choice, index) => `${index + 1}) ${choice.text}`).join('\n');
    revealedBottomText = bottomText.slice(0, state.bottomTextRevealIndex);
  } else if (nextPage) {
    bottomText = nextPage.text;
    revealedBottomText = bottomText.slice(0, state.bottomTextRevealIndex);
  } else {
    bottomText = 'Start over?';
    revealedBottomText = bottomText.slice(0, state.bottomTextRevealIndex);
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${currentPage.image})`
        }}
      />

      {/* Transition overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: overlayOpacity }}
      />

      <div 
        className="relative h-full flex flex-col justify-between p-8 z-10 transition-opacity duration-500"
        style={{ opacity: textOpacity }}
      >
        {/* Top text box */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative text-2xl font-serif">
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
                  <div className="whitespace-pre-line leading-relaxed">
                    {revealedBottomText}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation circles */}
          {isTextFullyRevealed && state.bottomTextRevealIndex >= bottomText.length && (
            <div 
              className="flex flex-col gap-3 transition-opacity duration-500"
              style={{ opacity: buttonsOpacity }}
            >
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
              ) : (
                <button
                  onClick={handleStartOver}
                  className="w-12 h-12 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  <RotateCcw size={24} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;