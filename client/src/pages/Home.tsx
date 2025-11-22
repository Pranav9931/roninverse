import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { LogOut, Lock } from 'lucide-react';
import { useLicense } from '@/hooks/useLicense';
import { mockLenses } from '@/pages/Marketplace';
import { useState } from 'react';
import LicensePurchaseModal from '@/components/LicensePurchaseModal';

function HomeContent() {
  const [, setLocation] = useLocation();
  const { logout } = usePrivy();
  const [selectedLensForPurchase, setSelectedLensForPurchase] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handleLensClick = (lensId: string) => {
    // Check if user has license for this lens
    const useLicenseHook = useLicense(lensId);
    if (useLicenseHook.hasLicense) {
      // Go directly to camera with the lens
      setLocation(`/camera/${lensId}`);
    } else {
      // Show purchase modal
      setSelectedLensForPurchase(lensId);
      setShowPurchaseModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/95 dark:supports-[backdrop-filter]:dark:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <div className="text-2xl font-bold" style={{ fontFamily: 'Lexlox, sans-serif', color: '#C1FF72' }}>
            o7.xr
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

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">AR Filters</h1>
          <p className="text-muted-foreground">
            Unlock stunning AR effects with individual purchases
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLenses.map((lens) => {
            // Use hook to check license for each lens
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { hasLicense } = useLicense(lens.id);
            
            return (
              <div key={lens.id} className="cursor-pointer" onClick={() => handleLensClick(lens.id)}>
                {/* Image Card - Clean and Simple */}
                <div
                  className="hover-elevate active-elevate-2 overflow-hidden rounded-3xl mb-4 relative"
                  data-testid={`card-lens-${lens.id}`}
                >
                  <div className="aspect-[9/16] relative bg-gray-900">
                    <img
                      src={lens.coverImage}
                      alt={lens.displayName}
                      className="w-full h-full object-cover"
                    />
                    {/* Badge positioned on image - top right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-block font-bold text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#C1FF72', color: '#000' }}>
                        {lens.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Below Image */}
                <div className="px-1 space-y-3">
                  {/* Title */}
                  <h3 
                    className="text-lg font-bold text-white" 
                    data-testid={`text-lens-name-${lens.id}`}
                  >
                    {lens.displayName}
                  </h3>

                  {/* Status Row with Circular Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-400">AR Filter</span>
                    <div className="h-8 w-8 rounded-full border-2 border-gray-600 flex items-center justify-center flex-shrink-0" style={{ borderColor: hasLicense ? '#C1FF72' : '#4b5563' }}>
                      <span className="text-xs font-bold" style={{ color: hasLicense ? '#C1FF72' : '#9ca3af' }}>
                        {hasLicense ? '✓' : lens.name.slice(0, 1)}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-800"></div>

                  {/* Price Section */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Price</span>
                      <span className="text-base font-bold" style={{ color: '#C1FF72' }}>
                        {hasLicense ? '✓ Owned' : `${lens.price} XRT`}
                      </span>
                    </div>

                    {/* Purchase Button */}
                    <Button
                      className="w-full font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLensClick(lens.id);
                      }}
                      style={{ backgroundColor: '#C1FF72', color: '#000' }}
                      data-testid={`button-lens-${lens.id}`}
                    >
                      {hasLicense ? 'Use Filter' : 'Purchase'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedLensForPurchase && (
        <LicensePurchaseModal
          open={showPurchaseModal}
          onOpenChange={setShowPurchaseModal}
          lensId={selectedLensForPurchase}
          price={mockLenses.find(l => l.id === selectedLensForPurchase)?.price || 0}
          title={mockLenses.find(l => l.id === selectedLensForPurchase)?.displayName || 'AR Filter'}
          onPurchaseSuccess={() => {
            setShowPurchaseModal(false);
            setSelectedLensForPurchase(null);
            // User can click to use filter after purchase
          }}
        />
      )}
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
