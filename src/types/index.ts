export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
}

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
    mobileMenu: MobileMenu;
  }
}

// Mobile Menu types
export interface MobileMenu {
  menu: HTMLElement | null;
  overlay: HTMLElement | null;
  menuButton: HTMLElement | null;
  closeButton: HTMLElement | null;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

// Animation Observer types
export interface AnimationObserver {
  observer: IntersectionObserver;
  observe: (element: Element) => void;
}

// Google namespace for Maps API
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: any);
    }
    class Marker {
      constructor(options: any);
      setMap(map: Map | null): void;
    }
    class InfoWindow {
      constructor(options: any);
      open(options?: { map: Map; anchor: Marker }): void;
    }
    interface MapOptions {
      zoom: number;
      center: { lat: number; lng: number };
      mapTypeId?: string;
    }
  }
}

// Media Section types
export type MediaType = 'gallery' | 'video' | 'testimonials';

export interface MediaSectionProps {
  mediaType?: MediaType;
}
