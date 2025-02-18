import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { reactquilToolbar } from '@/constants'
import { format } from 'date-fns'
import { ArrowLeft, Check, ChevronLeft } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';  

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AddNote = ({setIsAddNote}:{
    setIsAddNote:Dispatch<SetStateAction<boolean>>
}) => {
    const [date, setDate] = useState('')
    useEffect(() => {
      setDate(format(new Date(), 'ddd, MMM, dd'))
 
    }, [ ])


    const memoizedToolbar = useMemo(reactquilToolbar, [])
    
  return (
    <section className="p-6 flex flex-col gap-4  ">
        <div className="flex justify-between gap-6 items-center ">
            <Button onClick={()=>setIsAddNote(false)} variant={'outline'} className='rounded-full h-10 w-10 flex justify-center items-center text-gray-600'>
                <ArrowLeft size={36}/>
            </Button>
            <h4 className="font-semibold">Add note</h4>
            <div></div>
        </div>

        <input 
            placeholder='Note title'
            className='px-4 border-b pb-2 focus:outline-none focus-within:outline-none bg-transparent'
        />

        <ReactQuill
            // value={formData.Note}
            // onChange={(value) => setFormData((prev) => ({ ...prev, Note: value }))}
            // modules={memoizedToolbar}
            className="editor-content no-scrollbar "
            placeholder='Start writing note'
        />

        <div className="flex justify-center w-full">
            <Button className='rounded-full h-10 w-10 flex justify-center items-center text-white bg-zikoroBlue'>
                <Check/>
            </Button>
        </div>
        
    </section>
  )
}

export default AddNote