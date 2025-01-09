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
  let [totalMaleCli, setTotalMaleCli] = useState(0);
  let [totalFemaleCli, setTotalFemaleCli] = useState(0);

  let removeEvents = useEvent((state) => state.removeEvents);

  useEffect(() => {
    let getDashboardData = async () => {
      const { data, status } = await dashboardData(id);
      if (status === 200) {
        setTotalEmp(data.totalEmployee);
        setTotalCli(data.TotalClients);
        setTotalMaleCli(data.totalMaleClients);
        setTotalFemaleCli(data.totalFemaleClients);
        setEvents(data.events);
      }
    };
    getDashboardData();
  }, []);

  useEffect(() => {
    const sortedEvents = events.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });
    setEvents(sortedEvents);
  }, [events]);

  useEffect(() => {
    setTotals([
      { name: "employees", total: totalEmp },
      { name: "clients", total: totalCli },
      { name: "Male Clients", total: totalMaleCli },
      { name: "Female Clients", total: totalFemaleCli },
    ]);
  }, [totalEmp, totalCli, totalMaleCli, totalFemaleCli]);
  let Card = ({ title, count }) => {
    return (
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 w-[300px] rounded-lg shadow-md text-center">
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
          <Card title={`Total ${v.name}`} key={i} count={v.total} />
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
