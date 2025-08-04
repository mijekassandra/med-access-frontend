import { useState } from "react";
import {
  Add,
  ArrowRight,
  Home,
  Warning2,
  Grid2,
  ArchiveBox,
  Briefcase,
  Edit2,
} from "iconsax-react";

import ButtonsIcon from "../global-components/ButtonsIcon";
import Button from "../global-components/Button";
import Modal from "../global-components/Modal";
import SnackbarAlert from "../global-components/SnackbarAlert";
import Dropdown, { type Option } from "../global-components/Dropdown";
import Pagination from "../global-components/Pagination";
import Tab from "../global-components/Tab";
import PurpleTaggedCard from "../global-components/PurpleTaggedCard";
import Document from "../global-components/Document";
import JobPositionHistory from "../global-components/JobPositionHistory";
import Input from "../global-components/Inputs";
import PopoverMenu from "../global-components/PopoverMenu";
import Tabs from "../global-components/Tabs";
import CardHeader from "../global-components/CardHeader";

// options for dropdown
const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
  { label: "Option 4", value: "4" },
  { label: "Option 5", value: "5" },
  { label: "Option 6", value: "6" },
  { label: "Option 7", value: "7" },
  { label: "Option 8", value: "8" },
  { label: "Option 9", value: "9" },
  { label: "Option 10", value: "10" },
  { label: "Option 11", value: "11" },
];

const dummyData = {
  position: "Junior Web Developer",
  positionCode: "90182",
  startDate: new Date("2024-11-01"),
  endDate: new Date("2025-03-31"),
  department: "BSI",
  length: "5 mos",
  directHead: "Stephanie Germanotta",
  directHeadPhotoUrl: "https://i.pravatar.cc/100?img=32",
  category: "Rank and File (Admin)",
  monthlyCompensation: "Stephanie Germanotta",
  otherAllowance: "Stephanie Germanotta",
  clothingAllowance: "Stephanie Germanotta",
  riceAllowance: "Stephanie Germanotta",
  laundryAllowance: "Stephanie Germanotta",
};

type DocumentValue = {
  name: string;
  url: string;
  mimeType?: string;
  isLocal?: boolean;
};

