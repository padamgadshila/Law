import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getClientDocuments } from "./helpers/helper";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ViewDocuments() {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const id = location.search.split("=")[1];
  const [docs, setDocs] = useState();
  const getDocuments = async (_id) => {
    try {
      const { data, status } = await getClientDocuments(_id);
      if (status === 201) {
        setDocs(data.docs);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching documents.");
    }
  };

  const isImage = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const ext = filename.split(".").pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  useEffect(() => {
    getDocuments(id);
  }, []);

  useEffect(() => {}, [docs]);
  return (
    <div className="w-full h-full p-7 relative ">
      <Link
        to={role === "admin" ? "/admin" : "/employee"}
        className="text-blue-500 text-2xl"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back to home</span>
      </Link>
      <Toaster />
      <h2 className="text-3xl text-center font-bold">Client Documents</h2>
      <ul className="w-[1000px] mx-auto border p-2 mt-3">
        {docs?.document.length > 0 ? (
          docs?.document.map((doc, i) => (
            <li key={i} className="mt-4">
              <span className="font-bold text-2xl">{doc.documentType}</span>
              {isImage(doc.filename) ? (
                <img
                  src={`http://localhost:3500/${doc.filename}`}
                  style={{ width: "50%" }}
                  alt={`${doc.documentType}`}
                />
              ) : (
                <iframe
                  src={`http://localhost:3500/${doc.filename}`}
                  frameborder="0"
                  width={"100%"}
                  height={"1000px"}
                  title={doc.documentType}
                ></iframe>
              )}
            </li>
          ))
        ) : (
          <li>No files available</li>
        )}
      </ul>
    </div>
  );
}
