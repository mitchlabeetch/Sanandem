import { writable } from 'svelte/store';

export const isLowPerformanceMode = writable(false);
export const isDarkMode = writable(true); // Default to dark as per current theme
export const isDenseMode = writable(false);
