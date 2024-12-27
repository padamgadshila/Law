import React from "react";
import styles from "../css/style.module.css";

import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

let Email = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        className="border w-[450px] h-auto p-5 rounded-md shadow-md"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Account Recovery</h1>
        <br />
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">Enter your register email</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Email"
            {...formik.getFieldProps("email")}
          />
        </div>
        <button className={styles.button} type="submit">
          Send OTP
        </button>

        <Link
          to={"/login"}
          className="mt-4 text-[20px] font-bold text-blue-500 "
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-3" />
          Back to Login
        </Link>
      </form>
    </div>
  );
};

export default Email;
