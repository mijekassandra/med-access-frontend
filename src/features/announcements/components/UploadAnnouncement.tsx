import React, { useState } from "react";
import { ExportCurve, Gallery, VideoSquare } from "iconsax-react";
import CardContainer from "../../../global-components/CardContainer";
import Button from "../../../global-components/Button";

interface UploadAnnouncementProps {
  onUpload?: (file: File) => void;
}

const UploadAnnouncement: React.FC<UploadAnnouncementProps> = ({
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for the file
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle file upload
      console.log("File uploaded:", selectedFile);

      // Call the parent's onUpload callback if provided
      if (onUpload) {
        onUpload(selectedFile);
      }

      setSelectedFile(null);
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
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
            accept="image/*,video/*"
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
                    PNG, JPG, MP4 up to 10MB
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
