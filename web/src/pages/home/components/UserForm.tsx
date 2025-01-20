// import React, { useEffect } from "react";
// import { z } from "zod";

// import { TUser } from "../../../utils/types";
// import FormInput from "../../../components/form-elements/FormInput";
// import FireBaseApi from "../../../api/FirebaseService";

// interface UserFormProps {
//   userState: TUser;
//   handleUpdateState: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => void;
//   errors: object;
// }

// interface Errors {
//   first_name?: string;
//   last_name?: string;
// }

// export const userFormSchema = z.object({
//   first_name: z.string().min(1, "Cannot be left blank."),
//   last_name: z.string().min(1, "Cannot be left blank."),
// });

// const UserForm = (props: UserFormProps) => {
//   const { userAuth, handleUpdateState, errors: propErrors } = props;
//   const [activies, setActivities] = React.useState([]);
//   const errors = propErrors as Errors;

//   useEffect(() => { 
//     const fetchActivities = async () => {
//       const response = await FireBaseApi.getUserActivites(userState.)
//       //setActivities(data);
//     };
//     fetchActivities();
//   }, []);

//   return (
//     <>
//       <div className="border-t border-gray-900/10 pb-12">
//         <h2 className="text-base/7 font-semibold text-gray-900">
//           User Information
//         </h2>
//       </div>
//       <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//         <div className="sm:col-span-3">
//           <FormInput
//             inputId={"first_name"}
//             inputLabel={"First name"}
//             value={userState.firstname}
//             isRequired={true}
//             handleUpdateState={handleUpdateState}
//           />
//           {errors?.first_name && (
//             <p className="text-red-500 text-sm">{errors?.first_name}</p>
//           )}
//         </div>

//         <div className="sm:col-span-3">
//           <FormInput
//             inputId={"last_name"}
//             inputLabel={"Last name"}
//             value={userState.lastname}
//             isRequired={true}
//             handleUpdateState={handleUpdateState}
//           />
//           {errors?.last_name && (
//             <p className="text-red-500 text-sm">{errors?.last_name}</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserForm;
