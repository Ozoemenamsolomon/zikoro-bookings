import {   reactquilToolbar } from '@/constants'
import {   FolderOpen } from 'lucide-react'
import React, {   FormEvent,   useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';  
import { FileUploader, renderAttachment } from '@/components/shared/Fileuploader'
import useUserStore from '@/store/globalUserStore'
import {   BookingNote, BookingNoteInput, BookingsContact } from '@/types/appointments'

import { handleFileUpload } from '@/lib/cloudinary'
import EmptyList from '../../ui/EmptyList';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const AddNote = ({  contact, insertNote, updateNote, editNote, isPreview   }:{
    contact: BookingsContact,
    insertNote:(note: BookingNoteInput) => Promise<string>,
    updateNote:(note: BookingNoteInput) => Promise<string>,
    editNote?:BookingNote,
    isPreview?:true,
}) => {
    const {user} = useUserStore()
    const [errors, setErrors] = useState<Record<string, string>|null>(null);
    const [loading, setLoading] = useState<string>('');

    const disabled = isPreview

    const defaultValues: BookingNoteInput = {
        note: "",
        title: "",
        media: [],
        createdBy: user?.id as bigint,
        bookingContactId: contact?.id,
        // bookingId: contact?.id!,
        workspaceId: contact?.workspaceId!
      };

    const [formData, setFormData] = useState<BookingNoteInput>(defaultValues);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);

    useEffect(() => {
      if(editNote) {
        const {createdBy, ...note} = editNote
        setFormData((prev) => ({ ...prev, ...note, createdBy: createdBy?.id }));
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
      
          setLoading("Submitting values...");
          
          const response = 
            editNote ? await updateNote({
              ...formData,
              media:  [...(formData?.media||[]), ...(uploadedFiles || [])],
              lastEditDate: new Date().toISOString(),
            }) 
            : await insertNote(
              {
              ...formData,
              media:uploadedFiles,
              lastEditDate: new Date().toISOString(),
              createdBy: user?.id,
            })
        // work on this response
        if(response) {
            !editNote && setPreviewUrls([]);
            setFiles([]);
            if (!editNote) setFormData(defaultValues);
        } else {
          setErrors({ gen: "An error occurred. Please try again." });
        }
        } catch (error) {
          // console.error("Submission failed:", error);
          setErrors({ gen: "Submission failed" });
        } finally {
          setLoading("");
        }
      };
    
    const memoizedToolbar = useMemo(reactquilToolbar, [])
 
  return (
    <section className="p-6">
        <div className="flex justify-between gap-6 items-center ">
            {/* <div></div> */}
            <h4 className="font-semibold">{disabled ? editNote?.title : editNote ? 'Edit note' :   'Add new note'  }</h4>
            <div></div>
        </div>

        <form onSubmit={handleSubmit} className='pt-4  flex flex-col gap-4'>
          {errors?.gen ? <small className='pb- text-red-600 text-center'>{errors.gen}</small> : null}
           
            {!disabled&&
            <div className="w-full">
                <input 
                    placeholder='Note title'
                    disabled={disabled}
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
            }

           <div> 
              <ReactQuill
                value={formData?.note || ''}
                onChange={
                  disabled
                    ? undefined
                    : (value) => setFormData((prev) => ({ ...prev, note: value }))
                }
                modules={disabled ? { toolbar: false } : memoizedToolbar}
                readOnly={disabled}
                className="editor-content no-scrollbar"
                placeholder={disabled ? '' : 'Start writing note'}
              />
              {errors?.note && <small className="text-red-600">{errors.note}</small>}
            </div>
           
             { !disabled ?  
             <div className="">
                <label htmlFor="attachments" className="text-gray-600 font-semibold text-sm">
                Upload File
                </label>
               <FileUploader
                  files={files}
                  setFiles={setFiles}
                  previewUrls={previewUrls}
                  setPreviewUrls={setPreviewUrls}
                  isDisabled={false}
                  callback={(url) => {
                    setFormData((prev: BookingNoteInput) => ({
                      ...prev,
                      media: prev.media?.filter((item) => item.url !== url) || [],
                    }));
                  }}
                />

                {errors?.media && <small className="text-red-500">{errors.media}</small>}
            </div>  
            :
            <div className="border p-2 rounded-md">
              <h6 className='text-sm pb-2 font-semibold'>Uploaded files</h6>
              {
                !previewUrls?.length ?
                <EmptyList icon={<FolderOpen size={20}/>} text='No file found' className='h-10 flex flex-row' /> 
                :
                <div className="flex w-full gap-2 flex-wrap">
                {
                  previewUrls?.map(({url,type},i)=>(
                    <Link href={url} target='_blank' key={i} className="size-20 rounded-md">
                      {renderAttachment(url,type)}
                    </Link >
                  ))
                }
              </div>}
            </div>
            
            }

             
        

            { disabled ? null :<div className="flex justify-center w-full">
                <button type='submit' className='rounded-full px-6 py-2 text-white bg-zikoroBlue'>
                    {loading ? loading : 'Submit'}
                </button>
            </div>}
        </form>
        
    </section>
  )
}

export default AddNote