import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
let Documents = ({ showAddDocument, handleAddDocumentDisplay, clientData }) => {
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
  return (
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
  );
};

export default Documents;
