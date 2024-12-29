import React from "react";
import { Link } from "react-router-dom";
import style from "../css/style.module.css";
export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[300px] h-auto flex flex-col">
        <Link className={style.button} to="/login?admin">
          Admin
        </Link>

        <Link className={style.button} to="/login?employee">
          Employee
        </Link>
      </div>
    </div>
  );
}
