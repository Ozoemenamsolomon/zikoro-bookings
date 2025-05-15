import { Button } from '@/components/ui/button'
import {   reactquilToolbar } from '@/constants'
import { ArrowLeft,   FolderOpen } from 'lucide-react'
import React, { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';  
import { FileUploader, renderAttachment } from '@/components/shared/Fileuploader'
import useUserStore from '@/store/globalUserStore'
import { PostRequest } from '@/utils/api'
import {   BookingNote, BookingsContact } from '@/types/appointments'
import { toast } from 'react-toastify'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { handleFileUpload } from '@/lib/cloudinary'
import EmptyList from '../../ui/EmptyList';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const AddNote = ({  contact, insertNote, updateNote, editNote   }:{
    contact: BookingsContact,
    insertNote:(note: BookingNote) => Promise<string>,
    updateNote:(note: BookingNote) => Promise<string>,
    editNote?:BookingNote
}) => {
    const {user} = useUserStore()
     

    const [errors, setErrors] = useState<Record<string, string>|null>(null);
    const [loading, setLoading] = useState<string>('');

    const defaultValues: BookingNote = {
        note: "",
        title: "",
        media: [],
        // createdBy: user?.id as bigint,
        bookingContactId: contact?.id,
        // bookingId: contact?.id!,
        workspaceId: contact?.workspaceId!
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
            const result = await handleFileUpload({ files });

            if (!result || result?.errorMessage) {
              setErrors({
                media: result?.errorMessage || "File upload failed.",
                gen: result?.errorMessage || "An error occurred during upload.",
              });
              setLoading("");
              return;
            }
            uploadedFiles = result.uploadedFiles || []
          } 
      
          setLoading("Submitting values");
          
          const response = 
            editNote ? await updateNote({
              ...formData,
              media: files.length ? [...(editNote?.media||[]), ...(uploadedFiles || [])] : editNote.media,
              lastEditDate: new Date().toISOString(),
              // createdBy: editNote?.createdBy?.id,
            }) 
            : await insertNote(
              {
              ...formData,
              media:uploadedFiles,
              lastEditDate: new Date().toISOString(),
              // createdBy: user?.id,
            }
            )
        // work on this response
        if(response) {
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

 
    // console.log({disabled,isAddNote,previewUrls})
  return (
    <section className="p-6">
        <div className="flex justify-between gap-6 items-center ">
            <Button onClick={()=>{
              setFormData(defaultValues)
              }} variant={'outline'} className='rounded-full h-10 w-10 flex justify-center items-center text-gray-600 hover:border-zikoroBlue duration-300'>
                <ArrowLeft size={36}/>
            </Button>
            <h4 className="font-semibold">{editNote ? 'Edit note' :   'Add note'  }</h4>
            <div></div>
        </div>

        <form onSubmit={handleSubmit} className='pt-6 flex flex-col gap-4'>
          {errors?.gen ? <small className='pb- text-red-600 text-center'>{errors.gen}</small> : null}
            <div className="w-full">
                <input 
                    placeholder='Note title'
                    // disabled={disabled}
                    className='px-4 border-b pb-2 focus:outline-none focus-within:outline-none bg-transparent w-full'
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
                    // readOnly={disabled}
                />
                {errors?.note ? <small className='text-red-600'>{errors?.note}</small> : null}
            </div>

            {/* {!disabled ?  */}
              {/* <div className="pb-4">
                <label htmlFor="attachments" className="text-gray-600 font-semibold text-sm">
                Upload File
                </label>
                <FileUploader
                  files={files}
                  setFiles={setFiles}
                  previewUrls={previewUrls}
                  setPreviewUrls={setPreviewUrls}
                  isDisabled={false}
                />
                {errors?.media && <small className="text-red-500">{errors.media}</small>}
            </div> : */}
            <div className="pb-4">
              <h6 className='text-sm pb-4 font-semibold'>Uploaded files</h6>
              {
                !previewUrls?.length ?
                <EmptyList icon={<FolderOpen size={20}/>} text='No file found' className='h-24' /> 
                :
                <div className="flex w-full gap-3 flex-wrap">
                {
                  previewUrls?.map(({url,type},i)=>(
                    <span key={i} className="h-32 w-24 rounded-md">
                      {renderAttachment(url,type)}
                    </span>
                  ))
                }
              </div>}
            </div>
            {/* } */}

            { <div className="flex justify-center w-full">
                <button type='submit' className='rounded-full px-6 py-2 text-white bg-zikoroBlue'>
                    {loading ? loading : 'Submit'}
                </button>
            </div>}
        </form>
        
    </section>
  )
}

export default AddNote