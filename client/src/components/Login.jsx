import React from "react";
import styles from "../css/style.module.css";
import { useSearchParams, Link } from "react-router-dom";
import { useFormik } from "formik";

let Login = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.has("admin");
  const isEmployee = searchParams.has("employee");
  const userType = isAdmin ? "Admin" : isEmployee ? "Employee" : "Unknown";

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
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
          <input
            type="text"
            className={styles.input}
            placeholder="Password"
            {...formik.getFieldProps("password")}
          />
        </div>
        <Link className="text-blue-500 font-bold" to={`/email?${userType}`}>
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
