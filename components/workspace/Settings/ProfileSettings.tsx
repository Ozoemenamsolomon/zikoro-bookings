'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Check, Plus, PlusCircle } from 'lucide-react';
import { FileUploader, handleFileUpload } from '@/components/shared/Fileuploader';
import { CustomSelect } from '@/components/shared/CustomSelect';
import { Button } from '@/components/ui/button';
import { PostRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import useUserStore from '@/store/globalUserStore';
import { User } from '@/types/appointments';
import { Toggler } from '../ui/SwitchToggler';
import CustomInput from '../ui/CustomInput';
import ProfileImageUpload from '@/components/shared/ProfileImageUpload';
import { uploadImage } from '@/components/shared/ProfileImageUpload';
import { TUser } from '@/types';
import { countryList } from '@/constants/countryList';
import { ReactSelect } from '@/components/shared/ReactSelect';

const initialFormData:User = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  organization: '',
  city: '',
  country: '',
  phoneNumber: '',
  whatsappNumber: '',
  profilePicture: '',
  bio: '',
};

const ProfileSettings = () => {
  const { setUser, user } = useUserStore();
  const [formData, setFormData] = useState<User>({
    ...initialFormData,
  });
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        created_at: user.created_at ? new Date(user.created_at) : new Date(), // Convert to Date
      });
    }
  }, [user]);

  const [file, setFile] = useState<File|null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string>('');

  /** Handle Input Change */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev:any) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  /** Handle Select Change */
  const handleSelectChange = useCallback((value: string) => {
    setFormData((prev:any) => ({ ...prev, country: value }));
    setErrors((prev) => ({ ...prev, country: '' }));
  }, []);

  /** Validation Logic */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

/** Handle Form Submission */
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
  
    try {
      let imageUrl = formData.profilePicture; // Default to existing profile picture
  
      if (file) {
        setLoading('Uploading picture...');
        const uploadResponse = await uploadImage(file);
  
        if (uploadResponse?.error) {
          setErrors({ gen: uploadResponse.error });
          throw new Error('Error uploading file');
        }
  
        imageUrl = uploadResponse?.url || imageUrl;
      }
  
      setLoading('Updating profile...');
  
      const { data, error } = await PostRequest({
        url: '/api/workspaces/userProfile',
        body: {
          ...formData,
          profilePicture: imageUrl,
        },
      });
  
      if (error) {
        setErrors({
          gen: error || 'Error occurred while updating profile',
        });
        return;
      }
  
      toast.success('Profile updated successfully');
      setUser(data); // Update global user state
      setFormData(data); // Update local form data state
  
    } catch (error: any) {
      setErrors({
        gen: error?.message || 'Submission failed',
      });
    } finally {
      setLoading('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-3 mx-auto max-w-lg p-6 py-10 ">
      {/* Form Section */}
        <h5 className="font-semibold text-xl pb-4">Profile Information</h5>

        <div>
            <ProfileImageUpload 
                imgUrl={formData?.profilePicture}
                setFile={setFile}
            />
        </div>
        
        <CustomInput
          type="text"
          name="firstName"
          label="First Name"
          isRequired
          value={formData.firstName}
          placeholder="Enter your first name"
          onChange={handleChange}
          error={errors.firstName}
        />

        <CustomInput
          type="text"
          name="lastName"
          label="Last Name"
          isRequired
          value={formData.lastName}
          placeholder="Enter your last name"
          error={errors.lastName}
          onChange={handleChange}
        />

        <CustomInput
          type="tel"
          name="phoneNumber"
          label="Phone Number"
          isRequired
          value={formData.phoneNumber}
          placeholder="Enter your phone number"
          error={errors.phoneNumber}
          onChange={handleChange}
        />

        <CustomInput
          type="tel"
          name="whatsappNumber"
          label="Whatsapp Number"
          value={formData.whatsappNumber||''}
          placeholder="Enter your whatsapp number"
          error={errors.whatsappNumber}
          onChange={handleChange}
        />

        <CustomInput
          type="text"
          name="city"
          label="City"
          isRequired
          value={formData?.city||''}
          placeholder="Enter your city of residence"
          onChange={handleChange}
        />

        <ReactSelect
          name='country'
          label="Country"
          error={errors.country}
          placeholder="Select a country"
          className={'w-full h-12 text-4xl'}
          value={formData.country||''}
          onChange={handleSelectChange}
          options={countryList.map((_)=>({label:_, value:_}))}
        />
        <CustomInput
            isTextarea
            name="bio"
          label="Bio"
          value={formData?.bio||''}
          placeholder="Enter your brief biography"
          onChange={handleChange}
        />

        <div className="flex flex-col gap-1 items-center justify-center">
          {errors?.gen && <small className="text-red-500">{errors.gen}</small>}
          <small>{loading}</small>
          <Button type="submit" className="bg-basePrimary w-full" disabled={loading.length > 0}>
            {loading || 'Update Profile'}
          </Button>
        </div>
    </form>
  );
};

export default ProfileSettings;
