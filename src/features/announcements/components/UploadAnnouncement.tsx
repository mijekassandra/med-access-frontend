import React, { useState } from "react";
import { ExportCurve, Gallery, VideoSquare } from "iconsax-react";

interface UploadAnnouncementProps {
  onUpload?: (file: File) => void;
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;
}

const UploadAnnouncement: React.FC<UploadAnnouncementProps> = ({
  onFileSelect,
  selectedFile: externalSelectedFile,
}) => {
  const [internalSelectedFile, setInternalSelectedFile] = useState<File | null>(
    null
  );
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Use external file if provided, otherwise use internal state
  const selectedFile = externalSelectedFile || internalSelectedFile;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid file type (JPEG, PNG, GIF, or PDF)");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      if (onFileSelect) {
        onFileSelect(file);
      } else {
        setInternalSelectedFile(file);
      }

      // Create preview URL for the file
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handleFileClick = () => {
    if (filePreviewUrl) {
      window.open(filePreviewUrl, "_blank");
    }
  };

  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  const isVideo = (file: File) => {
    return file.type.startsWith("video/");
  };

  const getFileIcon = (file: File) => {
    if (isImage(file)) {
      return <Gallery className="icon-md text-szGrey500" />;
    } else if (isVideo(file)) {
      return <VideoSquare className="icon-md text-szGrey500" />;
    }
    return <ExportCurve className="icon-md text-szGrey500" />;
  };

  return (
    <div>
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed border-szGrey300 rounded-lg p-8 text-center hover:border-szPrimary700 transition-colors min-h-[200px] ${
            selectedFile ? "cursor-pointer" : ""
          }`}
          onClick={selectedFile ? handleFileClick : undefined}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`block ${
              selectedFile ? "pointer-events-none" : "cursor-pointer"
            }`}
          >
            <div className="space-y-1">
              <div className="mx-auto w-12 h-12 bg-szGrey100 rounded-full flex items-center justify-center">
                {selectedFile ? (
                  getFileIcon(selectedFile)
                ) : (
                  <ExportCurve className="icon-md text-szGrey500" />
                )}
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-body-base-reg text-szBlack700 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-caption-reg text-szGrey500">
                    Click to view
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-body-base-reg text-szGrey600">
                    Click to upload
                  </p>
                  <p className="text-caption-reg text-szGrey500">
                    PNG, JPG, GIF, PDF up to 5MB
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* <div className="flex justify-center">
            <Button
              label="Upload"
              variant="secondary"
              size="large"
              onClick={handleUpload}
              disabled={!selectedFile}
              loading={isUploading}
            />
          </div> */}
      </div>
    </div>
  );
};

export default UploadAnnouncement;
