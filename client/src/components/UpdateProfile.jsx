import React, { useEffect, useState } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import { getProfileInfo, updateProfile } from "./helpers/helper";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import profilePic from "./images/profile.png";
import { convertToBase64 } from "./helpers/convert";
let Profile = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      mobile: "",
      username: "",
      role: "",
      profilePic: "",
      _id: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await formik.setFieldValue("profilePic", image || "");
        const { data, status } = await updateProfile(values);
        if (status === 200) {
          toast.success(data.message);
          const role = localStorage.getItem("role");
          if (role === "admin") {
            navigate("/admin");
          } else if (role === "employee") {
            navigate("/employee");
          }
        }
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          toast.error(data.error);
        }
      }
    },
  });

  let convertImage = async (e) => {
    try {
      const pic = await convertToBase64(e.target.files[0]);
      setImage(pic);
      formik.setFieldValue("profilePic", pic);
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      }
    }
  };
  let getUser = async (id, role) => {
    try {
      const {
        data: { userData },
        status,
      } = await getProfileInfo(id, role);
      if (status === 200) {
        formik.setValues({
          fname: userData.fname || "",
          lname: userData.lname || "",
          email: userData.email || "",
          mobile: userData.mobile || "",
          username: userData.username || "",
          role: userData.role || "",
          profilePic: userData.profilePic || "",
          _id: userData._id || "",
        });
        setImage(userData.profilePic || "");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      }
    }
  };
  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    getUser(id, role);
  }, []);
  return (
    <div className="w-full h-full mt-5 flex  justify-center">
      <Toaster />
      <form
        className="border w-[650px] h-auto p-5 rounded-md shadow-md"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Profile</h1>
        <br />
        <div className="flex items-center justify-center">
          <label htmlFor="profile">
            <img
              src={image || profilePic}
              className="w-[150px] aspect-square rounded-full cursor-pointer hover:border-2 border-gray-400"
              alt="profilePic"
            />
            <input
              type="file"
              className="hidden"
              id="profile"
              onChange={(e) => {
                convertImage(e);
              }}
            />
          </label>
        </div>
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">Username</label>
          <input
            type="text"
            className={styles.input}
            placeholder="username"
            {...formik.getFieldProps("username")}
          />
        </div>
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">First name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="First Name"
              {...formik.getFieldProps("fname")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Last name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Last Name"
              {...formik.getFieldProps("lname")}
            />
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Email"
              {...formik.getFieldProps("email")}
            />
          </div>

          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Mobile</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Mobile No."
              {...formik.getFieldProps("mobile")}
            />
          </div>
        </div>
        <input
          type="hidden"
          className={styles.input}
          placeholder="role"
          {...formik.getFieldProps("role")}
        />
        <input
          type="hidden"
          className={styles.input}
          placeholder="id"
          {...formik.getFieldProps("_id")}
        />
        <button className={styles.button} type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
