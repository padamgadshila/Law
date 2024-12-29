import React from "react";
import styles from "../css/style.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function Session() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="border w-[450px] flex flex-col h-auto p-5 rounded-md shadow-md">
        <h1 className="text-4xl font-bold text-center">Session Expired</h1>
        <br />
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-9xl text-red-500"
        />

        <Link
          to={"/"}
          className={styles.button}
          style={{ marginTop: "1rem", fontSize: "20px" }}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
