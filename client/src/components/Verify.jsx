import React from "react";
import styles from "../css/style.module.css";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import avatar from "./images/profile.png";
let Verify = () => {
  const formik = useFormik({
    initialValues: {
      otp: "",
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
        <div className="mt-2 flex items-center justify-center">
          <img
            src={avatar}
            alt="Profile"
            className="w-[25px] h-25px rounded-full"
          />
          <h2 className="ml-2">padamgadshila17@gmail.com</h2>
        </div>
        <br />
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">
            Enter 6 digit otp send your register email
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Otp"
            {...formik.getFieldProps("otp")}
          />
        </div>
        <Link className="text-blue-500 font-bold text-[20px]">
          Resend Otp ?
        </Link>
        <button className={styles.button} type="submit">
          Verify
        </button>
      </form>
    </div>
  );
};

export default Verify;
