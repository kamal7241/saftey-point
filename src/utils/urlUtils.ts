/**
 * Safely constructs a URL by handling undefined environment variables
 * @param path - The path to append to the base URL
 * @param baseUrl - The base URL (defaults to NEXT_PUBLIC_URL)
 * @returns A valid URL string
 */
export const constructImageUrl = (path: string, baseUrl?: string): string => {
  const base = baseUrl || process.env.NEXT_PUBLIC_URL;
  
  // If base URL is undefined, return a fallback image
  if (!base || base === 'undefined') {
    return "/images/noimage.webp";
  }
  
  // If path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If path is already a relative path starting with /, return it as is
  if (path.startsWith('/')) {
    return path;
  }
  
  // Remove leading slash from path if base URL ends with slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  
  return `${cleanBase}/${cleanPath}`;
};

/**
 * Validates if a URL is safe to use
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || url === 'undefined' || url.includes('undefined')) {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets a fallback image URL when the original URL is invalid
 * @returns Fallback image URL
 */
export const getFallbackImageUrl = (): string => {
  return "/images/noimage.webp";
}; 