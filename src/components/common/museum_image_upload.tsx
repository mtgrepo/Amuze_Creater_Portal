import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import { Plus, X } from "lucide-react";
import ReactQuill from "react-quill-new"
import 'react-quill-new/dist/quill.snow.css'; 

type MuseumFile = {
  id?: number;
  localId: string;
  image?: File | string | null;
  label?: string;
  description?: string;
  preview?: string;
};

interface MuseumImageUploaderProps {
  value: MuseumFile[];
  onChange: (val: MuseumFile[]) => void;
  control: any;
  name: string;
  onDelete?: (id?: number) => void;
  onEdit?: (
    id: number,
    image: File,
    label?: string,
    description?: string
  ) => void;
  errors?: {image?: {message: string}}[];
}

export const MuseumImageUploader: React.FC<MuseumImageUploaderProps> = ({
  value = [],
  onChange,
  control,
  name,
  onDelete,
  onEdit,
  errors,
}) => {
  const onDrop = (acceptedFiles: File[], index: number) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const updated = [...value];
    updated[index] = {
      ...updated[index],
      image: file,
      preview: URL.createObjectURL(file),
    };
    onChange(updated);

    if (updated[index].id && onEdit) {
      onEdit(
        updated[index].id,
        file,
        updated[index].label,
        updated[index].description
      );
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
  });

  const addNewImageBox = () => {
    onChange([
      ...value,
      { localId: crypto.randomUUID(), image: null, label: "", description: "", preview: "" },
    ]);
  };

  //remove image
  const removeImage = (index: number) => {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      image: null,
      preview: "",
    };
    onChange(updated);
  };

  const removeBox = (localId: string) => {
    const removed = value.find((v) => v.localId === localId);

    if (removed?.id && onDelete) {
      onDelete(removed.id);
    }

    onChange(value.filter((v) => v.localId !== localId));
  };

  return (
    <div className="flex flex-wrap gap-4">
      {value.map((file, i) => (
        <div
          key={file.localId}
          className="relative border border-gray-400 p-4 w-[50vh]"
        >
          <button
            type="button"
            onClick={() => removeBox(file.localId)}
            className="absolute top-1 right-1 bg-red-500 text-white px-1 font-bold "
          >
            <X width={20} />
          </button>
          <label className="block text-sm font-bold mb-1">Image</label>

          {file.preview || file.image ? (
            <div className="relative w-24 h-24 mb-2">
              <img
                src={
                  file.preview ||
                  (typeof file.image === "string" ? file.image : "")
                }
                alt="preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white p-0.5 px-1 text-xs rounded-full"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
            <div
              {...getRootProps()}
              className="w-24 h-24 border-2 border-gray-500 border-dashed cursor-pointer flex flex-col items-center justify-center mb-2"
              onClick={() =>
                document.getElementById(`museum_file_${i}`)?.click()
              }
            >
              <input
                {...getInputProps({
                  onChange: (e: any) => onDrop(Array.from(e.target.files), i),
                })}
                id={`museum_file_${i}`}
                type="file"
                className="hidden"
              />

              <Plus className="text-gray-500" size={40} />
              <span className="text-xs text-gray-500 mt-1">Add Image</span>
            </div>
            {errors?.[i]?.image && (
            <p className="text-red-500 text-xs">
              {errors[i].image.message}
            </p>
          )}
          </>
          )}

          {/* Label */}
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1">Label</label>
            <Controller
              control={control}
              name={`${name}.${i}.label`}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    const updated = [...value];
                    updated[i] = { ...updated[i], label: val };
                    onChange(updated);

                    if (file.id && onEdit) {
                      onEdit(
                        file.id,
                        file.image as File,
                        val,
                        file.description
                      );
                    }
                  }}
                />
              )}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <Controller
              control={control}
              name={`${name}.${i}.description`}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                  value={field.value || ""}
                  onChange={(val) => {
                    field.onChange(val);
                    const updated = [...value];
                    updated[i] = { ...updated[i], description: val };
                    onChange(updated);

                    if (file.id && onEdit) {
                      onEdit(file.id, file.image as File, file.label, val);
                    }
                  }}
                />
              )}
            />
          </div>

        </div>
      ))}

      <button
        type="button"
        onClick={addNewImageBox}
        className="flex items-center gap-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 w-50 h-16"
      >
        <Plus size={20} /> Add New Image
      </button>
    </div>
  );
};
