import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { LogOut, ArrowLeft, Check, Gamepad2 } from 'lucide-react';
import { useLicense } from '@/hooks/useLicense';
import { mockLenses } from '@/lib/lensData';
import { mockGames } from '@/lib/gameData';
import { Lens } from '@/types/lens';
import { Game } from '@/types/game';

// Component to check individual lens ownership
function LensOwnershipChecker({ lens, onOwned }: { lens: Lens; onOwned: (lens: Lens) => void }) {
  const { hasLicense, loading } = useLicense(lens.id);
  
  useEffect(() => {
    if (!loading && hasLicense) {
      onOwned(lens);
    }
  }, [hasLicense, loading, lens, onOwned]);
  
  return null;
}

// Component to check individual game ownership
function GameOwnershipChecker({ game, onOwned }: { game: Game; onOwned: (game: Game) => void }) {
  const { hasLicense, loading } = useLicense(game.id);
  
  useEffect(() => {
    if (!loading && hasLicense) {
      onOwned(game);
    }
  }, [hasLicense, loading, game, onOwned]);
  
  return null;
}

// Unified library game item card
function LibraryGameItemCard({ 
  item, 
  itemType 
}: { 
  item: Lens | Game; 
  itemType: 'lens' | 'game';
}) {
  const [, setLocation] = useLocation();

  const handlePlay = () => {
    setLocation(itemType === 'lens' ? `/camera/${item.id}` : `/game/${item.id}`);
  };

  const typeLabel = itemType === 'lens' ? 'AR Game' : 'WebXR Game';
  const icon = itemType === 'lens' && 'name' in item ? (
    <span className="text-xs font-bold" style={{ color: '#87CEEB' }}>
      {item.name.slice(0, 1)}
    </span>
  ) : (
    <Gamepad2 className="w-4 h-4" style={{ color: '#87CEEB' }} />
  );

  return (
    <div 
      className="group cursor-pointer overflow-hidden rounded-lg bg-black border border-gray-800 hover:border-gray-600 transition-all duration-200"
      data-testid={`card-library-${itemType}-${item.id}`}
      onClick={handlePlay}
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.coverImage} 
          alt={item.displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 
          className="text-xl font-bold text-white leading-tight" 
          data-testid={`text-library-name-${item.id}`}
        >
          {item.displayName}
        </h3>

        {/* Game Type with Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{typeLabel}</span>
          <div className="h-8 w-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#87CEEB' }}>
            {icon}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800"></div>

        {/* Status Section */}
        <div className="space-y-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold block">Status</span>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: '#87CEEB' }} />
            <span className="text-base font-bold" style={{ color: '#87CEEB' }}>
              Owned
            </span>
          </div>
        </div>

        {/* Bottom Button - Always visible, more prominent on hover */}
        <div className="pt-2">
          <Button
            className="w-full font-semibold opacity-60 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            style={{ backgroundColor: '#87CEEB', color: '#000' }}
            data-testid={`button-library-use-${item.id}`}
          >
            Play Game
          </Button>
        </div>
      </div>
    </div>
  );
}

function LibraryContent() {
  const [, setLocation] = useLocation();
  const { logout } = usePrivy();
  const [ownedLenses, setOwnedLenses] = useState<Lens[]>([]);
  const [ownedGames, setOwnedGames] = useState<Game[]>([]);
  const [checkComplete, setCheckComplete] = useState(false);
  
  // Track which lenses are owned
  const handleLensOwned = useCallback((lens: Lens) => {
    setOwnedLenses(prev => {
      if (prev.find(l => l.id === lens.id)) return prev;
      return [...prev, lens];
    });
  }, []);
  
  // Track which games are owned
  const handleGameOwned = useCallback((game: Game) => {
    setOwnedGames(prev => {
      if (prev.find(g => g.id === game.id)) return prev;
      return [...prev, game];
    });
  }, []);
  
  useEffect(() => {
    // Mark check as complete after a short delay
    const timer = setTimeout(() => setCheckComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const totalOwned = ownedLenses.length + ownedGames.length;

  return (
    <div className="min-h-screen bg-background dark">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/95 dark:supports-[backdrop-filter]:dark:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setLocation('/')}
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Lexlox, sans-serif', color: '#87CEEB' }}>
              Your Library
            </div>
          </div>
          <Button
            onClick={logout}
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8 space-y-12">
        {/* Hidden ownership checkers */}
        {mockLenses.map(lens => (
          <LensOwnershipChecker key={lens.id} lens={lens} onOwned={handleLensOwned} />
        ))}
        {mockGames.map(game => (
          <GameOwnershipChecker key={game.id} game={game} onOwned={handleGameOwned} />
        ))}
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Your Library</h1>
          <p className="text-muted-foreground">
            {checkComplete ? (
              `${totalOwned} item${totalOwned !== 1 ? 's' : ''} in your collection`
            ) : (
              'Loading your library...'
            )}
          </p>
        </div>

        {checkComplete && totalOwned === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-400 text-lg mb-6">No games owned yet</p>
            <Button
              onClick={() => setLocation('/')}
              style={{ backgroundColor: '#87CEEB', color: '#000' }}
              className="font-semibold"
            >
              Browse Games
            </Button>
          </div>
        ) : (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">My Games</h2>
              <p className="text-muted-foreground text-sm">
                {totalOwned} game{totalOwned !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {ownedLenses.map((lens) => (
                <LibraryGameItemCard key={lens.id} item={lens} itemType="lens" />
              ))}
              {ownedGames.map((game) => (
                <LibraryGameItemCard key={game.id} item={game} itemType="game" />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function Library() {
  return (
    <AuthGuard>
      <LibraryContent />
    </AuthGuard>
  );
}
