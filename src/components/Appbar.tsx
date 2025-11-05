import Avatar from "../global-components/Avatar";
import Notification from "../features/notification/Notification";
import type { User } from "../types/auth";

interface AppbarProps {
  title: string;
  subheader?: string;
  userRole: "admin" | "doctor" | "user";
  user: User;
}

const Appbar = ({ title, subheader, userRole, user }: AppbarProps) => {
  return (
    <div className="flex justify-between items-center bg-szWhite100 w-full px-6 py-4">
      <div className="flex flex-col ">
        {/* <h1 className="text-szBlack900 text-body-large-strong">{title}</h1> */}
        <p className={`text-h3 md:text-h2 text-szBlack800`}>{title}</p>
        <p className="text-szDarkGrey600 text-body-small-reg">{subheader}</p>
      </div>
      <div className="flex items-center gap-6 h-full">
        <Notification userRole={userRole} />
        <div className="flex items-center gap-2">
          <Avatar
            src={user.profilePicture}
            size="medium"
            firstName={user.profilePicture ? "" : user.firstName}
            lastName={user.profilePicture ? "" : user.lastName}
          />
          <p className="text-szBlack800 text-body-small-reg">{user.fullName}</p>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
