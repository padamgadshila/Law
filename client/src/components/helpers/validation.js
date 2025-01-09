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

export let passwordReset = (values) => {
  const errors = {};
  if (!values.password || !values.password === " ") {
    errors.email = toast.error("Password cannot not be blank..!");
  }
  if (!values.cpassword || !values.cpassword === " ") {
    errors.email = toast.error("Password cannot not be blank..!");
  }
  if (values.password !== values.cpassword) {
    errors.email = toast.error("Password doesn't match..!");
  }

  return errors;
};

export let taskValidation = (values) => {
  const errors = {};
  if (!values.date || !values.date === " ") {
    errors.date = "Date cannot be blank..!";
  }
  if (!values.title || !values.title === " ") {
    errors.date = "Title cannot be blank..!";
  }
  if (!values.time || !values.time === " ") {
    errors.date = "Time cannot be blank..!";
  }
  if (Object.keys(errors).length > 0) {
    const errorMessages = Object.values(errors).join(" & ");
    toast.error(errorMessages);
  }

  return errors;
};