const KassyDesignSystem = () => {
  const [isModalOneOpen, setModalOneOpen] = useState(false);

  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarTwoOpen, setSnackbarTwoOpen] = useState(false);

  const [activeTabIndex, setActiveTabIndex] = useState(0); // use number, default to 0

  const handleSelectionChange = (selected: Option | Option[]) => {
    console.log("Selected Options:", selected);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number, meta?: { source?: string }) => {
    console.log(`Page changed to ${page} from ${meta?.source}`);
    setCurrentPage(page);
  };

  const [localFile, setLocalFile] = useState<DocumentValue | null>(null);
  const [remoteFile, setRemoteFile] = useState<DocumentValue | null>({
    name: "contract.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    mimeType: "application/pdf",
    isLocal: false,
  });

  return (
    <div className="p-8">
      <h2 className="text-h2">DESIGN SYSTEM 2</h2>
      <div>
        <h3 className="text-h3">BUTTONS ICON -----------</h3>
        <section className="m-4 flex flex-wrap gap-2">
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="primary"
            size="large"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="secondary"
            size="large"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="ghost"
            size="large"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="ghost"
            size="large"
            disabled
          />
        </section>
        <section className="m-4 flex flex-wrap gap-2">
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="primary"
            size="medium"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="secondary"
            size="medium"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="ghost"
            size="medium"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="ghost"
            size="medium"
            disabled
          />
        </section>
        <section className="m-4 flex flex-wrap gap-2">
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="primary"
            size="small"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="secondary"
            size="small"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="ghost"
            size="small"
          />
          <ButtonsIcon
            icon={<Home variant="Linear" />}
            onClick={() => console.log("clicked")}
            variant="ghost"
            size="small"
            disabled
          />
        </section>
        <h3 className="text-h3">BUTTONS -----------</h3>
        <h4 className="text-h4">LARGE </h4>
        <section className="m-4 flex flex-wrap gap-2">
          <Button label="Primary" variant="primary" size="large" />
          <Button label="Secondary" variant="secondary" size="large" />
          <Button label="Secondary Dark" variant="secondaryDark" size="large" />
          <Button label="Ghost" variant="ghost" size="large" />
        </section>
        <section className="m-4 flex flex-wrap gap-2">
          <Button
            leftIcon={<Add variant="Linear" />}
            label="Primary"
            variant="primary"
            size="large"
          />
          <Button
            leftIcon={<Add variant="Linear" />}
            label="Secondary"
            variant="secondary"
            size="large"
          />
          <Button
            leftIcon={<Add variant="Linear" />}
            label="Secondary Dark"
            variant="secondaryDark"
            size="large"
          />
          <Button
            leftIcon={<Add variant="Linear" />}
            label="Ghost"
            variant="ghost"
            size="large"
          />
        </section>
        <section className="m-4 flex flex-wrap gap-2">
          <Button label="Primary" variant="primary" size="large" disabled />
          <Button label="Secondary" variant="secondary" size="large" disabled />
          <Button
            label="Secondary Dark"
            variant="secondaryDark"
            size="large"
            disabled
          />
          <Button label="Ghost" variant="ghost" size="large" disabled />
        </section>

        <h4 className="text-h4">MEDIUM </h4>
        <section className="m-4 flex flex-wrap gap-2">
          <Button
            rightIcon={<ArrowRight variant="Linear" />}
            label="Primary"
            variant="primary"
            size="medium"
          />
          <Button
            rightIcon={<ArrowRight variant="Linear" />}
            label="Secondary"
            variant="secondary"
            size="medium"
          />
          <Button
            rightIcon={<ArrowRight variant="Linear" />}
            label="Ghost"
            variant="ghost"
            size="medium"
          />
        </section>
        <section className="m-4 flex flex-wrap gap-2">
          <Button label="Primary" variant="primary" size="medium" disabled />
          <Button
            label="Secondary"
            variant="secondary"
            size="medium"
            disabled
          />
          <Button label="Ghost" variant="ghost" size="medium" disabled />
        </section>
        <h4 className="text-h4">SMALL </h4>
        <section className="m-4 flex flex-wrap gap-2">
          <Button
            leftIcon={<Add variant="Linear" />}
            label="Primary"
            variant="primary"
            size="small"
          />
          <Button
            leftIcon={<Add variant="Linear" />}
            label="Secondary"
            variant="secondary"
            size="small"
          />
          <Button
            leftIcon={<Add variant="Linear" />}
            label="Ghost"
            variant="ghost"
            size="small"
          />
        </section>
        <section className="m-4 flex flex-wrap gap-2">
          <Button label="Primary" variant="primary" size="small" disabled />
          <Button label="Secondary" variant="secondary" size="small" disabled />
          <Button label="Ghost" variant="ghost" size="small" disabled />
        </section>
        <h4 className="text-h4">EXTRA </h4>
        <section className="m-4 flex flex-wrap gap-2">
          <h6>full width -------</h6>
          <Button
            rightIcon={<ArrowRight variant="Linear" />}
            label="Primary Large"
            variant="primary"
            size="large"
            fullWidth
          />
          <br />
          <h6>full width action buttons -------</h6>
          <div className="flex gap-4 w-full">
            <Button
              label="Cancel"
              variant="ghost"
              size="medium"
              className="flex-1"
            />
            <Button
              label="Submit"
              variant="primary"
              size="medium"
              className="flex-1"
            />
          </div>
          <br />
          <h6>action buttons -------</h6>
          <div className="flex gap-4 w-full">
            <Button label="Submit" variant="primary" size="medium" />
            <Button label="Cancel" variant="ghost" size="medium" />
          </div>
          <h6>loading -------</h6>
          <div className="flex w-full gap-4">
            <Button
              rightIcon={<ArrowRight variant="Linear" />}
              label="Primary"
              variant="primary"
              size="large"
              loading
            />
            <Button
              rightIcon={<ArrowRight variant="Linear" />}
              label="Secondary"
              variant="secondary"
              size="medium"
              loading
            />
            <Button
              rightIcon={<ArrowRight variant="Linear" />}
              label="Ghost"
              variant="ghost"
              size="small"
              loading
            />
          </div>
        </section>
        <h3 className="text-h3">MODALS -----------</h3>
        <section className="m-4">
          <Button
            label="Open Modal"
            onClick={() => setModalOneOpen(true)}
            variant="primary"
            size="large"
          />

          {/* Modal component */}
          <Modal
            isOpen={isModalOneOpen}
            icon={<Warning2 />}
            onClose={() => setModalOneOpen(false)}
            title="Title here"
            subHeading="Sub Heading"
            showButton={false}
            buttonLabel="Button"
            showHeaderDivider={true}
            showFooterDivider={true}
            content={
              <div className="flex flex-col gap-5">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sapien,
                  conubia dui sem maecenas hendrerit turpis odio dis hac, nostra
                  aliquet sagittis sollicitudin eros blandit praesent. Cum
                  facilisi quam donec condimentum vivamus cursus commodo velit
                  lacus curabitur, porta conubia auctor gravida ante id viverra
                  etiam vitae. Eu ligula sociis non lacinia fermentum molestie,
                  porta auctor feugiat ac erat eget bibendum, vivamus curae dis
                  ornare dignissim. Turpis eros molestie nibh diam tempus
                  fringilla pharetra posuere taciti, dictumst quisque parturient
                  arcu sed a sodales enim, sociis etiam massa per donec iaculis
                  curabitur natoque. Elementum integer imperdiet gravida
                  faucibus mattis eros orci magna, dapibus commodo sociosqu
                  facilisis vehicula interdum erat mauris, fermentum ultrices
                  ante sagittis iaculis hendrerit etiam. Dignissim phasellus
                  magnis taciti porta hendrerit urna semper facilisi, natoque
                  porttitor auctor orci ultrices dui litora, viverra lobortis
                  cursus laoreet tortor penatibus molestie.
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sapien,
                  conubia dui sem maecenas hendrerit turpis odio dis hac, nostra
                  aliquet sagittis sollicitudin eros blandit praesent. Cum
                  facilisi quam donec condimentum vivamus cursus commodo velit
                  lacus curabitur, porta conubia auctor gravida ante id viverra
                  etiam vitae. Eu ligula sociis non lacinia fermentum molestie,
                  porta auctor feugiat ac erat eget bibendum, vivamus curae dis
                  ornare dignissim. Turpis eros molestie nibh diam tempus
                  fringilla pharetra posuere taciti, dictumst quisque parturient
                  arcu sed a sodales enim, sociis etiam massa per donec iaculis
                  curabitur natoque.
                </p>
              </div>
            }
            headerOptions="left"
            footerOptions="stacked-left"
            headerImage="https://www.creativefabrica.com/wp-content/uploads/2021/08/19/Zebra-print-Zebra-spots-Zebra-patterns-Graphics-16056369-3-312x208.png"
            footerButtons={[
              {
                label: "Cancel",
                variant: "ghost",
                onClick: () => setModalOneOpen(false),
                size: "medium",
              },
              {
                label: "Submit",
                variant: "secondaryDark",
                onClick: () => console.log("Submit on Modal clicked!"),
                size: "medium",
              },
            ]}
          />
        </section>
        <h3 className="text-h3">SNACKBAR ALERT -----------</h3>
        <section className="m-4">
          <div className="flex gap-2">
            <Button
              label="Trigger Snackbar"
              onClick={() => setSnackbarOpen(true)}
              variant="secondary"
              size="medium"
            />
            <Button
              label="Trigger Snackbar without Button"
              onClick={() => setSnackbarTwoOpen(true)}
              variant="primary"
              size="medium"
            />
          </div>

          <SnackbarAlert
            isOpen={isSnackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            type="success"
            title="Heading"
            duration={6000}
            message="Lorem ipsum dolor sit amet consectetur adipiscing elit odio platea"
            action={{
              label: "Button",
              onClick: () => {
                // console.log("alert button clicked!");
                console.log("Snackbar state:", isSnackbarOpen);
              },
            }}
            animation="slide-left"
          />
          <SnackbarAlert
            isOpen={isSnackbarTwoOpen}
            onClose={() => setSnackbarTwoOpen(false)}
            showCloseButton={false}
            type="info"
            title="Heading"
            duration={3000}
            // message="Lorem ipsum dolor sit amet consectetur adipiscing elit odio platea"
            animation="slide-up"
          />
        </section>
        <h3 className="text-h3">DROPDOWN -----------</h3>
        <div className="flex gap-2 m- max-w-[500px]">
          <Dropdown
            label="Small"
            placeholder="Choices"
            options={options}
            size="small"
            value={options[1]}
            onSelectionChange={handleSelectionChange}
            disabled
          />
          <Dropdown
            label="Medium"
            placeholder="Choices"
            options={options}
            onSelectionChange={handleSelectionChange}
            size="medium"
          />
          <Dropdown
            label="Large"
            placeholder="Choices"
            options={options}
            onSelectionChange={handleSelectionChange}
            size="large"
            disabled
          />
        </div>

        <section className="flex flex-col gap-2 m-4 max-w-[420px]">
          <Dropdown
            label="Simple Dropdown"
            placeholder="Choices"
            options={options}
            onSelectionChange={handleSelectionChange}
            usePortal={false}
          />
          <Dropdown
            label="LABEL"
            placeholder="Choices"
            options={options}
            onSelectionChange={handleSelectionChange}
            multiSelect
            isCheckbox
            size="small"
            usePortal={false}
          />
        </section>
        <h3 className="text-h3">PAGINATION -----------</h3>
        <section>
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            visiblePages={5}
            onChange={handlePageChange}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            visiblePages={5}
            onChange={handlePageChange}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            visiblePages={5}
            onChange={handlePageChange}
            disabled={true}
          />
        </section>
        <h3 className="text-h3">TAB -----------</h3>
        <section className="grid gap-4">
          <h5 className="text-szSecondary500">LABEL ONLY --------- </h5>
          {/* -------- Parent div with no specific div, will take up all the space. */}
          <Tabs
            options={[
              {
                label: "Basic Info",
                value: "Basic Info",
                number: 1,
                icon: <Grid2 />,
              },
              {
                label: "Contacts",
                value: "Contacts",
                number: 2,
                icon: <Grid2 />,
              },
              {
                label: "Family",
                value: "Family",
                number: 3,
                icon: <Grid2 />,
              },
              {
                label: "IDs",
                value: "IDs",
                number: 4,
                icon: <Grid2 />,
              },
            ]}
            activeIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
          />
          {/* -------- example parent div when we add a specifcic width , */}
          <h5 className="text-szSecondary500">
            WITH LABEL, ICON AND NUMBER ---------{" "}
          </h5>
          <div className="flex gap-4 w-[500px]">
            {/* Bottom row - active */}

            <Tabs
              options={[
                {
                  label: "Tab label",
                  value: "Tab label",
                  number: 1,
                  icon: <Grid2 />,
                },
                {
                  label: "Tab label",
                  value: "Tab label",
                  number: 2,
                  icon: <Grid2 />,
                },
                {
                  label: "Tab label",
                  value: "Tab label",
                  number: 3,
                  icon: <Grid2 />,
                },
                {
                  label: "Tab label",
                  value: "Tab label",
                  number: 4,
                  icon: <Grid2 />,
                },
              ]}
              activeIndex={activeTabIndex}
              onTabChange={setActiveTabIndex}
            />
          </div>
          <h5 className="text-szSecondary500">ICON ONLY --------- </h5>
          <div className="flex w-fit">
            <Tab type="left" active={false} icon={<Grid2 />} />
            <Tab type="middle" active={false} icon={<Grid2 />} />
            <Tab type="right" active icon={<Grid2 />} />
          </div>
        </section>

        <h3 className="text-h3 mb-4">
          Card Container with Purple Label -----------
        </h3>
        <section>
          <PurpleTaggedCard label="Title here" children={<div>hello</div>} />
        </section>

        <h3 className="text-h3">DOCUMENT -----------</h3>
        <section className="flex flex-col gap-2 w-[300px]">
          <Document
            inputId="fileInput1"
            value={localFile}
            onChange={(file) => {
              setLocalFile(file);
              if (file) {
                console.log("Selected new file:", file);
              } else {
                console.log("Local file removed.");
              }
            }}
          />
          <Document
            inputId="fileInput2"
            value={remoteFile}
            onChange={(file) => {
              setRemoteFile(file);
              if (file) {
                console.log("Remote file updated:", file);
              } else {
                console.log("Remote file removed.");
              }
            }}
          />
        </section>
        <h3 className="text-h3 mb-3">
          JOB POSITION HISTORY COMPONENTS -----------
        </h3>
        <section className="flex flex-col gap-2">
          <h5 className="text-szSecondary500">CLOSED STATE --------- </h5>
          <JobPositionHistory data={dummyData} state="closed" />
          <h5 className="text-szSecondary500">OPEN STATE --------- </h5>
          <JobPositionHistory data={dummyData} state="open" />
          <h5 className="text-szSecondary500">
            OTHER STATE (NO DROPDOWN) ---------{" "}
          </h5>

          <JobPositionHistory data={dummyData} state="other" />
        </section>
        <h3 className="text-h3 mb-3">
          TEST INPUT AND BUTTON SIZES -----------
        </h3>
        <section className="flex flex-row gap-2 h-fit">
          <ButtonsIcon icon={<Home variant="Linear" />} size="medium" />
          <Button label="medium" size="medium" />
          <Input label="Large" />
          <Dropdown
            label="Label"
            placeholder="Choices"
            options={options}
            onSelectionChange={handleSelectionChange}
            size="small"
          />{" "}
        </section>
        <h3 className="text-h3 mb-3">Popover Menu -----------</h3>
        <section className="flex flex-col gap-2 h-fit ">
          <PopoverMenu
            color="szPrimary500"
            size="medium"
            items={[
              {
                label: "Add Tag",
                onClick: () => {
                  alert("Add Account clicked");
                },
                icon: <Add />,
              },
              {
                label: "View Archived Accounts",
                onClick: () => {
                  alert("View Archived Accounts clicked");
                },
                icon: <ArchiveBox />,
              },

              {
                label: "Menu Item with no icon",
                onClick: () => {
                  alert("Menu Item with no icon");
                },
              },
            ]}
          />
        </section>

        <h3 className="text-h3 mb-3">Card Header -----------</h3>
        <section className="flex flex-col h-fit gap-[12px]">
          <CardHeader
            title="Header Text"
            rightIcon={<Edit2 />}
            leftIcon={<Briefcase />}
          />
          <CardHeader title="Header Text" leftIcon={<Briefcase />} />
          <CardHeader title="Header Text" />
          <CardHeader title="Header Text" rightIcon={<Edit2 />} />
        </section>
      </div>
    </div>
  );
};

export default KassyDesignSystem;
