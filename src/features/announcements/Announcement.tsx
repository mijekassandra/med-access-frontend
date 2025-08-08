import React, { useState } from "react";

//icons
import { ExportCurve, Trash, Gallery, VideoSquare } from "iconsax-react";

//assets

//components
import ContainerWrapper from "../../components/ContainerWrapper";
import Button from "../../global-components/Button";
import Input from "../../global-components/Inputs";
import CardContainer from "../../global-components/CardContainer";
import ButtonsIcon from "../../global-components/ButtonsIcon";
import Divider from "../../global-components/Divider";
import Pagination from "../../global-components/Pagination";
import DeleteConfirmation from "../../components/DeleteConfirmation";

const Announcement = () => {
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const handlePostSubmit = async () => {
    if (!postText.trim()) return;

    setIsPosting(true);

    try {
      // Simulate post submission process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Handle post submission
      console.log("Post submitted:", postText);
      setPostText("");
    } catch (error) {
      console.error("Post submission failed:", error);
    } finally {
      setIsPosting(false);
    }
  };

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

  const handleDeletePost = () => {
    // Handle delete post
    console.log("Post deleted");
    setIsDeleteConfirmationOpen(true);
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
    <ContainerWrapper>
      <div className="space-y-6">
        {/* View Announcement Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-8">
            <h4 className="text-h4 text-szBlack700">View Announcements</h4>
            <Divider className="flex-1 h-full " />
          </div>

          <CardContainer
            content={
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 ">
                  <div>
                    <h6 className="text-h6 font-montserrat font-bold text-szPrimary900 ">
                      MONKEYPOX DISEASE OUTBREAK ADVISORY
                    </h6>
                  </div>

                  <ButtonsIcon
                    variant="warning"
                    icon={<Trash />}
                    size="small"
                    onClick={handleDeletePost}
                  />
                </div>

                <div className="space-y-3 text-body-base-reg text-szBlack700 mt-2">
                  <p>
                    We have received reports of confirmed cases of Monkeypox
                    within the municipality. Health authorities are currently
                    monitoring the situation closely and implementing necessary
                    actions to prevent further transmission.
                  </p>

                  <p>
                    <strong>What is Monkeypox?</strong>
                    <br />
                    Monkeypox is a contagious viral disease that spreads through
                    close contact with an infected person, their bodily fluids,
                    respiratory droplets, or contaminated objects.
                  </p>

                  <div>
                    <p className="font-semibold mb-2">
                      To help protect yourself and the community, please observe
                      the following precautions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        Avoid close contact with individuals showing symptoms
                        such as rashes, fever, swollen lymph nodes, and body
                        aches.
                      </li>
                      <li>
                        Wash hands regularly with soap and water or use
                        alcohol-based hand sanitizers.
                      </li>
                      <li>Wear face masks in crowded or enclosed spaces.</li>
                      <li>
                        Do not share personal items like towels, clothing, or
                        utensils.
                      </li>
                      <li>
                        Report any suspected symptoms immediately for proper
                        medical guidance.
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    The health and safety of every resident remain a top
                    priority. Stay informed, alert, and cooperative.
                  </p>

                  <p className="text-left font-semibold text-szPrimary700">
                    - RHU Jasaan
                  </p>
                </div>
              </div>
            }
          />
          <CardContainer
            content={
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 ">
                  <div>
                    <h6 className="text-h6 font-montserrat font-bold text-szPrimary900 ">
                      MONKEYPOX DISEASE OUTBREAK ADVISORY
                    </h6>
                  </div>

                  <ButtonsIcon
                    variant="warning"
                    icon={<Trash />}
                    size="small"
                    onClick={handleDeletePost}
                  />
                </div>

                <div className="space-y-3 text-body-base-reg text-szBlack700 mt-2">
                  <p>
                    We have received reports of confirmed cases of Monkeypox
                    within the municipality. Health authorities are currently
                    monitoring the situation closely and implementing necessary
                    actions to prevent further transmission.
                  </p>

                  <p>
                    <strong>What is Monkeypox?</strong>
                    <br />
                    Monkeypox is a contagious viral disease that spreads through
                    close contact with an infected person, their bodily fluids,
                    respiratory droplets, or contaminated objects.
                  </p>

                  <div>
                    <p className="font-semibold mb-2">
                      To help protect yourself and the community, please observe
                      the following precautions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        Avoid close contact with individuals showing symptoms
                        such as rashes, fever, swollen lymph nodes, and body
                        aches.
                      </li>
                      <li>
                        Wash hands regularly with soap and water or use
                        alcohol-based hand sanitizers.
                      </li>
                      <li>Wear face masks in crowded or enclosed spaces.</li>
                      <li>
                        Do not share personal items like towels, clothing, or
                        utensils.
                      </li>
                      <li>
                        Report any suspected symptoms immediately for proper
                        medical guidance.
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    The health and safety of every resident remain a top
                    priority. Stay informed, alert, and cooperative.
                  </p>

                  <p className="text-left font-semibold text-szPrimary700">
                    - RHU Jasaan
                  </p>
                </div>
              </div>
            }
          />
          <Pagination currentPage={1} totalPages={3} onChange={() => {}} />
        </div>

        {/* Write Post Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardContainer
            title="Write post"
            content={
              <div className="space-y-4">
                <Input
                  isTextarea={true}
                  placeholder="Share your thoughts, updates, or announcements..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex justify-center">
                  <Button
                    label="Post"
                    variant="primary"
                    size="large"
                    onClick={handlePostSubmit}
                    disabled={!postText.trim()}
                    loading={isPosting}
                    fullWidth
                  />
                </div>
              </div>
            }
          />

          {/* Upload Section */}
          <CardContainer
            title="Upload Image & Video"
            content={
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
                            Click to upload or drag and drop
                          </p>
                          <p className="text-caption-reg text-szGrey500">
                            PNG, JPG, MP4 up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                <div className="flex justify-center">
                  <Button
                    label="Upload"
                    variant="secondary"
                    size="large"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    loading={isUploading}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>

      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onClick={handleDeletePost}
      />
    </ContainerWrapper>
  );
};

export default Announcement;
