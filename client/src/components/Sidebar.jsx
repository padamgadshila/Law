import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUserTie,
  faUser,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
let Sidebar = ({
  showSidebar,
  handleAddDocumentDisplay,
  activeTab,
  setActiveTab,
}) => {
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };
  return (
    <div
      className={`bg-[#2d3748] z-10 w-[270px] h-[calc(100vh-70px)] fixed p-2 transform transition-all duration-300 ease-in-out ${
        showSidebar ? "translate-x-0" : "translate-x-[-100%]"
      }`}
    >
      <ul className="text-white">
        {tabs.map((tab, i) => (
          <React.Fragment key={i}>
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
              <span className="inline-block ml-5 text-[23px]">{tab.name}</span>
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
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
