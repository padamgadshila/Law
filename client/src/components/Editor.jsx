import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import styles from "../css/style.module.css";
import toast from "react-hot-toast";
import { bulkEdit, getClients } from "./helpers/helper";
import { useClientStore } from "../store/store";
let Editor = ({
  showEditor,
  handleShowEditor,
  selectedRecords,
  setFilterClientDetails,
  removeSelectedRecords,
  removeClient,
}) => {
  const setClientData = useClientStore((state) => state.setClientData);
  const formik = useFormik({
    initialValues: {
      caseType: "",
      docType: "",
      status: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        Object.assign(values, { id: selectedRecords });
        const { data, status } = await bulkEdit(values);
        if (status === 200) {
          toast.success(data.message);
          formik.resetForm();
          handleShowEditor(false);
          selectedRecords.forEach((id) => {
            removeSelectedRecords(id);
          });
          await getClientData();
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error);
        }
      }
    },
  });

  const getClientData = async () => {
    try {
      const { data, status } = await getClients();
      if (status === 201) {
        setClientData(data.clientData);
        // setFilterClientDetails(data.clientData);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching data.");
    }
  };

  return (
    <div
      className={`absolute bg-[rgba(0,0,0,.3)] backdrop-blur-md w-full h-full top-0 right-0 z-50 overflow-hidden flex items-center justify-center  ${
        showEditor ? "block" : "hidden"
      }`}
    >
      <FontAwesomeIcon
        icon={faClose}
        className="absolute top-3 text-3xl px-[10px] py-[6px] rounded-full cursor-pointer right-3 text-white bg-blue-400 ]"
        onClick={handleShowEditor}
      />
      <form
        className="border w-[650px] bg-white  p-5 rounded-md shadow-md mt-5"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Update Information</h1>

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
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Status</label>
            <select
              id="type"
              {...formik.getFieldProps("status")}
              className={styles.input}
            >
              <option value="" disabled={true}>
                Select Type
              </option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <input type="hidden" {...formik.getFieldProps("_id")} />

        <button className={styles.button} type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default Editor;
