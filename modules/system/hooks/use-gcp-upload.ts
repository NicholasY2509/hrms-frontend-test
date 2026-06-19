import { useState } from 'react';
import { mediaService } from '../services/media-service';

export function useGcpUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Get the Signed URL from Laravel
      const { url, path } = await mediaService.generateUploadUrl(file.name, file.type);

      // 2. Upload directly to GCP using XMLHttpRequest to track progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setProgress(percentage);
            onProgress?.(percentage);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100);
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };

        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      return path;
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    progress,
    error
  };
}
