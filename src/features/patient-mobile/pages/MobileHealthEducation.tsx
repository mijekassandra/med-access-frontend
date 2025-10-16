import React, { useState } from "react";

import { SearchNormal1 } from "iconsax-react";

//components
import NoSearchFound from "../../../global-components/NoSearchFound";
import Inputs from "../../../global-components/Inputs";
import MobilePageTitle from "../mobile-global-components/MobilePageTitle";
import MobileHealthEducationCard from "../components/MobileHealthEducationCard";

import type { HealthEducationContentTable } from "../../../types/database";

const MobileHealthEducation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock data for health education
  const mockHealthEducation: HealthEducationContentTable[] = [
    {
      id: 1,
      title: "Physical Health & Exercise",
      headline:
        "Just 1.5 Minutes of Daily Vigorous Exercise Can Cut Heart Disease Risk, Study Finds",
      body: "Recent research has shown that even brief periods of vigorous exercise can have significant health benefits. A new study published in the Journal of Health and Fitness reveals that just 1.5 minutes of high-intensity exercise daily can reduce the risk of heart disease by up to 40%. This finding is particularly encouraging for individuals with busy schedules who struggle to find time for traditional workout routines.\n\nThe study followed over 2,000 participants for three years, tracking their exercise habits and cardiovascular health. Participants who engaged in short bursts of vigorous activity, such as climbing stairs, brisk walking, or cycling, showed marked improvements in heart health markers including blood pressure, cholesterol levels, and overall cardiovascular fitness.",
      content_type: "video",
      category: "Physical Health",
      url: "https://www.youtube.com/embed/1sISguPDIhY?si=UE7vSazC02d3-FBo",
      created_by: 1,
      created_at: new Date("2024-01-15"),
    },
    {
      id: 6,
      title: "Cardiovascular Health",
      headline: "Updated Guidelines for Cardiovascular Health and Prevention",
      body: "The American Heart Association has released updated guidelines for cardiovascular health, emphasizing the importance of early prevention and lifestyle modifications. These new recommendations focus on comprehensive risk assessment and personalized treatment approaches for patients at different stages of cardiovascular disease development.\n\nThe guidelines highlight the critical role of regular physical activity, maintaining a heart-healthy diet, and managing stress levels in preventing cardiovascular complications. Healthcare providers are encouraged to work closely with patients to develop individualized care plans that address both traditional risk factors and emerging concerns such as mental health and social determinants of health.\n\nKey updates include revised blood pressure targets, expanded recommendations for cholesterol management, and enhanced screening protocols for early detection of cardiovascular disease. The guidelines also emphasize the importance of patient education and shared decision-making in treatment planning.",
      content_type: "article",
      category: "Physical Health",
      url: "",
      created_by: 1,
      created_at: new Date("2024-01-12"),
    },
    {
      id: 2,
      title: "Nutrition & Diet",
      headline:
        "The Mediterranean Diet: A Complete Guide to Heart-Healthy Eating",
      body: "The Mediterranean diet has been consistently ranked as one of the healthiest eating patterns in the world. Based on the traditional eating habits of people living in countries bordering the Mediterranean Sea, this diet emphasizes whole foods, healthy fats, and moderate portions.\n\nKey components include:\n• Abundant fruits and vegetables\n• Whole grains and legumes\n• Olive oil as the primary fat source\n• Moderate consumption of fish and poultry\n• Limited red meat and processed foods\n• Red wine in moderation (optional)\n\nResearch has shown that following a Mediterranean diet can reduce the risk of heart disease, stroke, type 2 diabetes, and certain cancers. It may also help with weight management and cognitive function as we age.",
      content_type: "article",
      category: "Nutrition",
      url: "",
      created_by: 1,
      created_at: new Date("2024-01-10"),
    },
    {
      id: 3,
      title: "Mental Health & Wellness",
      headline: "Understanding and Managing Stress in Daily Life",
      body: "Stress is a natural response to challenges and demands in our lives, but when it becomes chronic, it can have serious effects on both our physical and mental health. Learning to recognize the signs of stress and implementing effective coping strategies is essential for maintaining overall well-being.\n\nCommon signs of stress include:\n• Physical symptoms: headaches, muscle tension, fatigue\n• Emotional symptoms: anxiety, irritability, mood swings\n• Behavioral symptoms: changes in appetite, sleep disturbances, social withdrawal\n• Cognitive symptoms: difficulty concentrating, memory problems, negative thinking\n\nEffective stress management techniques include regular exercise, mindfulness meditation, deep breathing exercises, maintaining social connections, and ensuring adequate sleep. It's also important to identify and address the sources of stress in your life, whether they're work-related, relationship-based, or financial.",
      content_type: "article",
      category: "Mental Health",
      url: "",
      created_by: 1,
      created_at: new Date("2024-01-05"),
    },
    {
      id: 4,
      title: "Preventive Care",
      headline: "The Importance of Regular Health Screenings",
      body: "Preventive care is one of the most effective ways to maintain good health and catch potential health issues early. Regular health screenings can detect diseases in their early stages when they're most treatable, often before symptoms appear.\n\nEssential screenings by age group include:\n\nAges 18-39:\n• Blood pressure checks annually\n• Cholesterol screening every 5 years\n• Diabetes screening if at risk\n• Skin cancer checks annually\n\nAges 40-64:\n• All above screenings plus:\n• Mammograms for women (40-49: discuss with doctor, 50+: every 2 years)\n• Colon cancer screening (starting at 45)\n• Bone density testing for women at 65\n\nAges 65+:\n• All above screenings plus:\n• Annual flu vaccine\n• Pneumonia vaccine\n• Shingles vaccine\n• Regular eye and hearing exams\n\nRemember to discuss your family history and personal risk factors with your healthcare provider to determine the most appropriate screening schedule for you.",
      content_type: "article",
      category: "Preventive Care",
      url: "",
      created_by: 1,
      created_at: new Date("2023-12-28"),
    },
    {
      id: 5,
      title: "Chronic Disease Management",
      headline: "Living Well with Diabetes: A Comprehensive Guide",
      body: "Diabetes is a chronic condition that affects how your body processes blood sugar (glucose). While there's no cure for diabetes, it can be effectively managed through lifestyle changes, medication, and regular monitoring.\n\nType 1 diabetes occurs when the body doesn't produce insulin, while Type 2 diabetes occurs when the body doesn't use insulin effectively. Both types require careful management to prevent complications.\n\nKey aspects of diabetes management include:\n\n1. Blood Sugar Monitoring: Regular testing helps you understand how food, exercise, and medication affect your blood sugar levels.\n\n2. Healthy Eating: Focus on balanced meals with appropriate portions of carbohydrates, proteins, and fats. Consider working with a dietitian to create a meal plan.\n\n3. Regular Exercise: Physical activity helps lower blood sugar levels and improves insulin sensitivity. Aim for at least 150 minutes of moderate exercise per week.\n\n4. Medication Adherence: Take prescribed medications as directed and communicate with your healthcare team about any side effects or concerns.\n\n5. Regular Check-ups: Schedule regular appointments with your healthcare team to monitor your condition and adjust treatment as needed.\n\n6. Foot Care: Check your feet daily for cuts, sores, or changes in sensation, as diabetes can affect circulation and nerve function.\n\n7. Stress Management: High stress levels can affect blood sugar control, so finding healthy ways to manage stress is important.\n\nWith proper management, people with diabetes can live long, healthy lives and reduce their risk of complications such as heart disease, kidney disease, and vision problems.",
      content_type: "article",
      category: "Chronic Disease Management",
      url: "",
      created_by: 1,
      created_at: new Date("2023-12-20"),
    },
  ];

  // Filter categories
  const categories = [
    "All",
    "Physical Health",
    "Nutrition",
    "Mental Health",
    "Preventive Care",
    "Chronic Disease Management",
  ];

  // Filter health education based on search term and category
  const filteredHealthEducation = mockHealthEducation.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.body.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-szWhite100 mb-6">
      {/* Header */}
      <div className="px-4 py-4">
        <MobilePageTitle
          title="Health Education"
          description="Learn about health topics and wellness tips to improve your well-being"
        />

        {/* Search Bar */}
        <Inputs
          type="text"
          placeholder="Search health topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={SearchNormal1}
          className="my-4"
        />

        {/* Categories Filter */}
        <>
          <h6 className="text-szDarkGrey600 text-h6 font-montserrat font-semibold mb-2">
            Categories
          </h6>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1 rounded-full text-caption-reg font-montserrat whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-szPrimary900 text-white"
                    : "bg-white text-szDarkGrey600 border border-szGrey300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {filteredHealthEducation.length === 0 ? (
          <NoSearchFound
            hasSearchTerm={!!searchTerm || selectedCategory !== "All"}
            searchTitle="No health education found"
            noItemsTitle="No health education available"
            searchDescription="Try adjusting your search terms or category filter."
            noItemsDescription="Check back later for new health education content."
            icon={SearchNormal1}
          />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-szDarkGrey600 text-body-base-reg">
                {filteredHealthEducation.length} topic
                {filteredHealthEducation.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredHealthEducation.map((item) => (
              <MobileHealthEducationCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHealthEducation;
