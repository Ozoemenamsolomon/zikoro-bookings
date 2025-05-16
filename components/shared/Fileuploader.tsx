'use client';

import { CheckCircle, FileWarning, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Arrow90degUp } from 'styled-icons/bootstrap';

interface FileUploaderProps {
  onChange?: (files: { url: string; type: string }[]) => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  previewUrls: { type: string; url: string }[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<{ type: string; url: string }[]>>;
  isDisabled: boolean;
  multiple?: boolean; // New prop for allowing single or multiple files
  input?: React.ReactNode
  callback?:(url:string)=>void
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  setFiles,input,
  previewUrls,
  setPreviewUrls,
  isDisabled,
  multiple = true, // Default is multiple
  callback
}) => {
 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const allowedFileTypes = [
    'image/*',
    'video/mp4',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/zip',
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    let errorMessages = '';

    selectedFiles.forEach((file) => {
      const errors: string[] = [];

      if (!allowedFileTypes.some((type) => file.type.match(type))) {
        errors.push(`Unsupported file type: ${file.name}.`);
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`File too large: ${file.name} (max 5MB).`);
      }

      if (errors.length === 0) validFiles.push(file);
      else errorMessages += errors.join(' ');
    });

    if (errorMessages) {
      setErrorMessage(errorMessages);
      return;
    }

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
      const previews = validFiles.map((file) => ({
        type: file.type.startsWith('image') ? 'image' : file.type,
        url: URL.createObjectURL(file),
      }));
      setPreviewUrls((prev) => [...prev, ...previews]);
    } else {
      const singleFile = validFiles[0];
      setFiles(singleFile ? [singleFile] : []);
      setPreviewUrls(
        singleFile
          ? [
              {
                type: singleFile.type.startsWith('image') ? 'image' : singleFile.type,
                url: URL.createObjectURL(singleFile),
              },
            ]
          : []
      );
    }
  };

  const removeItem = (url: string) => {
    setPreviewUrls((prev) => prev.filter((item) => item.url !== url));
    callback&&callback(url)
    setFiles((prev) => prev.filter((file) => URL.createObjectURL(file) !== url));
  };

  const DeleteBtn = ({ url }: { url: string }) => (
    <button className="absolute top-1 right-2 bg-white rounded-full p-0.5" onClick={() => removeItem(url)}>
      <X size={14} className="text-red-600" />
    </button>
  );
  return (
    <div className="space-y-2 rounded-lg  ">
      <div className="flex flex-col space-y-2 disabled:opacity-30">
        {
          input ? input :
          <>
            <input
              type="file"
              onChange={handleFileChange}
              multiple={multiple}          
              accept={multiple ? undefined : 'image/*'} // Enforce only images if single mode
              disabled={isDisabled}
              className="p-2 border  border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100/10 file:text-blue-700 hover:file:bg-blue-100/20"
              aria-label="Upload files"
            />
            <small>{multiple ? `File type (pdf, image, mp4). Maximum file size of 5MB` : 'File type (image). Maximum file size of 5MB'}</small>
          </>
        }

      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {previewUrls.map((preview, index) => (
          <div key={index} className="relative border size-24 rounded-lg shadow-sm overflow-hidden">
            <DeleteBtn url={preview.url} />
            {renderAttachment(preview.url, preview.type)}
          </div>
        ))}
      </div>

      {errorMessage && (
        <div className="flex items-center text-red-400 space-x-2">
          <FileWarning />
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center text-blue-400 space-x-2">
          <CheckCircle />
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export const renderAttachment = (url: string, type: string) => {
  if (type.startsWith('image')) {
    return <img src={url} alt="Preview" className="object-cover w-full h-full" />;
  } else if (type.startsWith('video')) {
    return <video controls className="w-full h-full"><source src={url} /></video>;
  } else if (type === 'application/pdf') {
    return <iframe src={url} title="PDF Preview" className="w-full h-full no-scrollbar border"></iframe>;
  }
  return <a href={url} target="_blank" className="text-blue-500 underline" rel="noopener noreferrer">View File</a>;
};

export const handleFileUpload = async ({
  files,
  setFiles,
  setErrors,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}): Promise<{ url: string; type: string }[] | undefined> => {
  if (!files?.length) {
    return;
  }

  try {
    // Upload all files concurrently
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
          throw new Error(errorData.error?.message || `Failed to upload ${file.name}`);
        }

        const data = await res.json();
        return { url: data.secure_url, type: file.type };
      })
    );

    // Clear the selected files after successful upload
    setFiles([]);

    return uploadedFiles;
  } catch (error: any) {
    // console.error('File upload failed:', error.message || error);

    // Update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      attachments: error.message || 'File upload failed.',
    }));
  }
};


