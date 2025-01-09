import React, { useEffect, useState } from "react";
import avatar from "./images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUserTie,
  faUser,
  faSyncAlt,
  faBars,
  faClose,
  faCalendarDays,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Client from "./Client";
import { dashboardData, deleteEvent, getClients } from "./helpers/helper";
import { useClientStore, useEmployeeStore, useEvent } from "../store/store";
import AdminEmployee from "./AdminEmployee";
import { Profile } from "./Profile";
import AddEvent from "./AddEvent";
import Footer from "./Footer";
export default function Admin() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  let [activeTab, setActiveTab] = useState(() => {
    return parseInt(localStorage.getItem("activeTab")) || 0;
  });
  let [showAddDocument, setShowAddDocument] = useState(false);
  let handleAddDocumentDisplay = () =>
    showAddDocument ? setShowAddDocument(false) : setShowAddDocument(true);
  let tabs = [
    { name: "Dashboard", icon: faTachometerAlt, option: [] },
    {
      name: "Employee",
      icon: faUserTie,
      option: [{ name: "Add employee", link: "/addEmployee" }],
    },
    {
      name: "Client",
      icon: faUser,
      option: [
        { name: "Add client", link: "/addClient" },
        {
          name: "Documents",
          click: handleAddDocumentDisplay,
        },
      ],
    },
    {
      name: "Add Event",
      icon: faCalendarDays,
      option: [],
    },
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };
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

  let [totalEmp, setTotalEmp] = useState(0);
  let [totalCli, setTotalCli] = useState(0);
  let [totalMaleCli, setTotalMaleCli] = useState(0);
  let [totalFemaleCli, setTotalFemaleCli] = useState(0);

  let events = useEvent((state) => state.events);
  let setEvents = useEvent((state) => state.setEvents);
  let removeEvents = useEvent((state) => state.removeEvents);

  useEffect(() => {
    let getDashboardData = async () => {
      const { data, status } = await dashboardData(id);
      if (status === 200) {
        setTotalEmp(data.totalEmployee);
        setTotalCli(data.TotalClients);
        setTotalMaleCli(data.totalMaleClients);
        setTotalFemaleCli(data.totalFemaleClients);
        setEvents(data.events);
      }
    };
    getDashboardData();
  }, []);

  useEffect(() => {
    const sortedEvents = events.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });
    setEvents(sortedEvents);
  }, [events]);

  useEffect(() => {
    setTotals([
      { name: "employees", total: totalEmp },
      { name: "clients", total: totalCli },
      { name: "Male Clients", total: totalMaleCli },
      { name: "Female Clients", total: totalFemaleCli },
    ]);
  }, [totalEmp, totalCli, totalMaleCli, totalFemaleCli]);

  let Card = ({ title, count }) => {
    return (
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 w-[300px] rounded-lg shadow-md text-center">
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

  // add Document functionality

  const [searchInput, setSearchInput] = useState("");
  const [filteredClients, setFilteredClients] = useState(clientData);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value.toLowerCase());
    let filtered = clientData.filter((client) => {
      return (
        client._id.toLowerCase().includes(value) ||
        client.fname.toLowerCase().includes(value) ||
        client.mname.toLowerCase().includes(value) ||
        client.lname.toLowerCase().includes(value)
      );
    });
    setFilteredClients(filtered);
  };

  let delEvents = async (id) => {
    try {
      const { data, status } = await deleteEvent(id);
      if (status === 200) {
        toast.success(data.message);
        removeEvents(id);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };
  return (
    <div className="w-full h-screen relative">
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

      {/* Navigation bar */}
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
          className={`bg-[#2d3748] z-10 w-[270px] h-[calc(100vh-70px)] fixed p-2 transform transition-all duration-300 ease-in-out ${
            showSidebar ? "translate-x-0" : "translate-x-[-100%]"
          }`}
        >
          <ul className="text-white">
            {tabs.map((tab, i) => (
              <>
                <li
                  key={i}
                  className={`flex items-center my-2 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-700" ${
                    activeTab === i ? "bg-gray-600" : " "
                  }`}
                  onClick={() => {
                    setActiveTab(i);

                    handleDropdownToggle(i);
                  }}
                >
                  <FontAwesomeIcon
                    icon={tab.icon}
                    className="text-[22px] w-[20px] h-[23px]"
                  />
                  <span className="inline-block ml-5 text-[23px]">
                    {tab.name}
                  </span>
                </li>
                {activeDropdown === i && tab.option.length > 0 && (
                  <ul className="ml-10 border-l-4 border-gray-600">
                    {tab.option.map((subTab, index) => (
                      <li
                        className="cursor-pointer text-xl px-6 hover:bg-gray-700 rounded-md"
                        key={index}
                      >
                        {subTab.link ? (
                          <Link to={subTab.link}>{subTab.name}</Link>
                        ) : (
                          <button onClick={subTab.click}>{subTab.name}</button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div
          className={`relative overflow-y-scroll  h-[calc(100vh-70px)]  border-gray-300 transition-all duration-300 ease-in-out transform ${
            showSidebar ? "w-[calc(100%-270px)] translate-x-[270px]" : "w-full"
          }`}
        >
          {activeTab === 0 && (
            <div className="px-7 py-5">
              <h1 className="font-bold text-2xl text-gray-700 ml-3">
                Overview
              </h1>
              <div className="flex gap-3 mt-2">
                {Totals.map((v, i) => (
                  <Card title={`Total ${v.name}`} key={i} count={v.total} />
                ))}
              </div>

              <section className="section-container p-6 rounded-lg shadow-md w-[500px] mt-5 bg-white border">
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                  Upcoming Events
                </h2>
                <div className="scrolling-list group relative w-full h-[150px] overflow-hidden">
                  <ul className="animate-scroll-vertical absolute w-full group-hover:animation-paused">
                    {events.map((data, i) => (
                      <li key={i}>
                        <div className="border relative rounded-md my-4 p-4 ">
                          <h3 className="text-2xl w-full font-semibold">
                            {data.title}
                          </h3>
                          <p className="text-gray-600 text-xl">
                            {data.date} at {data.time}
                          </p>
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => delEvents(data._id)}
                            className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2 text-2xl text-red-500 hover:text-red-700"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
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
          {/* Add Event */}
          {activeTab === 3 && (
            <AddEvent toast={toast} events={events} setEvents={setEvents} />
          )}
        </div>
      </div>

      {/* Add Documents */}
      <div
        className={`absolute bg-[rgba(0,0,0,.3)] backdrop-blur-md w-full h-full top-0 right-0 z-50 overflow-hidden ${
          showAddDocument ? "block" : "hidden"
        }`}
      >
        <FontAwesomeIcon
          icon={faClose}
          className="absolute top-3 text-3xl px-[10px] py-[6px] rounded-full cursor-pointer right-3 text-white bg-blue-400 ]"
          onClick={handleAddDocumentDisplay}
        />
        <input
          type="text"
          placeholder="Client Id, Name"
          value={searchInput}
          onChange={handleSearch}
          className="w-[360px] h-[50px] rounded-md outline-none px-5 text-xl absolute top-4 left-1/2 -translate-x-1/2 shadow-md"
        />

        <div className="w-[360px]  min-auto max-h-full py-3 px-2 bg-white rounded-md absolute top-20 left-1/2 -translate-x-1/2 shadow-md">
          <ul className="h-full">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, i) => (
                <li
                  key={i}
                  className="mt-1 rounded-md hover:bg-gray-300 relative group"
                >
                  {client.fileUploaded === "No" && (
                    <Link
                      className="block py-2 px-3 absolute top-0 left-0 opacity-0 transition-all duration-300 w-[150px] rounded-md group-hover:left-[-160px] shadow-md group-hover:opacity-100 bg-green-500 text-white"
                      to={`/addClientDocuments?id=${client._id}`}
                    >
                      Add Documents
                    </Link>
                  )}
                  <span className="block py-2 px-3">
                    {client.fname} {client.mname} {client.lname}
                  </span>
                  {client.fileUploaded === "Yes" && (
                    <Link
                      className="block py-2 px-3 absolute top-0 right-0 opacity-0 transition-all duration-300 w-[150px] rounded-md group-hover:right-[-160px] shadow-md group-hover:opacity-100 bg-blue-500 text-white"
                      to={`/viewDocuments?id=${client._id}`}
                    >
                      View Documents
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li>No Clients Found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
