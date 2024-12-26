'use client'

import { CenterModal } from '@/components/shared/CenterModal';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill
import { FileUploader } from '@/components/shared/Fileuploader';
import { toast } from 'react-toastify';
import { PostRequest } from '@/utils/api';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { useGoalContext } from '@/context/GoalContext';
// import { urls } from '@/constants';
import { KeyResult, KeyResultsTimeline } from '@/types/goal';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/globalUserStore';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface FormData  {
  value: number | null;
  Note?: string;
  attachments: { url: string; type: string }[];
}

const MetricForm = ({ 
  keyResult, 
  triggerBtn=<div className="flex justify-center">
                <Button className="bg-basePrimary">Update new value</Button>
              </div>, 
  metric }: { 
    keyResult: KeyResult,
    triggerBtn?: React.ReactNode,
    metric?: KeyResultsTimeline
   }) => {
  
  const {refresh} = useRouter()
  const [errors, setErrors] = useState<{
    value?: string;
    attachments?: string;
    gen?: string;
    isGreater?: string;
  } | null>(null);
  const [loading, setLoading] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    value: null,
    Note: '',
    attachments: [],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if(metric) {
      setFormData({
        Note:metric.Note!,
        value:metric.value!,
        attachments: metric.attachments || []
      })
    }
    setPreviewUrls(metric?.attachments||[])
    setIsDisabled(true)
  }, [metric])
  
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const numericValue = Number(value);
      const targetValue = Number(keyResult?.targetValue);
  
      // Validate value against the targetValue
      if (numericValue > targetValue) {
        setErrors((prev: any) => ({
          ...prev,
          isGreater: 'The current value is greater than the target value (optional)',
        }));
      } else if (errors?.isGreater && numericValue <= targetValue) {
        setErrors((prev: any) => ({
          ...prev,
          isGreater: '',
        }));
      }
  
      // Update form data
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
  
      // Clear field-specific error
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    },
    [keyResult.targetValue, errors] // Dependencies added for accurate re-render behavior
  );
  

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
        attachments: 'File upload failed.',
      }));
    }  
  };
  

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (formData.value === null || formData.value <= 0) {
      newErrors.value = 'Value is required and must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const {user} = useUserStore()

  const handleSubmit = async () => {
    setErrors(null);
    if (!validate()) return;
  
    try {
      // Handle file upload first
      const uploadedFiles = await handleFileUpload();
      if (errors?.attachments && errors?.attachments?.length > 0) {
        return;
      }
  
      setLoading("Submitting values");
  
      // Prepare the requests
      const metricRequest = PostRequest({
        url: "/api/goals/submitMetric",
        body: {
          timeLineData: {
            ...formData,
            attachments: uploadedFiles,
            keyResultId: keyResult?.id,
            organizationId: keyResult?.organization,
            createdBy: user?.id,
          },
        },
      });
  
      const keyResultRequest = PostRequest({
        url: "/api/goals/editKeyResult",
        body: {
          keyResultData: {
            ...keyResult,
            currentValue: formData.value,
            status: "In-progress",
          },
        },
      });
  
      // Execute requests concurrently
      const [metricResponse, keyResultResponse] = await Promise.all([
        metricRequest,
        keyResultRequest,
      ]);
  
      const metricError = metricResponse.error;
      const keyResultError = keyResultResponse.error;
  
      if (metricError || keyResultError) {
        setErrors({
          gen: metricError || keyResultError || "Error occurred while submitting values",
        });
        return;
      } else {
        toast.success("Timeline updated successfully");
        refresh();
        setFormData({
          value: null,
          Note: "",
          attachments: [],
        });
        setPreviewUrls([]);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors({ gen: "Submission failed:" });
    } finally {
      setLoading("");
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
      trigerBtn={triggerBtn}
    >
      <form
        className="p-6 sm:p-12 max-h-[90vh] overflow-auto hide-scrollbar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h4 className="text-lg font-bold pb-8">Update Value</h4>

        <div className="text-sm pb-4 mb-4 border-b flex justify-between gap-2 flex-wrap w-full font-semibold">
          <p className="">Start value: <span>{keyResult?.startValue||0}</span></p>
          <p className="">Target value: <span>{keyResult?.targetValue}</span></p>
          <p className="">Current value: <span>{keyResult?.currentValue}</span></p>
        </div>

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
        {errors?.value && <small className="text-red-500 w-full flex justify-center">{errors.value}</small>}
        {errors?.isGreater && <small className="text-blue-700 w-full flex justify-center">{errors?.isGreater}</small>}

        <div className="py-4">
          <label htmlFor="Note" className="text-gray-600 pb-2 font-semibold text-sm">
            Add Note (optional)
          </label>

          {metric&&isDisabled ? (
              <div
                dangerouslySetInnerHTML={{ __html: metric?.Note! }}
                className="prose  text-xs "
              />
            ) : (
              <ReactQuill
                value={formData.Note}
                onChange={(value) => setFormData((prev) => ({ ...prev, Note: value }))}
                modules={memoizedToolbar}
                className="editor-content no-scrollbar"
              />
            )}
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
            isDisabled={metric! && isDisabled}
          />
          {errors?.attachments && <small className="text-red-500">{errors.attachments}</small>}
        </div>

        <div className="flex flex-col gap-1 items-center justify-center">
          {errors?.gen && <small className="text-red-500">{errors.gen}</small>}
          <small>{loading}</small>
          <Button type='submit' className="bg-basePrimary" disabled={loading.length>0}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </CenterModal>
  );
};

export default MetricForm;
