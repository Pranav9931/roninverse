import { Game } from '@/types/game';
import gameCover from '@assets/stock_images/futuristic_gaming_ne_ddadd80d.jpg';

export const mockGames: Game[] = [
  {
    id: 'game-ueeaauueeaa',
    name: 'UEEAAUUEEAA',
    displayName: 'UEEAAUUEEAA',
    description: 'Immersive AR gaming experience',
    price: 4540,
    coverImage: gameCover,
    url: 'https://alivestudios.8thwall.app/neworldeffects/',
    isMobileOnly: false,
  },
];

export const getGameId = (gameId: string): number => {
  const index = mockGames.findIndex(g => g.id === gameId);
  if (index === -1) {
    throw new Error(`Invalid game ID: ${gameId}. Game not found in catalog.`);
  }
  return 13 + index; // Games start at ID 13
};
