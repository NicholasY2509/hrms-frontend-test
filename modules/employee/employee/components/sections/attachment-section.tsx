"use client";

import * as React from 'react';
import { Control, Controller } from 'react-hook-form';

import { FileUpload } from '@/components/ui/file-upload';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { useGcpUpload } from '@/modules/system/hooks/use-gcp-upload';

import { CreateEmployeeFormValues } from '../../schemas';

interface AttachmentSectionProps {
  control: Control<CreateEmployeeFormValues>;
}

function GcpFieldWrapper({ 
  name, 
  control, 
  label, 
  description, 
  accept = "image/*,.pdf", 
  multiple = false 
}: {
  name: any;
  control: any;
  label: string;
  description: string;
  accept?: string;
  multiple?: boolean;
}) {
  const { uploadFile } = useGcpUpload();
  const [localFiles, setLocalFiles] = React.useState<File[]>([]);
  const [progressMap, setProgressMap] = React.useState<Record<string, number>>({});

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        
        const handleChange = async (val: File | File[] | null) => {
          if (!val) {
             setLocalFiles([]);
             setProgressMap({});
             field.onChange(multiple ? [] : null);
             return;
          }

          const files = Array.isArray(val) ? val : [val];
          setLocalFiles(files);
          
          if (!multiple) {
            const file = files[0];
            try {
              const path = await uploadFile(file, (prog) => {
                 setProgressMap({ [file.name]: prog });
              });
              field.onChange(path);
            } catch (e) {
               console.error("Upload failed", e);
               field.onChange(null);
            }
          } else {
             // Handle multiple files
             const paths: string[] = [];
             for (const file of files) {
               try {
                 const path = await uploadFile(file, (prog) => {
                    setProgressMap(prev => ({ ...prev, [file.name]: prog }));
                 });
                 paths.push(path);
               } catch (e) {
                 console.error("Upload failed for", file.name, e);
               }
             }
             field.onChange(paths);
          }
        };

        return (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            <FileUpload
              value={localFiles.length > 0 ? (multiple ? localFiles : localFiles[0]) : null}
              onChange={handleChange}
              label={`Upload ${label.split('(')[0].trim()}`}
              description={description}
              accept={accept}
              multiple={multiple}
              progress={multiple ? progressMap : Object.values(progressMap)[0]}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}

export function AttachmentSection({ control }: AttachmentSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-4">
      <GcpFieldWrapper
        name="ktp"
        control={control}
        label="Kartu Tanda Penduduk (KTP)"
        description="Format JPG, PNG, atau PDF (Maks 5MB)"
      />

      <GcpFieldWrapper
        name="kartu_keluarga"
        control={control}
        label="Kartu Keluarga (KK)"
        description="Format JPG, PNG, atau PDF (Maks 5MB)"
      />

      <GcpFieldWrapper
        name="ijazah"
        control={control}
        label="Ijazah Terakhir"
        description="Format JPG, PNG, atau PDF (Maks 5MB)"
      />

      <GcpFieldWrapper
        name="file_pendukung"
        control={control}
        label="File Pendukung (CV/Sertifikat)"
        description="Format JPG, PNG, atau PDF (Maks 5MB)"
        multiple={true}
      />
    </div>
  );
}
