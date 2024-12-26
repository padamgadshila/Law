import React, { useState } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import { addClientDocuments } from "./helpers/helper";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

let AddClientDocuments = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([
    { documentType: "", document: "Select the file" },
  ]);

  const formik = useFormik({
    initialValues: {
      info: "",
      cid: localStorage.getItem("cid"),
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const { data, status } = await addClientDocuments({
          documents,
          values,
        });
        if (status === 201) {
          toast.success(data.message);
          localStorage.removeItem("cid");
          navigate("/");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  const addDocuments = () => {
    setDocuments([
      ...documents,
      { documentType: "", document: "Select the file" },
    ]);
  };
  const handleDocumentChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    setDocuments(updatedDocuments);
  };

  const handleFileSelection = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].document = file || null;
    setDocuments(updatedDocuments);
  };

  const docTypes = [
    "Client Photo",
    "Client Signature",
    "Aadhar Card",
    "Pan Card",
    "Voter Card",
    "Driving License",
    "Ration Card",
    "Domicile Certificate",
    "Others",
  ];

  const getAvailableDocTypes = (currentIndex) => {
    const selectedTypes = documents
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);
    return docTypes.filter((type) => !selectedTypes.includes(type));
  };

  const isAddMoreDisabled = documents.every(
    (doc) => doc.document === "" && doc.document !== "Select the file"
  );

  return (
    <div className="w-full h-full flex justify-center">
      <Toaster />
      <form
        className="border w-[650px] p-5 rounded-md shadow-md mt-5"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Client Documents</h1>
        {documents.map((doc, i) => (
          <div className="w-full flex gap-2" key={i}>
            <div className="w-full flex flex-col my-2">
              <label className="text-xl ml-1">Document Type</label>
              <select
                className={styles.input}
                value={doc.documentType}
                onChange={(e) =>
                  handleDocumentChange(i, "documentType", e.target.value)
                }
              >
                <option>Select document</option>
                {getAvailableDocTypes(i).map((type, i) => (
                  <option value={type} key={i}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col my-2">
              <label className="text-[18px] ml-1">
                {doc.documentType} (JPG, PNG, PDF)
              </label>
              <input
                type="file"
                id={`file-${i}`}
                style={{ display: "none" }}
                placeholder="Client Id"
                onChange={(e) => handleFileSelection(i, e.target.files[0])}
              />
              <label
                htmlFor={`file-${i}`}
                className={styles.input}
                style={{
                  border: "1px dashed",
                  lineHeight: "55px",
                  cursor: "pointer",
                }}
              >
                Select the file
              </label>
            </div>
          </div>
        ))}

        {!isAddMoreDisabled && (
          <button
            type="button"
            onClick={addDocuments}
            className="text-xl text-blue-500"
          >
            Add More
          </button>
        )}
        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">Extra info (Optional)</label>
          <textarea
            className={styles.input}
            style={{ height: "150px" }}
            placeholder="Enter additional information about the document"
            {...formik.getFieldProps("info")}
          ></textarea>
        </div>
        <button className={styles.button} type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};

export default AddClientDocuments;
