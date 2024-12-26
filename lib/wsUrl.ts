/** Utility function to create workspace URLs */
export const wsUrl = (path: string, param: string) => {
    if (!param) return `${path}`; // Fallback if no param is provided
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}${param}`;
  };

  export const wsUrll = (path: string, wsPath: string) => {
    if (!wsPath) return `/workspace${path}`; // Fallback if no param is provided
    return `${wsPath}${path}`;
  };