import React, { useState } from "react";
import styles from "../css/style.module.css";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import loginValidation from "./helpers/validation";
import { login } from "./helpers/helper";

let Login = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.has("admin");
  const isEmployee = searchParams.has("employee");
  const userType = isAdmin ? "admin" : isEmployee ? "employee" : "Unknown";
  const navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      role: userType,
    },
    validate: loginValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const { data, status } = await login(values);
        console.log(data);

        if (status === 201) {
          toast.success(data.message);
          document.cookie = `token=${data.token}; path=/; SameSite=Strict;`;
          navigate("/addClient");
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
            toast.error(data.error);
          } else if (status === 404) {
            toast.error(data.error);
          } else {
            toast.error(data.error || "An unexpected error occurred.");
          }
        } else {
          toast.error("Network error or server unreachable.");
        }
      }
    },
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Toaster />
      <form
        className="border w-[450px] h-auto p-5 rounded-md shadow-md"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">{userType} Login</h1>
        <br />
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">Username</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Username"
            {...formik.getFieldProps("username")}
          />
        </div>
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="Password"
              {...formik.getFieldProps("password")}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xl"
              onClick={() => {
                showPassword ? setShowPassword(false) : setShowPassword(true);
              }}
            />
          </div>
        </div>
        <input
          type="hidden"
          className={styles.input}
          {...formik.getFieldProps("role")}
        />
        <Link className="text-blue-500 font-bold text-[20px]" to="/email">
          Forgot password ?
        </Link>
        <button className={styles.button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
