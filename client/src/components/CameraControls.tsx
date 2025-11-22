interface CameraControlsProps {
  onCapture: () => void;
  disabled?: boolean;
}

export default function CameraControls({
  onCapture,
  disabled = false
}: CameraControlsProps) {
  const handleCapture = () => {
    if (!disabled) {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onCapture();
    }
  };

  return (
    <button
      data-testid="button-capture"
      onClick={handleCapture}
      disabled={disabled}
      className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
      aria-label="Capture photo"
    >
      <div className="w-16 h-16 rounded-full bg-white" />
    </button>
  );
}
