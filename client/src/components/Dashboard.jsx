import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEvent } from "../store/store";
import { dashboardData, deleteEvent } from "./helpers/helper";
let Dashboard = ({ toast, setEvents, events }) => {
  const id = localStorage.getItem("id");
  let [Totals, setTotals] = useState([{}]);

  let [totalEmp, setTotalEmp] = useState(0);
  let [totalCli, setTotalCli] = useState(0);
  let [totalFiles, setTotalFiles] = useState(0);
  let [activeClients, setActiveClients] = useState(0);
  let [completedClients, setCompletedClients] = useState(0);

  let removeEvents = useEvent((state) => state.removeEvents);

  useEffect(() => {
    let getDashboardData = async () => {
      const { data, status } = await dashboardData(id);
      if (status === 200) {
        setTotalEmp(data?.totalEmployee);
        setTotalCli(data?.TotalClients);
        setTotalFiles(data?.totalFiles);
        setActiveClients(data?.activeClients);
        setCompletedClients(data?.completedClients);
        setEvents(data?.events);
      }
    };
    getDashboardData();
  }, [id, setEvents]);

  useEffect(() => {
    const sortedEvents = events.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });
    setEvents(sortedEvents);
  }, [events, setEvents]);

  useEffect(() => {
    setTotals([
      { name: "Total employees", total: totalEmp },
      { name: "Total clients", total: totalCli },
      { name: "Active Clients", total: activeClients },
      { name: "Completed", total: completedClients },
      { name: "Total documents", total: totalFiles },
    ]);
  }, [totalEmp, totalCli, activeClients, completedClients, totalFiles, events]);
  let Card = ({ title, count, index }) => {
    return (
      <div
        className={`bg-gradient-to-r  text-white flex flex-col p-6 w-[260px] rounded-lg shadow-md text-center ${
          index === 0 ? "from-green-400 to-blue-500" : ""
        } ${index === 1 ? "from-yellow-400 to-orange-500" : ""} 
         ${index === 2 ? "from-indigo-400 to-purple-500" : ""}
         ${index === 3 ? "from-pink-400 to-red-500" : ""}
         ${index === 4 ? "from-blue-400 to-green-500" : ""}
        
        `}
      >
        <span className="text-2xl">{title}</span>
        <h1 className="font-bold text-4xl">{count || 0}</h1>
      </div>
    );
  };

  let delEvents = async (id) => {
    try {
      const { data, status } = await deleteEvent(id);
      if (status === 200) {
        toast.success(data.message);
        removeEvents(id);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div className="px-7 py-5">
      <h1 className="font-bold text-2xl text-gray-700 ml-3">Overview</h1>
      <div className="flex gap-3 mt-2">
        {Totals.map((v, i) => (
          <Card title={v.name} key={i} index={i} count={v.total} />
        ))}
      </div>

      <section className="section-container p-6 rounded-lg shadow-md w-[500px] mt-5 bg-white border">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Upcoming Events
        </h2>
        <div className="scrolling-list group relative w-full h-[150px] overflow-hidden">
          <ul className="animate-scroll-vertical absolute w-full group-hover:animation-paused">
            {events.map((data, i) => (
              <li key={i}>
                <div className="border relative rounded-md my-4 p-4 ">
                  <h3 className="text-2xl w-full font-semibold">
                    {data.title}
                  </h3>
                  <p className="text-gray-600 text-xl">
                    {data.date} at {data.time}
                  </p>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => delEvents(data._id)}
                    className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2 text-2xl text-red-500 hover:text-red-700"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
