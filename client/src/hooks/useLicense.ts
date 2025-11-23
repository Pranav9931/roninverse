import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { SAGA_CHAIN_CONFIG, GAME_LICENSING_CONFIG } from '@/lib/sagaChain';
import gameABI from '@/lib/gameABI.json';
import { mockLenses } from '@/lib/lensData';
import { mockGames, getGameId } from '@/lib/gameData';

// Helper function to convert ID to numeric gameId - MUST MATCH LicensePurchaseModal
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

export function useLicense(lensId: string) {
  const { user } = usePrivy();
  const [hasLicense, setHasLicense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const checkLicense = useCallback(async () => {
    if (!user?.wallet?.address) {
      setHasLicense(false);
      return;
    }

    if (!lensId) {
      console.error('useLicense: lensId is required');
      setError('Lens ID is required');
      setHasLicense(false);
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(SAGA_CHAIN_CONFIG.rpcUrl);
      const contract = new ethers.Contract(
        GAME_LICENSING_CONFIG.contractAddress,
        gameABI,
        provider
      );

      // Convert itemId (lens or game) to numeric gameId (required parameter)
      const numericGameId = getItemGameId(lensId);
      
      // hasLicense expects (gameId: uint256, user: address)
      const owns = await contract.hasLicense(numericGameId, user.wallet.address);
      setHasLicense(owns);
      setError(null);
    } catch (err) {
      console.error('Failed to check license:', err);
      setError(err instanceof Error ? err.message : 'Failed to check license');
      setHasLicense(false);
    } finally {
      setLoading(false);
    }
  }, [user?.wallet?.address, lensId]);

  useEffect(() => {
    checkLicense();
  }, [user?.wallet?.address, lensId, refreshTrigger, checkLicense]);

  const refetch = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return { hasLicense, loading, error, refetch };
}
