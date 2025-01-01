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

  let [table, showTable] = useState(false);
  const getClientData = async () => {
    try {
      const { data, status } = await getClients();
      if (status === 201) {
        setClientData(data.clientData);
        setOriginalClientData(data.clientData);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      }
    }
  };

  useEffect(() => {
    getClientData();
  }, []);

  let deleteClient = async (cid) => {
    try {
      const { data, status } = await deleteClientData(cid);
      if (status === 201) {
        toast.success(data.message);
        removeClient(cid);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      }
    }
  };

  let getDocuments = async (cid) => {
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
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      } else {
        toast.error("something went wrong..!");
      }
    }
  };

  let TableRows = ({ data, i }) => {
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
        <td className="px-4 py-2 border">{data.address.city || "-"}</td>
        <td className="px-4 py-2 border">{data.address.village || "-"}</td>
        <td className="px-4 py-2 border">{data.address.pincode || "-"}</td>
        <td className="px-4 py-2 border">{data.status || "-"}</td>
        <td className="px-4 py-2 border text-center text-blue-500 cursor-pointer hover:underline">
          {data.fileUploaded === "Yes" ? (
            <button
              onClick={() => {
                getDocuments(data._id);
              }}
            >
              View
            </button>
          ) : (
            <Link
              className="text-green-500"
              to={`/addClientDocuments?id=${data._id}`}
            >
              Add
            </Link>
          )}
        </td>
        {localStorage.getItem("role") === "admin" ? (
          <>
            <td className="px-4 py-2 border text-center text-green-500 cursor-pointer hover:underline">
              <Link to={`/edit?id=${data._id}`}>Edit</Link>
            </td>
            <td className="px-4 py-2 border text-center text-red-500 cursor-pointer hover:underline">
              <button onClick={() => deleteClient(data._id)}>Delete</button>
            </td>
          </>
        ) : (
          ""
        )}
      </tr>
    );
  };

  return (
    <div>
      <div
        className={`z-10 fixed left-0 flex justify-center bg-[rgba(0,0,0,.3)] backdrop-blur-md h-screen w-full ${
          table ? "opacity-[1] visible" : "opacity-0 invisible"
        }
        `}
      >
        <FontAwesomeIcon
          icon={faClose}
          className="absolute top-3 text-3xl px-[10px] py-[6px] rounded-full cursor-pointer right-3 text-white bg-[#fd25d6]"
          onClick={() => {
            setClientDocs({
              userId: "",
              document: [],
              info: "",
            });
            showTable(false);
          }}
        />
        <div className="w-[450px] h-[450px] overflow-y-scroll mt-10 rounded-lg p-[20px] bg-white">
          <span>
            <b>Client Id:</b>
            {clientDocs.userId || "-"}
          </span>

          <table className="border-collapse w-full text-left table-fixed">
            <thead>
              <tr className="text-white">
                <th className="bg-[#fd25d6] w-[200px] px-4 py-2  rounded-tl-xl">
                  Document Type
                </th>
                <th
                  className="bg-[#fd25d6]  px-4 py-2 text-center  rounded-tr-xl"
                  colSpan={2}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {clientDocs &&
                clientDocs.document.map((d, i) => (
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

      <table className="border-collapse w-full text-left table-fixed">
        <thead className="sticky top-0">
          <tr className="text-white">
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px]  rounded-tl-xl">
              Client Id
            </th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">First Name</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">Middle Name</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">Last Name</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[220px] ">Email</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[130px] ">Mobile</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">Case Type</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[200px] ">Dob</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">City</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">Village</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[100px] ">Pincode</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[100px] ">Status</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[120px] ">Documents</th>
            {localStorage.getItem("role") === "admin" ? (
              <th
                className="bg-[#fd25d6] px-4 py-2 w-[160px] text-center  rounded-tr-xl"
                colSpan={2}
              >
                Action
              </th>
            ) : (
              ""
            )}
          </tr>
        </thead>
        <tbody>
          {clientData.length !== 0 &&
            clientData.map((data, i) => <TableRows data={data} key={i} />)}
        </tbody>
      </table>
    </div>
  );
}
