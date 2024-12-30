import React, { useEffect } from "react";
import { deleteEmployeeData, getEmployee } from "./helpers/helper";
import { Link } from "react-router-dom";

export default function AdminEmployee({
  employeeData,
  setEmployeeData,
  removeEmployee,
  toast,
}) {
  const getEmployeeData = async () => {
    try {
      const { data, status } = await getEmployee();
      if (status === 200) {
        setEmployeeData(data.employeeData);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      }
    }
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  let deleteEmployee = async (eid) => {
    try {
      const { data, status } = await deleteEmployeeData(eid);

      if (status === 200) {
        toast.success(data.message);
        removeEmployee(eid);
      }
    } catch (error) {
      const { data, status } = error.response;

      if (status === 404) {
        toast.error(data.error);
      }
    }
  };

  let TableRows = ({ e, i }) => {
    return (
      <tr className="hover:bg-gray-100" key={i}>
        <td className="px-4 py-2 border">{e.fname || "-"}</td>
        <td className="px-4 py-2 border">{e.lname || "-"}</td>
        <td className="px-4 py-2 border">{e.username || "-"}</td>
        <td className="px-4 py-2 border">{e.email || "-"}</td>
        <td className="px-4 py-2 border">{e.mobile || "-"}</td>

        <td className="px-4 py-2 border text-green-500 cursor-pointer hover:underline">
          <Link to={`/editEmployee?id=${e._id}`}>Edit</Link>
        </td>
        <td className="px-4 py-2 border text-red-500 cursor-pointer hover:underline">
          <button onClick={() => deleteEmployee(e._id)}>Delete</button>
        </td>
      </tr>
    );
  };

  return (
    <table className="border-collapse w-full text-left table-auto">
      <thead className="">
        <tr className="text-white">
          <th className="bg-[#fd25d6] px-4 py-2  rounded-tl-xl">First Name</th>
          <th className="bg-[#fd25d6] px-4 py-2 ">Last Name</th>
          <th className="bg-[#fd25d6] px-4 py-2 ">Username</th>
          <th className="bg-[#fd25d6] px-4 py-2 ">Email</th>
          <th className="bg-[#fd25d6] px-4 py-2 ">Mobile</th>
          <th
            className="bg-[#fd25d6] px-4 py-2 text-center  rounded-tr-xl"
            colSpan={2}
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {employeeData.map((e, i) => (
          <TableRows e={e} key={i} />
        ))}
      </tbody>
    </table>
  );
}
