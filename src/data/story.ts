import { Page } from '../types';

export const storyPages: Page[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27',
    text: "The ancient forest stretched endlessly before you, its twisted branches reaching toward the darkening sky. The path ahead splits into shadows, each direction holding its own mysteries.",
    audio: "https://go.escom.tv/lg340/sample.mp3",
    choices: [
      { text: "Take the misty path to the left", nextPageId: 2 },
      { text: "Follow the moonlit trail to the right", nextPageId: 3 }
    ]
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
    text: "The mist swirls around your feet as you venture deeper into the unknown. Strange whispers echo through the trees.",
    audio: "https://go.escom.tv/lg340/sample.mp3",
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    text: "Moonlight bathes the path in an ethereal glow. Up ahead, you see what appears to be an ancient structure.",
    audio: "https://go.escom.tv/lg340/sample.mp3",
    choices: [
      { text: "Investigate the structure", nextPageId: 4 },
      { text: "Continue along the path", nextPageId: 5 },
      { text: "Turn back while you still can", nextPageId: 1 }
    ]
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1533069027836-fa937181a8ce',
    text: "The structure reveals itself to be an ancient temple, its walls covered in mysterious glowing symbols.",
    audio: "https://go.escom.tv/lg340/sample.mp3",
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
    text: "The path leads you to a clearing where strange lights dance in the distance.",
    audio: "https://go.escom.tv/lg340/sample.mp3",
  }
];