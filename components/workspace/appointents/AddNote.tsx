import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { reactquilToolbar } from '@/constants'
import { format } from 'date-fns'
import { ArrowLeft, Check, ChevronLeft } from 'lucide-react'
import React, { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';  
import { FileUploader } from '@/components/shared/Fileuploader'
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/globalUserStore'
import { PostRequest } from '@/utils/api'
import { Booking, BookingNote } from '@/types/appointments'
import { toast } from 'react-toastify'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const AddNote = ({setIsAddNote, editNote, booking, setBookingNotes }:{
    setIsAddNote:Dispatch<SetStateAction<boolean>>
    editNote?: BookingNote,
    booking: Booking,
    setBookingNotes: Dispatch<SetStateAction<BookingNote[]>>
}) => {
    const {user} = useUserStore()

    const [errors, setErrors] = useState<Record<string, string>|null>(null);
    const [loading, setLoading] = useState<string>('');

    const defaultValues: BookingNote = {
        note: "",
        title: "",
        media: [],
        createdBy:  user?.id,
        bookingContactId: booking?.contactId,
        bookingId: booking?.id!,
        workspaceId: booking?.workspaceId!
      };

    const [formData, setFormData] = useState<BookingNote>(defaultValues);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);

    useEffect(() => {
      if(editNote) {
        setFormData((prev) => ({ ...prev, ...editNote }));
    }
      setPreviewUrls(editNote?.media || [])
    }, [ editNote])
     
      const handleFileUpload = async () => {
        if (!files?.length) {
          return;
        }
      
        setLoading('Uploading files');
        try {
          const uploadedFiles = await Promise.all(
            files.map(async (file) => {
              const formDataToSend = new FormData();
              formDataToSend.append('file', file);
              formDataToSend.append('upload_preset', 'w5xbik6z');
              formDataToSend.append('folder', 'ZIKORO');
      
              const res = await fetch(`https://api.cloudinary.com/v1_1/zikoro/image/upload`, {
                method: 'POST',
                body: formDataToSend,
              });
      
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || 'Image upload failed.');
              }
      
              const data = await res.json();
              return { url: data.secure_url, type: file.type };
            })
          );
      
          setFiles([]);
          return uploadedFiles;
        } catch (error) {
          console.error('File upload failed:', error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            media: 'File upload failed.',
          }));
        }  
      };
    
      const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        if (formData?.note?.length! < 4 ) {
          newErrors.value = 'Provide the note';
        }
        if (formData?.title?.length! < 4 ) {
            newErrors.value = 'Provide the note';
          }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      }, [formData]);
    
    
      const handleSubmit = async (e: FormEvent)=> {
        e.preventDefault();
        setErrors(null);
        if (!validate()) return;
      
        try {
          setLoading("Processing...");
          
          let uploadedFiles;
          if(files.length) {
            setLoading("Uploading file...");
            uploadedFiles = await handleFileUpload();
          } 
          if (errors?.media && errors?.media?.length > 0) {
            return;
          }
      
          setLoading("Submitting values");
      console.log({formData})
          const response = 
            editNote ? await PostRequest<{data:any|null,error:string|null}>({
            url: "/api/appointments/editNote",
            body: {
              ...formData,
              media:  files.length ? [...editNote?.media!, uploadedFiles] : editNote.media,
              lastEditDate: new Date().toISOString(),
            },
          }) : await PostRequest<{data:any|null,error:string|null}>({
            url: "/api/appointments/addNote",
            body: {
              ...formData,
              media:uploadedFiles,
              lastEditDate: new Date().toISOString(),
            },
          })

        if(response?.data) {
            if(editNote) {
              setBookingNotes((prev)=>{
                const items =  prev.map((item)=>item.id===editNote.id ? editNote : item)
                return items
              })
            } else {
              setBookingNotes((prev)=>[response.data, ...prev])
            }
            setPreviewUrls([]);
            setFiles([]);
            if (!editNote) setFormData(defaultValues);
            toast.success('Your request was successful.')
        } else {
          setErrors({ gen: "An error occurred. Please try again." });
          toast.error('Unsuccessful operation.')
        }
        } catch (error) {
          console.error("Submission failed:", error);
          setErrors({ gen: "Submission failed:" });
        } finally {
          setLoading("");
        }
      };
    
    const memoizedToolbar = useMemo(reactquilToolbar, [])
    
  return (
    <section className="p-6">
        <div className="flex justify-between gap-6 items-center ">
            <Button onClick={()=>setIsAddNote(false)} variant={'outline'} className='rounded-full h-10 w-10 flex justify-center items-center text-gray-600'>
                <ArrowLeft size={36}/>
            </Button>
            <h4 className="font-semibold">Add note</h4>
            <div></div>
        </div>

        <form onSubmit={handleSubmit} className='pt-6 flex flex-col gap-4'>
          {errors?.gen ? <small className='pb- text-red-600 text-center'>{errors.gen}</small> : null}
            <div className="">
                <input 
                    placeholder='Note title'
                    className='px-4 border-b pb-2 focus:outline-none focus-within:outline-none bg-transparent'
                    value={formData?.title||''}
                    name='title'
                    aria-label='title of the note'
                    onChange={(e)=>setFormData((prev)=>{
                        return{
                            ...prev, title:e.target.value
                        }
                    })}
                />
                {errors?.title ? <small className='text-red-600'>{errors?.title}</small> : null}
            </div>

            <div className="">
                <ReactQuill
                    value={formData?.note||''}
                    onChange={(value) => setFormData((prev) => ({ ...prev, note: value }))}
                    modules={memoizedToolbar}
                    className="editor-content no-scrollbar "
                    placeholder='Start writing note'
                />
                {errors?.note ? <small className='text-red-600'>{errors?.note}</small> : null}
            </div>

            <div className="pb-4">
                <label htmlFor="attachments" className="text-gray-600 font-semibold text-sm">
                Upload File
                </label>
                <FileUploader
                files={files}
                setFiles={setFiles}
                onChange={handleFileUpload}
                previewUrls={previewUrls}
                setPreviewUrls={setPreviewUrls}
                isDisabled={false}
                />
                {errors?.media && <small className="text-red-500">{errors.media}</small>}
            </div>

            <div className="flex justify-center w-full">
                <Button type='submit' className='rounded-full px-6 py-2 text-white bg-zikoroBlue'>
                    {loading ? loading : 'Submit'}
                </Button>
            </div>
        </form>
        
    </section>
  )
}

export default AddNote