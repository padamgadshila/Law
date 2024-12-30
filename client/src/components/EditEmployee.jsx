import React, { useEffect } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import {
  addEmployee,
  getOneEmployeeById,
  updateEmployee,
} from "./helpers/helper";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
export default function EditEmployee() {
  const navigate = useNavigate();
  const location = useLocation();

  const eid = location.search.split("=")[1];
  const formik = useFormik({
    initialValues: {
      _id: "",
      fname: "",
      lname: "",
      email: "",
      mobile: "",
      role: "",
      username: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const { data, status } = await updateEmployee(values);
        if (status === 200) {
          toast.success(data.message);
          navigate("/admin");
        }
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          toast.error(data.error);
        }
      }
    },
  });
  let getEmployeeById = async (id) => {
    try {
      const {
        data: { employeeData },
        status,
      } = await getOneEmployeeById(id);
      if (status === 200) {
        formik.setValues({
          _id: employeeData._id || "",
          fname: employeeData.fname || "",
          lname: employeeData.lname || "",
          email: employeeData.email || "",
          mobile: employeeData.mobile || "",
          role: employeeData.role || "",
          username: employeeData.username || "",
        });
      }
    } catch (error) {
      const { data } = error.response;
      toast.error(data.error);
    }
  };

  useEffect(() => {
    getEmployeeById(eid);
  }, []);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Toaster />
      <form
        className="border w-[450px] h-auto p-5 rounded-md shadow-md"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Update Details</h1>
        <br />
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
          Update
        </button>
      </form>
    </div>
  );
}
