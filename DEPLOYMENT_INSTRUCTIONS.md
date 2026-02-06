# RoninVerse - Game Deployment Instructions

## Overview
Deploy all catalog items (12 AR lenses + 1 WebXR game) on the GameLicensing smart contract so each item can be purchased separately with RON tokens.

## Prerequisites

1. **Contract Owner Wallet**
   - You need the private key for the wallet that owns the GameLicensing contract
   - This wallet must have RON tokens for gas fees

2. **Network Details**
   - Chain: Ronin Saigon Testnet
   - Chain ID: 2021 (0x7e5)
   - RPC: https://saigon-testnet.roninchain.com/rpc
   - Block Explorer: https://saigon-app.roninchain.com
   - Contract: 0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846

## Deployment Steps

### Option 1: Using the Provided Script (Recommended)

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install ethers
   ```

2. **Run the Deployment Script**
   ```bash
   npx tsx deployGames.ts <PRIVATE_KEY>
   ```

3. **Expected Output**
   ```
   === RoninVerse Game Deployment ===
   
   Connecting to Ronin Saigon...
   Connected
     Wallet: 0x...
     Chain ID: 2021
     Contract: 0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846
     Balance: X.XX RON
   
   Listing game 1: AR Lens 01 - Cosmic Vibes (0.1 RON)...
   ... (continues for all 13 items)
   
   === Deployment Complete ===
   Successfully deployed all items
   ```

### Option 2: Manual Deployment via Block Explorer

1. **Go to Contract on Block Explorer**
   - Visit: https://saigon-app.roninchain.com/address/0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846
   - Click "Write Contract"
   - Connect your owner wallet

2. **Call `listGame` for Each Item**
   - For each item, call:
   ```
   Function: listGame
   Parameters:
   - name: "AR Lens 01 - Cosmic Vibes" (change for each)
   - description: "Cosmic visual AR effects" (customize per item)
   - price: 100000000000000000 (0.1 RON in wei - 18 decimals)
   ```

3. **Item Details for Manual Entry**
   ```
   Game 1:  AR Lens 01 - Cosmic Vibes (0.1 RON)
   Game 2:  AR Lens 02 - Rainbow Blast (0.12 RON)
   Game 3:  AR Lens 03 - Pixel Paradise (0.13 RON)
   Game 4:  AR Lens 04 - Electric Dreams (0.15 RON)
   Game 5:  AR Lens 05 - Prism Party (0.14 RON)
   Game 6:  AR Lens 06 - Neon Nights (0.16 RON)
   Game 7:  AR Lens 07 - Retro Wave (0.18 RON)
   Game 8:  AR Lens 08 - Glitch Mode (0.2 RON)
   Game 9:  AR Lens 09 - Crystal Burst (0.22 RON)
   Game 10: AR Lens 10 - Vapor Dreams (0.25 RON)
   Game 11: AR Lens 11 - Cyber Glow (0.28 RON)
   Game 12: AR Lens 12 - Laser Lights (0.3 RON)
   Game 13: UEEAAUUEEAA WebXR Game (0.25 RON)
   ```

## Verification

After deployment, verify all items exist:

```bash
# Check a specific game
curl -X POST https://saigon-testnet.roninchain.com/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [{
      "to": "0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846",
      "data": "0x78a89567000000000000000000000000000000000000000000000000000000000000000X"
    }, "latest"],
    "id": 1
  }'
```
Replace the last `X` with game ID (1-13 in hex).

## After Deployment

Once all items are deployed:
1. Refresh the RoninVerse application
2. Each item should show "Purchase" if not owned
3. Items are priced 0.1-0.3 RON each
4. Purchased items unlock immediately upon transaction confirmation

## Troubleshooting

**Error: "Insufficient funds"**
- Add more RON to your owner wallet for gas fees

**Error: "Game already exists"**
- Skip that game ID, it's already deployed
- The script automatically handles this

**Error: "Unauthorized" or "Only owner"**
- Make sure you're using the contract owner's private key
- Verify the owner address matches the contract owner

**Transaction stuck/pending**
- Wait a few minutes for confirmation
- Check block explorer for transaction status

## Need Help?

Check the Ronin Saigon block explorer for your transactions:
https://saigon-app.roninchain.com/address/0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846
