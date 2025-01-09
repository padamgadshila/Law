import React, { useEffect } from "react";
import { deleteEmployeeData, getEmployee } from "./helpers/helper";
import { Link } from "react-router-dom";
import { useEmployeeStore } from "../store/store";

export default function AdminEmployee({ toast }) {
  const employeeData = useEmployeeStore((state) => state.employeeData);
  const setEmployeeData = useEmployeeStore((state) => state.setEmployeeData);
  const removeEmployee = useEmployeeStore((state) => state.removeEmployee);
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
      <tr className="text-black">
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
            className={`bg-gray-300 px-4 py-2 ${
              index === 0 ? "rounded-tl-xl" : ""
            } ${index === 6 && !isAdmin ? "rounded-tr-xl" : ""}`}
          >
            {header}
          </th>
        ))}
        {isAdmin && (
          <th
            colSpan={2}
            className="bg-gray-300 px-4 py-2 text-center rounded-tr-xl"
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
        <td className="px-4 py-2 border">{e._id || "-"}</td>
        <td className="px-4 py-2 border">{e.fname || "-"}</td>
        <td className="px-4 py-2 border">{e.lname || "-"}</td>
        <td className="px-4 py-2 border">{e.username || "-"}</td>
        <td className="px-4 py-2 border">{e.email || "-"}</td>
        <td className="px-4 py-2 border">{e.mobile || "-"}</td>

        <td className="px-4 py-2 border cursor-pointer">
          <Link
            to={`/editEmployee?id=${e._id}`}
            className="block px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
          >
            Edit
          </Link>
        </td>
        <td className="px-4 py-2 border cursor-pointer hover:underline">
          <button
            onClick={() => deleteEmployee(e._id)}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="absolute w-full h-full p-2">
      <table className="border-collapse w-full text-left table-auto">
        <TableHeader isAdmin={"admin"} />
        <tbody>
          {employeeData.map((e, i) => (
            <TableRows e={e} key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
