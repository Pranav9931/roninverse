# NeoSaga - AR Camera Experience

[![Built with Replit](https://img.shields.io/badge/Built%20with-Replit-orange)](https://replit.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)

NeoSaga is a next-generation AR gaming platform that combines Snap Camera Kit AR lenses with blockchain-powered game licensing. Experience immersive AR games directly in your browser, with secure ownership powered by Saga blockchain.

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
- **Per-Game Licensing**: Own individual games via Saga blockchain smart contracts
- **Secure Purchases**: Keplr wallet integration for safe transactions
- **Your Library**: Track all owned games in one place
- **License Verification**: Real-time ownership verification via smart contract

### User Experience
- **Privy Authentication**: Sign in with wallet, email, or Google
- **Unified Interface**: All games (AR & WebXR) in one cohesive marketplace
- **Responsive Design**: Seamless experience from mobile to desktop
- **Dark Theme**: Easy on the eyes with #C1FF72 accent color

## Technology Stack

### Frontend
- **React 18** - Modern UI with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management

### AR & Gaming
- **Snap Camera Kit** - Professional AR lens rendering
- **WebXR** - Immersive browser-based games
- **Canvas API** - Real-time AR effects

### Backend
- **Express.js** - RESTful API server
- **PostgreSQL** - Neon serverless database
- **Drizzle ORM** - Type-safe database queries
- **Privy** - Web3 authentication

### Blockchain
- **Saga Chainlet** - OpenXR gaming-optimized chain
- **Keplr Wallet** - EVM transaction signing
- **ethers.js** - Blockchain interaction library
- **GameLicensing Contract** - Smart contract at `0x91C7B6f8905060D6aE711878020DB15E90C697E0`

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Keplr wallet browser extension (for game purchases)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd neosaga
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

### Saga Chainlet Details

- **Chain**: Saga Chainlet (OpenXR)
- **Chain ID**: `2763783314764000`
- **RPC**: `https://openxr-2763783314764000-1.jsonrpc.sagarpc.io`
- **Explorer**: `https://openxr-2763783314764000-1.sagaexplorer.io`
- **Native Token**: XRT (18 decimals)

### GameLicensing Smart Contract

- **Address**: `0x91C7B6f8905060D6aE711878020DB15E90C697E0`
- **Game IDs**: 1-12 (AR Lenses), 13+ (WebXR Games)
- **Price per AR Lens**: 2324 XRT
- **Total for all AR Lenses**: 27,888 XRT

### Purchasing Games

1. Connect Keplr wallet
2. Ensure you have XRT tokens in your wallet
3. Browse games in the marketplace
4. Click "Purchase" on desired game
5. Approve transaction in Keplr
6. Game unlocks immediately upon confirmation

### Contract Deployment

If you're the contract owner and need to deploy games 2-12:

```bash
export PRIVATE_KEY="your_private_key"
node scripts/deploy-games.js
```

See [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) for details.

## Project Structure

```
neosaga/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and data
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
│   └── index.html
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── shared/                # Shared types/schemas
│   └── schema.ts          # Drizzle database schema
├── scripts/               # Deployment scripts
│   └── deploy-games.js    # Contract game deployment
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
   - Connect Keplr wallet
   - Approve transaction (2324 XRT for AR lenses, varies for WebXR)
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
  name: '13',
  displayName: 'Lens 13 - Your Name',
  groupId: 'your_group_id',
  lensId: 'your_lens_id',
  price: 2324,
  coverImage: '/path/to/cover.jpg'
}
```
3. Deploy corresponding game to smart contract (game ID 13)

### Adding WebXR Games

1. Host your WebXR game
2. Add game data to `client/src/lib/gameData.ts`:
```typescript
{
  id: 'game-your-slug',
  displayName: 'Your Game Name',
  gameUrl: 'https://your-game-url.com',
  price: 4540,
  coverImage: '/path/to/cover.jpg',
  isMobileOnly: true
}
```
3. Deploy game to smart contract with appropriate game ID

## Troubleshooting

### Camera not working
- Ensure HTTPS connection (required for camera access)
- Grant camera permissions when prompted
- Check Snap Camera Kit credentials are valid
- Verify browser supports WebRTC

### Purchase fails
- Ensure Keplr wallet is connected
- Verify you're on Saga chain (chain ID: 2763783314764000)
- Check XRT balance (need 2324+ XRT per AR lens)
- Confirm gas fees (small amount of XRT)

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

## Support

- Documentation: See `SETUP.md` and `DEPLOYMENT_INSTRUCTIONS.md`
- Issues: Open a GitHub issue
- Snap Camera Kit: [camera-kit.snapchat.com](https://camera-kit.snapchat.com/)
- Privy: [docs.privy.io](https://docs.privy.io/)
- Saga: [docs.saga.xyz](https://docs.saga.xyz/)

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Snap Camera Kit for AR technology
- Privy for Web3 authentication
- Saga for gaming-optimized blockchain
- shadcn for beautiful UI components
- Replit for seamless deployment

---

**Built with passion for the future of AR gaming** 🎮✨
