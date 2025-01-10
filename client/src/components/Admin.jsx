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

  // client search and filter
  let [query, setQuery] = useState({ search: "", filter: "" });

  let filters = [
    { name: "all", value: "All" },
    { name: "hide", value: "Hidden Clients" },
    {
      name: "caseType",
      value: "Case type",
      subOptions: [
        "Criminal",
        "Property",
        "Divorce",
        "Family",
        "Civil",
        "Others",
      ],
    },
    {
      name: "docType",
      value: "Document type",
      subOptions: ["Notary", "Subreg", "Only Type"],
    },
    {
      name: "status",
      value: "Status",
      subOptions: ["Active", "Pending", "Completed"],
    },
  ];
  let [inputSearch, setInputSearch] = useState();
  const clientData = useClientStore((state) => state.clientData);
  let [hiddenClients, setHiddenClients] = useState(
    clientData.filter((data) => data.hide === true)
  );
  let [unHideClients, setUnHiddenClients] = useState(
    clientData.filter((data) => data.hide === false)
  );
  let [filterClientDetails, setFilterClientDetails] = useState(unHideClients);

  useEffect(() => {
    setFilterClientDetails(clientData.filter((data) => data.hide === false));
    setHiddenClients(clientData.filter((data) => data.hide === true));
    setUnHiddenClients(clientData.filter((data) => data.hide === false));
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

  let [selectedFilter, setSelectedFilter] = useState("");
  let [selectedSubOption, setSelectedSubOption] = useState("");
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
        inputSearch={inputSearch}
        setInputSearch={setInputSearch}
        setFilterClientDetails={setFilterClientDetails}
        Crud={Crud}
        selectedRecords={selectedRecords}
        removeSelectedRecords={removeSelectedRecords}
        handleShowEditor={handleShowEditor}
        unHideClients={unHideClients}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedSubOption={selectedSubOption}
        setSelectedSubOption={setSelectedSubOption}
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
              query={query}
              toast={toast}
              clientData={clientData}
              filterClientDetails={filterClientDetails}
              setFilterClientDetails={setFilterClientDetails}
              Crud={Crud}
              setCrud={setCrud}
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
              selectedFilter={selectedFilter}
              selectedSubOption={selectedSubOption}
              unHideClients={unHideClients}
              hiddenClients={hiddenClients}
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
      />
    </div>
  );
}
