import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Pages, CHARACTER_MIN } from "../../../utils/constants";
import { FirebaseError } from "@firebase/util";
import { joinClasses } from "../../../utils/helpers";
import { useAuth } from "../../../providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      CHARACTER_MIN,
      `Password must be at least ${CHARACTER_MIN} characters long,\n`
    )
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(
        CHARACTER_MIN,
        `Password must be at least ${CHARACTER_MIN} characters long,\n`
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface RegisterUserFormProps {
  isSigningIn: boolean;
}

export default function AuthForm(props: RegisterUserFormProps) {
  const { isSigningIn } = props;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firebaseError?: string;
  }>({});

  const navigate = useNavigate();
  const { handleSignInAndReturnSuccess } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSigningIn) {
        loginSchema.parse({ email, password });
      } else {
        registerSchema.parse({ email, password, confirmPassword });
      }
      
      const wasSuccessful = await handleSignInAndReturnSuccess(email, password);
      if (!wasSuccessful) {
        alert("Could not sign in user.");
        return;
      }
      alert("User signed in!");
      navigate(Pages.HOME);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors);
      } else if (error instanceof FirebaseError) {
        setErrors({ firebaseError: error.message });
      }
    }
  };

  return (
    <div
      className={joinClasses(
        "w-[300px]",
        "border",
        "p-6",
        "border-white",
        "rounded-md",
        "text-white",
        "bg-slate-50"
      )}
    >
      <h2
        className={joinClasses(
          "mb-4",
          "text-lg",
          "font-semibold",
          "text-center",
          "text-blue-500"
        )}
      >
        {isSigningIn ? "Sign In" : "Register an Account"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm text-blue-500">
            Email
          </label>
          <input
            type="text"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={joinClasses(
              "w-full",
              "px-3",
              "py-2",
              "border",
              "border-gray-300",
              "rounded-md",
              "text-black",
              "focus:outline-none focus:ring focus:ring-blue-300"
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-1 text-sm text-blue-500"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={joinClasses(
              "w-full",
              "px-3",
              "py-2",
              "border border-gray-300 rounded-md",
              "text-black",
              "focus:outline-none focus:ring focus:ring-blue-300"
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        {!isSigningIn && (
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm text-blue-500"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={joinClasses(
                "w-full",
                "px-3",
                "py-2",
                "border border-gray-300 rounded-md",
                "text-black",
                "focus:outline-none focus:ring focus:ring-blue-300"
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        )}
        <button
          type="submit"
          className={joinClasses(
            "w-full",
            "px-4",
            "py-2",
            "text-white",
            "bg-blue-600",
            "rounded-md",
            "hover:bg-blue-700",
            "focus:outline-none focus:ring focus:ring-blue-300",
            "text-sm"
          )}
        >
          {isSigningIn ? "Sign in" : "Register"}
        </button>
        {errors.firebaseError && (
          <p className="text-red-500 text-sm">{errors.firebaseError}</p>
        )}
      </form>
    </div>
  );
}
