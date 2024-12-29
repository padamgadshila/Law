import React, { useState } from "react";
import styles from "../css/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useFormik } from "formik";

export default function PasswordReset() {
  const formik = useFormik({
    initialValues: {
      password: "",
      cpassword: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  let [showPassword, setShowPassword] = useState(false);
  let [showCPassword, setCShowPassword] = useState(false);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        className="border w-[450px] h-auto p-5 rounded-md shadow-md"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Password Reset</h1>
        <br />
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="Confirm Password"
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
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">Password</label>
          <div className="relative">
            <input
              type={showCPassword ? "text" : "password"}
              className={styles.input}
              placeholder="Confirm Password"
              {...formik.getFieldProps("cpassword")}
            />
            <FontAwesomeIcon
              icon={showCPassword ? faEyeSlash : faEye}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xl"
              onClick={() => {
                showCPassword
                  ? setCShowPassword(false)
                  : setCShowPassword(true);
              }}
            />
          </div>
        </div>
        <button className={styles.button} type="submit">
          Reset
        </button>
      </form>
    </div>
  );
}
