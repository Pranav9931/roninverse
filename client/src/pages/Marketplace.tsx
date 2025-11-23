import { useLocation } from 'wouter';
import { Sparkles, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import AuthGuard from '@/components/AuthGuard';
import { Lens } from '@/types/lens';
import { mockLenses } from '@/lib/lensData';

function MarketplaceContent() {
  const [, setLocation] = useLocation();
  const { logout } = usePrivy();

  const handleLensClick = (lens: Lens) => {
    setLocation(`/camera/${lens.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">AR Lens Collection</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setLocation('/')}
              variant="ghost" className="text-white hover:bg-white/20"
              size="sm"
              data-testid="button-back-home"
            >
              Back
            </Button>
            <Button
              onClick={logout}
              size="icon"
              variant="ghost" className="text-white hover:bg-white/20"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Browse and select from our collection of AR lenses
          </p>
          <Badge variant="secondary" className="mt-2">
            {mockLenses.length} lenses available
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockLenses.map((lens) => (
            <Card
              key={lens.id}
              className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-0"
              onClick={() => handleLensClick(lens)}
              data-testid={`card-lens-${lens.id}`}
            >
              <CardContent className="p-0 relative">
                <div className="aspect-video relative">
                  <img
                    src={lens.coverImage}
                    alt={lens.displayName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="mb-2">
                      <span className="text-sm font-bold tracking-wider bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-md inline-block">
                        {lens.name}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-2xl" data-testid={`text-lens-name-${lens.id}`}>
                      {lens.displayName}
                    </h3>
                    <p className="text-sm opacity-80 font-medium">
                      Tap to try
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Marketplace() {
  return (
    <AuthGuard>
      <MarketplaceContent />
    </AuthGuard>
  );
}
