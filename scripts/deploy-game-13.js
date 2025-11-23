import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gameABI = JSON.parse(readFileSync(join(__dirname, '../client/src/lib/gameABI.json'), 'utf8'));

const CONTRACT_ADDRESS = '0x91C7B6f8905060D6aE711878020DB15E90C697E0';
const RPC_URL = 'https://openxr-2763783314764000-1.jsonrpc.sagarpc.io';

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('Error: PRIVATE_KEY environment variable not set');
  process.exit(1);
}

async function deployGame13() {
  console.log('=== Deploying Game 13 (UEEAAUUEEAA) ===\n');
  
  console.log('📡 Connecting to Saga chainlet...');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  const network = await provider.getNetwork();
  console.log('✓ Connected');
  console.log('  Wallet:', wallet.address);
  console.log('  Chain ID:', network.chainId.toString());
  console.log('  Contract:', CONTRACT_ADDRESS);
  
  const balance = await provider.getBalance(wallet.address);
  console.log('  Balance:', ethers.formatEther(balance), 'XRT\n');
  
  const contract = new ethers.Contract(CONTRACT_ADDRESS, gameABI, wallet);
  
  // Check if game 13 already exists
  try {
    const game13 = await contract.games(13);
    if (game13.isActive) {
      console.log('⚠️  Game 13 already exists:', game13.name);
      console.log('   Price:', ethers.formatEther(game13.price), 'XRT');
      console.log('   Active:', game13.isActive);
      return;
    }
  } catch (err) {
    // Game doesn't exist, continue with deployment
  }
  
  console.log('📝 Listing game 13: UEEAAUUEEAA...');
  
  // listGame(string _name, string _description, uint256 _price)
  const gameName = 'UEEAAUUEEAA';
  const gameDescription = 'Immersive AR gaming experience';
  const price = ethers.parseEther('4540'); // 4540 XRT
  
  console.log('  Name:', gameName);
  console.log('  Description:', gameDescription);
  console.log('  Price:', ethers.formatEther(price), 'XRT');
  
  const tx = await contract.listGame(gameName, gameDescription, price);
  console.log('  Transaction sent:', tx.hash);
  console.log('  Waiting for confirmation...');
  
  const receipt = await tx.wait();
  
  if (receipt.status === 1) {
    console.log('  ✓ Game deployed successfully!\n');
  } else {
    console.log('  ✗ Transaction failed\n');
    process.exit(1);
  }
  
  console.log('=== Deployment Complete ===');
  console.log('✓ Game (UEEAAUUEEAA) deployed');
  console.log('  Price: 4540 XRT\n');
  
  // Verify deployment - game 13 should now exist
  console.log('📋 Verifying game...\n');
  const game = await contract.games(13);
  console.log('Game 13:', game.name, '-', ethers.formatEther(game.price), 'XRT - Active:', game.isActive);
}

deployGame13()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
