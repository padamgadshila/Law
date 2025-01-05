import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  deleteClientData,
  FileDownload,
  FileView,
  getClientDocuments,
} from "./helpers/helper";
import { useClientDocumentsStore } from "../store/store";
import { getClients } from "./helpers/helper";

export default function AdminClient({
  clientData,
  setClientData,
  removeClient,
  toast,
  setOriginalClientData,
}) {
  const clientDocs = useClientDocumentsStore((state) => state.clientDocs);
  const setClientDocs = useClientDocumentsStore((state) => state.setClientDocs);

  const getDocuments = async (_id) => {
    try {
      const { data, status } = await getClientDocuments(_id);
      if (status === 201) {
        setClientDocs({
          userId: data.docs[0]?.userId || null,
          document: data.docs[0]?.document || [],
          info: data.docs[0]?.info || [],
        });
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

  const printDocument = async (e) => {
    await getDocuments(e._id);
    const printableContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e._id}</title>
  <style>
    /* General Styles */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      width: 8in;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      background-color: #fff;
      position:relative;
    }
    .heading {
      margin-top: 20px;
      font-weight: bold;
      font-size: 24px;
      text-align: center;
      color: #000;
    }
    .subheading {
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0 10px;
    }
    .info-row {
      display: flex;
      align-items: center;
      
    }
    .info-item {
    display:block;
      padding: 10px;
      border: 1px solid #ccc;
      width:100%;
    }

    .documents-section {
      margin-top: 20px;
    }
    .document-item {
      display: block;
      margin-bottom: 5px;
    }
      .doc{
      display:block;
      position:absolute;
      top:10px;
      right:10px;
      }
      .di{
      width:100%;
      margin-bottom:10px;
      }
  </style>
</head>
<body>
  <div class="container">
  <span class="doc"><b>Document no:</b>${e.docNo}</span>
    <h1 class="heading">Client Information</h1>
    <br />
    <h2 class="subheading">Personal Information</h2>
    <div class="info-row">
      <span class="info-item">
        <b>Client Id: </b> ${e._id}
      </span>
      <span class="info-item">
        <b>Full name: </b> ${e.fname} ${e.mname} ${e.lname}
      </span>
    </div>
    <div class="info-row">
      <span class="info-item">
        <b>Mobile no: </b> ${e.mobile}
      </span>
      <span class="info-item">
        <b>Email: </b> ${e.email}
      </span>
    </div>
    <div class="info-row">
      <span class="info-item">
        <b>Dob: </b> ${e.dob}
      </span>
      <span class="info-item">
        <b>Address: </b> ${e.address?.city}, ${e.address?.village}, ${
      e.address?.pincode
    }
      </span>
    </div>
    <div class="info-row">
      <span class="info-item">
        <b>Case Type: </b> ${e.caseType}
      </span>
      <span class="info-item">
        <b>Documents Attached: </b> ${e.fileUploaded}
      </span>
    </div>

    <h2 class="subheading">Documents Attached</h2>
    <div class="documents-section">
     <ul>
          ${clientDocs.document
            .map(
              (doc, i) => `
            <li class="di" key="${i}">
              <h3>${doc.documentType}</h3>
              ${
                isImage(doc.filename)
                  ? `
                <img src="http://localhost:3500/${doc.filename}" style="width:50%" alt="${doc.documentType}" />
              `
                  : `
                <iframe src="http://localhost:3500/${doc.filename}" frameBorder="0" width="100%" height="1000px" title="${doc.documentType}"></iframe>
              `
              }
            </li>
          `
            )
            .join("")}
        </ul>
    </div>
  </div>
</body>
</html>

  `;

    const printWindow = window.open("", "_blank");
    const print = localStorage.getItem("print");
    if (print === "print") {
      localStorage.removeItem("print");
      printWindow.document.open();
      printWindow.document.write(printableContent);
      printWindow.document.close();
      printWindow.print();
    } else if (print === "view") {
      localStorage.removeItem("print");
      printWindow.document.open();
      printWindow.document.write(printableContent);
      printWindow.document.close();
    }
  };

  const DocumentViewer = ({ isOpen, onClose, clientDocs }) => {
    if (!isOpen) return null;

    return (
      <div className="z-10 fixed left-0 flex justify-center bg-[rgba(0,0,0,.3)] backdrop-blur-md h-screen w-full">
        <FontAwesomeIcon
          icon={faClose}
          className="absolute top-3 text-3xl px-[10px] py-[6px] rounded-full cursor-pointer right-3 text-white bg-[#fd25d6]"
          onClick={onClose}
        />
        <div className="w-[450px] h-[450px] overflow-y-scroll mt-10 rounded-lg p-[20px] bg-white">
          <span>
            <b>Client Id:</b>
            {clientDocs.userId || "-"}
          </span>
          <table className="border-collapse w-full text-left table-fixed">
            <thead>
              <tr className="text-white">
                <th className="bg-[#fd25d6] w-[200px] px-4 py-2 rounded-tl-xl">
                  Document Type
                </th>
                <th
                  className="bg-[#fd25d6] px-4 py-2 text-center rounded-tr-xl"
                  colSpan={2}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {clientDocs?.document?.map((d, i) => (
                <tr key={i}>
                  <td className="px-4 py-[5px] border bg-white">
                    {d.documentType}
                  </td>
                  <td className="px-4 py-[5px] border bg-white">
                    <FileView filename={d.filename} />
                  </td>
                  <td className="px-4 py-[5px] border w-[180px] bg-white">
                    <FileDownload filename={d.filename} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h5 className="font-bold">Extra Info</h5>
          <span className="w-full inline-block text-wrap h-auto border rounded-md bg-white">
            {clientDocs.info || ""}
          </span>
        </div>
      </div>
    );
  };

  const TableRows = ({ data, i }) => {
    const role = localStorage.getItem("role");

    return (
      <tr className="hover:bg-gray-100" key={i}>
        <td className="px-4 py-2 border">{data._id || "-"}</td>
        <td className="px-4 py-2 border">{data.docNo || "-"}</td>
        <td className="px-4 py-2 border">{data.fname || "-"}</td>
        <td className="px-4 py-2 border">{data.mname || "-"}</td>
        <td className="px-4 py-2 border">{data.lname || "-"}</td>
        <td className="px-4 py-2 border">{data.email || "-"}</td>
        <td className="px-4 py-2 border">{data.mobile || "-"}</td>
        <td className="px-4 py-2 border">{data.caseType || "-"}</td>
        <td className="px-4 py-2 border">{data.dob || "-"}</td>
        <td className="px-4 py-2 border">{data.address?.city || "-"}</td>
        <td className="px-4 py-2 border">{data.address?.village || "-"}</td>
        <td className="px-4 py-2 border">{data.address?.pincode || "-"}</td>
        <td className="px-4 py-2 border">{data.status || "-"}</td>
        <td className="px-4 py-2 border text-center text-blue-500 cursor-pointer hover:underline">
          {data.fileUploaded === "Yes" ? (
            <button
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
              onClick={() => {
                getDocuments(data._id);
                showTable(true);
              }}
            >
              View
            </button>
          ) : (
            <Link
              className="block px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
              to={`/addClientDocuments?id=${data._id}`}
            >
              Add
            </Link>
          )}
        </td>
        <td className="px-4 py-2 border text-center cursor-pointer">
          <Link
            to={`/edit?id=${data._id}`}
            className="block px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
          >
            Edit
          </Link>
        </td>
        {role === "admin" && (
          <>
            <td className="px-4 py-2 border text-center cursor-pointer ">
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700"
                onClick={() => deleteClient(data._id)}
              >
                Delete
              </button>
            </td>
          </>
        )}
        <td className="px-4 py-2 border text-center cursor-pointer ">
          <button
            onClick={() => {
              localStorage.setItem("print", "print");
              printDocument(data);
            }}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
          >
            Print
          </button>
        </td>
        <td className="px-4 py-2 border text-center cursor-pointer ">
          <button
            onClick={() => {
              localStorage.setItem("print", "view");
              printDocument(data);
            }}
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
          >
            Preview
          </button>
        </td>
      </tr>
    );
  };

  const TableHeader = ({ isAdmin }) => (
    <thead className="sticky top-0">
      <tr className="text-black">
        {[
          "Client Id",
          "Document No",
          "First Name",
          "Middle Name",
          "Last Name",
          "Email",
          "Mobile",
          "Case Type",
          "Dob",
          "City",
          "Village",
          "Pincode",
          "Status",
          "Documents",
        ].map((header, index) => (
          <th
            key={index}
            className={`bg-gray-300 px-4 py-2 ${
              index === 0 ? "rounded-tl-xl" : ""
            } ${index === 14 && !isAdmin ? "rounded-tr-xl" : ""}`}
          >
            {header}
          </th>
        ))}
        {isAdmin && (
          <th
            colSpan={4}
            className="bg-gray-300 px-4 py-2 text-center rounded-tr-xl"
          >
            Action
          </th>
        )}
        {!isAdmin && (
          <th
            colSpan={3}
            className="bg-gray-300 px-4 py-2 text-center rounded-tr-xl"
          >
            Action
          </th>
        )}
      </tr>
    </thead>
  );
  const TableBody = ({ clientData }) => {
    return (
      <tbody>
        {clientData.length !== 0 ? (
          clientData.map((data, i) => <TableRows data={data} key={i} />)
        ) : (
          <tr>
            <td className="px-4 py-2 border text-center" colSpan="100%">
              No records available
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  const [table, showTable] = useState(false);

  const getClientData = async () => {
    try {
      const { data, status } = await getClients();
      if (status === 201) {
        setClientData(data.clientData);
        setOriginalClientData(data.clientData);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching data.");
    }
  };

  useEffect(() => {
    getClientData();
  }, []);

  const deleteClient = async (_id) => {
    try {
      const { data, status } = await deleteClientData(_id);
      if (status === 201) {
        toast.success(data.message);
        removeClient(_id);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting client.");
    }
  };

  const role = localStorage.getItem("role");
  return (
    <div>
      <DocumentViewer
        isOpen={table}
        onClose={() => showTable(false)}
        clientDocs={clientDocs}
      />
      <table className="border-collapse w-full text-left table-auto">
        <TableHeader isAdmin={role === "admin"} />
        <TableBody
          clientData={clientData}
          isAdmin={role === "admin"}
          deleteClient={deleteClient}
          getDocuments={getDocuments}
        />
      </table>
    </div>
  );
}
