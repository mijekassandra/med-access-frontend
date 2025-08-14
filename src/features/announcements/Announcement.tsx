import React, { useState } from "react";

//icons
import { Trash } from "iconsax-react";

//components
import ContainerWrapper from "../../components/ContainerWrapper";
import Button from "../../global-components/Button";
import Input from "../../global-components/Inputs";
import CardContainer from "../../global-components/CardContainer";
import ButtonsIcon from "../../global-components/ButtonsIcon";
import Divider from "../../global-components/Divider";
import Pagination from "../../global-components/Pagination";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import UploadAnnouncement from "./components/UploadAnnouncement";

const Announcement = () => {
  const [postText, setPostText] = useState("");
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

  const handleDeletePost = () => {
    // Handle delete post
    console.log("Post deleted");
    setIsDeleteConfirmationOpen(true);
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload from the UploadAnnouncement component
    console.log("File uploaded from component:", file);
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
          <UploadAnnouncement onUpload={handleFileUpload} />
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
