import React, { useEffect, useState } from "react";
import styles from "../css/style.module.css";
import avatar from "./images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUserTie,
  faUser,
  faSyncAlt,
  faUserPlus,
  faBars,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Client from "./Client";
import { getClients } from "./helpers/helper";
import { useClientStore, useEmployeeStore } from "../store/store";
import AdminEmployee from "./AdminEmployee";
import { Profile } from "./Profile";
export default function Admin() {
  const navigate = useNavigate();
  let [activeTab, setActiveTab] = useState(() => {
    return parseInt(localStorage.getItem("activeTab")) || 0;
  });
  let tabs = [
    { name: "Dashboard", icon: faTachometerAlt, option: "" },
    { name: "Employee", icon: faUserTie, option: "Add employee" },
    { name: "Client", icon: faUser, option: "Add client" },
  ];

  let [disableFilter, setDisableFilter] = useState(false);
  let [showProfile, setShowProfile] = useState(false);

  let [showSidebar, setShowSidebar] = useState(false);

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

  useEffect(() => {
    setTotals([
      { name: "employees", total: employeeData.length },
      { name: "clients", total: clientData.length },
    ]);
  }, [employeeData, clientData]);

  let Card = ({ title, count }) => {
    return (
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 w-[250px] rounded-lg shadow-md text-center">
        <span className="text-2xl">{title}</span>
        <h1 className="font-bold text-4xl">{count || 0}</h1>
      </div>
    );
  };

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
  let [profile, setProfile] = useState({});
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
        <Profile
          toast={toast}
          Link={Link}
          profile={profile}
          setProfile={setProfile}
          navigate={navigate}
        />
      </div>

      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-lg flex items-center justify-between w-full mx-auto h-[70px]">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={showSidebar ? faClose : faBars}
            className="text-2xl ml-7 cursor-pointer"
            onClick={() => {
              showSidebar ? setShowSidebar(false) : setShowSidebar(true);
            }}
          />
          <h1 className="ml-6 font-bold text-2xl">
            {profile.username || "Admin"}
          </h1>
        </div>
        {activeTab === 1 && (
          <Link
            to={"/addEmployee"}
            className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-md px-5 py-2"
          >
            Add Employee <FontAwesomeIcon icon={faUserPlus} className="ml-3" />
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
              className="bg-white text-black w-[250px] h-[50px] rounded-l-xl outline-none pl-3 text-xl"
            />
            <select
              onClick={() => setDisableFilter(true)}
              value={query.filter}
              onChange={handleOnChange}
              name="filter"
              className="bg-white text-black cursor-pointer w-auto h-[50px] outline-none appearance-none px-2 text-[22px]  rounded-r-xl"
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
              className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-md px-5 py-2"
            >
              Add Client <FontAwesomeIcon icon={faUserPlus} />
            </Link>
          </div>
        )}
        <img
          src={profile.profilePic || avatar}
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
        <div
          className={`bg-[#2d3748] z-10 w-[170px] h-[calc(100vh-70px)] fixed p-2 transform transition-all duration-300 ease-in-out  ${
            showSidebar ? " translate-x-0" : "translate-x-[-100%]"
          }`}
        >
          <ul className="text-white">
            {tabs.map((tab, i) => (
              <li
                key={i}
                className={`flex items-center my-2 px-3 py-1 rounded-md cursor-pointer " ${
                  activeTab === i ? "bg-gray-700" : " "
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
        <div
          className={`relative overflow-y-scroll  h-[calc(100vh-70px)] ml-3 border-gray-300 transition-all duration-300 ease-in-out transform ${
            showSidebar ? "w-[calc(100%-190px)] translate-x-[170px]" : "w-full"
          }`}
        >
          {activeTab === 0 && (
            <div>
              <h1 className="font-bold text-2xl">Overview</h1>
              <div className="flex gap-3 mt-2">
                {Totals.map((v, i) => (
                  <Card title={`Total ${v.name}`} key={i} count={v.total} />
                ))}
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
              <Client
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
