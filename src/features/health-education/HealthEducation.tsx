import React, { useState, useEffect } from "react";

//components
import HealthEducationCard from "./components/HealthEducationCard";
import AddHealthEducationModal from "./components/AddHealthEducationModal";
import ContainerWrapper from "../../components/ContainerWrapper";
import ButtonsIcon from "../../global-components/ButtonsIcon";

import { Add } from "iconsax-react";

// types
import type { HealthEducationContentTable } from "../../types/database";

// rtk query
import { useGetHealthEducationQuery } from "./api/healthEducationApi";
// import { useEditHealthEducationMutation } from "./api/healthEducationApi";

const HealthEducation: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedItem, setSelectedItem] = useState<
    HealthEducationContentTable | undefined
  >(undefined);
  const [healthEducationContent, setHealthEducationContent] = useState<
    HealthEducationContentTable[]
  >([]);

  // Load health education content using RTK Query
  const {
    data: healthEducationData,
    isLoading,
    error,
  } = useGetHealthEducationQuery();
  // Archiving is handled inside the edit modal via the Archive toggle

  // Update local state when data changes
  useEffect(() => {
    if (healthEducationData) {
      setHealthEducationContent(healthEducationData);
    }
  }, [healthEducationData]);

  // Handle loading and error states
  if (isLoading) {
    return (
      <ContainerWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-szGrey500">
            Loading health education content...
          </div>
        </div>
      </ContainerWrapper>
    );
  }

  if (error) {
    return (
      <ContainerWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Failed to load health education content
          </div>
        </div>
      </ContainerWrapper>
    );
  }

  const handleOpenModal = () => {
    setSelectedItem(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveContent = (savedContent: HealthEducationContentTable) => {
    setHealthEducationContent((previousContent) => {
      const contentExists = previousContent.some(
        (content) => content.id === savedContent.id
      );
      if (contentExists) {
        // Update existing item (edit or archive toggle)
        return previousContent.map((content) =>
          content.id === savedContent.id ? savedContent : content
        );
      }
      // Prepend new item (add)
      return [savedContent, ...previousContent];
    });
  };

  const handleEdit = (id: number | string) => {
    const item = healthEducationContent.find((c) => c.id === id);
    if (!item) return;
    setSelectedItem(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Archiving is handled via the Archive toggle inside the AddHealthEducationModal when editing

  // Sort content: videos first, then articles
  const sortedContent = [...healthEducationContent].sort((a, b) => {
    if (a.content_type === "video" && b.content_type === "article") return -1;
    if (a.content_type === "article" && b.content_type === "video") return 1;
    return 0;
  });

  return (
    <ContainerWrapper>
      <div className="space-y-6">
        <div className="flex justify-end">
          <ButtonsIcon
            variant="primary"
            size="medium"
            icon={<Add variant="Linear" />}
            onClick={handleOpenModal}
          />
        </div>

        {/* Display content dynamically */}
        <div className="space-y-6">
          {sortedContent.map((content) => (
            <HealthEducationCard
              key={content.id}
              id={content.id}
              title={content.title}
              headline={content.headline}
              content_type={content.content_type}
              body={content.body}
              url={content.url}
              isPublished={content.isPublished}
              onEdit={handleEdit}
              // onDownload={() => handleDownload(content.title)}
            />
          ))}
        </div>

        {/* Add Health Education Modal */}
        <AddHealthEducationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          healthEducation={selectedItem}
          onSave={handleSaveContent}
        />
      </div>
    </ContainerWrapper>
  );
};

export default HealthEducation;
