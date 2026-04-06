import React from 'react';

/**
 * D-VirtOS Kernel Module: Automatic App Discovery
 * Scans 'src/apps' for any .tsx files to create a component map.
 * This mimics the Linux binary execution without manual imports.
 */

// Vite magic: Scans the directory and creates a lazy-loading map
const appModules = import.meta.glob('../apps/**/*.tsx');

export interface AppManifest {
  id: string;
  name: string;
  icon: string;
  exec: string;
  description?: string;
}

export const getAppComponent = (execName: string) => {
  // Find the component path that matches the 'exec' name in JSON
  const path = Object.keys(appModules).find(p => p.includes(`${execName}.tsx`));
  
  if (!path) {
    console.error(`Kernel Error: Binary '${execName}' not found in /src/apps/`);
    return null;
  }

  // Returns the component as a React Lazy component
  return React.lazy(appModules[path] as () => Promise<{ default: React.ComponentType<any> }>);
};