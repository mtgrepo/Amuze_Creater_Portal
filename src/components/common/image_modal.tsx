import React from "react";
import { X } from "lucide-react";

interface ImageData {
  id: number;
  image: string;
  label: string;
  description: string;
}

interface ImageModalProps {
  images: ImageData[];
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div className="w-full max-w-6xl max-h-[90vh] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Museum Episode Images
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {images.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              No images available
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              
              {images.map((file) => (
                <div
                  key={file.id}
                  className="group rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={file.image}
                      alt="Episode"
                      className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-1">
                    {/* Label */}
                    <div className="text-sm font-medium text-gray-800 line-clamp-1">
                      {file.label ? (
                        <span
                          dangerouslySetInnerHTML={{ __html: file.label }}
                        />
                      ) : (
                        <span className="text-gray-400 italic">
                          No Label
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {file.description ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: file.description,
                          }}
                        />
                      ) : (
                        <span className="italic text-gray-400">
                          No Description
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;