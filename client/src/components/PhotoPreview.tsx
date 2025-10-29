import { User, Link } from 'lucide-react';
import { Button } from './ui/button';
import { SiX, SiInstagram, SiFacebook, SiLinkedin } from 'react-icons/si';

interface PhotoPreviewProps {
  imageDataUrl: string;
  onClose: () => void;
  onRetake: () => void;
}

export default function PhotoPreview({ imageDataUrl, onClose, onRetake }: PhotoPreviewProps) {
  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Button
          data-testid="button-user-profile"
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white"
          aria-label="User profile"
        >
          <User className="w-5 h-5" />
        </Button>

        <Button
          data-testid="button-help"
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white"
          aria-label="Help"
        >
          <span className="text-xl">?</span>
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative max-w-md w-full">
          <img
            src={imageDataUrl}
            alt="Captured photo"
            className="w-full h-auto object-contain rounded-2xl"
            data-testid="img-preview"
          />
          
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
            <span className="text-white text-sm font-medium">@lorempipsum02</span>
          </div>
        </div>
      </div>

      <div className="p-6 pb-8">
        <div className="bg-background/80 backdrop-blur-lg rounded-2xl p-4">
          <div className="text-sm font-medium text-foreground mb-3 text-center">SHARE TO</div>
          <div className="flex items-center justify-around">
            <Button
              data-testid="button-share-x"
              size="icon"
              variant="ghost"
              onClick={() => handleShare('X')}
              className="w-12 h-12 rounded-full hover-elevate"
              aria-label="Share to X"
            >
              <SiX className="w-5 h-5" />
            </Button>
            <Button
              data-testid="button-share-instagram"
              size="icon"
              variant="ghost"
              onClick={() => handleShare('Instagram')}
              className="w-12 h-12 rounded-full hover-elevate"
              aria-label="Share to Instagram"
            >
              <SiInstagram className="w-5 h-5" />
            </Button>
            <Button
              data-testid="button-share-facebook"
              size="icon"
              variant="ghost"
              onClick={() => handleShare('Facebook')}
              className="w-12 h-12 rounded-full hover-elevate"
              aria-label="Share to Facebook"
            >
              <SiFacebook className="w-5 h-5" />
            </Button>
            <Button
              data-testid="button-share-linkedin"
              size="icon"
              variant="ghost"
              onClick={() => handleShare('LinkedIn')}
              className="w-12 h-12 rounded-full hover-elevate"
              aria-label="Share to LinkedIn"
            >
              <SiLinkedin className="w-5 h-5" />
            </Button>
            <Button
              data-testid="button-copy-link"
              size="icon"
              variant="ghost"
              onClick={() => handleShare('Link')}
              className="w-12 h-12 rounded-full hover-elevate"
              aria-label="Copy link"
            >
              <Link className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
