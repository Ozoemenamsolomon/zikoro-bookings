'use client';
import React, { useState } from 'react';
import { Loader, Pencil, UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { User } from '@/types/appointments';

// Cloudinary upload function
export const uploadImage = async (file: File, setFile?:React.Dispatch<React.SetStateAction<File>>) => {
  const formDataToSend = new FormData();
  formDataToSend.append("file", file);
  formDataToSend.append("upload_preset", "w5xbik6z");
  formDataToSend.append("folder", "ZIKORO");

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/zikoro/image/upload`, {
      method: "POST",
      body: formDataToSend,
    });

    if (res.ok) {
      const data = await res.json();
      return {url: data.secure_url};
    } else {
      return {error:'Error uploading image'}
    }
  } catch (error) {
    toast.error(`Error: ${error}`);
  }
};

interface ProfileImageUploadProps {
  imgUrl?: string|null;
  setFormData?: React.Dispatch<React.SetStateAction<User>>;
  file?: File;
  setFile: React.Dispatch<React.SetStateAction<File|null>>;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = (
  { imgUrl, setFile }
) => {
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.size! > MAX_FILE_SIZE) {
      setError(`File too large: (max 5MB).`);
    }
    if (file && file.type.startsWith('image/')) {
      setFile(file!)
      setPreview(URL.createObjectURL(file))
    } else {
      setError("Only image files are allowed.");
    }
  };

  return (
    <div className="mx-auto">
    <div className="relative h-40 w-40 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center justify-center">
      {
      preview || imgUrl ? (
        <Image
          src={preview|| imgUrl || ''}
          alt=""
          width={200}
          height={200}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
         <UserIcon size={60} className='opacity-50' />
      )}

      <label htmlFor="profile-upload" className="border absolute -right-2 bottom-0 rounded-full bg-white p-2 cursor-pointer">
        <Pencil size={16} className="border-b border-black" />
        <input
          id="profile-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
      <small className="text-red-600 text-center">{error}</small>
  </div>
  );
};

export default ProfileImageUpload;
