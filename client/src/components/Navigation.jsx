import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import avatar from "./images/profile.png";
let Navigation = ({
  showSidebar,
  setShowSidebar,
  profile,
  activeTab,
  Refresh,
  showProfile,
  setShowProfile,
  query,
  setQuery,
  filters,
}) => {
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };
  let [disableFilter, setDisableFilter] = useState(false);
  return (
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
  );
};

export default Navigation;
