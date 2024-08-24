import { ErrorMessage } from "@hookform/error-message";
import type { UseFormReturn } from "react-hook-form";
import { inputStyle } from "../../styles/formStyles";
import { useSession } from "next-auth/react";
import { CKANUserFormType } from "@schema/user.schema";

export const UserForm: React.FC<{
  formObj: UseFormReturn<CKANUserFormType>;
}> = ({ formObj }) => {
  const {
    register,
    formState: { errors },
  } = formObj;

  return (
    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
      <div>
        <label
          htmlFor="name"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Name
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("name")}
            disabled={true}
          />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="fullname"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Full name
        </label>
        <div className="mt-1 w-full">
          <input type="text" className={inputStyle} {...register("fullname")} />
          <ErrorMessage
            errors={errors}
            name="fullname"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="title"
          className="block w-fit text-sm font-medium opacity-75"
        >
          Email
        </label>
        <div className="mt-1 w-full">
          <input
            type="text"
            className={inputStyle}
            {...register("email")}
            disabled={true}
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-justify text-xs text-red-600">{message}</p>
            )}
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="about" className="block text-sm font-medium opacity-75">
          About
        </label>
        <div className="mb-3 mt-1">
          <textarea
            id="about"
            rows={4}
            className={inputStyle}
            defaultValue={""}
            {...register("about")}
          />
        </div>
      </div>
    </div>
  );
};
