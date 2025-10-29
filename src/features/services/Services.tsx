import { useState } from "react";

//components
import ContainerWrapper from "../../components/ContainerWrapper";
import ServiceCard from "./components/ServiceCard";
import Button from "../../global-components/Button";
import ServiceModal from "./components/ServiceModal";

// icons
import { Add } from "iconsax-react";

// Mock data - in a real app, this would come from an API
const servicesData = [
  {
    id: "1",
    name: "Consultation",
    price: 250,
    description:
      "General medical consultation with our healthcare professionals for diagnosis, treatment, and health advice.",
    image: "src/assets/consultation-img.jpg",
  },
  {
    id: "2",
    name: "Immunization",
    price: 150,
    description:
      "Vaccination services to protect against various diseases including routine immunizations for children and adults.",
    image: "src/assets/immunization-img.png",
  },
  {
    id: "3",
    name: "Prenatal",
    price: 300,
    description:
      "Comprehensive prenatal care including regular check-ups, monitoring, and guidance for expecting mothers.",
    image: "",
  },
  {
    id: "4",
    name: "ABTC",
    price: 200,
    description:
      "Animal Bite Treatment Center providing immediate care and rabies vaccination for animal bite victims.",
    image: "",
  },
  {
    id: "5",
    name: "TB Dots",
    price: 100,
    description:
      "Directly Observed Treatment Short-course program for tuberculosis patients ensuring proper medication adherence.",
    image: "",
  },
  {
    id: "6",
    name: "Laboratory",
    price: 180,
    description:
      "Diagnostic laboratory services including blood tests, urine analysis, and other medical examinations.",
    image: "",
  },
  {
    id: "7",
    name: "Family Planning",
    price: 120,
    description:
      "Family planning services and counseling to help families make informed decisions about their reproductive health.",
    image: "",
  },
];

const Services = () => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const handleOpenServiceModal = () => {
    setIsServiceModalOpen(true);
  };

  return (
    <ContainerWrapper>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <h1 className="text-h1 text-szPrimary500 text-center">
            RHU Jasaan’s Health Services
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
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              price={service.price}
              description={service.description}
              image={service.image}
            />
          ))}
        </div>
      </div>

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />
    </ContainerWrapper>
  );
};

export default Services;
