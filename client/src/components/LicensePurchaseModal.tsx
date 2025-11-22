import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePrivy } from '@privy-io/react-auth';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { SAGA_CHAIN_CONFIG, GAME_LICENSING_CONFIG } from '@/lib/sagaChain';
import gameABI from '@/lib/gameABI.json';
import { Loader2 } from 'lucide-react';

interface LicensePurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseSuccess?: () => void;
  gameId?: number;
}

export default function LicensePurchaseModal({
  open,
  onOpenChange,
  onPurchaseSuccess,
  gameId = GAME_LICENSING_CONFIG.arLensesGameId,
}: LicensePurchaseModalProps) {
  const { user } = usePrivy();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    console.log('=== PURCHASE FLOW START ===');
    console.log('User wallet:', user?.wallet?.address);
    console.log('Game ID:', gameId);
    console.log('Price:', GAME_LICENSING_CONFIG.arLensesPrice);
    console.log('Contract address:', GAME_LICENSING_CONFIG.contractAddress);

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

      const w = window as any;
      console.log('Step 1: Checking Keplr...');
      
      if (!w.keplr) {
        throw new Error('Keplr wallet not found. Please install Keplr extension.');
      }
      console.log('✓ Keplr found');

      // Get the EVM provider from Keplr
      console.log('Step 2: Getting EVM provider...');
      let provider = w.keplr.providers?.eip155;
      if (!provider) {
        provider = w.keplr.ethereum;
      }
      
      if (!provider) {
        throw new Error('Keplr EVM provider not available. Please upgrade Keplr.');
      }
      console.log('✓ EVM provider obtained');

      toast({
        title: 'Requesting network switch...',
        description: 'Please approve switching to Saga network in your Keplr wallet',
      });

      // Request Keplr to switch to Saga network
      console.log('Step 3: Requesting network switch...');
      const chainIdHex = `0x${SAGA_CHAIN_CONFIG.networkId.toString(16)}`;
      console.log('Target chain ID (hex):', chainIdHex);
      
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        console.log('✓ Network switch successful');
      } catch (switchError: any) {
        console.log('Network switch error code:', switchError.code);
        // If the chain doesn't exist, try to add it
        if (switchError.code === 4902) {
          console.log('Chain not found, adding it...');
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainIdHex,
                  chainName: 'Saga - openxr',
                  rpcUrls: [SAGA_CHAIN_CONFIG.rpcUrl],
                  nativeCurrency: {
                    name: 'XRT',
                    symbol: 'XRT',
                    decimals: 18,
                  },
                  blockExplorerUrls: [SAGA_CHAIN_CONFIG.blockExplorer],
                },
              ],
            });
            console.log('✓ Chain added successfully');
          } catch (addError) {
            console.error('Failed to add chain:', addError);
            throw new Error('Failed to add Saga network to Keplr');
          }
        } else {
          console.error('Switch error:', switchError);
          throw switchError;
        }
      }

      toast({
        title: 'Awaiting wallet confirmation...',
        description: 'Please approve the transaction in your Keplr wallet',
      });

      // Create ethers provider from Keplr
      console.log('Step 4: Creating ethers provider...');
      const ethersProvider = new ethers.BrowserProvider(provider);
      console.log('✓ Ethers provider created');
      
      // Get signer and validate
      console.log('Step 5: Getting signer...');
      const signer = await ethersProvider.getSigner();
      if (!signer) {
        throw new Error('Failed to get signer from Keplr');
      }
      console.log('✓ Signer obtained');

      // Get user address from signer
      console.log('Step 6: Getting signer address...');
      const signerAddress = await signer.getAddress();
      console.log('Signer address:', signerAddress);
      if (!signerAddress) {
        throw new Error('Failed to get address from signer');
      }

      if (signerAddress.toLowerCase() !== user.wallet.address.toLowerCase()) {
        throw new Error(`Address mismatch: Keplr has ${signerAddress}, but app expects ${user.wallet.address}`);
      }
      console.log('✓ Address matches');

      // Verify we're on the right network
      console.log('Step 7: Checking network...');
      const network = await ethersProvider.getNetwork();
      console.log('Current chain ID:', network.chainId);
      console.log('Expected chain ID:', SAGA_CHAIN_CONFIG.networkId);
      if (String(network.chainId) !== String(SAGA_CHAIN_CONFIG.networkId)) {
        throw new Error(
          `Wrong network detected: You're on chain ${network.chainId}, but should be on ${SAGA_CHAIN_CONFIG.networkId}.`
        );
      }
      console.log('✓ Network correct');

      // Encode the function call
      console.log('Step 8: Encoding function call...');
      console.log('Game ID to encode:', gameId);
      const iface = new ethers.Interface(gameABI);
      const data = iface.encodeFunctionData('purchaseLicense', [gameId]);
      console.log('Encoded data:', data);
      if (!data) {
        throw new Error('Failed to encode purchaseLicense function');
      }
      console.log('✓ Function encoded');

      // Parse the value properly
      console.log('Step 9: Parsing price value...');
      const priceStr = String(GAME_LICENSING_CONFIG.arLensesPrice);
      console.log('Price string:', priceStr);
      let value: bigint;
      
      try {
        value = ethers.parseEther(priceStr);
        console.log('Parsed value:', value.toString());
      } catch (e) {
        console.error('Failed to parse value:', priceStr, e);
        throw new Error(`Invalid price value: ${priceStr}. Expected a number.`);
      }
      console.log('✓ Value parsed');

      // Send transaction
      console.log('Step 10: Sending transaction...');
      console.log('Transaction details:', {
        to: GAME_LICENSING_CONFIG.contractAddress,
        data: data,
        value: value.toString(),
      });
      
      const txResponse = await signer.sendTransaction({
        to: GAME_LICENSING_CONFIG.contractAddress,
        data: data,
        value: value,
      });

      if (!txResponse || !txResponse.hash) {
        throw new Error('Transaction was not sent properly');
      }
      console.log('✓ Transaction sent:', txResponse.hash);

      toast({
        title: 'Processing payment...',
        description: `Transaction hash: ${txResponse.hash.slice(0, 10)}...`,
      });

      // Wait for receipt
      console.log('Step 11: Waiting for receipt...');
      const receipt = await txResponse.wait(1);

      if (!receipt) {
        throw new Error('Transaction failed to confirm');
      }
      console.log('✓ Receipt received:', receipt.hash);

      if (receipt.status === 0) {
        throw new Error('Transaction was reverted by the smart contract');
      }
      console.log('✓ Transaction successful');

      toast({
        title: 'License purchased!',
        description: `You now have access to AR Lenses. Transaction: ${receipt.hash.slice(0, 10)}...`,
      });

      onPurchaseSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('=== PURCHASE FAILED ===');
      console.error('Error:', err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Stack:', err.stack);
      }

      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('user rejected') || err.message.includes('User denied')) {
          errorMessage = 'You cancelled the transaction';
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient XRT balance in your wallet';
        } else {
          errorMessage = err.message;
        }
      }

      toast({
        title: 'Purchase failed',
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
          <DialogTitle className="text-white text-2xl font-bold">AR Lenses License</DialogTitle>
          <DialogDescription className="text-gray-400">
            Unlock stunning AR effects for a one-time payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-5">
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-sm font-medium text-gray-400">Price</span>
              <div className="text-right">
                <span className="text-4xl font-bold" style={{ color: '#C1FF72' }}>
                  {GAME_LICENSING_CONFIG.arLensesPrice}
                </span>
                <span className="text-sm text-gray-400 ml-2">XRT</span>
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
                <span style={{ color: '#C1FF72' }}>✓</span> Unlimited access to all AR lenses
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <span style={{ color: '#C1FF72' }}>✓</span> Real-time AR effects on camera
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <span style={{ color: '#C1FF72' }}>✓</span> Photo capture with AR filters
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <span style={{ color: '#C1FF72' }}>✓</span> Permanent license (one-time)
              </li>
            </ul>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full mt-6 bg-black text-black font-semibold hover:bg-opacity-90"
            style={{ backgroundColor: '#C1FF72' }}
            size="lg"
            data-testid="button-purchase-license"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Purchase for ${GAME_LICENSING_CONFIG.arLensesPrice} XRT`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
