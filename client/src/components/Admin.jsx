import React, { useEffect, useState } from "react";
import avatar from "./images/paddy.jpg";
import styles from "../css/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faGear,
  faUserFriends,
  faUsers,
  faSyncAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import AdminClient from "./AdminClient";
import { getClients } from "./helpers/helper";
import { useClientStore, useEmployeeStore } from "../store/store";
import AdminEmployee from "./AdminEmployee";
export default function Admin() {
  let [activeTab, setActiveTab] = useState(() => {
    return parseInt(localStorage.getItem("activeTab")) || 0;
  });

  let tabs = [
    { name: "Dashboard", icon: faGear },
    { name: "Employee", icon: faUsers },
    { name: "Client", icon: faUserFriends },
  ];

  let [disableFilter, setDisableFilter] = useState(false);
  let [showProfile, setShowProfile] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };
  let [query, setQuery] = useState({ search: "", filter: "" });
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

  // Local
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    const storedCid = localStorage.getItem("cid");
    if (storedTab !== null) {
      setActiveTab(Number(storedTab));
    }
    if (storedCid !== null) {
      localStorage.removeItem("cid");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  let [Totals, setTotals] = useState([
    { name: "employees", total: "" },
    { name: "clients", total: "" },
  ]);
  let [originalClientData, setOriginalClientData] = useState([]);

  let [isLoading, setLoading] = useState(false);
  const setClientData = useClientStore((state) => state.setClientData);
  const clientData = useClientStore((state) => state.clientData);
  const removeClient = useClientStore((state) => state.removeClient);

  const employeeData = useEmployeeStore((state) => state.employeeData);
  const setEmployeeData = useEmployeeStore((state) => state.setEmployeeData);
  const removeEmployee = useEmployeeStore((state) => state.removeEmployee);

  let Refresh = async () => {
    setLoading(true);
    try {
      const { data, status } = await getClients();
      if (status === 201) {
        setClientData(data.clientData);
      } else {
        throw new Error("Failed to fetch clients");
      }
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;

        if (status === 404) {
          toast.error(data.error);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (query.filter && query.search) {
      const filtered = originalClientData.filter((item) =>
        item[query.filter]?.toLowerCase().includes(query.search.toLowerCase())
      );
      setClientData(filtered);
    } else {
      setClientData(originalClientData);
    }
  }, [query]);

  useEffect(() => {});

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
        {activeTab === 1 && (
          <Link
            to={"/addEmployee"}
            className={styles.button}
            style={{
              fontSize: "20px",
              padding: "5px",
              marginLeft: "5px",
              width: "200px",
            }}
          >
            Add Employee <FontAwesomeIcon icon={faUserPlus} />
          </Link>
        )}
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
            <FontAwesomeIcon
              spin={isLoading}
              icon={faSyncAlt}
              className="ml-5 cursor-pointer text-2xl bg-[#fd25d6] p-2 rounded-full text-white"
              title="Refresh"
              onClick={Refresh}
            />
            <Link
              to={"/addClient"}
              className={styles.button}
              style={{ fontSize: "20px", padding: "5px", marginLeft: "5px" }}
            >
              Add Client <FontAwesomeIcon icon={faUserPlus} />
            </Link>
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
              <AdminEmployee
                employeeData={employeeData}
                setEmployeeData={setEmployeeData}
                removeEmployee={removeEmployee}
                toast={toast}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div className="absolute w-full h-full px-2">
              <AdminClient
                clientData={clientData}
                setClientData={setClientData}
                removeClient={removeClient}
                toast={toast}
                setOriginalClientData={setOriginalClientData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
