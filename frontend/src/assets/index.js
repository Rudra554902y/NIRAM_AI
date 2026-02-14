/**
 * Assets Folder
 * 
 * This folder contains static assets like images, icons, and fonts.
 * 
 * Logo Image: 2142bc52670aec246c08f5e53b9fddca1c4539cb.png
 * - Also copied to /public/logo.png for easy access
 * - Used as favicon (/public/favicon.png)
 * 
 * Icons: All from Lucide React (tree-shakeable)
 * 
 * Recommended structure for future:
 * - assets/icons/
 * - assets/images/
 * - assets/illustrations/
 * - assets/brand/
 */

// Export logo path for use in components
export const LOGO_PATH = '/logo.png';
export const LOGO_IMAGE = new URL('./2142bc52670aec246c08f5e53b9fddca1c4539cb.png', import.meta.url).href;

