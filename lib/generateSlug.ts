
export const generateSlug = (name: string): string => {
  const slug = name?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');

  // const uniqueIdentifier = uuidv4();

  return `${slug}`;
};
