import React, { useState } from "react";
import { Home, Folder, EyeSlash, Eye } from "iconsax-react";

//components
import Avatar from "../global-components/Avatar";
import BreadCrumbs from "../global-components/BreadCrumbs";
import Checkboxes from "../global-components/Checkboxes";
import RadioButton from "../global-components/RadioButton";
import Inputs from "../global-components/Inputs";
import Table, { type HeaderType } from "../global-components/Table";
import profile from "../assets/profile.png";
import Chip from "../global-components/Chip";

import { Clipboard, Warning2, Edit2, ArchiveBox } from "iconsax-react";

import TextContent from "../global-components/TextContent";
import CardContainer from "../global-components/CardContainer";
import CustomDatePicker from "../global-components/CustomDatePicker";

const KaraDesignSystem: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isMixed, setIsMixed] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [text, setText] = useState("");
  const [textIcon, setTextIcon] = useState("");
  const [textLabel, setTextLabel] = useState("");
  const [textArea, setTextArea] = useState("");
  const [textDesc, setTextDesc] = useState("");
  const [textDescIcon, setTextDescIcon] = useState("");
  const [textLabelDesc, setTextLabelDesc] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState<Date>(new Date());
  const [profilePicture, setProfilePicture] = useState<string>(profile);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxMixedChange = () => {
    setIsMixed(!isMixed);
  };

  const handleRadioButtonChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleProfileUpdate = (
    file: {
      name: string;
      url: string;
      mimeType?: string;
      isLocal?: boolean;
    } | null
  ) => {
    if (file) {
      setProfilePicture(file.url);
    } else {
      setProfilePicture(profile); // Reset to default
    }
  };
  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <Home /> },
    {
      label: "Design System",
      href: "/design-system",
      icon: <Folder />,
    },
    { label: "Breadcrumbs" },
  ];

  const headers: HeaderType[] = [
    {
      type: "string",
      header: "Title Header",
      accessor: "title",
      icon: <Warning2 className="w-5 h-5" />,
    },
    { type: "string", header: "Owner", accessor: "owner" },
    { type: "string", header: "Label", accessor: "label" },
    { type: "more", header: <></>, accessor: "more" },
    { type: "checkbox", header: <></>, accessor: "checkbox" },
  ];

  const data = [
    {
      title:
        "Develop innovative software solutions to enhance user experience.",
      owner: (
        <div className="flex flex-row items-center gap-2">
          <Avatar size="xsmall" src={profile} showBadge={true} />
          <span>Jenny Wilson</span>
        </div>
      ),
      label: <Chip label="C Label" onDelete={() => {}} />,
    },
    {
      title: "Back to the Future",
      owner: (
        <div className="flex flex-row items-center gap-2">
          <Avatar size="xsmall" src={profile} showBadge={true} />
          <span>Chapell Roan</span>
        </div>
      ),
      label: <Chip label="A Label" onDelete={() => {}} />,
    },
    {
      title: "Come Back to the Future",
      owner: (
        <div className="flex flex-row items-center gap-2">
          <Avatar size="xsmall" src={profile} showBadge={true} />
          <span>Mike Wilson</span>
        </div>
      ),
      label: <Chip label="B Label" onDelete={() => {}} />,
    },
  ];

  const moreOptions = [
    {
      icon: <Edit2 />,
      label: "Edit Account",
      onClick: (index: number) => console.log("Edit row:", index),
    },
    {
      icon: <ArchiveBox />,
      label: "Archive Account",
      onClick: (index: number) => console.log("Delete row:", index),
    },
  ];

  const handleRowClick = (rowIndex: number) => {
    console.log("Row clicked:", rowIndex);
  };

  return (
    <div>
      <div className="p-8">
        <div>
          <h2>DESIGN SYSTEM 1</h2>
          <h3> AVATAR -----------</h3>
          <section className="m-4 flex flex-row items-center gap-5">
            <div className=" flex flex-col items-center gap-2">
              <div className=" flex flex-row items-center gap-2">
                <Avatar size="large" src={profile} />
                <Avatar size="medium" src={profile} />
                <Avatar size="small" src={profile} />
                <Avatar size="xsmall" src={profile} />
              </div>
              <div className=" flex flex-row items-center gap-2">
                <Avatar size="large" src={profile} showBadge={true} />
                <Avatar size="medium" src={profile} showBadge={true} />
                <Avatar size="small" src={profile} showBadge={true} />
                <Avatar size="xsmall" src={profile} showBadge={true} />
              </div>
              <div className=" flex flex-row items-center gap-2">
                <Avatar size="large" src={profile} showBadge={false} />
                <Avatar size="medium" src={profile} showBadge={false} />
                <Avatar size="small" src={profile} showBadge={false} />
                <Avatar size="xsmall" src={profile} showBadge={false} />
              </div>
            </div>
            <div className=" flex flex-col items-center gap-2">
              <div className=" flex flex-row items-center gap-2">
                <Avatar size="large" firstName="Alex" lastName="Dacer" />
                <Avatar size="medium" firstName="Alex" lastName="Dacer" />
                <Avatar size="small" firstName="Alex" lastName="Dacer" />
                <Avatar size="xsmall" firstName="Alex" lastName="Dacer" />
              </div>
              <div className=" flex flex-row items-center gap-2">
                <Avatar
                  size="large"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={true}
                />
                <Avatar
                  size="medium"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={true}
                />
                <Avatar
                  size="small"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={true}
                />
                <Avatar
                  size="xsmall"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={true}
                />
              </div>
              <div className=" flex flex-row items-center gap-2">
                <Avatar
                  size="large"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={false}
                />
                <Avatar
                  size="medium"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={false}
                />
                <Avatar
                  size="small"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={false}
                />
                <Avatar
                  size="xsmall"
                  firstName="kara"
                  lastName="ladera"
                  showBadge={false}
                />
              </div>
            </div>
          </section>
        </div>
        <div>
          <h3>BREADCRUMBS -----------</h3>
          <section className="m-4">
            <BreadCrumbs items={breadcrumbItems} />
          </section>
        </div>
        <div>
          <h3>CHECKBOXES -----------</h3>
          <section className="m-4">
            <Checkboxes
              label="Label"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <Checkboxes
              label="Label"
              checked={true}
              onChange={handleCheckboxChange}
              disabled
            />
            <Checkboxes
              label="Label"
              mixed={isMixed}
              onChange={handleCheckboxMixedChange}
            />
            <Checkboxes
              label="Label"
              mixed={true}
              onChange={handleCheckboxMixedChange}
              disabled
            />
          </section>
        </div>
        <div>
          <h3>RADIOBUTTON -----------</h3>
          <section className="m-4">
            <RadioButton
              id="option1"
              name="example"
              value="option1"
              label="Option 1"
              checked={selectedValue === "option1"}
              onChange={handleRadioButtonChange}
            />
            <RadioButton
              id="option2"
              name="example"
              value="option2"
              label="Option 2"
              checked={selectedValue === "option2"}
              onChange={handleRadioButtonChange}
            />
            <RadioButton
              id="option3"
              name="example"
              value="option3"
              label="Option 3"
              disabled
              checked={selectedValue === "option3"}
              onChange={handleRadioButtonChange}
            />
          </section>
        </div>
        <div>
          <h3>INPUTS -----------</h3>
          <section className="flex flex-col gap-4 ">
            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">Text</p>
              <div className="flex-grow">
                <Inputs
                  type="text"
                  placeholder="Text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">Text + icon</p>
              <div className="flex-grow">
                <Inputs
                  type={showPassword ? "text" : "password"}
                  placeholder="Text"
                  value={textIcon}
                  icon={showPassword ? Eye : EyeSlash}
                  onChange={(e) => setTextIcon(e.target.value)}
                  iconClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">Text + label</p>
              <div className="flex-grow">
                <Inputs
                  type="text"
                  placeholder="Text"
                  label="LABEL"
                  value={textLabel}
                  onChange={(e) => setTextLabel(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">Textarea</p>
              <div className="flex-grow">
                <Inputs
                  type="textarea"
                  placeholder="Text"
                  value={textArea}
                  maxCharacter={200}
                  isTextarea
                  onChange={(e) => setTextArea(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">Text + description</p>
              <div className="flex-grow">
                <Inputs
                  type="text"
                  placeholder="Text"
                  value={textDesc}
                  onChange={(e) => setTextDesc(e.target.value)}
                  description="Description"
                  error={true}
                />
              </div>
            </div>

            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">
                Text + description + icon
              </p>
              <div className="flex-grow">
                <Inputs
                  type={showPassword ? "text" : "password"}
                  placeholder="Text"
                  value={textDescIcon}
                  icon={showPassword ? Eye : EyeSlash}
                  onChange={(e) => setTextDescIcon(e.target.value)}
                  iconClick={() => setShowPassword(!showPassword)}
                  description="Description"
                  error={true}
                />
              </div>
            </div>

            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">
                Text + label + description
              </p>
              <div className="flex-grow">
                <Inputs
                  type="text"
                  label="LABEL"
                  placeholder="Text"
                  value={textLabelDesc}
                  onChange={(e) => setTextLabelDesc(e.target.value)}
                  description="Description"
                  error={true}
                />
              </div>
            </div>

            <div className="flex flex-row w-full">
              <p className="p-small p-regular w-4/12">Custom Date Picker</p>
              <div className="flex-grow">
                <CustomDatePicker
                  label="LABEL"
                  value={value}
                  onChange={(value) => setValue(value)}
                />
              </div>
            </div>
          </section>
        </div>
        <div>
          <h3>TABLE -----------</h3>
          <section className="m-4">
            <Table
              headers={headers}
              data={data}
              moreOptions={moreOptions}
              tableHeight="h-[500px]"
              onRowClick={handleRowClick}
            />
          </section>
        </div>

        <div>
          <h3>CARD CONTAINER -----------</h3>
          <section className="m-4">
            <CardContainer
              icon={<Clipboard />}
              title="Title Title"
              content="Content"
            />
          </section>
          <section className="m-4">
            <CardContainer content="Content" backgroundColor="bg-szGrey150" />
          </section>
        </div>

        <div>
          <h3>Text Content -----------</h3>
          <section className="m-4">
            <TextContent
              icon={<Avatar size="small" src={profile} />}
              header="text header"
              text="Stephanie Germanotta"
            />
          </section>
          <section className="m-4">
            <TextContent
              icon={<Avatar size="small" src={profile} />}
              header="text header"
              sidetext="Stephanie Germanotta"
            />
          </section>
          <section className="m-4">
            <TextContent header="text header" text="Stephanie Germanotta" />
          </section>
          <section className="m-4">
            <TextContent header="text header" sidetext="Stephanie Germanotta" />
          </section>
        </div>

        <div>
          <h3>Edit Profile Picture -----------</h3>
          <section className="w-full">
            <Avatar
              size="large"
              src={profilePicture}
              showEdit={true}
              onProfileUpdate={handleProfileUpdate}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default KaraDesignSystem;
