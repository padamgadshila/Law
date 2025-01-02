import { toast } from "react-hot-toast";

export let loginValidation = (values) => {
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

export let emailValidation = (values) => {
  const errors = {};
  if (!values.email || !values.email === " ") {
    errors.email = toast.error("Email cannot not be blank..!");
  }

  return errors;
};
