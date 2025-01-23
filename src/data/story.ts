import { Page } from '../types';

import forestImage from '../assets/fon/forest.png';
import forestAudio from '../assets/glas/sample.mp3';

export const storyPages: Page[] = [
  {
    id: 1,
    image: forestImage,
    text: "В сърцето на гората има група деца, които обичат да играят на изследователи. Те често скитат, търсейки нови приключения и всеки път откриват нови и интересни загадки. Макс е любопитен и винаги търси нови преживявания и предизвикателства. Той има любов към науката и технологиите и харесва да човърка джаджи и машинки. ",
    audio: forestAudio,
    choices: [{ 
        text: "Алекс е брат близнак на Макс и въпреки, че споделя любовта към приключенията, той е по-методичен в подхода си. Запален читател е и обича фентъзи романи, като често се губи в техните светове. Лили е съседското момиче и единственото дете на двойка ботаници, които често пътуват по работа. В резултат на това тя прекарва доста време сама, изследвайки горите около къщата им, развивайки дълбока любов и уважение към природата.", 
        nextPageId: 2 
      },
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