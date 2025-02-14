'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import CustomInput from '../ui/CustomInput'
import { DatePicker } from '../ui/DatePicker'
import LinksInput from '../ui/LinksInput'
import ProfileImageUpload, { uploadImage } from './ProfileImageUpload'
import { BookingsContact,  } from '@/types/appointments'
import {toast} from 'react-toastify'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { CenterModal } from '@/components/shared/CenterModal'
import { format } from 'date-fns'
import { PostRequest } from '@/utils/api'


const validateForm = (formData: any) => {
    let errors = {}
    // if (!formData.firstName) errors = { ...errors, firstName: 'First name is required' }
    // if (!formData.lastName) errors = { ...errors, lastName: 'Last name is required' }
    if (!formData.email) errors = { ...errors, email: 'Email is required' }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors = { ...errors, email: 'Invalid email format' }
    return errors
}

const EditContact = () => {
    const { contact, setContact, setContacts } = useAppointmentContext()
    const [file, setFile] = useState<File|null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>()

    const [formData, setFormData] = useState<BookingsContact>({
        ...contact
    })

    useEffect(() => {
        if(contact){
            setFormData(contact)
            setPreviewUrl(contact?.profileImg || '')
        }
    }, [contact])
    

    const [errors, setErrors] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState('')


    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors((prev:any) => ({ ...prev, [name]: '' }))
    }, [])

    const handleDateChange = (date: Date | undefined) => {
        setFormData(prev => ({
            ...prev,
            created_at: date ? date.toDateString() : '',
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate the form data
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
    
        // Proceed only if there are no validation errors
        if (Object.values(validationErrors)?.length === 0) {
            
    
            try {
                let imageUrl
                if(file) {
                    setIsSubmitting('uploading...');
                    imageUrl = await uploadImage(file!)
                }
                setIsSubmitting('Submitting...');
                const {data, error}  =  await PostRequest({
                url:'/api/bookingsContact/updateContact',
                body: {...formData, profileImg:imageUrl}
                }) 
                console.log({data, error});
                if (data) {
                    setContacts((prevContacts: BookingsContact[] | null) =>
                            prevContacts
                                ? prevContacts.map(contact =>
                                    contact.id === data.id ? data : contact  
                                )
                                : prevContacts  
                    );
                    setContact(data);
                    setFile(null)
                    toast.success('Contact updated');
                } else {
                    toast.error('Server error! Check your network')
                }
            } catch (error) {
                toast.error('Server error! Check your network')
                console.error('Error submitting form:', error);
            } finally {
                setIsSubmitting('');
            }
        }
    };
    
    // const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors])

    return (
        <CenterModal
            className='max-w-3xl  max-h-[95vh] overflow-auto no-scrollbar '
            trigerBtn={
                <button className='border absolute right-3 top-3 rounded-full bg-white p-2'>
                    <Pencil size={20} className='border-b border-black'/>
                </button>
            }
        >
                <div className=" w-full rounded-md    pb-6">
                    <div className="bg-baseLight py-8 px-6 w-full text-xl font-semibold border-b">
                        Edit Contact
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 space-y-4">
                        <div className="flex justify-end pt-6 w-full">
                            <button 
                                type='submit' 
                                className={`bg-basePrimary text-white px-3 py-1 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                disabled={isSubmitting.length>0}
                            >
                                {isSubmitting ? isSubmitting : 'Save'}
                            </button>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                            <h6 className="font-medium">Basic Info</h6>

                            <div className="flex py-2 justify-center w-full">
                                <ProfileImageUpload formData={formData} previewUrl={previewUrl!} setPreviewUrl={setPreviewUrl} setFile={setFile} />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <CustomInput
                                    label='First name'
                                    type='text'
                                    name='firstName'
                                    value={formData.firstName!}
                                    placeholder='Enter Name'
                                    error={errors?.firstName}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Last name'
                                    type='text'
                                    name='lastName'
                                    value={formData.lastName!}
                                    placeholder='Enter Name'
                                    error={errors?.lastName}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Email'
                                    type='email'
                                    name='email'
                                    disabled
                                    value={formData.email!}
                                    placeholder='Enter Email'
                                    error={errors?.email}
                                    className='disabled:opacity-50'
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Age'
                                    type='number'
                                    name='age'
                                    value={formData.age!}
                                    placeholder='Enter Age'
                                    error={errors?.age}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Phone Number'
                                    type='tel'
                                    name='phone'
                                    value={formData.phone!}
                                    placeholder='Enter Phone Number'
                                    error={errors?.phone}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Created At'
                                    type='text'
                                    name='created_at'
                                    value={format(new Date(formData.created_at!), 'dd MMMM yyyy, hh:mm a')}
                                    disabled
                                    // placeholder='Enter Phone Number'
                                    error={errors?.created_at}
                                    className='disabled:opacity-50 text-sm'
                                    onChange={handleChange}
                                />
                                {/* <DatePicker
                                    label='Created At'
                                    name='created_at'
                                    value={formData.created_at}
                                    onChange={handleDateChange}
                                    disabled={false} // Disable or enable as needed
                                /> */}
                            </div>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                            <h6 className="font-medium ">Contact Links</h6>

                            <LinksInput 
                                formlinks={formData?.links!} 
                                updateFormLinks={(updatedLinks) => setFormData(prev => ({
                                    ...prev,
                                    links: updatedLinks
                                }))}
                            />
                            
                        </div>
                    </form>
                </div>
        </CenterModal>
    )
}

export default EditContact

// export const CenterModall = () => {

// }
