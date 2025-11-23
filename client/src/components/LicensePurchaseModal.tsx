import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePrivy } from '@privy-io/react-auth';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { SAGA_CHAIN_CONFIG, GAME_LICENSING_CONFIG } from '@/lib/sagaChain';
import gameABI from '@/lib/gameABI.json';
import { Loader2, Check } from 'lucide-react';
import { mockLenses } from '@/lib/lensData';
import { mockGames, getGameId } from '@/lib/gameData';

// Helper function to convert ID to numeric gameId - MUST MATCH useLicense
// Lenses: gameId 1-12, Games: gameId 13+
// Throws error if ID is invalid to prevent bypass
const getItemGameId = (itemId: string): number => {
  // Check if it's a lens (lenses are IDs 1-12)
  const lensIndex = mockLenses.findIndex(lens => lens.id === itemId);
  if (lensIndex !== -1) {
    return lensIndex + 1;
  }
  
  // Check if it's a game (games start at ID 13)
  const gameIndex = mockGames.findIndex(game => game.id === itemId);
  if (gameIndex !== -1) {
    return getGameId(itemId);
  }
  
  throw new Error(`Invalid item ID: ${itemId}. Item not found in catalog.`);
};

interface LicensePurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseSuccess?: () => void;
  lensId: string; // REQUIRED - each lens has unique gameId
  price?: number;
  title?: string;
}

