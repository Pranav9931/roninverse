# Implementation Guide: Snap Camera Kit Lenses & Carousel

This guide explains how to implement Snap Camera Kit lenses and the Embla carousel component in your application.

---

## Table of Contents

1. [Snap Camera Kit Lenses](#snap-camera-kit-lenses)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
   - [Core Implementation](#core-implementation)
   - [React Hook](#react-hook)
   - [Camera View Component](#camera-view-component)
   - [Usage](#usage-example)
2. [Carousel Component](#carousel-component)
   - [Installation](#carousel-installation)
   - [Basic Usage](#basic-usage)
   - [Advanced Examples](#advanced-examples)
   - [API Reference](#api-reference)

---

## Snap Camera Kit Lenses

### Prerequisites

Before implementing Snap Camera Kit, you need:

1. **Snap Camera Kit Account**: Sign up at [Snap Camera Kit](https://camera-kit.snapchat.com/)
2. **API Token**: Generate your API token from the Camera Kit dashboard
3. **Lens Group ID**: Create a lens group and note the Group ID
4. **Lens IDs**: Upload or select lenses and note their individual IDs

### Installation

Install the required packages:

```bash
npm install @snap/camera-kit
# or
yarn add @snap/camera-kit
```

### Configuration

**Step 1**: Create a configuration file at `lib/config.ts`:

```typescript
/**
 * Configuration for the Camera Kit integration
 */

export const SNAP_API_TOKEN = 'YOUR_SNAP_API_TOKEN_HERE';
export const SNAP_GROUP_ID = 'YOUR_GROUP_ID_HERE';
export const DEFAULT_LENS_ID = 'YOUR_DEFAULT_LENS_ID_HERE';

export const config = {
  snap: {
    apiToken: SNAP_API_TOKEN,
    groupId: SNAP_GROUP_ID
  }
};

export default config;
```

**Important**: Replace the placeholder values with your actual credentials from the Snap Camera Kit dashboard.

### Core Implementation

**Step 2**: Create the Camera Kit service at `lib/cameraKitService.ts`:

```typescript
'use client';

import { SNAP_API_TOKEN } from './config';

// Module-level variables to maintain Camera Kit state
let cameraKit: any = null;
let session: any = null;
let currentLensId: string | null = null;

interface InitOptions {
  canvas: HTMLCanvasElement;
  facingMode: 'user' | 'environment';
}

/**
 * Initialize Camera Kit with the canvas and API token
 */
export const initializeCamera = async ({ canvas, facingMode }: InitOptions): Promise<MediaStream> => {
  if (typeof window === 'undefined') {
    throw new Error('Camera Kit can only be initialized on the client side');
  }

  try {
    console.log('Initializing Camera Kit...');
    
    // Dynamic import for client-side only
    const { bootstrapCameraKit } = await import('@snap/camera-kit');
    
    // Use API token from config or custom window variable
    const apiToken = (window as any).SNAP_CUSTOM_API_KEY || SNAP_API_TOKEN;
    
    // Bootstrap Camera Kit
    cameraKit = await bootstrapCameraKit({
      apiToken
    });
    console.log('CameraKit initialized successfully');
    
    // Create a session with the canvas as render target
    session = await cameraKit.createSession({ liveRenderTarget: canvas });
    console.log('Session created successfully');
    
    // Get user media stream
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    console.log('Got media stream successfully');
    
    // Set the media stream as source
    await session.setSource(mediaStream);
    console.log('Set source successfully');
    
    // Start playing the session
    await session.play();
    console.log('Session playing successfully');
    
    return mediaStream;
  } catch (error) {
    console.error('Snap Camera Kit initialization failed:', error);
    throw error;
  }
};

/**
 * Apply a lens to the canvas
 */
export const applyLensToCanvas = async (
  canvas: HTMLCanvasElement,
  lensId: string,
  groupId: string | null
): Promise<void> => {
  if (!cameraKit || !session) {
    console.error('Camera Kit not initialized');
    throw new Error('Camera Kit not initialized');
  }
  
  try {
    console.log(`Applying lens ${lensId} from group ${groupId}`);
    
    // Skip if same lens is already applied
    if (currentLensId === lensId) {
      console.log('Lens already applied, skipping');
      return;
    }
    
    // Load the lens from the repository
    const effectiveGroupId = groupId || SNAP_GROUP_ID;
    const lens = await cameraKit.lensRepository.loadLens(lensId, effectiveGroupId);
    
    if (!lens) {
      throw new Error(`Lens ${lensId} not found`);
    }
    
    // Apply the lens to the session
    await session.applyLens(lens);
    currentLensId = lensId;
    console.log(`Successfully applied lens: ${lensId}`);
    
  } catch (error) {
    console.error('Failed to apply lens:', error);
    throw error;
  }
};

/**
 * Capture a photo from the canvas
 */
export const captureCanvas = async (
  canvas: HTMLCanvasElement, 
  facingMode: 'user' | 'environment' = 'user'
): Promise<string> => {
  try {
    console.log('Capturing photo from canvas...');
    
    // Create a new canvas for the final image with 9:16 aspect ratio
    const captureCanvas = document.createElement('canvas');
    const ctx = captureCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Set the capture dimensions to 9:16 aspect ratio
    const targetWidth = 1080;
    const targetHeight = 1920;
    captureCanvas.width = targetWidth;
    captureCanvas.height = targetHeight;
    
    // Calculate source dimensions to maintain aspect ratio
    const sourceWidth = canvas.width;
    const sourceHeight = canvas.height;
    
    // Calculate scaling to fit the target dimensions
    const scaleX = targetWidth / sourceWidth;
    const scaleY = targetHeight / sourceHeight;
    const scale = Math.max(scaleX, scaleY);
    
    // Calculate source rect to center the crop
    const scaledSourceWidth = targetWidth / scale;
    const scaledSourceHeight = targetHeight / scale;
    const sourceX = (sourceWidth - scaledSourceWidth) / 2;
    const sourceY = (sourceHeight - scaledSourceHeight) / 2;
    
    // Fill with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    
    // Draw the canvas content, cropped and scaled to 9:16
    ctx.drawImage(
      canvas,
      sourceX, sourceY, scaledSourceWidth, scaledSourceHeight,
      0, 0, targetWidth, targetHeight
    );
    
    // Convert to data URL
    const dataUrl = captureCanvas.toDataURL('image/png', 1.0);
    console.log('Photo captured successfully');
    
    return dataUrl;
  } catch (error) {
    console.error('Failed to capture photo:', error);
    throw error;
  }
};

/**
 * Clean up Camera Kit resources
 */
export const cleanupCamera = async (): Promise<void> => {
  try {
    if (session) {
      await session.destroy();
      session = null;
    }
    
    cameraKit = null;
    currentLensId = null;
    console.log('Camera Kit cleaned up successfully');
  } catch (error) {
    console.error('Failed to cleanup Camera Kit:', error);
  }
};
```

### React Hook

**Step 3**: Create a React hook to manage camera state at `hooks/useCameraKit.ts`:

```typescript
import { useState, useEffect, useRef, RefObject } from 'react';
import { initializeCamera, applyLensToCanvas, captureCanvas, cleanupCamera } from '../lib/cameraKitService';

type CameraStatus = 'loading' | 'permission_needed' | 'ready' | 'error';

export const useCameraKit = (
  containerRef: RefObject<HTMLDivElement>,
  canvasRef: RefObject<HTMLCanvasElement>
) => {
  const [status, setStatus] = useState<CameraStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera on mount
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      try {
        if (!containerRef.current || !canvasRef.current) {
          throw new Error('Container or canvas reference not available');
        }

        // Check camera permissions
        const permission = await navigator.permissions.query({ 
          name: 'camera' as PermissionName 
        });
        
        if (permission.state === 'denied') {
          setStatus('permission_needed');
          return;
        }

        setStatus('loading');
        
        // Initialize camera
        const stream = await initializeCamera({
          canvas: canvasRef.current,
          facingMode: isFrontCamera ? 'user' : 'environment'
        });
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          await cleanupCamera();
          return;
        }
        
        streamRef.current = stream;
        setStatus('ready');
      } catch (err) {
        console.error('Camera initialization failed:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize camera');
          setStatus('error');
        }
      }
    };
    
    init();
    
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      cleanupCamera().catch(err => {
        console.warn('Error during Camera Kit cleanup:', err);
      });
    };
  }, [containerRef, canvasRef, isFrontCamera]);

  // Request camera permission
  const requestPermission = async () => {
    try {
      setStatus('loading');
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      const stream = await initializeCamera({
        canvas: canvasRef.current!,
        facingMode: isFrontCamera ? 'user' : 'environment'
      });
      
      streamRef.current = stream;
      setStatus('ready');
    } catch (err) {
      console.error('Permission request failed:', err);
      setError(err instanceof Error ? err.message : 'Permission denied');
      setStatus('permission_needed');
    }
  };

  // Toggle between front and back camera
  const toggleCamera = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    await cleanupCamera();
    setIsFrontCamera(prev => !prev);
  };

  // Toggle flash
  const toggleFlash = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities() as any;
        if (capabilities?.torch) {
          const newFlashState = !isFlashEnabled;
          videoTrack.applyConstraints({
            advanced: [{ torch: newFlashState } as any]
          }).then(() => {
            setIsFlashEnabled(newFlashState);
          }).catch(err => {
            console.error('Failed to toggle flash:', err);
          });
        }
      }
    }
  };
  
  // Apply lens to the canvas
  const applyLens = (lensId: string, groupId: string | null = null) => {
    if (status !== 'ready' || !canvasRef.current) {
      return;
    }
    
    applyLensToCanvas(canvasRef.current, lensId, groupId).catch(err => {
      console.error('Failed to apply lens:', err);
      setError(err instanceof Error ? err.message : 'Failed to apply lens');
    });
  };

  // Capture photo from canvas
  const capturePhoto = async (): Promise<string | null> => {
    if (status !== 'ready' || !canvasRef.current) {
      return null;
    }
    
    try {
      return await captureCanvas(canvasRef.current);
    } catch (err) {
      console.error('Failed to capture photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to capture photo');
      return null;
    }
  };

  return {
    status,
    error,
    isFrontCamera,
    isFlashEnabled,
    requestPermission,
    toggleCamera,
    toggleFlash,
    applyLens,
    capturePhoto
  };
};
```

### Camera View Component

**Step 4**: Create a camera view component. This is a simplified example - customize it for your needs:

```typescript
import { useRef, useState } from 'react';
import { useCameraKit } from '../hooks/useCameraKit';

export default function CameraView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    status,
    error,
    isFrontCamera,
    requestPermission,
    toggleCamera,
    applyLens,
    capturePhoto
  } = useCameraKit(containerRef, canvasRef);

  const [currentLensId, setCurrentLensId] = useState<string | null>(null);

  const handleApplyLens = (lensId: string) => {
    setCurrentLensId(lensId);
    applyLens(lensId);
  };

  const handleCapture = async () => {
    const photoDataUrl = await capturePhoto();
    if (photoDataUrl) {
      // Do something with the photo (e.g., download, upload, display)
      console.log('Photo captured:', photoDataUrl);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      {/* Canvas for Camera Kit */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />

      {/* Permission Needed */}
      {status === 'permission_needed' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={requestPermission}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Grant Camera Permission
          </button>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <p>Error: {error}</p>
          </div>
        </div>
      )}

      {/* Controls (only show when ready) */}
      {status === 'ready' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
          <button
            onClick={toggleCamera}
            className="px-4 py-2 bg-white rounded-full"
          >
            Flip Camera
          </button>
          
          <button
            onClick={handleCapture}
            className="w-16 h-16 bg-white rounded-full border-4 border-gray-300"
          />
          
          <button
            onClick={() => handleApplyLens('YOUR_LENS_ID')}
            className="px-4 py-2 bg-white rounded-full"
          >
            Apply Lens
          </button>
        </div>
      )}
    </div>
  );
}
```

### Usage Example

Here's how to use the camera component in your app:

```typescript
import CameraView from './components/CameraView';

function App() {
  return (
    <div className="App">
      <CameraView />
    </div>
  );
}

export default App;
```

### Key Points

1. **Client-Side Only**: Camera Kit must run in the browser. Use `'use client'` directive if using Next.js with app router.

2. **Dynamic Import**: The SDK uses dynamic imports to avoid SSR issues.

3. **Permission Handling**: Always check and request camera permissions before initializing.

4. **Cleanup**: Always cleanup resources when component unmounts to prevent memory leaks.

5. **Lens Loading**: Lenses must be loaded from your lens group using the group ID and lens ID.

6. **Canvas Element**: Camera Kit renders to a canvas element, not a video element.

---

## Carousel Component

### Carousel Installation

Install the Embla Carousel React package:

```bash
npm install embla-carousel-react
# or
yarn add embla-carousel-react
```

### Implementation

**Step 1**: Create the carousel component at `components/ui/carousel.tsx`:

```typescript
import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

### Basic Usage

```typescript
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <div className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

### Advanced Examples

#### Vertical Carousel

```typescript
<Carousel orientation="vertical" className="w-full max-w-xs">
  <CarouselContent className="-mt-1 h-[200px]">
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index} className="pt-1 md:basis-1/2">
        <div className="p-1">
          <div className="flex items-center justify-center p-6">
            <span className="text-3xl font-semibold">{index + 1}</span>
          </div>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

#### Multiple Items Per View

```typescript
<Carousel
  opts={{
    align: "start",
  }}
  className="w-full max-w-sm"
>
  <CarouselContent>
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
        <div className="p-1">
          <div className="flex aspect-square items-center justify-center p-6">
            <span className="text-3xl font-semibold">{index + 1}</span>
          </div>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

#### Loop Carousel

```typescript
<Carousel
  opts={{
    align: "start",
    loop: true,
  }}
  className="w-full max-w-sm"
>
  <CarouselContent>
    {items.map((item, index) => (
      <CarouselItem key={index}>
        <div className="p-1">
          {item}
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

#### Autoplay Carousel

First, install the autoplay plugin:

```bash
npm install embla-carousel-autoplay
```

Then use it:

```typescript
import Autoplay from "embla-carousel-autoplay"

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <div className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

#### With API Control

```typescript
import { type CarouselApi } from "@/components/ui/carousel"

export function CarouselApi() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div>
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  )
}
```

### API Reference

#### Carousel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | The orientation of the carousel |
| `opts` | `CarouselOptions` | `{}` | Options to pass to the Embla Carousel |
| `plugins` | `CarouselPlugin[]` | `[]` | Plugins to pass to the Embla Carousel |
| `setApi` | `(api: CarouselApi) => void` | - | Callback to set the carousel API |

#### Common Embla Options

```typescript
{
  align: "start" | "center" | "end",
  loop: boolean,
  skipSnaps: boolean,
  dragFree: boolean,
  containScroll: "trimSnaps" | "keepSnaps" | "",
}
```

#### Carousel API Methods

When using `setApi`, you get access to these methods:

- `scrollNext()` - Scroll to next slide
- `scrollPrev()` - Scroll to previous slide
- `scrollTo(index)` - Scroll to specific slide
- `canScrollNext()` - Check if can scroll next
- `canScrollPrev()` - Check if can scroll prev
- `selectedScrollSnap()` - Get current slide index
- `scrollSnapList()` - Get array of all slides

---

## Troubleshooting

### Snap Camera Kit Issues

**Problem**: Camera permission denied
- **Solution**: Check browser settings and ensure HTTPS is enabled

**Problem**: Lens not loading
- **Solution**: Verify your API token, group ID, and lens ID are correct

**Problem**: Canvas not rendering
- **Solution**: Ensure canvas element is mounted before initializing Camera Kit

### Carousel Issues

**Problem**: Carousel not sliding
- **Solution**: Ensure CarouselContent and CarouselItem are properly wrapped

**Problem**: Navigation buttons not showing
- **Solution**: Check that you have enough space for absolute positioned buttons (they are positioned outside the carousel by default)

---

## Additional Resources

- [Snap Camera Kit Documentation](https://docs.snap.com/camera-kit)
- [Embla Carousel Documentation](https://www.embla-carousel.com/)
- [Embla Carousel React](https://www.embla-carousel.com/get-started/react/)

---

## License

This implementation guide is provided as-is for educational purposes.
