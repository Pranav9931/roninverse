import { Lens } from '@/types/lens';

interface LensCarouselProps {
  lenses: Lens[];
  onLensSelect: (lens: Lens) => void;
  currentLensId?: string;
}

export default function LensCarousel({ lenses, onLensSelect, currentLensId }: LensCarouselProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 z-20 px-4" data-testid="carousel-lenses">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {lenses.map((lens) => {
              const isSelected = currentLensId === lens.id;
              
              return (
                <button
                  key={lens.id}
                  data-testid={`button-lens-${lens.id}`}
                  onClick={() => onLensSelect(lens)}
                  className={`relative w-20 h-20 rounded-full flex-shrink-0 overflow-hidden transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-primary scale-100 shadow-lg' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Apply ${lens.displayName} lens`}
                >
                  <img 
                    src={lens.coverImage} 
                    alt={lens.displayName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
