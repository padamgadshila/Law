import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { deleteClientData, getClientDocuments } from "./helpers/helper";

import { getClients } from "./helpers/helper";

export default function AdminClient({
  clientData,
  setClientData,
  removeClient,
  toast,
  setOriginalClientData,
}) {
  const getClientData = async () => {
    try {
      const { data, status } = await getClients();
      if (status === 201) {
        setClientData(data.clientData);
        setOriginalClientData(data.clientData);
        console.log(clientData);
      } else {
        throw new Error("Failed to fetch clients");
      }
    } catch (error) {
      console.log("Data not found");
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
        const { data, status } = error.response;

        if (status === 404) {
          toast.error(data.error);
        }
      }
    }
  };

  let getDocuments = async (cid) => {
    try {
      const { data, status } = await getClientDocuments(cid);

      if (status === 201) {
        console.log(data);
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
        <td className="px-4 py-2 border">{data.cid}</td>
        <td className="px-4 py-2 border">{data.fname}</td>
        <td className="px-4 py-2 border">{data.mname || "N.A."}</td>
        <td className="px-4 py-2 border">{data.lname}</td>
        <td className="px-4 py-2 border">{data.email}</td>
        <td className="px-4 py-2 border">{data.mobile}</td>
        <td className="px-4 py-2 border">{data.caseType}</td>
        <td className="px-4 py-2 border">{data.address.state}</td>
        <td className="px-4 py-2 border">{data.address.city}</td>
        <td className="px-4 py-2 border">{data.address.village}</td>
        <td className="px-4 py-2 border">{data.address.pincode}</td>
        <td className="px-4 py-2 border text-center text-blue-500 cursor-pointer hover:underline">
          <button onClick={() => getDocuments(data._id)}>View</button>
        </td>
        <td className="px-4 py-2 border text-center text-green-500 cursor-pointer hover:underline">
          <Link to={`/view?id=${data._id}`}>Edit</Link>
        </td>
        <td className="px-4 py-2 border text-center text-red-500 cursor-pointer hover:underline">
          <button onClick={() => deleteClient(data._id)}>Delete</button>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <Link to={"/addClient"} className="fixed bottom-5 right-7">
        <FontAwesomeIcon
          icon={faUserPlus}
          className="text-3xl bg-[#fd25d6] py-[18px] px-[14px] rounded-full text-white"
        />
      </Link>
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
            <th className="bg-[#fd25d6] px-4 py-2 w-[200px] ">State</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">City</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[150px] ">Village</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[100px] ">Pincode</th>
            <th className="bg-[#fd25d6] px-4 py-2 w-[120px] ">Documents</th>
            <th
              className="bg-[#fd25d6] px-4 py-2 w-[160px] text-center  rounded-tr-xl"
              colSpan={2}
            >
              Action
            </th>
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
