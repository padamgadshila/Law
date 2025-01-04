import React, { useEffect, useState } from "react";
import styles from "../css/style.module.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import avatar from "./images/profile.png";
import { getProfilePic, resSendOtp, verifyOtp } from "./helpers/helper";
import toast, { Toaster } from "react-hot-toast";
export default function Verify() {
  let [image, setImage] = useState(null);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let email = localStorage.getItem("email");
        Object.assign(values, { email: email });
        const { status } = await verifyOtp(values);

        if (status === 200) {
          navigate("/resetPassword", { replace: true });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    let getProfileImage = async () => {
      try {
        let email = localStorage.getItem("email");
        const { data, status } = await getProfilePic(email);
        if (status === 200) {
          console.log(data);
          setImage(data.profilePic.profilePic);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProfileImage();
  }, []);

  let resendOtp = async () => {
    try {
      let email = localStorage.getItem("email");
      const { data, status } = await resSendOtp(email);
      if (status === 200) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Toaster />
      <div className="border w-[450px] h-auto p-5 rounded-md shadow-md">
        <form onSubmit={formik.handleSubmit}>
          <h1 className="text-4xl font-bold text-center">Account Recovery</h1>
          <div className="mt-2 flex items-center justify-center">
            <img
              src={image || avatar}
              alt="Profile"
              className="w-[25px] h-25px rounded-full"
            />
            <h2 className="ml-2">{localStorage.getItem("email")}</h2>
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
          <button className={styles.button} type="submit">
            Verify
          </button>
        </form>
        <button
          className="text-blue-500 font-bold text-[20px]"
          onClick={resendOtp}
        >
          Resend Otp ?
        </button>
      </div>
    </div>
  );
}
