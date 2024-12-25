import React from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
let AddClient = () => {
  const formik = useFormik({
    initialValues: {
      fname: "Harry",
      mname: "James",
      lname: "Potter",
      email: "harrypotter@gmail.com",
      mobile: "7757069284",
      cid: "dfgdhfgwuey",
      caseType: "Family",
      city: "Pune",
      pincode: "411003",
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
        className="border w-[650px] h-auto p-5 rounded-md shadow-md"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Add Client</h1>
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
            <label className="text-xl ml-1">Middle name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Middle Name"
              {...formik.getFieldProps("mname")}
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
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Client Id</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Client Id"
              {...formik.getFieldProps("cid")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Case Type</label>
            <select
              className={styles.input}
              {...formik.getFieldProps("caseType")}
            >
              <option value=""></option>
              <option value="Criminal">Criminal</option>
              <option value="Property">Property</option>
              <option value="Divorce">Divorce</option>
              <option value="Family">Family</option>
              <option value="Civil">Civil</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">City</label>
            <input
              type="text"
              className={styles.input}
              placeholder="City"
              {...formik.getFieldProps("city")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Pincode</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Pincode"
              {...formik.getFieldProps("pincode")}
            />
          </div>
        </div>

        <button className={styles.button} type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddClient;
