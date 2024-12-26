import { v4 as uuidv4 } from 'uuid';

export const generateSlug = (name: string): string => {
  const uniqueIdentifier = uuidv4();

  return `${uniqueIdentifier}`;
};

export const generateSlugg = (name: string, length?:number): string => {
  const slug = name?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');

    const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const hashLength = length || 5;
    let hash = "";

  for (let i = 0; i < hashLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters.charAt(randomIndex);
  }
;

  return `${slug}-${hash}`;
};
