import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Client from "./Client";
import { useClientStore, useEvent } from "../store/store";
import AdminEmployee from "./AdminEmployee";
import { Profile } from "./Profile";
import AddEvent from "./AddEvent";
import Footer from "./Footer";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Documents from "./Documents";
export default function Admin() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");

  // sidebar tabs
  let [activeTab, setActiveTab] = useState(() => {
    return parseInt(localStorage.getItem("activeTab")) || 0;
  });
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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
  // add and view documents
  let [showAddDocument, setShowAddDocument] = useState(false);
  let handleAddDocumentDisplay = () =>
    showAddDocument ? setShowAddDocument(false) : setShowAddDocument(true);

  // profile pop up
  let [showProfile, setShowProfile] = useState(false);

  // show sidebar
  let [showSidebar, setShowSidebar] = useState(false);

  // client search and filter
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

  const clientData = useClientStore((state) => state.clientData);
  // dashboard data

  let [profile, setProfile] = useState({});

  let events = useEvent((state) => state.events);
  let setEvents = useEvent((state) => state.setEvents);
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
      <Navigation
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        profile={profile}
        activeTab={activeTab}
        query={query}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        setQuery={setQuery}
        filters={filters}
      />
      {/* Main Page */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          showSidebar={showSidebar}
          handleAddDocumentDisplay={handleAddDocumentDisplay}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* Content Area */}
        <div
          className={`relative overflow-y-scroll  h-[calc(100vh-70px)]  border-gray-300 transition-all duration-300 ease-in-out transform ${
            showSidebar ? "w-[calc(100%-270px)] translate-x-[270px]" : "w-full"
          }`}
        >
          {activeTab === 0 && (
            <Dashboard events={events} setEvents={setEvents} toast={toast} />
          )}
          {activeTab === 1 && <AdminEmployee toast={toast} />}
          {activeTab === 2 && (
            <Client query={query} toast={toast} clientData={clientData} />
          )}
          {/* Add Event */}
          {activeTab === 3 && (
            <AddEvent toast={toast} events={events} setEvents={setEvents} />
          )}
        </div>
      </div>

      {/* Add Documents */}

      <Documents
        showAddDocument={showAddDocument}
        handleAddDocumentDisplay={handleAddDocumentDisplay}
        clientData={clientData}
      />
    </div>
  );
}
