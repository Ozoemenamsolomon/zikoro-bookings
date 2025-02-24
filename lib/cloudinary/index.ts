export const handleFileUpload = async ({
    files,
  }: {
    files: File[];
  }): Promise<{ uploadedFiles: { url: string; type: string }[]; errorMessage?: string } | undefined> => {
    if (!files?.length) {
      return { uploadedFiles: [], errorMessage: 'No files selected for upload.' };
    }
  
    // Validate environment variables
    const uploadPreset ='w5xbik6z';
    const folder = 'ZIKORO';
    const cloudName = 'zikoro';
  
    if (!uploadPreset || !cloudName) {
      return { uploadedFiles: [], errorMessage: 'Configuration is missing. Please check your environment variables.' };
    }
  
    try {
      // Upload all files concurrently
      let error:string = ''
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const formDataToSend = new FormData();
          formDataToSend.append('file', file);
          formDataToSend.append('upload_preset', uploadPreset);
          formDataToSend.append('folder', folder);
  
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: formDataToSend,
          });
  
          // Handle unsuccessful upload responses
          if (!res.ok) {
            const errorData = await res.json();
            const errorMessage = errorData?.error?.message || `Failed to upload ${file.name}`;
            error=errorMessage;
            return
          }
  
          // If the upload is successful, get the file data
          const data = await res.json();
          return { url: data.secure_url, type: file.type };
        })
      );
  
      // Filter out any undefined or failed uploads
      const successfulUploads = uploadedFiles.filter(Boolean) as { url: string; type: string }[];
  
      // If no successful uploads, set error
      if (!successfulUploads.length) {
        return { uploadedFiles: [], errorMessage: error||'No files were successfully uploaded.' };
      }
  
      return { uploadedFiles: successfulUploads, errorMessage: '' };
    } catch (error: any) {
      console.error('Unexpected Error:', error);
      return { uploadedFiles: [], errorMessage: 'Unexpected error occurred during upload.' };
    }
  };