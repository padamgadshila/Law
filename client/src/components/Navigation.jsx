import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClose,
  faEyeSlash,
  faPenToSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import avatar from "./images/profile.png";
import { bulkDelete, bulkHide, getClients } from "./helpers/helper";
import toast from "react-hot-toast";
import { useClientStore } from "../store/store";
let Navigation = ({
  showSidebar,
  setShowSidebar,
  profile,
  activeTab,
  showProfile,
  setShowProfile,

  filters,
  setInputSearch,
  inputSearch,
  setFilterClientDetails,
  Crud,
  selectedRecords,
  removeSelectedRecords,
  handleShowEditor,

  selectedFilter,
  setSelectedFilter,
  setClientData,
  clientData,
}) => {
  const removeClient = useClientStore((state) => state.removeClient);
  let deleteMany = async () => {
    try {
      const { data, status } = await bulkDelete(selectedRecords);
      if (status === 200) {
        toast.success(data.message);
        selectedRecords.forEach((id) => {
          removeClient(id);
          removeSelectedRecords(id);
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    setInputSearch(value.toLowerCase());
    let filtered = clientData.filter((client) => {
      return (
        (client._id?.toLowerCase() || "").includes(value) ||
        (client.docNo?.toLowerCase() || "").includes(value) ||
        (client.fname?.toLowerCase() || "").includes(value) ||
        (client.mname?.toLowerCase() || "").includes(value) ||
        (client.lname?.toLowerCase() || "").includes(value) ||
        (client.email?.toLowerCase() || "").includes(value) ||
        (client.mobile?.toLowerCase() || "").includes(value) ||
        (client.caseType?.toLowerCase() || "").includes(value) ||
        (client.docType?.toLowerCase() || "").includes(value) ||
        (client.gender?.toLowerCase() || "").includes(value) ||
        (client.dob?.toLowerCase() || "").includes(value) ||
        (client.address?.state?.toLowerCase() || "").includes(value) ||
        (client.address?.city?.toLowerCase() || "").includes(value) ||
        (client.address?.village?.toLowerCase() || "").includes(value) ||
        (client.address?.pincode?.toLowerCase() || "").includes(value) ||
        (client.status?.toLowerCase() || "").includes(value) ||
        (client.fileUploaded?.toLowerCase() || "").includes(value)
      );
    });
    setFilterClientDetails(filtered);
    setSelectedFilter("All");
  };

  // hide
  let hideMany = async () => {
    try {
      const { data, status } = await bulkHide(selectedRecords);
      if (status === 200) {
        toast.success(data.message);
        selectedRecords.forEach((id) => {
          removeSelectedRecords(id);
        });
        await getClientData();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };
  const getClientData = async () => {
    try {
      const { data, status } = await getClients();
      if (status === 201) {
        setClientData(data.clientData);
        // setFilterClientDetails(data.clientData);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching data.");
    }
  };
  const handleFilter = (e) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-lg flex items-center justify-between w-full mx-auto h-[70px]">
      <div
        className={`w-full h-[70px] bg-[rgba(0,0,0,.3)] backdrop-blur-sm absolute top-0 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center ${
          Crud ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="bg-white shadow-md rounded-md flex items-center justify-evenly w-[500px] h-[60px]">
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="text-red-500 text-3xl cursor-pointer"
            title="Delete"
            onClick={deleteMany}
          />
          <FontAwesomeIcon
            icon={faEyeSlash}
            className="text-blue-500 text-3xl cursor-pointer"
            title="Hide"
            onClick={hideMany}
          />
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="text-green-500 text-3xl cursor-pointer"
            title="Hide"
            onClick={handleShowEditor}
          />
        </div>
      </div>
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
            value={inputSearch}
            onChange={handleOnChange}
            name="search"
            className="bg-white text-black w-[250px] h-[50px] rounded-l-xl outline-none pl-3 text-xl"
          />
          <select
            value={selectedFilter}
            onChange={handleFilter}
            name="filter"
            className="bg-white font-bold text-black cursor-pointer w-[200px] h-[50px] outline-none appearance-none px-2 text-[22px] rounded-r-xl text-center"
          >
            {filters.map((o, i) => (
              <option
                value={o.name}
                disabled={o.name === "" ? true : false}
                key={i}
              >
                {o.value}
              </option>
            ))}
          </select>
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
  );
};

export default Navigation;
