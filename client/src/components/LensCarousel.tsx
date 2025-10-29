export interface Lens {
  id: string;
  name: string;
  iconUrl?: string;
  groupId?: string;
}

interface LensCarouselProps {
  lenses: Lens[];
  onLensSelect: (lens: Lens) => void;
  selectedLensId?: string;
}

export default function LensCarousel({ lenses, onLensSelect, selectedLensId }: LensCarouselProps) {
  const displayLenses = lenses.slice(0, 5);

  return (
    <div className="w-full flex items-center justify-center gap-4 px-4" data-testid="carousel-lenses">
      {displayLenses.map((lens, index) => {
        const isSelected = selectedLensId === lens.id;
        const isCenter = index === 2;
        
        return (
          <button
            key={lens.id}
            data-testid={`button-lens-${lens.id}`}
            onClick={() => onLensSelect(lens)}
            className={`
              flex-shrink-0 rounded-full bg-white/90 backdrop-blur-sm
              transition-all duration-200
              ${isCenter 
                ? 'w-16 h-16' 
                : 'w-12 h-12'
              }
              ${isSelected 
                ? 'ring-2 ring-white scale-110' 
                : 'opacity-70 hover:opacity-100'
              }
            `}
            aria-label={`Apply ${lens.name} lens`}
          >
            {lens.iconUrl ? (
              <img 
                src={lens.iconUrl} 
                alt={lens.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
