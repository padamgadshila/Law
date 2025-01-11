import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Client from "./Client";
import { useClientStore, useEvent, useSelectRecords } from "../store/store";
import AdminEmployee from "./AdminEmployee";
import { Profile } from "./Profile";
import AddEvent from "./AddEvent";
import Footer from "./Footer";
import Editor from "./Editor";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Documents from "./Documents";
export default function Admin() {
  const navigate = useNavigate();

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

  let filters = [
    { name: "", value: "Select Filter" },
    { name: "All", value: "All" },
    { name: "", value: "Document Type" },
    { name: "Notary", value: "Notary" },
    { name: "Subreg", value: "Subreg" },
    { name: "Only Type", value: "Only Type" },
    { name: "", value: "Select Status" },
    { name: "Active", value: "Active" },
    { name: "Pending", value: "Pending" },
    { name: "Completed", value: "Completed" },
    { name: "", value: "Clients Type" },
    { name: "Hidden Clients", value: "Hidden Clients" },
    { name: "Visible Clients", value: "Visible Clients" },
  ];
  let [inputSearch, setInputSearch] = useState();
  let [selectedFilter, setSelectedFilter] = useState("Visible Clients");
  const clientData = useClientStore((state) => state.clientData);
  const setClientData = useClientStore((state) => state.setClientData);
  const removeClient = useClientStore((state) => state.removeClient);
  let [filterClientDetails, setFilterClientDetails] = useState([]);

  useEffect(() => {
    // setFilterClientDetails(clientData);
    setSelectedFilter("Visible Clients");
  }, [clientData]);

  let [profile, setProfile] = useState({});

  let events = useEvent((state) => state.events);
  let setEvents = useEvent((state) => state.setEvents);

  let [Crud, setCrud] = useState(false);
  let selectedRecords = useSelectRecords((state) => state.selectedRecords);
  let setSelectedRecords = useSelectRecords(
    (state) => state.setSelectedRecords
  );
  let removeSelectedRecords = useSelectRecords(
    (state) => state.removeSelectedRecords
  );

  let [showEditor, setShowEditor] = useState(false);

  let handleShowEditor = () =>
    showEditor ? setShowEditor(false) : setShowEditor(true);

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
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        filters={filters}
        inputSearch={inputSearch}
        setInputSearch={setInputSearch}
        setFilterClientDetails={setFilterClientDetails}
        Crud={Crud}
        selectedRecords={selectedRecords}
        removeSelectedRecords={removeSelectedRecords}
        handleShowEditor={handleShowEditor}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        clientData={clientData}
        setClientData={setClientData}
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
            <Client
              toast={toast}
              clientData={clientData}
              filterClientDetails={filterClientDetails}
              setFilterClientDetails={setFilterClientDetails}
              setCrud={setCrud}
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              removeClient={removeClient}
              setClientData={setClientData}
            />
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

      {/* Editor */}
      <Editor
        showEditor={showEditor}
        handleShowEditor={handleShowEditor}
        selectedRecords={selectedRecords}
        setFilterClientDetails={setFilterClientDetails}
        removeSelectedRecords={removeSelectedRecords}
        removeClient={removeClient}
      />
    </div>
  );
}