// 'use client';

// import { CheckCircle, FileWarning, Loader2, X } from 'lucide-react';
// import { useState } from 'react';
// import { Button } from '../ui/button';
// import { Arrow90degUp } from 'styled-icons/bootstrap';
 

// interface FileUploaderProps {
//   onChange?: (files: { url: string; type: string }[]) => void;
//   files: File[];
//   setFiles:  React.Dispatch<React.SetStateAction<File[]>> 
//   previewUrls: { type: string; url: string }[];
//   setPreviewUrls: React.Dispatch<React.SetStateAction< { type: string; url: string }[]>>
//   isDisabled:boolean
// }

// export const FileUploader: React.FC<FileUploaderProps> = ({ onChange, files, setFiles,previewUrls, setPreviewUrls, isDisabled }) => {
//   // const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
//   const [uploadedFileUrls, setUploadedFileUrls] = useState<{ url: string; type: string }[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // Supported file types
//   const allowedFileTypes = [
//     'image/*',
//     'video/mp4',
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'application/vnd.ms-powerpoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     'text/plain',
//     'text/csv',
//     'application/zip',
//   ];

//   // Maximum file size (5MB)
//   const MAX_FILE_SIZE = 5 * 1024 * 1024;

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSuccessMessage(null);
//     setErrorMessage(null);

//     const selectedFiles = Array.from(e.target.files || []);
//     const validFiles: File[] = [];
//     let errorMessages = '';

//     selectedFiles.forEach((file) => {
//       const errors: string[] = [];

//       if (!allowedFileTypes.some((type) => file.type.match(type))) {
//         errors.push(`Unsupported file type: ${file.name}.`);
//       }
//       if (file.size > MAX_FILE_SIZE) {
//         errors.push(`File too large: ${file.name} (max 5MB).`);
//       }

//       if (errors.length === 0) validFiles.push(file);
//       else errorMessages += errors.join(' ');
//     });

//     if (errorMessages) {
//       setErrorMessage(errorMessages);
//       return;
//     }

//     setFiles(prev => [...prev, ...validFiles]);

//     const previews = validFiles.map((file) => {
//       if (file.type.startsWith('image')) {
//         return { type: 'image', url: URL.createObjectURL(file) };
//       } else if (file.type.startsWith('video')) {
//         return { type: 'video', url: URL.createObjectURL(file) };
//       } else if (file.type === 'application/pdf') {
//         return { type: 'pdf', url: URL.createObjectURL(file) };
//       }
//       return null;
//     });

//     setPreviewUrls( prev => [...prev, ...previews.filter((preview) => preview !== null) as { type: string; url: string }[]]);
//   };

// // Handle file upload
//   const handleFileUpload = async () => {
//     setSuccessMessage(null);
//     setErrorMessage(null);

//     if (!files?.length) {
//       setErrorMessage('Please select at least one file to upload.');
//       return;
//     }

//     setLoading(true);
//     const urls: { url: string; type: string }[] = [];

//     try {
//       // Simulated upload process
//       for (const file of files) {
//         const formDataToSend = new FormData();
//         formDataToSend.append("file", file);
//         formDataToSend.append("upload_preset", "w5xbik6z");
//         formDataToSend.append("folder", "ZIKORO");

//         const res = await fetch(`https://api.cloudinary.com/v1_1/zikoro/image/upload`, {
//           method: "POST",
//           body: formDataToSend,
//         });

//         if (res.ok) {
//           const data = await res.json();
//           urls.push({ url: data.secure_url, type: file.type }); // Use the secure URL from the response
//         } else {
//           const errorData = await res.json();
//           setErrorMessage(errorData.error?.message || 'Image upload failed.');
//           setLoading(false);
//           return;
//         }
//       }

