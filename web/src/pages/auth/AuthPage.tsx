import { useState } from "react";

import AuthForm from "./components/AuthForm";
import { joinClasses } from "../../utils/helpers";

export default function AuthPage() {
  return <AuthPageContent />;
}

function AuthPageContent() {
  const [isSigningIn, setIsSigningIn] = useState<boolean>(true);

  const handleToggleForms = async () => {
    setIsSigningIn(!isSigningIn);
  };

  return (
    <div
      className={joinClasses(
        "h-screen",
        "flex",
        "flex-col",
        "justify-center",
        "items-center",
        "gap-10"
      )}
    >
      <AuthForm isSigningIn={isSigningIn} />
      <button
        onClick={handleToggleForms}
        type="submit"
        className={joinClasses(
          "px-4",
          "py-2",
          "text-blue-500",
          "rounded-md",
          "hover:underline",
          "focus:outline-none",
          "text-sm"
        )}
      >
        {isSigningIn
          ? "Are you new? Register your account."
          : "Have an account? Sign in."}
      </button>
    </div>
  );
}
