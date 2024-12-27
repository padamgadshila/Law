import React, { useEffect, useState } from "react";
import avatar from "./images/paddy.jpg";
import styles from "../css/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faGear,
  faUserFriends,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getClients } from "./helpers/helper";
import AdminClient from "./AdminClient";
let Admin = () => {
  let [activeTab, setActiveTab] = useState(0);

  let tabs = [
    { name: "Dashboard", icon: faGear },
    { name: "Employee", icon: faUsers },
    { name: "Client", icon: faUserFriends },
  ];

  let filters = [
    { name: "cid", value: "Client Id" },
    { name: "fname", value: "First name" },
    { name: "mname", value: "Middle name" },
    { name: "lname", value: "Last name" },
    { name: "email", value: "Email" },
    { name: "mobile", value: "Mobile No." },
    { name: "caseType", value: "Case type" },
    { name: "state", value: "State" },
    { name: "city", value: "City" },
    { name: "village", value: "Village" },
    { name: "pincode", value: "Pincode" },
  ];

  let [disableFilter, setDisableFilter] = useState(false);
  let [showProfile, setShowProfile] = useState(false);
  let [clientData, setClientData] = useState([]);
  let [employeeData, setEmployeeData] = useState([
    {
      eid: 12,
      fname: "Padam",
      lname: "Gadshila",
      username: "padam234",
      email: "padamgadshila17@gmail.com",
      mobile: "784512952",
    },
    {
      eid: 13,
      fname: "Padam",
      lname: "Gadshila",
      username: "padam234",
      email: "padamgadshila17@gmail.com",
      mobile: "784512952",
    },
    {
      eid: 14,
      fname: "Padam",
      lname: "Gadshila",
      username: "padam234",
      email: "padamgadshila17@gmail.com",
      mobile: "784512952",
    },
  ]);
  let [query, setQuery] = useState({ search: "", filter: "" });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };
  let [originalClientData, setOriginalClientData] = useState([]);

  useEffect(() => {
    if (query.filter && query.search) {
      const filtered = originalClientData.filter((item) =>
        item[query.filter]?.toLowerCase().includes(query.search.toLowerCase())
      );
      setClientData(filtered);
    } else {
      setClientData(originalClientData);
    }
  }, [query, originalClientData]);

  useEffect(() => {
    const getClientData = async () => {
      try {
        const { data, status } = await getClients();
        if (status === 201) {
          setClientData(data.clientData);
          setOriginalClientData(data.clientData); // Store the original data
        }
      } catch (error) {
        console.log("Data not found");
      }
    };

    getClientData();
  }, []);

  return (
    <div className="w-full h-screen">
      <Toaster />
      {/* profile */}

      <div
        className={`absolute border w-[350px] h-[380px] rounded-3xl bg-white z-10 shadow-lg overflow-hidden right-5 transition-all ${
          showProfile
            ? "top-[70px] opacity-[1] visible"
            : "top-[120px] opacity-0 invisible"
        }`}
      >
        <div className={styles.profile}>
          <img
            src={avatar}
            alt=""
            className="w-[150px] aspect-square rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 border-4 border-white"
          />
        </div>
        <div className="mt-[60px] p-5 flex flex-col items-center">
          <h1 className="text-4xl font-bold">username</h1>
          <span className="text-2xl">
            <b>Role</b>: Admin
          </span>
          <div className="flex items-center gap-1">
            <Link
              to={"/profile"}
              className="flex items-center w-[150px] text-center bg-[#fd25d6] p-3 rounded-r-md rounded-l-lg text-white"
            >
              <FontAwesomeIcon className="text-xl mr-3" icon={faGear} />
              <span className="text-xl font-bold">Profile</span>
            </Link>
            <Link
              to={"/logout"}
              className="flex items-center w-[150px] text-center bg-[#fc5543] p-3 rounded-l-md rounded-r-lg text-white"
            >
              <FontAwesomeIcon
                className="text-xl mr-3"
                icon={faRightFromBracket}
              />
              <span className="text-xl font-bold">Logout</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.nav}>
        <h1 className="ml-6 font-bold text-2xl text-black">Admin Name</h1>
        {activeTab === 2 && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Search"
              value={query.search}
              onChange={handleOnChange}
              name="search"
              className="bg-gray-100 w-[250px] h-[50px] rounded-l-xl outline-none pl-3 text-xl focus:border border-[#fd25d6]"
            />
            <select
              onClick={() => setDisableFilter(true)}
              value={query.filter}
              onChange={handleOnChange}
              name="filter"
              className="bg-gray-100 cursor-pointer w-auto h-[50px] outline-none appearance-none px-2 text-[22px] focus:border border-[#fd25d6] rounded-r-xl"
            >
              <option disabled={disableFilter}>Filter</option>
              {filters.map((o, i) => (
                <option value={o.name} key={i}>
                  {o.value}
                </option>
              ))}
            </select>
          </div>
        )}
        <img
          src={avatar}
          alt="profile pic"
          className="w-[50px] h-[50px] rounded-full mr-6 cursor-pointer"
          onClick={() => {
            showProfile ? setShowProfile(false) : setShowProfile(true);
          }}
        />
      </div>

      {/* Main Page */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[160px] h-[calc(100vh-70px)] ml-3  p-2">
          <ul>
            {tabs.map((tab, i) => (
              <li
                key={i}
                className={`flex items-center my-2 p-1 rounded-md cursor-pointer ${
                  activeTab === i ? "bg-[#fd25d6] text-white" : " text-gray-800"
                }`}
                onClick={() => setActiveTab(i)}
              >
                <FontAwesomeIcon
                  icon={tab.icon}
                  className="text-[22px] w-[20px] h-[20px]"
                />
                <span className="inline-block ml-2 text-[20px]">
                  {tab.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="relative overflow-y-scroll w-[calc(100%-190px)] h-[calc(100vh-70px)] ml-3 border-gray-300">
          {activeTab === 0 && (
            <div className="absolute w-full h-full p-5 flex gap-5">
              <div className="border w-[250px] h-[110px] rounded-2xl flex flex-col items-center py-5 shadow-md">
                <h1 className="font-bold text-4xl">10</h1>
                <span className="text-2xl">Total Employee</span>
              </div>
              <div className="border w-[250px] h-[110px] rounded-2xl flex flex-col items-center py-5 shadow-md">
                <h1 className="font-bold text-4xl">200</h1>
                <span className="text-2xl">Total Clients</span>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="absolute w-full h-full p-2">
              <table className="border-collapse w-full text-left table-auto">
                <thead className="">
                  <tr className="text-white">
                    <th className="bg-[#fd25d6] px-4 py-2  rounded-tl-xl">
                      First Name
                    </th>
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
                    <tr className="hover:bg-gray-100" key={e.eid}>
                      <td className="px-4 py-2 border">{e.fname}</td>
                      <td className="px-4 py-2 border">{e.lname}</td>
                      <td className="px-4 py-2 border">{e.username}</td>
                      <td className="px-4 py-2 border">{e.email}</td>
                      <td className="px-4 py-2 border">{e.mobile}</td>

                      <td className="px-4 py-2 border text-green-500 cursor-pointer hover:underline">
                        <Link to={`/edit?id=${e.eid}`}>Edit</Link>
                      </td>
                      <td className="px-4 py-2 border text-red-500 cursor-pointer hover:underline">
                        <Link to={`/delete?id=${e.eid}`}>Delete</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 2 && (
            <div className="absolute w-full h-full px-2">
              <AdminClient
                clientData={clientData}
                setClientData={setClientData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
