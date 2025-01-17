export const baseUrl = 
  process.env.NODE_ENV === 'development' ? 
  'http://localhost:3000/' :
  process?.env?.NEXT_PUBLIC_SITE_URL ??
  process?.env?.NEXT_PUBLIC_VERCEL_URL 

export const getBaseURL = (): string => {
  let url =
    process?.env?.NEXT_PUBLIC_BASE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/';

  url = url.includes('http') ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};