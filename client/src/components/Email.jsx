import React from "react";
import styles from "../css/style.module.css";

import { useFormik } from "formik";

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
      </form>
    </div>
  );
};

export default Email;
