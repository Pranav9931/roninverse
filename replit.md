# RoninVerse - AR Marketplace

## Overview

RoninVerse is a blockchain-powered AR lens and game marketplace built on the Ronin Saigon testnet. The application integrates Snap Camera Kit for AR lens experiences and supports WebXR games, all purchasable with RON tokens. Built with React and Express, it features a marketplace interface with real-time AR preview, multi-wallet support (Ronin Wallet, MetaMask, Keplr), and user authentication via Privy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management and data fetching

**UI Component System**
- Radix UI primitives for accessible, unstyled base components
- Tailwind CSS for utility-first styling with custom design tokens
- shadcn/ui component patterns for consistent UI elements
- Custom CSS variables for theme management (light/dark mode support)

**AR Camera Integration**
- Snap Camera Kit SDK (`@snap/camera-kit`) for AR lens rendering
- Custom `useCameraKit` hook managing camera lifecycle, permissions, and lens application
- Canvas-based rendering for real-time AR effects
- MediaStream API for camera access and video capture

**State Management Pattern**
- React hooks for local component state
- Custom hooks (`useCameraKit`) encapsulating complex camera logic
- Context providers for global state (Privy authentication)
- Query client for server-synchronized state

**Key Features**
- Free AR lens selection and application
- Real-time camera preview with AR effects
- Photo capture with AR filters applied
- Lens marketplace browser
- User profile with wallet management

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- TypeScript for type safety across the stack
- RESTful API design pattern

**Authentication & Authorization**
- Privy for user authentication (wallet, email, Google login)
- JWT token verification via `@privy-io/server-auth`
- Server-side token validation for protected endpoints
- User session management
- AuthGuard component wraps camera interface to enforce authentication
- Automatic user sync to backend database upon successful login
- Secure token-based API authentication on all protected routes

**Data Storage Strategy**
- PostgreSQL database using Replit's built-in Neon serverless database
- Drizzle ORM for type-safe database queries and schema management
- User schema with Privy ID, wallet address, email, and phone number fields
- Database migrations managed via `npm run db:push` command
- Connection via `DATABASE_URL` environment variable (automatically configured)

**Database Tables**:
- `users`: Stores authenticated user data with UUID primary keys
  - id: varchar (UUID, auto-generated)
  - privyId: text (unique, not null)
  - walletAddress: text (nullable)
  - email: text (nullable)
  - phoneNumber: text (nullable)
  - createdAt: timestamp (auto-generated)

### External Dependencies

**Snap Camera Kit Integration**
- API Token and Group ID required for AR lens functionality
- Lens IDs configured per lens effect
- Bootstrap initialization pattern for Camera Kit SDK
- Real-time canvas rendering for AR effects

**Ronin Saigon Blockchain Integration (GameLicensing Contract)**
- Chain: Ronin Saigon Testnet
- Chain ID: 2021 (0x7e5)
- RPC URL: https://saigon-testnet.roninchain.com/rpc
- Block Explorer: https://saigon-app.roninchain.com
- Contract Address: 0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846
- Native Token: RON (18 decimals)
- License Price: 0.1-0.3 RON per item
- Each AR lens maps to a unique gameId (1-12) on the smart contract
- WebXR games start at gameId 13+
- Users must purchase each item separately (individual licenses)
- Wallet Integration: Ronin Wallet, MetaMask, Keplr for EVM transactions
- Transaction Flow: User selects item → Purchases license for that gameId → Smart contract verifies payment → Item unlocked
- Deployment: Contract owner lists all items using `deployGames.ts`

**Privy Authentication Service**
- App ID: `cmhdsknrh003zjp0chko9z886` (stored in VITE_PRIVY_APP_ID)
- App Secret stored securely in PRIVY_APP_SECRET environment variable
- Multiple login methods: email, wallet, Google OAuth
- Custom branding with dark theme and #C1FF72 accent color
- Server-side token verification for API security using PrivyClient
- API endpoint: POST /api/auth/login for user sync
- Authentication flow: Login → JWT verification → Database sync → Camera access

**Neon Serverless PostgreSQL**
- Configured via `@neondatabase/serverless` driver
- Connection via `DATABASE_URL` environment variable
- Designed for serverless deployment environments

**Third-Party UI Libraries**
- React Icons for social sharing icons
- Embla Carousel (via `useEmblaCarousel`) for lens selection UI
- Lucide React for icon system
- Google Fonts (Inter, Space Grotesk, Lexend Deca) for typography

### Design System

**Mobile-First Approach**
- Full viewport camera canvas (100vh)
- Touch-optimized controls for one-handed use
- Bottom-anchored control bar with safe area awareness
- Horizontal lens carousel in thumb-accessible zone

**Visual Hierarchy**
- Camera-first immersive experience with minimal UI chrome
- Floating controls with backdrop blur for readability over camera feed
- Consistent border radius system (3px to 24px scale)
- Elevation system using opacity-based overlays

**Interaction Patterns**
- Haptic feedback on capture (vibration API)
- Active state scaling for tactile feedback
- Instant visual feedback for all actions
- Permission-based progressive enhancement

## Recent Changes

### February 2026 - Ronin Saigon Migration & RoninVerse Rebrand
- **Full Rebrand**: Renamed from "NeoSaga" to "RoninVerse" across all UI, documentation, and configuration
- **Blockchain Migration**: Migrated from Saga Chainlet to Ronin Saigon Testnet (Chain ID: 2021)
- **Contract**: GameLicensing at 0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846
- **RON Pricing**: All items priced 0.1-0.3 RON (12 AR lenses + 1 WebXR game)
- **Multi-Wallet**: Ronin Wallet, MetaMask, Keplr support
- **Sky Blue Theme**: UI accent color #87CEEB applied throughout
- **On-chain Deployment**: All 13 catalog items deployed via deployGames.ts
- **Documentation**: Updated README.md, SETUP.md, DEPLOYMENT_INSTRUCTIONS.md with Ronin Saigon details

### November 2025 - Games Category & AR Marketplace
- Added WebXR games marketplace alongside AR lenses
- First game: "UEEAAUUEEAA" (game 13) at 0.25 RON
- Mobile-optimized GamePlayer with full-screen iframe
- Centralized data in lib/gameData.ts and lib/lensData.ts
- Netflix-style UI with horizontal cards and gradient overlays
- Responsive design across mobile, tablet, and desktop