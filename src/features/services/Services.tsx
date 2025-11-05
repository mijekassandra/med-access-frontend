import { useState, useEffect } from "react";

//components
import ContainerWrapper from "../../components/ContainerWrapper";
import ServiceCard from "./components/ServiceCard";
import Button from "../../global-components/Button";
import ServiceModal from "./components/ServiceModal";
import Loading from "../../components/Loading";
import SnackbarAlert from "../../global-components/SnackbarAlert";
import DeleteConfirmation from "../../components/DeleteConfirmation";

// API
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "./api/serviceApi";

// icons
import { Add } from "iconsax-react";

const Services = () => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "error"
  );
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  // API hooks
  const {
    data: servicesResponse,
    isLoading,
    error: fetchError,
  } = useGetServicesQuery();

  const [createService, { error: createError }] = useCreateServiceMutation();
  const [updateService, { error: updateError }] = useUpdateServiceMutation();
  const [deleteService, { error: deleteError, isLoading: isDeleting }] =
    useDeleteServiceMutation();

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      const errorMessage =
        (fetchError as any)?.data?.message ||
        (fetchError as any)?.error ||
        "Failed to load services. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [fetchError]);

  // Handle create errors
  useEffect(() => {
    if (createError) {
      const errorMessage =
        (createError as any)?.data?.message ||
        (createError as any)?.error ||
        "Failed to create service. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [createError]);

  // Handle update errors
  useEffect(() => {
    if (updateError) {
      const errorMessage =
        (updateError as any)?.data?.message ||
        (updateError as any)?.error ||
        "Failed to update service. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [updateError]);

  // Handle delete errors
  useEffect(() => {
    if (deleteError) {
      const errorMessage =
        (deleteError as any)?.data?.message ||
        (deleteError as any)?.error ||
        "Failed to delete service. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [deleteError]);

  const handleOpenServiceModal = (
    mode: "add" | "edit" | "view" = "add",
    service?: any
  ) => {
    setModalMode(mode);
    setSelectedService(service || null);
    setIsServiceModalOpen(true);
  };

  const handleCreateService = async (serviceData: any) => {
    try {
      const formData = new FormData();
      formData.append("serviceName", serviceData.serviceName);
      if (serviceData.additionalInfo) {
        formData.append("additionalInfo", serviceData.additionalInfo);
      }
      formData.append("price", serviceData.price.toString());
      if (serviceData.image) {
        formData.append("image", serviceData.image);
      }

      await createService(formData).unwrap();
      setSnackbarMessage("Service created successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);
      setIsServiceModalOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to create service. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
      throw error;
    }
  };

  const handleUpdateService = async (serviceData: any) => {
    if (!selectedService?._id) return;

    try {
      const formData = new FormData();
      if (serviceData.serviceName) {
        formData.append("serviceName", serviceData.serviceName);
      }
      if (serviceData.additionalInfo !== undefined) {
        formData.append("additionalInfo", serviceData.additionalInfo);
      }
      if (serviceData.price !== undefined) {
        formData.append("price", serviceData.price.toString());
      }
      if (serviceData.image) {
        formData.append("image", serviceData.image);
      }

      await updateService({ id: selectedService._id, data: formData }).unwrap();
      setSnackbarMessage("Service updated successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);
      setIsServiceModalOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to update service. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
      throw error;
    }
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete).unwrap();
      setSnackbarMessage("Service deleted successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);
      setIsDeleteConfirmationOpen(false);
      setServiceToDelete(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to delete service. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const services = servicesResponse?.data || [];

  return (
    <ContainerWrapper>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <h1 className="text-h1 text-szPrimary500 text-center">
            RHU Jasaan's Health Services
          </h1>
          <p className="text-body-small-reg text-center text-szBlack500 max-w-[80%]">
            The Rural Health Unit (RHU) of Jasaan is dedicated to providing
            accessible and quality healthcare services for all residents. Our
            goal is to promote wellness, prevent diseases, and deliver timely
            medical care through our various programs. From general
            consultations to vaccination drives and laboratory services, RHU
            Jasaan continues to serve the community with compassion and
            commitment to public health.
          </p>
          <div>
            <Button
              label="Add Service"
              leftIcon={<Add />}
              size="medium"
              className="mt-2"
              onClick={() => handleOpenServiceModal("add")}
            />
          </div>
        </div>

        {isLoading ? (
          <Loading message="Loading services..." />
        ) : (
          <>
            {/* Services Grid */}
            {services.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-body-base-reg text-szGrey500">
                  No services available
                </p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 ">
                {services.map((service: any, index: number) => (
                  <ServiceCard
                    key={service._id || index}
                    id={service._id}
                    name={service.serviceName}
                    price={service.price}
                    description={service.additionalInfo}
                    image={service.image || ""}
                    onEdit={() => handleOpenServiceModal("edit", service)}
                    onDelete={() => handleDeleteClick(service._id)}
                    onView={() => handleOpenServiceModal("view", service)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        mode={modalMode}
        service={selectedService}
        onSave={
          modalMode === "edit" ? handleUpdateService : handleCreateService
        }
      />

      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={5000}
      />

      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setServiceToDelete(null);
        }}
        onClick={handleDeleteConfirm}
        title="Delete Service"
        description={`Are you sure you want to delete this service?`}
        isLoading={isDeleting}
      />
    </ContainerWrapper>
  );
};

export default Services;
