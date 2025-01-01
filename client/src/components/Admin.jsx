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
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import AdminClient from "./AdminClient";
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
    { name: "Dashboard", icon: faTachometerAlt },
    { name: "Employee", icon: faUserTie },
    { name: "Client", icon: faUser },
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
      <div className="border w-[250px] h-[110px] rounded-2xl flex flex-col items-center py-5 shadow-md">
        <h1 className="font-bold text-4xl">{count || 0}</h1>
        <span className="text-2xl">{title}</span>
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

      <div className={styles.nav}>
        <h1 className="ml-6 font-bold text-2xl text-black">
          {profile.username || "Admin"}
        </h1>
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
            <div className="flex gap-3 mt-2">
              {Totals.map((v, i) => (
                <Card title={`Total ${v.name}`} key={i} count={v.total} />
              ))}
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
