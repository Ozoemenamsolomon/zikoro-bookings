'use client'

import { CenterModal } from '@/components/shared/CenterModal';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill
import { FileUploader } from '@/components/shared/Fileuploader';
import { toast } from 'react-toastify';
import { PostRequest } from '@/utils/api';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { useGoalContext } from '@/context/GoalContext';
import { urls } from '@/constants';
import { KeyResult } from '@/types/goal';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface FormData  {
  value: number | null;
  Note?: string;
  attachments?: { url: string; type: string }[];
}

const MetricForm = ({ keyResult }: { keyResult: KeyResult }) => {
  const {contact,} = useAppointmentContext()
  const {refresh,push} = useRouter()
  const [errors, setErrors] = useState<{
    value?: string;
    attachments?: string;
    gen?: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    value: null,
    Note: '',
    attachments: [],
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    },
    []
  );

  const handleFileUpload = useCallback((uploadedFiles: { url: string; type: string }[]) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      attachments: '',
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: [...(prevFormData.attachments || []), ...uploadedFiles],
    }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (formData.value === null || formData.value <= 0) {
      newErrors.value = 'Value is required and must be greater than 0';
    }
    if (files.length && !formData.attachments?.length) {
      newErrors.attachments = 'You have not saved the files';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, files]);

  const handleSubmit = async () => {
    setErrors(null);
    if (!validate()) return;

    try {
        if(false){
            // const { data, error } = await PostRequest({url:'/api/goals/submitMetric', 
            //     body:{ 
            //         timeLineData: {
            //             ...formData,
            //             organizationId: goalData.organization,
            //             createdBy: goalData.createdBy,
            //         },
            //     }
            // })
            // if (error) {
            //     setErrors({gen:error})
            // } else {
            //     toast.success('Metric value was updated')
            //     refresh()
            // }
        } else {
            const { data, error } = await PostRequest({url:'/api/goals/submitMetric', 
                body:{ 
                    timeLineData: {
                        ...formData,
                        keyResultId: keyResult?.id,
                        organizationId: keyResult.organization,
                        createdBy: keyResult.createdBy,
                    },
                }
            })
            if (error) {
                setErrors({gen:error})
            } else {
                toast.success('Timeline updated successfull')
                 refresh()
                // push(`${urls.contacts}/${contact?.email}/goals/details/${data.id}?id=${contact?.id}&name=${contact?.firstName}`)
            }
        }
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setLoading(false)
    }
  };

  const memoizedToolbar = useMemo(
    () => ({
      toolbar: [
        [{ font: ['sans-serif', 'serif', 'monospace', 'cursive'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: ['', 'center', 'right', 'justify'] }],
        ['clean'],
      ],
    }),
    []
  );

  return (
    <CenterModal
      className="max-w-2xl w-full overflow-hidden"
      trigerBtn={
        <div className="flex justify-center">
          <Button className="bg-basePrimary">Update new value</Button>
        </div>
      }
    >
      <form
        className="p-6 sm:p-12 max-h-[90vh] overflow-auto hide-scrollbar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h4 className="text-lg font-bold pb-8">Update Value</h4>

        <div className="flex justify-center items-center gap-2">
          <label htmlFor="value" className="text-gray-600 font-semibold text-sm">
            Update Value:
          </label>
          <input
            type="number"
            name="value"
            id="value"
            value={formData.value || ''}
            onChange={handleInputChange}
            className="text-xl px-2 border-b border-gray-800 bg-transparent focus:bg-transparent focus:outline-none font-bold w-20"
          />
          <small className="text-sm text-gray-600 font-semibold">Degrees</small>
        </div>
        {errors?.value && <small className="text-red-500">{errors.value}</small>}

        <div className="py-4">
          <label htmlFor="Note" className="text-gray-600 pb-2 font-semibold text-sm">
            Add Note (optional)
          </label>
          <ReactQuill
            value={formData.Note}
            onChange={(value) => setFormData((prev) => ({ ...prev, Note: value }))}
            modules={memoizedToolbar}
            className="editor-content no-scrollbar"
          />
        </div>

        <div className="pb-4">
          <label htmlFor="attachments" className="text-gray-600 font-semibold text-sm">
            Upload File
          </label>
          <FileUploader
            files={files}
            setFiles={setFiles}
            onChange={handleFileUpload}
          />
          {errors?.attachments && <small className="text-red-500">{errors.attachments}</small>}
        </div>

        <div className="flex flex-col gap-1 items-center justify-center">
          {errors?.gen && <small className="text-red-500">{errors.gen}</small>}
          <Button type='submit' className="bg-basePrimary" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <small>Last updated: Just now</small>
        </div>
      </form>
    </CenterModal>
  );
};

export default MetricForm;
