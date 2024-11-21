'use client';

import { CheckCircle, FileWarning, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Arrow90degUp } from 'styled-icons/bootstrap';

interface FileUploaderProps {
  onChange?: (files: { url: string; type: string }[]) => void;
  files?: File[];
  setFiles?: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onChange, files, setFiles }) => {
  const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<{ url: string; type: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Supported file types
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

  // Maximum file size (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

    setFiles?.(validFiles);

    const previews = validFiles.map((file) => {
      if (file.type.startsWith('image')) {
        return { type: 'image', url: URL.createObjectURL(file) };
      } else if (file.type.startsWith('video')) {
        return { type: 'video', url: URL.createObjectURL(file) };
      } else if (file.type === 'application/pdf') {
        return { type: 'pdf', url: URL.createObjectURL(file) };
      }
      return null;
    });

    setPreviewUrls(previews.filter((preview) => preview !== null) as { type: string; url: string }[]);
  };

// Handle file upload
const handleFileUpload = async () => {
  setSuccessMessage(null);
  setErrorMessage(null);

  if (!files?.length) {
    setErrorMessage('Please select at least one file to upload.');
    return;
  }

  setLoading(true);
  const urls: { url: string; type: string }[] = [];

  try {
    // Simulated upload process
    for (const file of files) {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("upload_preset", "w5xbik6z");
      formDataToSend.append("folder", "ZIKORO");

      const res = await fetch(`https://api.cloudinary.com/v1_1/zikoro/image/upload`, {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        const data = await res.json();
        urls.push({ url: data.secure_url, type: file.type }); // Use the secure URL from the response
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error?.message || 'Image upload failed.');
        setLoading(false);
        return;
      }
    }

    // Set the uploaded URLs and success message
    setUploadedFileUrls(urls);
    onChange?.(urls);

    setSuccessMessage('Files uploaded successfully!');
  } catch (error) {
    setErrorMessage(`Error uploading files:  `);
  } finally {
    setLoading(false);
    setFiles?.([]);
    setPreviewUrls([]);
  }
};


  const removeItem = (url: string) => {
    setPreviewUrls((prev) => prev.filter((item) => item.url !== url));
    setFiles?.(files?.filter((file) => URL.createObjectURL(file) !== url) || []);
  };

  const DeleteBtn = ({ url }: { url: string }) => (
    <button className="absolute top-1 right-2 bg-white rounded-full p-0.5" onClick={() => removeItem(url)}>
      <X size={20} className="text-red-600 " />
    </button>
  );

  return (
    <div className="space-y-2 rounded-lg bg-cms-white">
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100/10 file:text-blue-700 hover:file:bg-blue-100/20"
          aria-label="Upload files"
        />
        <small>File type (pdf, image, mp4). Maximum file size of 5MB</small>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {previewUrls.map((preview, index) => (
          <div key={index} className="relative flex items-center justify-center border rounded-lg shadow-sm overflow-hidden">
            <DeleteBtn url={preview.url} />
            {preview.type === 'image' && <img src={preview.url} alt="Image Preview" className="object-cover w-full h-36" />}
            {preview.type === 'video' && (
              <video controls className="w-full h-36">
                <source src={preview.url} type="video/mp4" />
              </video>
            )}
            {preview.type === 'pdf' && <iframe src={preview.url} className="w-full h-36" title="PDF Preview"></iframe>}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleFileUpload}
        disabled={!files?.length || loading}
        type="button"
        aria-disabled={!files?.length || loading}
      >
        {loading ? 'Uploading...' : 'Upload Files'}
      </Button>

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

      {uploadedFileUrls.length > 0 && (
        <div className="mt-4 ">
          {/* <p className="text-sm font-semibold text-gray-700">Uploaded Files:</p> */}
          <div className="list-disc list-inside flex flex-wrap gap-2 items-center">
            {uploadedFileUrls.map(({ url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600  px-1 border border-blue-400 rounded-md max-w-40 truncate min-w-0 text-[12px] flex items-center gap-1"
                >
                  {url} <Arrow90degUp size={14} />
                </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};







// 'use client';

// import { CheckCircle, FileWarning, Loader2, X } from 'lucide-react';
// import { useState } from 'react';
// import { Button } from '../ui/button';
// import { Arrow90degUp } from 'styled-icons/bootstrap';

// interface FileUploaderProps {
//   onChange?: (files: { url: string; type: string }[]) => void;
//   files?: File[];
//   setFiles?: (files: File[]) => void;
// }

// export const FileUploader: React.FC<FileUploaderProps> = ({ onChange, files, setFiles }) => {
//   const [previewUrls, setPreviewUrls] = useState<{ type: string; url: string }[]>([]);
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

//     setFiles?.(validFiles);

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

//     setPreviewUrls(previews.filter((preview) => preview !== null) as { type: string; url: string }[]);
//   };

//   // Handle file upload
//   const handleFileUpload = async () => {
//     setSuccessMessage(null);
//     setErrorMessage(null);

//     if (!files?.length) {
//       setErrorMessage('Please select at least one file to upload.');
//       return;
//     }

//     setLoading(true);
//     const urls: { url: string; type: string }[] = [];

//     // Simulated upload process
//     for (const file of files) {
//       const url = URL.createObjectURL(file);
//       urls.push({ url, type: file.type });
//     }

//     setUploadedFileUrls(urls);
//     onChange?.(urls);

//     setLoading(false);
//     setFiles?.([]);
//     setPreviewUrls([]);
//     setSuccessMessage('Files uploaded successfully!');
//   };

//   const removeItem = (url: string) => {
//     setPreviewUrls((prev) => prev.filter((item) => item.url !== url));
//     setFiles?.(files?.filter((file) => URL.createObjectURL(file) !== url) || []);
//   };

//   const DeleteBtn = ({ url }: { url: string }) => (
//     <button className="absolute top-1 right-2" onClick={() => removeItem(url)}>
//       <X size={12} className="text-red-500 p-0.5" />
//     </button>
//   );

//   return (
//     <div className="space-y-2 rounded-lg bg-cms-white">
//       <div className="flex flex-col space-y-2">
//         <input
//           type="file"
//           onChange={handleFileChange}
//           multiple
//           className="p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100/10 file:text-blue-700 hover:file:bg-blue-100/20"
//           aria-label="Upload files"
//         />
//         <small>File type (pdf, image, mp4). Maximum file size of 5MB</small>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {previewUrls.map((preview, index) => (
//           <div key={index} className="relative flex items-center justify-center border rounded-lg shadow-sm overflow-hidden">
//             <DeleteBtn url={preview.url} />
//             {preview.type === 'image' && <img src={preview.url} alt="Image Preview" className="object-cover w-full h-36" />}
//             {preview.type === 'video' && (
//               <video controls className="w-full h-36">
//                 <source src={preview.url} type="video/mp4" />
//               </video>
//             )}
//             {preview.type === 'pdf' && <iframe src={preview.url} className="w-full h-36" title="PDF Preview"></iframe>}
//           </div>
//         ))}
//       </div>

//       <Button
//         variant="outline"
//         onClick={handleFileUpload}
//         disabled={!files?.length || loading}
//         type="button"
//         aria-disabled={!files?.length || loading}
//       >
//         {loading ? 'Uploading...' : 'Upload Files'}
//       </Button>

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
//         <div className="mt-4">
//           <p className="text-sm font-semibold text-gray-700">Uploaded Files:</p>
//           <ul className="list-disc list-inside">
//             {uploadedFileUrls.map(({ url }, index) => (
//               <li key={index} className="text-blue-600 px-1 border rounded-md">
//                 <a
//                   href={url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="max-w-40 truncate min-w-0 text-[12px] flex items-center gap-1"
//                 >
//                   {url} <Arrow90degUp size={14} />
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };
