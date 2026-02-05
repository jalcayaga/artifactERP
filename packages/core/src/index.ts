// lib/api
export * from './lib/api';
export { default as fetchWithAuth } from './lib/fetchWithAuth';

// lib/types
export * from './lib/types';

// lib/utils
export * from './lib/utils';

// lib/constants
export * from './lib/constants';

// lib/json data
export { default as chileanRegions } from './lib/chilean_regions.json';
export { default as countries } from './lib/countries.json';

// NOTE: Client-side components (React Contexts, Hooks) are now in ./client.ts
// Do NOT export them here to avoid breaking the Backend build.
