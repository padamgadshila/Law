import React from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import { addClientInfo } from "./helpers/helper";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function AddClient() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fname: "",
      mname: "",
      lname: "",
      email: "",
      mobile: "",
      gender: "",
      docType: "",
      caseType: "",
      dob: "",
      state: "",
      city: "",
      village: "",
      pincode: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let { data, status } = await addClientInfo(values);
        if (status === 201) {
          toast.success("Client Info saved..!");
          navigate(`/addClientDocuments?id=${data._id}`);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="w-full h-full flex justify-center">
      <Toaster />
      <form
        className="border w-[650px]  p-5 rounded-md shadow-md mt-5"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Client Information</h1>
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
            <label className="text-xl ml-1">Gender</label>
            <select
              className={styles.input}
              {...formik.getFieldProps("gender")}
            >
              <option value="" disabled={true}>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Mobile</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Mobile No."
              {...formik.getFieldProps("mobile")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Dob</label>
            <input
              type="date"
              className={styles.input}
              placeholder="Dob"
              {...formik.getFieldProps("dob")}
            />
          </div>
        </div>
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Case Type</label>
            <select
              className={styles.input}
              {...formik.getFieldProps("caseType")}
            >
              <option value="" disabled={true}>
                Select Type
              </option>
              <option value="Criminal">Criminal</option>
              <option value="Property">Property</option>
              <option value="Divorce">Divorce</option>
              <option value="Family">Family</option>
              <option value="Civil">Civil</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Document Type</label>
            <select
              id="type"
              {...formik.getFieldProps("docType")}
              className={styles.input}
            >
              <option value="" disabled={true}>
                Select Type
              </option>
              <option value="Notary">Notary</option>
              <option value="Subreg">Subreg</option>
              <option value="Only Type">Only Type</option>
            </select>
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">State</label>
            <input
              type="text"
              className={styles.input}
              placeholder="State"
              {...formik.getFieldProps("state")}
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

        <button className={styles.button} type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
