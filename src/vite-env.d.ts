/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Defined by the inline boot guard in index.html, which runs before this
     *  bundle and is absent only if index.html itself was replaced. */
    __portfolioBooted?: () => void;
  }
}

export {};
