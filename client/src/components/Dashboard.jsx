import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Dashboard() {
  return (
    <div className="w-[8in] mx-auto p-5 border mt-5">
      <h1 className="mt-5 font-bold text-3xl text-black text-center">
        Client Information
      </h1>
      <br />
      <h1>Personal Information</h1>
      <div className="flex items-center">
        <span className="border px-3 py-2 w-full block">
          <b>Client Id: </b> 12345t622323
        </span>
        <span className="border px-3 py-2 w-full block">
          <b>Full name: </b> Harry James Potter
        </span>
      </div>
      <div className="flex items-center">
        <span className="border px-3 py-2 w-full block">
          <b>Mobile no: </b> Harry James Potter
        </span>
        <span className="border px-3 py-2 w-full block">
          <b>Email: </b> harry@gmail.com
        </span>
      </div>
      <div className="flex items-center">
        <span className="border px-3 py-2 w-full block">
          <b>Dob: </b> 14/4/2003
        </span>
        <span className="border px-3 py-2 w-full block">
          <b>Address: </b>Pune, Khadki, 411003
        </span>
      </div>
      <div className="flex items-center">
        <span className="border px-3 py-2 w-full block">
          <b>Case Type: </b> Criminal
        </span>
        <span className="border px-3 py-2 w-full block">
          <b>Documents Attached: </b> Yes
        </span>
      </div>

      <h1>Documents Attached</h1>
      <div className="w-full flex flex-col">
        <span>Aadhar card</span>
        <span>Aadhar card</span>
        <span>Aadhar card</span>
        <span>Aadhar card</span>
        <span>Aadhar card</span>
        <span>Aadhar card</span>
        <span>Aadhar card</span>
        <br />
      </div>
    </div>
  );
}
