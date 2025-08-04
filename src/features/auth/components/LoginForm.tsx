import React, { useState } from "react";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//components
import Inputs from "../../../global-components/Inputs";
import Checkboxes from "../../../global-components/Checkboxes";
import Button from "../../../global-components/Button";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [text, setText] = useState("");
  const [textIcon, setTextIcon] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col gap-10 w-[280px] sm:w-[360px]">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Email:</p>
          <Inputs
            type="text"
            // placeholder="Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Password:</p>
          <Inputs
            type={showPassword ? "text" : "password"}
            // placeholder="Text"
            value={textIcon}
            icon={showPassword ? Eye : EyeSlash}
            onChange={(e) => setTextIcon(e.target.value)}
            iconClick={() => setShowPassword(!showPassword)}
          />{" "}
        </div>
        <Checkboxes
          label="Remember me"
          onChange={() => setIsChecked(!isChecked)}
          checked={isChecked}
          textColor="szWhite100"
        />
      </section>

      <Button
        variant="secondaryDark"
        label="LOGIN"
        size="medium"
        type="button"
        fullWidth
      />
    </div>
  );
};

export default LoginForm;
