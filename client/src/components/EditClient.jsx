import React, { useEffect } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import { getOneClientBYId, updateClient } from "./helpers/helper";
import { Toaster, toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
export default function EditClient() {
  const navigate = useNavigate();
  const location = useLocation();

  const _id = location.search.split("=")[1];
  const formik = useFormik({
    initialValues: {
      _id: "",
      fname: "",
      mname: "",
      lname: "",
      email: "",
      mobile: "",
      docNo: "",
      caseType: "",
      dob: "",
      city: "",
      village: "",
      pincode: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let { data, status } = await updateClient(values);
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
        toast.error("Something went wrong");
      }
    },
  });
  let getClient = async (id) => {
    try {
      const {
        data: { clientData },
        status,
      } = await getOneClientBYId(id);

      if (status === 200) {
        formik.setValues({
          _id: clientData._id || "",
          fname: clientData.fname || "",
          mname: clientData.mname || "",
          lname: clientData.lname || "",
          email: clientData.email || "",
          mobile: clientData.mobile || "",
          docNo: clientData.docNo || "",
          caseType: clientData.caseType || "",
          dob: clientData.dob || "",
          city: clientData.address?.city || "",
          village: clientData.address?.village || "",
          pincode: clientData.address?.pincode || "",
        });
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      }
    }
  };

  useEffect(() => {
    getClient(_id);
  }, []);
  return (
    <div className="w-full h-full flex justify-center">
      <Toaster />
      <form
        className="border w-[650px]  p-5 rounded-md shadow-md mt-5"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Update Information</h1>
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
            <label className="text-xl ml-1">Document No</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Document No"
              {...formik.getFieldProps("docNo")}
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
            <label className="text-xl ml-1">Dob</label>
            <input
              type="date"
              className={styles.input}
              placeholder="Dob"
              {...formik.getFieldProps("dob")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">City</label>
            <input
              type="text"
              className={styles.input}
              placeholder="City"
              {...formik.getFieldProps("city")}
            />
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Village</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Village"
              {...formik.getFieldProps("village")}
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

        <input type="hidden" {...formik.getFieldProps("_id")} />

        <button className={styles.button} type="submit">
          Update
        </button>
      </form>
    </div>
  );
}