//       // Set the uploaded URLs and success message
//       setUploadedFileUrls(urls);
//       onChange?.(urls);

//       setSuccessMessage('Files uploaded successfully!');
//     } catch (error) {
//       setErrorMessage(`Error uploading files:  `);
//     } finally {
//       setLoading(false);
//       setFiles?.([]);
//       setPreviewUrls([]);
//     }
//   };



//   const removeItem = (url: string) => {
//     setPreviewUrls((prev:{ type: string; url: string; }[]) => prev.filter((item) => item.url !== url));
//     setFiles?.(files?.filter((file) => URL.createObjectURL(file) !== url) || []);
//   };

//   const DeleteBtn = ({ url }: { url: string }) => (
//     <button className="absolute top-1 right-2 bg-white rounded-full p-0.5" onClick={() => removeItem(url)}>
//       <X size={14} className="text-red-600 " />
//     </button>
//   );




//   return (
//     <div className="space-y-2 rounded-lg bg-cms-white">
//       <div className="flex flex-col space-y-2">
//         <input
//           type="file"
//           accept=''
//           onChange={handleFileChange}
//           multiple
//           disabled={isDisabled}
//           className="p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100/10 file:text-blue-700 hover:file:bg-blue-100/20"
//           aria-label="Upload files"
//         />
//         <small>File type (pdf, image, mp4). Maximum file size of 5MB</small>
//       </div>

//       <div className="grid grid-cols-3 justify-center items-center md:grid-cols-4 lg:grid-cols-6 gap-2">
//         {previewUrls.map((preview, index) => (
//           <div key={index} className="relative flex items-center justify-center border size-24 rounded-lg shadow-sm overflow-hidden">
//             <DeleteBtn url={preview.url} />
//             {renderAttachment(preview?.url, preview?.type)}
//             {/* {preview.type === 'image' && <img src={preview.url} alt="Image Preview" className="object-cover w-full h-24" />}
//             {preview.type === 'video' && (
//               <video controls className="w-full h-36">
//                 <source src={preview.url} type="video/mp4" />
//               </video>
//             )}
//             {preview.type === 'pdf' && <iframe src={preview.url} className="w-full h-24" title="PDF Preview"></iframe>} */}
//           </div>
//         ))}
//       </div>

//       {/* <Button
//         variant="outline"
//         onClick={handleFileUpload}
//         disabled={!files?.length || loading}
//         type="button"
//         aria-disabled={!files?.length || loading}
//       >
//         {loading ? 'Uploading...' : 'Upload Files'}
//       </Button> */}

//       {errorMessage && (
//         <div className="flex items-center text-red-400 space-x-2">
//           <FileWarning />
//           <p>{errorMessage}</p>
//         </div>
//       )}

//       {successMessage && (
//         <div className="flex items-center text-blue-400 space-x-2">
//           <CheckCircle />
//           <p>{successMessage}</p>
//         </div>
//       )}

//       {uploadedFileUrls.length > 0 && (
//         <div className="mt-4 ">
//           {/* <p className="text-sm font-semibold text-gray-700">Uploaded Files:</p> */}
//           <div className="list-disc list-inside flex flex-wrap gap-2 items-center">
//             {uploadedFileUrls.map(({ url }, index) => (
//                 <a
//                   key={index}
//                   href={url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600  px-1 border border-blue-400 rounded-md max-w-40 truncate min-w-0 text-[12px] flex items-center gap-1"
//                 >
//                   {url} <Arrow90degUp size={14} />
//                 </a>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export   const renderAttachment = (url: string, type: string) => {
//   if (type.startsWith('image')) {
//     return <img src={url} alt="Image Preview" className="object-cover w-full h-full" />;
//   } else if (type.startsWith('video')) {
//     return (
//       <video controls className="w-full h-full">
//         <source src={url} type={type} />
//       </video>
//     );
//   } else if (type === 'application/pdf') {
//     return (
//       <iframe
//         src={url}
//         title="PDF Preview"
//         className="w-full h-full no-scrollbar border"
//       ></iframe>
//     );
//   } else {
//     return (
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-500 text-xs w-full h-full flex justify-center items-center underline"
//       >
//         View File
//       </a>
//     );
//   }
// };