import { toast } from "react-hot-toast";

let loginValidation = (values) => {
  const errors = {};

  if (!values.username || values.username === " ") {
    errors.username = "Username cannot be blank..!";
  }

  if (!values.password || values.password === " ") {
    errors.password = "Password cannot be blank..!";
  }

  if (Object.keys(errors).length > 0) {
    const errorMessages = Object.values(errors).join(" & ");
    toast.error(errorMessages);
  }

  return errors;
};

export default loginValidation;
// make a custom hook for getting data,status,message from server
