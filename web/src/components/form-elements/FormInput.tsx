import React from "react";
import { joinClasses } from "../../utils/helpers";

const inputClasses = joinClasses(
  "block w-full rounded-md bg-white",
  "px-3 py-1.5 text-base text-gray-900",
  "outline outline-1 -outline-offset-1 outline-gray-300",
  "placeholder:text-gray-400",
  "focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600",
  "sm:text-sm/6"
);

interface FormInputProps {
  inputId: string;
  inputLabel: string;
  value?: string;
  isRequired: boolean;
  handleUpdateState: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const FormInput = (props: FormInputProps) => {
  const { inputId, inputLabel, isRequired, value, handleUpdateState } = props;
  const required = <span className="ml-1 bold text-red-600">*</span>;
  return (
    <>
      <label
        htmlFor="first_name"
        className={joinClasses("block text-sm/6", "font-medium text-gray-900")}
      >
        {inputLabel}
        {isRequired && required}
      </label>
      <div className="mt-2">
        <input
          required={isRequired}
          type="text"
          name={inputId}
          id={inputId}
          autoComplete={inputId}
          value={value}
          onChange={handleUpdateState}
          className={inputClasses}
        />
      </div>
    </>
  );
};

export default FormInput;
