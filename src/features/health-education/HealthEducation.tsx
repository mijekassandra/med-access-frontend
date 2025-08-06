import React from "react";
import { Activity, Heart, Microscope, ShieldTick } from "iconsax-react";
import HealthEducationCard from "./components/HealthEducationCard";
import ContainerWrapper from "../../components/ContainerWrapper";

const HealthEducation: React.FC = () => {
  const handleDownload = (title: string) => {
    console.log(`Downloading: ${title}`);
    // Add your download logic here
  };

  return (
    <ContainerWrapper>
      <div className="p-6 space-y-10">
        <div className="w-full">
          <div className="w-full h-72 bg-white rounded-lg flex items-center justify-center">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/1sISguPDlhY?si=UE7vSazC02d3-FBo"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Physical Health & Exercise */}
          <HealthEducationCard
            icon={<Activity />}
            title="Physical Health & Exercise"
            headline="Just 1.5 Minutes of Daily Vigorous Exercise Can Cut Heart Disease Risk, Study Finds"
            summary="Verywell Health reports on a study indicating that short bursts of vigorous physical activity, lasting just 1.5 to 4 minutes daily, can significantly reduce the risk of heart disease, especially in women."
            onDownload={() => handleDownload("Physical Health & Exercise")}
          />

          {/* Heart Health */}
          <HealthEducationCard
            icon={<Heart />}
            title="Cardiovascular Health"
            headline="Breakthrough in Heart Disease Prevention: New Guidelines Released"
            summary="The American Heart Association has released updated guidelines for cardiovascular health, emphasizing the importance of early prevention and lifestyle modifications to reduce heart disease risk factors."
            onDownload={() => handleDownload("Cardiovascular Health")}
          />

          {/* Medical Research */}
          <HealthEducationCard
            icon={<Microscope />}
            title="Medical Research"
            headline="Revolutionary Cancer Treatment Shows 85% Success Rate in Early Trials"
            summary="A groundbreaking immunotherapy treatment has demonstrated remarkable results in early clinical trials, offering new hope for patients with previously untreatable forms of cancer."
            onDownload={() => handleDownload("Medical Research")}
          />

          {/* Preventive Care */}
          <HealthEducationCard
            icon={<ShieldTick />}
            title="Preventive Care"
            headline="Annual Health Screenings: Your Complete Guide to Staying Healthy"
            summary="Comprehensive guide to essential health screenings by age group, including recommended tests, frequency, and what to expect during each examination."
            onDownload={() => handleDownload("Preventive Care")}
          />
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default HealthEducation;
