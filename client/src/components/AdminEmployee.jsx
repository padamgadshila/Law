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
  const TableHeader = ({ isAdmin }) => (
    <thead className="sticky top-0">
      <tr className="text-white">
        {[
          "Employee Id",
          "First Name",
          "Middle Name",
          "Username",
          "Email",
          "Mobile",
        ].map((header, index) => (
          <th
            key={index}
            className={`bg-[#fd25d6] px-4 py-2 ${
              index === 0 ? "rounded-tl-xl" : ""
            } ${index === 6 && !isAdmin ? "rounded-tr-xl" : ""}`}
          >
            {header}
          </th>
        ))}
        {isAdmin && (
          <th
            colSpan={2}
            className="bg-[#fd25d6] px-4 py-2 text-center rounded-tr-xl"
          >
            Action
          </th>
        )}
      </tr>
    </thead>
  );

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
      <TableHeader isAdmin={"admin"} />
      <tbody>
        {employeeData.map((e, i) => (
          <TableRows e={e} key={i} />
        ))}
      </tbody>
    </table>
  );
}
