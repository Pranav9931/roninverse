import CameraControls from '../CameraControls';

export default function CameraControlsExample() {
  return (
    <div className="relative h-96 bg-muted">
      <CameraControls
        onCapture={() => console.log('Capture triggered')}
      />
    </div>
  );
}
