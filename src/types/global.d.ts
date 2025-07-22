declare global {
  interface Window {
    toast: {
      success: (message: string, options?: any) => void;
      error: (message: string, options?: any) => void;
      warning: (message: string, options?: any) => void;
      info: (message: string, options?: any) => void;
      show: (options: any) => void;
      hide: (id: string) => void;
      hideAll: () => void;
    };
    toastManager: any;
    modals: Map<string, any>;
    openModal: (id: string) => void;
    closeModal: (id: string) => void;
    toggleModal: (id: string) => void;
  }
}

export {};
