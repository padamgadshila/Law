import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export default function AdminClient({ clientData, deleteClient }) {
  return (
    <div>
      <Link to={"/addClient"} className="fixed bottom-5 right-7">
        <FontAwesomeIcon
          icon={faUserPlus}
          className="text-3xl bg-[#fd25d6] py-[12px] px-[10px] rounded-full text-white"
        />
      </Link>
      <table className="border-collapse w-full text-left table-fixed">
        <thead className="sticky top-0">
          <tr className="text-white">
            <th className="bg-[#fd25d6] px-4 py-2 w-[100px]  rounded-tl-xl">
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
          {clientData.map((e, i) => (
            <tr className="hover:bg-gray-100" key={e._id}>
              <td className="px-4 py-2 border">{e.cid}</td>
              <td className="px-4 py-2 border">{e.fname}</td>
              <td className="px-4 py-2 border">{e.mname}</td>
              <td className="px-4 py-2 border">{e.lname}</td>
              <td className="px-4 py-2 border">{e.email}</td>
              <td className="px-4 py-2 border">{e.mobile}</td>
              <td className="px-4 py-2 border">{e.caseType}</td>
              <td className="px-4 py-2 border">{e.address.state}</td>
              <td className="px-4 py-2 border">{e.address.city}</td>
              <td className="px-4 py-2 border">{e.address.village}</td>
              <td className="px-4 py-2 border">{e.address.pincode}</td>
              <td className="px-4 py-2 border text-center text-blue-500 cursor-pointer hover:underline">
                <Link to={`/view?id=${e.cid}`}>View</Link>
              </td>
              <td className="px-4 py-2 border text-center text-green-500 cursor-pointer hover:underline">
                <Link to={`/view?id=${e._id}`}>Edit</Link>
              </td>
              <td className="px-4 py-2 border text-center text-red-500 cursor-pointer hover:underline">
                <Link to={`/delete?id=${e._id}`}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