export default function LicensePurchaseModal({
  open,
  onOpenChange,
  onPurchaseSuccess,
  lensId,
  price = GAME_LICENSING_CONFIG.arLensesPrice,
  title = 'AR Filter License',
}: LicensePurchaseModalProps) {
  const { user } = usePrivy();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    console.log('[START] Starting purchase flow...');
    
    if (!user?.wallet?.address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('[OK] User wallet address:', user.wallet.address);

      const w = window as any;
      
      // Robust provider detection and normalization with deep unwrapping
      const normalizeProvider = async (obj: any, maxRetries = 2): Promise<any> => {
        if (!obj) return null;
        
        // Deep unwrapping helper - checks all common nested structures
        const deepUnwrap = (target: any): any => {
          if (!target) return null;
          if (typeof target.request === 'function') return target;
          
          // Check common nesting patterns
          const paths = ['provider', 'ethereum', 'wallet', 'result'];
          for (const path of paths) {
            if (target[path] && typeof target[path].request === 'function') {
              return target[path];
            }
            if (target[path] && typeof target[path] === 'object') {
              const nested = deepUnwrap(target[path]);
              if (nested) return nested;
            }
          }
          return null;
        };
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          // Try deep unwrapping first
          const unwrapped = deepUnwrap(obj);
          if (unwrapped) return unwrapped;
          
          // Try explicit connect() for wallets that need it
          if (typeof obj.connect === 'function') {
            try {
              console.log(`[PROVIDER] Attempt ${attempt + 1}: Calling connect()...`);
              const connected = await obj.connect();
              
              // Deep unwrap the connect result
              const connectedProvider = deepUnwrap(connected || obj);
              if (connectedProvider) return connectedProvider;
              
              // Small delay to allow async state mutations
              await new Promise(resolve => setTimeout(resolve, 200));
              
              // Check again after delay
              const delayed = deepUnwrap(obj);
              if (delayed) return delayed;
              
            } catch (err: any) {
              console.warn(`[PROVIDER] Connect attempt ${attempt + 1} failed:`, err?.message || err);
              if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
          } else {
            break; // No connect method, no point retrying
          }
        }
        
        return null;
      };

      let provider;
      let walletName = '';
      
      // 1. Check for Ronin Wallet (highest priority for Ronin chain)
      if (w.ronin) {
        try {
          provider = await normalizeProvider(w.ronin);
          if (provider) {
            walletName = 'Ronin Wallet';
            console.log('[OK] Ronin Wallet detected and normalized');
          }
        } catch (err) {
          console.warn('[RONIN] Normalization failed:', err);
        }
      }
      
      // 2. Check window.ethereum (MetaMask, injected wallets)
      if (!provider && w.ethereum) {
        // Handle multiple providers array - iterate until we find a valid one
        if (Array.isArray(w.ethereum.providers) && w.ethereum.providers.length > 0) {
          console.log(`[PROVIDER] Checking ${w.ethereum.providers.length} providers...`);
          
          // Try Ronin first if available in array
          const roninProvider = w.ethereum.providers.find((p: any) => p.isRonin || p.isRoninWallet);
          if (roninProvider) {
            try {
              provider = await normalizeProvider(roninProvider);
              if (provider) walletName = 'Ronin Wallet';
            } catch (err) {
              console.warn('[RONIN-ARRAY] Normalization failed:', err);
            }
          }
          
          // If not found, try all providers in order with error handling
          if (!provider) {
            for (let i = 0; i < w.ethereum.providers.length; i++) {
              let currentProvider = null; // Reset for each iteration
              try {
                const p = w.ethereum.providers[i];
                console.log(`[PROVIDER] Trying provider ${i + 1}/${w.ethereum.providers.length}...`);
                currentProvider = await normalizeProvider(p);
                if (currentProvider && typeof currentProvider.request === 'function') {
                  provider = currentProvider;
                  walletName = 'Ethereum Wallet';
                  console.log(`[OK] Provider ${i + 1} normalized successfully`);
                  break;
                }
              } catch (err) {
                console.warn(`[PROVIDER] Provider ${i + 1} failed:`, err);
                // Continue to next provider
              }
            }
          }
        } else {
          try {
            provider = await normalizeProvider(w.ethereum);
            if (provider) walletName = 'Ethereum Wallet';
          } catch (err) {
            console.warn('[ETHEREUM] Normalization failed:', err);
          }
        }
        
        if (provider) {
          console.log(`[OK] ${walletName} detected and normalized`);
        }
      }
      
      // 3. Fallback to Keplr
      if (!provider && (w.keplr?.ethereum || w.keplr?.providers?.eip155)) {
        try {
          provider = await normalizeProvider(w.keplr.ethereum || w.keplr.providers.eip155);
          if (provider) {
            walletName = 'Keplr';
            console.log('[OK] Keplr EVM provider detected and normalized');
          }
        } catch (err) {
          console.warn('[KEPLR] Normalization failed:', err);
        }
      }
      
      // Final validation
      if (!provider || typeof provider.request !== 'function') {
        console.error('No valid provider found. window.ronin:', !!w.ronin, 'window.ethereum:', !!w.ethereum, 'window.keplr:', !!w.keplr);
        throw new Error('No compatible wallet found. Please install Ronin Wallet, MetaMask, or Keplr extension, ensure it is unlocked, and try again.');
      }

      console.log(`[OK] Using ${walletName} provider`);

      // Request account access with retry for "already pending" errors
      let accounts;
      const maxAccountRetries = 3;
      
      for (let attempt = 0; attempt < maxAccountRetries; attempt++) {
        try {
          console.log(`[ACCOUNTS] Requesting account access (attempt ${attempt + 1}/${maxAccountRetries})...`);
          accounts = await provider.request({ method: 'eth_requestAccounts' });
          console.log('[OK] Account access granted, accounts:', accounts);
          break; // Success, exit retry loop
        } catch (error: any) {
          const errorMsg = error?.message?.toLowerCase() || '';
          const isAlreadyPending = errorMsg.includes('already pending') || errorMsg.includes('request of type');
          
          if (isAlreadyPending && attempt < maxAccountRetries - 1) {
            console.warn(`[ACCOUNTS] Request already pending, waiting before retry...`);
            toast({
              title: 'Waiting for wallet...',
              description: 'Please check your wallet for a pending connection request',
            });
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
            continue;
          }
          
          console.error('Failed to request accounts:', error);
          if (errorMsg.includes('wallet mismatch')) {
            throw error; // Re-throw wallet mismatch error
          }
          throw new Error(`Failed to access ${walletName}. Please approve the connection request in your wallet.`);
        }
      }
      
      // Verify the wallet account matches the Privy connected wallet
      if (accounts && accounts.length > 0) {
        const walletAccount = accounts[0].toLowerCase();
        if (walletAccount !== user.wallet.address.toLowerCase()) {
          throw new Error(`Wallet mismatch: Please connect ${walletName} to the same address as your Privy wallet (${user.wallet.address})`);
        }
      } else {
        throw new Error(`No accounts returned from ${walletName}. Please ensure your wallet is unlocked.`);
      }

      toast({
        title: 'Requesting network switch...',
        description: 'Please approve switching to Ronin Saigon network in your wallet',
      });

      // Request wallet to switch to Ronin Saigon network
      const chainIdHex = `0x${SAGA_CHAIN_CONFIG.networkId.toString(16)}`;
      console.log('[NETWORK] Requesting chain switch to:', chainIdHex, '(', SAGA_CHAIN_CONFIG.networkId, ')');
      
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        console.log('[OK] Network switched successfully');
      } catch (switchError: any) {
        console.log('Network switch error:', switchError);
        if (switchError.code === 4902) {
          console.log('Chain not found, adding it...');
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainIdHex,
                  chainName: 'Ronin Saigon Testnet',
                  rpcUrls: [SAGA_CHAIN_CONFIG.rpcUrl],
                  nativeCurrency: {
                    name: 'RON',
                    symbol: 'RON',
                    decimals: 18,
                  },
                  blockExplorerUrls: [SAGA_CHAIN_CONFIG.blockExplorer],
                },
              ],
            });
            console.log('[OK] Chain added successfully');
          } catch (addError) {
            console.error('Failed to add chain:', addError);
            throw new Error('Failed to add Ronin Saigon network to wallet');
          }
        } else {
          throw switchError;
        }
      }

      toast({
        title: 'Preparing transaction...',
        description: 'Checking your balance and preparing the purchase',
      });

      // Create ethers provider from wallet
      console.log('Creating ethers provider...');
      const ethersProvider = new ethers.BrowserProvider(provider);
      console.log('Getting signer...');
      const signer = await ethersProvider.getSigner();
      
      if (!signer) {
        throw new Error('Failed to get signer from wallet');
      }
      console.log('[OK] Signer obtained');

      const signerAddress = await signer.getAddress();
      if (!signerAddress) {
        throw new Error('Failed to get address from signer');
      }
      console.log('[OK] Signer address:', signerAddress);

      if (signerAddress.toLowerCase() !== user.wallet.address.toLowerCase()) {
        throw new Error(`Address mismatch: Wallet=${signerAddress}, Privy=${user.wallet.address}`);
      }

      // Verify network
      console.log('Verifying network...');
      const network = await ethersProvider.getNetwork();
      console.log('Current network chainId:', network.chainId.toString());
      console.log('Expected chainId:', SAGA_CHAIN_CONFIG.networkId);
      
      if (String(network.chainId) !== String(SAGA_CHAIN_CONFIG.networkId)) {
        throw new Error(`Wrong network: Connected to ${network.chainId}, need ${SAGA_CHAIN_CONFIG.networkId}`);
      }
      console.log('[OK] Network verified');

      // Check wallet balance
      console.log('Checking balance...');
      const balance = await ethersProvider.getBalance(signerAddress);
      const balanceInRON = ethers.formatEther(balance);
      console.log('[WALLET] Wallet address:', signerAddress);
      console.log('[WALLET] Balance in Wei:', balance.toString());
      console.log('[WALLET] Balance in RON:', balanceInRON);

      // Convert itemId (lens or game) to numeric gameId (required parameter)
      if (!lensId) {
        throw new Error('Item ID is required for purchase');
      }
      const numericGameId = getItemGameId(lensId);
      
      console.log('Purchasing license for lensId:', lensId, 'gameId:', numericGameId);

      // Parse price in Wei - user provides price in RON tokens
      const priceStr = String(price);
      const valueInWei = ethers.parseEther(priceStr);
      
      // Calculate total cost (value + gas)
      const gasLimit = 300000;
      const gasPrice = ethers.toBigInt('1000000000'); // 1 gwei
      const gasCost = ethers.toBigInt(gasLimit) * gasPrice;
      const totalCost = valueInWei + gasCost;
      const totalCostInRON = ethers.formatEther(totalCost);
      
      console.log('Price in RON:', priceStr);
      console.log('Value in Wei:', valueInWei.toString());
      console.log('Gas cost in Wei:', gasCost.toString());
      console.log('Gas cost in RON:', ethers.formatEther(gasCost));
      console.log('Total cost in RON:', totalCostInRON);

      // Check if balance is sufficient
      if (balance < totalCost) {
        const shortfall = ethers.formatEther(totalCost - balance);
        throw new Error(
          `Insufficient balance. You have ${balanceInRON} RON but need ${totalCostInRON} RON (${priceStr} for purchase + ${ethers.formatEther(gasCost)} for gas). You need ${shortfall} more RON.`
        );
      }

      // Create contract instance for encoding
      const contract = new ethers.Contract(
        GAME_LICENSING_CONFIG.contractAddress,
        gameABI,
        signer
      );

      console.log('Calling purchaseLicense on contract...');
      console.log('GameId:', numericGameId);
      console.log('Value:', valueInWei.toString(), 'RON');

      // Manually encode the function call (Keplr strips it otherwise)
      const data = contract.interface.encodeFunctionData('purchaseLicense', [numericGameId]);
      console.log('Encoded function data:', data);

      // Send transaction manually with encoded data
      const txResponse = await signer.sendTransaction({
        to: GAME_LICENSING_CONFIG.contractAddress,
        value: valueInWei,
        data: data,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
      });

      if (!txResponse || !txResponse.hash) {
        throw new Error('Transaction failed to send');
      }

      toast({
        title: 'Processing payment...',
        description: 'Waiting for confirmation...',
      });

      // Wait for receipt
      const receipt = await txResponse.wait(1);

      if (!receipt) {
        throw new Error('Transaction failed to confirm');
      }

      if (receipt.status === 0) {
        throw new Error('Transaction reverted');
      }

      toast({
        title: 'License purchased!',
        description: 'You now have access to AR Lenses!',
      });

      onPurchaseSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('❌ Purchase error:', err);
      console.error('Error type:', typeof err);
      console.error('Error keys:', err ? Object.keys(err) : 'null');
      console.error('Error JSON:', JSON.stringify(err, null, 2));

      let errorMessage = 'An unexpected error occurred';
      let errorTitle = 'Purchase failed';
      
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        if (err.message.includes('user rejected') || err.message.includes('User Rejected')) {
          errorTitle = 'Transaction cancelled';
          errorMessage = 'You cancelled the transaction in your wallet';
        } else if (err.message.includes('Insufficient balance')) {
          errorTitle = 'Insufficient balance';
          errorMessage = err.message;
        } else if (err.message.includes('insufficient funds')) {
          errorTitle = 'Insufficient balance';
          errorMessage = 'Not enough RON to cover the transaction cost and gas fees';
        } else {
          errorMessage = err.message;
        }
      } else if (err && typeof err === 'object') {
        // Handle non-Error objects
        const errObj = err as any;
        if (errObj.message) {
          errorMessage = errObj.message;
        } else if (errObj.error && errObj.error.message) {
          errorMessage = errObj.error.message;
        } else {
          errorMessage = 'Unknown error: ' + JSON.stringify(err);
        }
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-0 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Unlock this AR effect for a one-time payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-5">
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-sm font-medium text-gray-400">Price</span>
              <div className="text-right">
                <span className="text-4xl font-bold" style={{ color: '#87CEEB' }}>
                  {price}
                </span>
                <span className="text-sm text-gray-400 ml-2">RON</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Pay once • Access forever • No recurring charges
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">What you get:</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#87CEEB' }} /> Unlimited use of this AR filter
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#87CEEB' }} /> Real-time AR effects on camera
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#87CEEB' }} /> Photo capture with this filter
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#87CEEB' }} /> Permanent license (one-time)
              </li>
            </ul>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full mt-6 text-black font-semibold"
            style={{ backgroundColor: '#87CEEB' }}
            size="lg"
            data-testid="button-purchase-license"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Purchase for ${price} RON`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
