"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileAttachmentIcon,
  Cancel01Icon,
  Image01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  value?: File | File[] | null;
  onChange?: (value: any) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  label?: string;
  description?: string;
  progress?: number | Record<string, number>;
}

export function FileUpload({
  value,
  onChange,
  multiple = false,
  accept,
  maxSize,
  className,
  label,
  description,
  progress,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const files = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);

    const validFiles = maxSize
      ? fileArray.filter(file => file.size <= maxSize * 1024 * 1024)
      : fileArray;

    if (multiple) {
      onChange?.([...files, ...validFiles]);
    } else {
      onChange?.(validFiles[0] || null);
    }
  };

  const removeFile = (index: number) => {
    if (multiple) {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      onChange?.(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange?.(null);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30",
          files.length > 0 && !multiple && "hidden"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files)}
        />

        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <HugeiconsIcon icon={FileAttachmentIcon} size={24} />
        </div>

        <div className="space-y-1">
          {label && <p className="text-sm font-semibold text-primary">{label}</p>}
          <p className="text-[13px] font-medium text-muted-foreground/80">Tarik atau cari file</p>
          <p className="text-xs text-muted-foreground">
            {description || (multiple ? "Bisa upload beberapa file sekaligus" : "Maksimal ukuran file 5MB")}
          </p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {files.map((file, index) => {
              const fileProgress = typeof progress === 'number'
                ? progress
                : progress?.[file.name];

              return (
                <FilePreview
                  key={`${file.name}-${index}`}
                  file={file}
                  progress={fileProgress}
                  onRemove={() => removeFile(index)}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {multiple && files.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => fileInputRef.current?.click()}
        >
          Tambah File Lain
        </Button>
      )}
    </div>
  );
}

function FilePreview({
  file,
  onRemove,
  progress
}: {
  file: File;
  onRemove: () => void;
  progress?: number;
}) {
  const isImage = file.type.startsWith("image/");
  const [preview, setPreview] = React.useState<string | null>(null);
  const isUploading = progress !== undefined && progress >= 0 && progress < 100;
  const isCompleted = progress === 100;

  React.useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-3 p-3 rounded-xl border bg-card shadow-sm group"
    >
      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 border">
        {isImage && preview ? (
          <img src={preview} alt="preview" className="h-full w-full object-cover" />
        ) : (
          <HugeiconsIcon
            icon={isImage ? Image01Icon : File01Icon}
            size={20}
            className="text-muted-foreground"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{file.name}</p>
          {isCompleted && (
            <HugeiconsIcon
              icon={Cancel01Icon} // Using a generic checkmark or success icon would be better, but sticking to existing imports
              size={14}
              className="text-green-500 rotate-45"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
      </div>

      {isUploading ? (
        <CircularProgress progress={progress!} size={32} />
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </Button>
      )}
    </motion.div>
  );
}

function CircularProgress({ progress, size = 40, strokeWidth = 3 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[8px] font-bold">{Math.round(progress)}%</span>
    </div>
  );
}
