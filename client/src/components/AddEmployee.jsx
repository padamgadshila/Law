import React from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import { addEmployee, sendMail } from "./helpers/helper";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function AddEmployee() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      mobile: "",
      role: "employee",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const addEmployeeResponse = await addEmployee(values);
        if (addEmployeeResponse.status === 201) {
          toast.success(addEmployeeResponse.data.message);
          await toast.promise(sendMail(addEmployeeResponse.data.mail), {
            loading: "Sending email...",
            success: "Email sent successfully!",
            error: "Failed to send email.",
          });
          setInterval(() => {
            navigate("/admin");
          }, 2200);
        }
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          toast.error(data.error);
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
        <h1 className="text-4xl font-bold text-center">Add Employee</h1>
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
        <button className={styles.button} type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
