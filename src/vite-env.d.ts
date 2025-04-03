
/// <reference types="vite/client" />

// Network Information API interfaces
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  downlinkMax?: number;
  rtt?: number;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown';
  addEventListener?: (type: string, listener: EventListener) => void;
  removeEventListener?: (type: string, listener: EventListener) => void;
}

interface Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

// Add fetchPriority to HTMLImageElement
interface HTMLImageElement {
  fetchPriority?: 'high' | 'low' | 'auto';
}

// Add startViewTransition to Document
interface Document {
  startViewTransition?: (callback?: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
    skipTransition: () => void;
  };
}

// Add contentVisibility to CSSStyleDeclaration
interface CSSStyleDeclaration {
  contentVisibility?: string;
}
