'use client';
import React, { useState } from 'react';
import { Loader, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { BookingsContact } from '@/types/appointments';

// Cloudinary upload function
export const uploadImage = async (file: File) => {
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
      toast.success("Image uploaded successfully!");
      return data.secure_url;
    } else {
      toast.error("Failed to upload image.");
    }
  } catch (error) {
    toast.error(`Error: ${error}`);
  }
};

interface ProfileImageUploadProps {
  previewUrl: string;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string|undefined>>;
  setFile: React.Dispatch<React.SetStateAction<File|null>>;
  formData: BookingsContact;
}
 
const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  previewUrl,
  setPreviewUrl,
  setFile,
  formData,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setFile(file);
      setPreviewUrl(objectUrl);

      // Clean up the object URL after usage
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      toast.error('Only image files are allowed.');
    }
  };

  return (
    <div className="relative h-20 w-20 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center text-2xl justify-center">
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Profile preview"
          width={80}
          height={80}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        (formData?.firstName?.[0] ?? '') + (formData?.lastName?.[0] ?? '') || 'NA'
      )}

      <label
        htmlFor="profile-upload"
        className="border absolute -right-2 bottom-0 rounded-full bg-white p-2 cursor-pointer"
        aria-label="Upload profile image"
      >
        <Pencil size={16} className="text-black" />
        <input
          id="profile-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ProfileImageUpload;
