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
  const printDocument = (data) => {
    const printableContent = `
    <html>
      <head>
        <title>Print Document</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
        </style>
      </head>
      <body>
        <h1>Client Details</h1>
        <table>
          <tr><th>Client Id</th><td>${data.cid || "-"}</td></tr>
          <tr><th>First Name</th><td>${data.fname || "-"}</td></tr>
          <tr><th>Middle Name</th><td>${data.mname || "-"}</td></tr>
          <tr><th>Last Name</th><td>${data.lname || "-"}</td></tr>
          <tr><th>Email</th><td>${data.email || "-"}</td></tr>
          <tr><th>Mobile</th><td>${data.mobile || "-"}</td></tr>
          <tr><th>Case Type</th><td>${data.caseType || "-"}</td></tr>
          <tr><th>Date of Birth</th><td>${data.dob || "-"}</td></tr>
          <tr><th>City</th><td>${data.address?.city || "-"}</td></tr>
          <tr><th>Village</th><td>${data.address?.village || "-"}</td></tr>
          <tr><th>Pincode</th><td>${data.address?.pincode || "-"}</td></tr>
          <tr><th>Status</th><td>${data.status || "-"}</td></tr>
        </table>
      </body>
    </html>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
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
        <td className="px-4 py-2 border">{data.cid || "-"}</td>
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
              onClick={() => getDocuments(data._id)}
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
        {role === "admin" && (
          <>
            <td className="px-4 py-2 border text-center cursor-pointer">
              <Link
                to={`/edit?id=${data._id}`}
                className="block px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
              >
                Edit
              </Link>
            </td>
            <td className="px-4 py-2 border text-center cursor-pointer ">
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700"
                onClick={() => deleteClient(data._id)}
              >
                Delete
              </button>
            </td>
            <td className="px-4 py-2 border text-center cursor-pointer ">
              <button
                onClick={() => printDocument(data)}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
              >
                Print
              </button>
            </td>
          </>
        )}
      </tr>
    );
  };

  const TableHeader = ({ isAdmin }) => (
    <thead className="sticky top-0">
      <tr className="text-black">
        {[
          "Client Id",
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
            } ${index === 12 && !isAdmin ? "rounded-tr-xl" : ""}`}
          >
            {header}
          </th>
        ))}
        {isAdmin && (
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
    const role = localStorage.getItem("role");

    // Filter data for employees
    const filteredData =
      role === "employee"
        ? clientData.filter((data) => data.fileUploaded === "No")
        : clientData;

    return (
      <tbody>
        {filteredData.length !== 0 ? (
          filteredData.map((data, i) => <TableRows data={data} key={i} />)
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
  const clientDocs = useClientDocumentsStore((state) => state.clientDocs);
  const setClientDocs = useClientDocumentsStore((state) => state.setClientDocs);
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

  const deleteClient = async (cid) => {
    try {
      const { data, status } = await deleteClientData(cid);
      if (status === 201) {
        toast.success(data.message);
        removeClient(cid);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting client.");
    }
  };

  const getDocuments = async (cid) => {
    try {
      const { data, status } = await getClientDocuments(cid);
      if (status === 201) {
        setClientDocs({
          userId: data.docs[0]?.userId || null,
          document: data.docs[0]?.document || [],
          info: data.docs[0]?.info || [],
        });
        showTable(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching documents.");
    }
  };

  const role = localStorage.getItem("role");
  const filteredData =
    role === "employee"
      ? clientData.filter((data) => data.fileUploaded === "No")
      : clientData;

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
          clientData={filteredData}
          isAdmin={role === "admin"}
          deleteClient={deleteClient}
          getDocuments={getDocuments}
        />
      </table>
    </div>
  );
}
