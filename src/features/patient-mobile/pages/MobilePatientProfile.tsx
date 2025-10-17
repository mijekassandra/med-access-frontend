import React, { useState } from "react";

//icons
import { Edit2, Camera, Profile } from "iconsax-react";

//components
import Input from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import MobilePageTitle from "../mobile-global-components/MobilePageTitle";

const MobilePatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-15",
    address: "123 Rizal St., Manila, Philippines",
    contactNumber: "09171234567",
    username: "johndoe",
    email: "johndoe@email.com",
    memberSince: "6/1/2024",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values if needed
  };

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
    // You can add API call to save the data
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-3 flex justify-between items-center">
        <MobilePageTitle title="Profile" />
        <ButtonsIcon
          icon={<Edit2 />}
          onClick={handleEdit}
          variant="secondary"
          size="medium"
          ariaLabel="Edit profile"
          disabled={isEditing}
        />
      </div>

      {/* Profile Picture Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-2 border-szPrimary700 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <Profile
                    size={40}
                    className="text-szPrimary500"
                    variant="Bulk"
                  />
                </div>
              )}
            </div>

            {/* Camera Upload Button */}
            <label
              htmlFor="profile-upload"
              className="absolute -bottom-0 -right-0 w-8 h-8 bg-szPrimary700 rounded-full flex items-center justify-center cursor-pointer hover:bg-szPrimary900 transition-colors"
            >
              <Camera className="w-4 h-4 text-white cursor-pointer" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-sm text-gray-600 mb-1">Patient</p>
            <p className="text-sm text-gray-600">
              Age: {calculateAge(formData.dateOfBirth)}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="mb-4">
          <h4 className="text-h4 font-semibold text-gray-800">
            Personal Information
          </h4>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange("firstName")}
              disabled={!isEditing}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange("lastName")}
              disabled={!isEditing}
            />
          </div>

          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange("dateOfBirth")}
            disabled={!isEditing}
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={handleInputChange("address")}
            disabled={!isEditing}
            isTextarea={true}
          />

          <Input
            label="Contact Number"
            value={formData.contactNumber}
            onChange={handleInputChange("contactNumber")}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h4 className="text-h4 font-semibold text-gray-800">
            Account Information
          </h4>
        </div>

        <div className="space-y-4">
          <Input
            label="Username"
            value={formData.username}
            onChange={handleInputChange("username")}
            disabled={true} // Always disabled as per requirements
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChange={handleInputChange("email")}
            disabled={!isEditing}
          />

          <Input
            label="Member Since"
            value={formData.memberSince}
            onChange={handleInputChange("memberSince")}
            disabled={true} // Always disabled as per requirements
          />
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3">
          <Button
            label="Cancel"
            variant="ghost"
            onClick={handleCancel}
            fullWidth
          />
          <Button
            label="Save Changes"
            variant="primary"
            onClick={handleSave}
            fullWidth
          />
        </div>
      )}
    </div>
  );
};

export default MobilePatientProfile;
