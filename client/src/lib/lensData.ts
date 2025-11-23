import { Lens } from '@/types/lens';

import lens1Cover from '@assets/stock_images/neon_holographic_dig_cf917332.jpg';
import lens2Cover from '@assets/stock_images/neon_holographic_dig_ac0b06f5.jpg';
import lens3Cover from '@assets/stock_images/neon_holographic_dig_044898d4.jpg';
import lens4Cover from '@assets/stock_images/neon_holographic_dig_7a39874b.jpg';
import lens5Cover from '@assets/stock_images/abstract_colorful_ne_295e1b8b.jpg';
import lens6Cover from '@assets/stock_images/abstract_colorful_ne_e89d8789.jpg';
import lens7Cover from '@assets/stock_images/abstract_colorful_ne_24f0d0e6.jpg';
import lens8Cover from '@assets/stock_images/abstract_colorful_ne_1d0370e8.jpg';
import lens9Cover from '@assets/stock_images/abstract_colorful_ne_964f7ab1.jpg';
import lens10Cover from '@assets/stock_images/abstract_colorful_ne_b03a8a6a.jpg';
import lens11Cover from '@assets/stock_images/abstract_colorful_ne_fb8d66af.jpg';
import lens12Cover from '@assets/stock_images/abstract_colorful_ne_e3db35e9.jpg';

const FIXED_LENS_PRICE = 2324; // Price for lenses 2-12 in XRT

export const mockLenses: Lens[] = [
  { id: '887d80da-f4ba-4a40-a0d6-4e4d0cfb31b1', name: 'Lens 01', displayName: 'Cosmic Vibes', coverImage: lens1Cover, groupId: 'b5551368-7881-4a23-a034-a0e757ec85a7', price: 100 },
  { id: '43276710876', name: 'Lens 02', displayName: 'Rainbow Blast', coverImage: lens2Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43276930875', name: 'Lens 03', displayName: 'Pixel Paradise', coverImage: lens3Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43281170875', name: 'Lens 04', displayName: 'Electric Dreams', coverImage: lens4Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43288720877', name: 'Lens 05', displayName: 'Prism Party', coverImage: lens5Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43288930875', name: 'Lens 06', displayName: 'Neon Nights', coverImage: lens6Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43290810875', name: 'Lens 07', displayName: 'Retro Wave', coverImage: lens7Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43290830875', name: 'Lens 08', displayName: 'Glitch Mode', coverImage: lens8Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43293650876', name: 'Lens 09', displayName: 'Crystal Burst', coverImage: lens9Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43294710875', name: 'Lens 10', displayName: 'Vapor Dreams', coverImage: lens10Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43296870875', name: 'Lens 11', displayName: 'Cyber Glow', coverImage: lens11Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
  { id: '43296900875', name: 'Lens 12', displayName: 'Laser Lights', coverImage: lens12Cover, groupId: '2a385df2-4591-47df-9594-b273b456c862', price: FIXED_LENS_PRICE },
];
