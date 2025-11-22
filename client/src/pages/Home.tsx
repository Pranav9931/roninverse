import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { LogOut } from 'lucide-react';

interface XRApp {
  id: string;
  name: string;
  description: string;
  coverImage: string;
}

const xrApps: XRApp[] = [
  {
    id: 'lenses',
    name: 'AR Lenses',
    description: 'Transform your camera with stunning AR effects',
    coverImage: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
  },
];

function HomeContent() {
  const [, setLocation] = useLocation();
  const { logout } = usePrivy();

  const handleAppClick = (appId: string) => {
    if (appId === 'lenses') {
      setLocation('/camera');
    } else {
      setLocation(`/app/${appId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-primary/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 neon-glow">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <div className="text-2xl font-bold" style={{ fontFamily: 'Lexlox, sans-serif', color: '#C1FF72', textShadow: '0 0 10px rgba(193, 255, 114, 0.5)' }}>
            o7.xr
          </div>
          <Button
            onClick={logout}
            size="icon"
            variant="ghost"
            data-testid="button-logout"
            className="text-primary hover:text-primary"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#C1FF72', textShadow: '0 0 20px rgba(193, 255, 114, 0.4)' }}>
            XR Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Unlock immersive experiences with cutting-edge AR technology
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {xrApps.map((app) => (
            <div
              key={app.id}
              className="group cursor-pointer"
              onClick={() => handleAppClick(app.id)}
              data-testid={`card-app-${app.id}`}
            >
              <Card className="hover-elevate active-elevate-2 overflow-hidden border-2 border-primary/40 h-full neon-glow transition-all duration-300 hover:border-primary/80">
                <CardContent className="p-0 relative h-96">
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: app.coverImage,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-3xl font-bold mb-2 drop-shadow-2xl" data-testid={`text-app-name-${app.id}`} style={{ textShadow: '0 0 20px rgba(193, 255, 114, 0.5)' }}>
                      {app.name}
                    </h3>
                    <p className="text-sm opacity-90 font-medium drop-shadow-lg">
                      {app.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff00ff', boxShadow: '0 0 10px #ff00ff' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00ffff', boxShadow: '0 0 10px #00ffff' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
