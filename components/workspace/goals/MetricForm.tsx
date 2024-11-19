'use client'

import { CenterModal } from '@/components/shared/CenterModal'
import { Button } from '@/components/ui/button'
import React from 'react'
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const MetricForm = () => {
  return (
    <CenterModal 
        className='max-w-2xl w-full '
        trigerBtn={
            <div className="flex justify-center">
                <Button className="bg-basePrimary">Update new value</Button>
            </div>
        }
    >
        <form className='p-6 sm:p-12 space-y-6'>
            <h4 className="text-lg font-bold pb-8">Update Value</h4>
            <div className="flex justify-center items-center gap-2">
                <label htmlFor='value' className="text-gray-600 font-semibold text-sm">Update Value:</label>
                <input type="number" name="value" id="value" className='text-xl px-2 border-b border-gray-800 bg-transparent focus:bg-transparent focus:outline-none font-bold w-20'/>
                <small className='text-sm text-gray-600 font-semibold'>Degrees</small>
            </div>

            <div className="">
                <label htmlFor="note" className="text-gray-600 font-semibold text-sm">Add Note (optional) </label>
                <ReactQuill
                    // value={formData.content}
                    modules={modules}
                    onChange={(value) => {return null}
                        // setFormData((prevData) => ({ ...prevData, content: value }))
                    }
                    placeholder="Write your content here..."
                    className="rounded-md editor-content"
                />
            </div>

            <div className="">
                <label htmlFor="attachment" className="text-gray-600 font-semibold text-sm">Upload file</label>
            </div>

            <div className="flex flex-col items-center justify-center">
                <Button className="bg-basePrimary">Update</Button>
                <small>Last updated: </small>
            </div>

        </form>
    </CenterModal>
  )
}

export default MetricForm


const modules = {
    toolbar: [
      // Font and size selectors
      [{ font: ['sans-serif', 'serif', 'monospace', 'cursive'] }, ],
        // Headers and Formats
        [{ header: [1, 2, 3, 4, 5, 6, false] }],      // Headers 1-6
      // Text formatting options
      ['bold', 'italic', 'underline', 'strike'],    // Bold, Italic, Underline, Strikethrough
      [{ color: [] }, { background: [] }],          // Text color, Background color
      [{ script: 'sub' }, { script: 'super' }],     // Subscript, Superscript
      ['blockquote', 'code-block'],                 // Blockquote, Code block
      
      // List and Indentation
      [{ list: 'ordered' }, { list: 'bullet' }],    // Ordered and Bullet lists
      [{ indent: '-1' }, { indent: '+1' }],         // Outdent and Indent
      [{ direction: 'rtl' }],                       // Text direction (Right-to-left)
  
      // Alignment options
      [{ align: ['', 'center', 'right', 'justify'] }], // Text alignment: Left (default), Center, Right, Justify
  
      // Links, Images, Video, and Files
      ['link', 'image', ],                   // Insert link, image, video
      ['clean'],                                    // Remove formatting
      
      // Undo/Redo
      ['undo', 'redo'],                             // Custom undo/redo handlers
  

    ],
  };