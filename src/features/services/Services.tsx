import { useState } from "react";

//components
import ContainerWrapper from "../../components/ContainerWrapper";
import ServiceCard from "./components/ServiceCard";
import Button from "../../global-components/Button";
import ServiceModal from "./components/ServiceModal";
import Loading from "../../components/Loading";

// API
import {
  useGetServicesQuery,
  useCreateServiceMutation,
} from "./api/serviceApi";

// icons
import { Add } from "iconsax-react";

const Services = () => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // API hooks
  const {
    data: servicesResponse,
    isLoading,
    error,
    refetch,
  } = useGetServicesQuery();

  const [createService] = useCreateServiceMutation();

  const handleOpenServiceModal = () => {
    setIsServiceModalOpen(true);
  };

  const handleCreateService = async (serviceData: any) => {
    try {
      await createService(serviceData).unwrap();
      // The cache will automatically update due to invalidatesTags
    } catch (error) {
      console.error("Failed to create service:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <ContainerWrapper>
        <div className="flex justify-center items-center h-64">
          <Loading message="Loading services..." />
        </div>
      </ContainerWrapper>
    );
  }

  // Show error state
  if (error) {
    return (
      <ContainerWrapper>
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-red-500 text-center">
            Failed to load services. Please try again.
          </p>
          <Button label="Retry" variant="primary" onClick={() => refetch()} />
        </div>
      </ContainerWrapper>
    );
  }

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
              onClick={handleOpenServiceModal}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 ">
          {servicesResponse?.map((service: any, index: number) => (
            <ServiceCard
              key={service._id || service.id || index}
              id={service._id || service.id}
              name={service.name}
              price={service.price}
              description={service.description}
              image={service.image || ""}
            />
          ))}
        </div>
      </div>

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleCreateService}
      />
    </ContainerWrapper>
  );
};

export default Services;
