import { useNavigate } from "react-router-dom";

import { Pages } from "../../../utils/constants";
// import { User } from "../../../utils/types";
import { joinClasses } from "../../../utils/helpers";
import { useAuth } from "../../../providers/AuthProvider";

export default function HomeHeader() {
  const { user } = useAuth();
  const { handleSignOut: signOut } = useAuth();
  const navigate = useNavigate();

  const onSignOut = () => {
    signOut();
    navigate(Pages.HOME);
  };

  const displayName = user?.email || "Profile";

  return (
    <header className="z-50 bg-slate-50 shadow-md">
      <div
        className={joinClasses(
          "max-w-7xl",
          "mx-auto",
          "px-4 py-3",
          "flex items-center justify-between"
        )}
      >
        <div className="text-2xl font-bold text-blue-600">{displayName}</div>

        <button
          className={joinClasses(
            "hover:text-blue-500 text-blue-600",
            "px-4 py-1",
            "rounded-md"
          )}
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
