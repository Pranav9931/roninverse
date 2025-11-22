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

  const setupAndEnableKeplr = async () => {
    const w = window as any;

    if (!w.keplr) {
      throw new Error('Keplr wallet not found');
    }

    const chainId = SAGA_CHAIN_CONFIG.networkId;

    // First, suggest the chain to Keplr
    try {
      await w.keplr.experimentalSuggestChain({
        chainId: chainId,
        chainName: 'Saga - openxr',
        rpc: SAGA_CHAIN_CONFIG.rpcUrl,
        rest: 'https://openxr-2763783314764000-1.rest.sagarpc.io',
        bip44: {
          coinType: 60,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'saga',
          bech32PrefixAccPub: 'sagapub',
          bech32PrefixValAddr: 'sagavaloper',
          bech32PrefixValPub: 'sagavaloperpub',
          bech32PrefixConsAddr: 'sagavalcons',
          bech32PrefixConsPub: 'sagavalconspub',
        },
        currencies: [
          {
            coinDenom: 'XRT',
            coinMinimalDenom: 'uXRT',
            coinDecimals: 18,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'XRT',
            coinMinimalDenom: 'uXRT',
            coinDecimals: 18,
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.03,
            },
          },
        ],
        stakeCurrency: {
          coinDenom: 'XRT',
          coinMinimalDenom: 'uXRT',
          coinDecimals: 18,
        },
      });
    } catch (suggestErr: any) {
      console.warn('Chain suggest error (may already exist):', suggestErr);
    }

    // Now enable the chain using numeric chain ID
    try {
      await w.keplr.enable(chainId);
    } catch (enableErr) {
      console.error('Keplr enable error:', enableErr);
      throw new Error(`Failed to enable Keplr for this chain: ${enableErr instanceof Error ? enableErr.message : String(enableErr)}`);
    }

    // Get the EVM provider
    const provider = w.keplr.providers?.eip155;
    if (!provider) {
      throw new Error('Keplr EVM provider not available');
    }

    return provider;
  };

  const handlePurchase = async () => {
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

      // Setup and enable Keplr
      const provider = await setupAndEnableKeplr();

      // Create ethers provider and signer
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Verify signer address
      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== user.wallet.address.toLowerCase()) {
        throw new Error('Wallet address mismatch');
      }

      toast({
        title: 'Awaiting wallet confirmation...',
        description: 'Please approve the transaction in your Keplr wallet',
      });

      // Create contract instance
      const contract = new ethers.Contract(
        GAME_LICENSING_CONFIG.contractAddress,
        gameABI,
        signer
      );

      const priceInWei = ethers.parseEther(GAME_LICENSING_CONFIG.arLensesPrice);

      // Send transaction
      const tx = await contract.purchaseLicense(gameId, {
        value: priceInWei,
      });

      toast({
        title: 'Processing payment...',
        description: 'Your transaction is being processed',
      });

      const receipt = await tx.wait(1);

      if (!receipt) {
        throw new Error('Transaction receipt not received');
      }

      toast({
        title: 'License purchased!',
        description: `You now have access to AR Lenses for ${GAME_LICENSING_CONFIG.arLensesPrice} XRT`,
      });

      onPurchaseSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Purchase failed:', err);

      if (err instanceof Error) {
        if (err.message.includes('user rejected') || err.message.includes('User denied')) {
          toast({
            title: 'Transaction cancelled',
            description: 'You cancelled the transaction in your wallet',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Purchase failed',
            description: err.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Purchase failed',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase AR Lenses License</DialogTitle>
          <DialogDescription>
            Get unlimited access to AR Lenses for a one-time payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Price</span>
              <span className="text-2xl font-bold text-white">{GAME_LICENSING_CONFIG.arLensesPrice} XRT</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Pay once, access forever. No recurring charges.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">What you get:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Unlimited access to all AR lenses</li>
              <li>✓ Real-time AR effects on your camera</li>
              <li>✓ Photo capture with AR filters</li>
              <li>✓ Permanent license (one-time payment)</li>
            </ul>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full"
            size="lg"
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
