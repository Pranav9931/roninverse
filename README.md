# RoninVerse 🎮

> Decentralized AR Lens & Game Marketplace on Ronin Saigon Testnet

[![Built with Replit](https://img.shields.io/badge/Built%20with-Replit-orange)](https://replit.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
![Ronin Saigon](https://img.shields.io/badge/Network-Ronin%20Saigon-87CEEB)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)

RoninVerse is a blockchain-powered marketplace for AR lenses and WebXR games built on the Ronin Saigon testnet. Purchase, own, and experience immersive AR content with true digital ownership using the RON token.

## Features

### AR Games (Lenses)
- **12 Unique AR Lenses**: Each with stunning visual effects from cosmic vibes to cyberpunk aesthetics
- **Real-time AR Effects**: Powered by Snap Camera Kit for professional-quality AR rendering
- **Camera Controls**: Front/back camera switching, photo capture with AR effects applied
- **Mobile-First Design**: Optimized for one-handed mobile use with touch-friendly controls

### WebXR Games
- **Browser-based Games**: Play immersive WebXR games without downloads
- **Full-Screen Experience**: Mobile-optimized player for seamless gameplay
- **First Game**: "UEEAAUUEEAA" - An immersive WebXR experience

### Blockchain Integration
- **Ronin Saigon Testnet**: Built on Ronin's high-performance blockchain
- **Smart Contract**: GameLicensing contract at `0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846`
- **Multi-Wallet Support**: Ronin Wallet, MetaMask, and Keplr compatibility
- **RON Payments**: All purchases in RON tokens (0.1-0.3 RON)
- **True Ownership**: On-chain license verification

### User Experience
- **Privy Authentication**: Sign in with wallet, email, or Google
- **Unified Interface**: All games (AR & WebXR) in one cohesive marketplace
- **Responsive Design**: Seamless experience from mobile to desktop
- **Sky Blue Theme**: Beautiful modern UI with #87CEEB accent color

## Technology Stack

### Frontend
- **React 18** - Modern UI with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management

### Blockchain
- **Ronin Saigon** - High-performance testnet (Chain ID: 2021)
- **ethers.js v6** - Web3 blockchain interactions
- **Smart Contracts** - Solidity 0.8.20 with OpenZeppelin

### AR & Gaming
- **Snap Camera Kit** - Professional AR lens rendering
- **WebXR** - Immersive browser-based games
- **Canvas API** - Real-time AR effects

### Backend
- **Express.js** - RESTful API server
- **PostgreSQL** - Neon serverless database (optional)
- **Drizzle ORM** - Type-safe database queries
- **Privy** - Web3 authentication

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or compatible package manager
- Ronin Wallet, MetaMask, or Keplr (for purchases)
- RON tokens on Ronin Saigon testnet

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd roninverse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see Configuration section below)

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```bash
# Database (automatically configured on Replit)
DATABASE_URL=your_postgres_connection_string

# Privy Authentication
VITE_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Snap Camera Kit
VITE_SNAP_API_TOKEN=your_snap_api_token
VITE_SNAP_GROUP_ID=your_snap_group_id

# Optional: For contract deployment
PRIVATE_KEY=contract_owner_private_key
```

### Snap Camera Kit Setup

1. Sign up at [camera-kit.snapchat.com](https://camera-kit.snapchat.com/)
2. Create a new application
3. Generate API token and note your Group ID
4. Upload or select AR lenses
5. Add credentials to `.env` file

See [SETUP.md](./SETUP.md) for detailed Snap Camera Kit configuration.

### Privy Setup

1. Sign up at [privy.io](https://privy.io)
2. Create a new application
3. Configure login methods (wallet, email, Google)
4. Copy App ID to `VITE_PRIVY_APP_ID`
5. Copy App Secret to `PRIVY_APP_SECRET`

## Blockchain Integration

### Ronin Saigon Testnet Details

- **Network**: Ronin Saigon Testnet
- **Chain ID**: `2021` (0x7e5)
- **RPC URL**: `https://saigon-testnet.roninchain.com/rpc`
- **Block Explorer**: `https://saigon-app.roninchain.com`
- **Native Token**: RON (18 decimals)

### GameLicensing Smart Contract

- **Contract Address**: `0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846`
- **Network**: Ronin Saigon Testnet
- **License System**: On-chain purchase verification
- **Pricing**: 0.1 - 0.3 RON per item

**Item Catalog:**
- **IDs 1-12**: AR Lenses (Cosmic Vibes through Laser Lights)
- **ID 13+**: WebXR Games (UEEAAUUEEAA)

### Wallet Support

RoninVerse supports multiple wallet providers:

1. **Ronin Wallet** (Recommended)
   - Native Ronin integration
   - Optimized for Ronin Saigon

2. **MetaMask**
   - Automatic network addition
   - Multi-provider support

3. **Keplr**
   - EVM provider compatibility

### Purchasing Items

1. **Connect Wallet**: Use Ronin Wallet, MetaMask, or Keplr
2. **Get RON Tokens**: Ensure you have RON on Ronin Saigon testnet
3. **Browse Marketplace**: View all available lenses and games
4. **Purchase**: Click "Purchase" and approve the transaction
5. **Instant Access**: Item unlocks immediately upon confirmation

### Contract Deployment

To initialize all items on the smart contract:

```bash
# Deploy all 13 items (12 lenses + 1 game)
npx tsx deployGames.ts <PRIVATE_KEY>
```

The deployment script creates all catalog items on-chain with their respective prices. See `deployGames.ts` for implementation details.

## 💰 Pricing

All items are priced in RON tokens on Ronin Saigon:

**AR Lenses (IDs 1-12):**
- Cosmic Vibes: 0.1 RON
- Rainbow Blast: 0.12 RON
- Pixel Paradise: 0.13 RON
- Electric Dreams: 0.15 RON
- Prism Party: 0.14 RON
- Neon Nights: 0.16 RON
- Retro Wave: 0.18 RON
- Glitch Mode: 0.2 RON
- Crystal Burst: 0.22 RON
- Vapor Dreams: 0.25 RON
- Cyber Glow: 0.28 RON
- Laser Lights: 0.3 RON

**WebXR Games (ID 13+):**
- UEEAAUUEEAA: 0.25 RON

## Project Structure

```
roninverse/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities, data, and configs
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
│   └── index.html
├── contracts/             # Smart contracts
│   └── GameLicensing.sol  # Main licensing contract
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Storage layer
│   └── index.ts           # Server entry point
├── deployGames.ts         # Contract deployment script
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Database Schema

### Users Table
Stores authenticated user data:
- `id` - UUID primary key
- `privyId` - Privy user ID (unique)
- `walletAddress` - User's wallet address
- `email` - User's email (optional)
- `phoneNumber` - User's phone (optional)
- `createdAt` - Account creation timestamp

## Game Data

### AR Lenses (Games 1-12)
Each AR lens features unique visual effects:
- Cosmic Vibes, Rainbow Blast, Pixel Paradise
- Electric Dreams, Prism Party, Neon Nights
- Retro Wave, Glitch Mode, Crystal Burst
- Vapor Dreams, Cyber Glow, Laser Lights

### WebXR Games (13+)
- **Game 13**: UEEAAUUEEAA - Immersive WebXR experience
- More games coming soon!

## License System

### How It Works
1. User authenticates with Privy
2. User browses game marketplace
3. Unlicensed games show "Purchase" button
4. Purchase flow:
   - Connect wallet (Ronin Wallet, MetaMask, or Keplr)
   - Approve transaction (0.1-0.3 RON per item)
   - Smart contract verifies payment
   - Game unlocks automatically
5. Owned games appear in "Your Library"
6. Licensed games show "Play Game" button

### Security Features
- JWT token verification
- Server-side authentication
- Smart contract ownership validation
- Secure transaction encoding
- No default lens fallbacks

## Development

### Adding New AR Lenses

1. Upload lens to Snap Camera Kit
2. Add lens data to `client/src/lib/lensData.ts`:
```typescript
{
  id: 'lens-13',
  name: 'Lens 13',
  displayName: 'Your Lens Name',
  groupId: 'your_group_id',
  price: 0.15,  // Price in RON
  coverImage: '/path/to/cover.jpg'
}
```
3. Deploy corresponding item to smart contract via `deployGames.ts`

### Adding WebXR Games

1. Host your WebXR game
2. Add game data to `client/src/lib/gameData.ts`:
```typescript
{
  id: 'game-your-slug',
  name: 'YourGame',
  displayName: 'Your Game Name',
  description: 'Game description',
  url: 'https://your-game-url.com',
  price: 0.25,  // Price in RON
  coverImage: '/path/to/cover.jpg',
  isMobileOnly: true
}
```
3. Deploy game to smart contract via `deployGames.ts`

## Troubleshooting

### Camera not working
- Ensure HTTPS connection (required for camera access)
- Grant camera permissions when prompted
- Check Snap Camera Kit credentials are valid
- Verify browser supports WebRTC

### Purchase fails
- Ensure wallet is connected (Ronin Wallet, MetaMask, or Keplr)
- Verify you're on Ronin Saigon (chain ID: 2021)
- Check RON balance (need 0.1-0.3 RON per item)
- Confirm sufficient RON for gas fees
- Check that the item exists on-chain (may need to deploy first)

### Lens not applying
- Verify Snap Camera Kit API token is correct
- Check lens ID and group ID match
- Ensure lens is published in Snap Camera Kit dashboard
- Check browser console for errors

## Deployment

### Replit Deployment
The app is configured for easy deployment on Replit:
1. Push changes to main branch
2. Click "Deploy" in Replit
3. App publishes automatically with custom domain support

### Environment Setup
Ensure all environment variables are set in Replit Secrets:
- Database URL (auto-configured)
- Privy credentials
- Snap Camera Kit credentials

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support & Documentation

- **Ronin Network**: [docs.roninchain.com](https://docs.roninchain.com/)
- **Snap Camera Kit**: [camera-kit.snapchat.com](https://camera-kit.snapchat.com/)
- **Privy**: [docs.privy.io](https://docs.privy.io/)
- **ethers.js**: [docs.ethers.org/v6/](https://docs.ethers.org/v6/)
- **Issues**: Open a GitHub issue

## License

MIT License - See LICENSE file for details

## Acknowledgments

- **Ronin Network** - High-performance blockchain infrastructure
- **Snap Inc.** - Professional AR Camera Kit technology
- **Privy** - Seamless Web3 authentication
- **shadcn/ui** - Beautiful component library
- **Replit** - Development and deployment platform

---

**Built with ❤️ for the Ronin ecosystem**

*RoninVerse - Where AR meets blockchain on Ronin Saigon* 🎮✨
