import React from "react";
import { useFormik } from "formik";
import { taskValidation } from "./helpers/validation";
import { addEvent, getEvents } from "./helpers/helper";
let AddEvent = ({ toast, setEvents }) => {
  const id = localStorage.getItem("id");
  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
      time: "",
      adminId: id,
    },
    validate: taskValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let { data, status } = await addEvent(values);
        if (status === 200) {
          toast.success(data.message);
          formik.resetForm();
          await eventsData();
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error);
        }
      }
    },
  });

  let eventsData = async () => {
    try {
      const { data, status } = await getEvents(id);
      if (status === 200) {
        setEvents(data.events);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  };
  return (
    <div className="w-full h-full p-4 bg-gray-100 ">
      <h1 className="text-4xl font-bold text-black text-center">
        Event Management
      </h1>

      <div className="flex items-center justify-center gap-5 mt-10">
        <section className="mb-6 p-6 rounded-lg shadow-md bg-white w-[350px]">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Add New Event
          </h2>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="event-title" className="block text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                {...formik.getFieldProps("title")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label htmlFor="event-date" className="block text-gray-700">
                Event Date
              </label>
              <input
                type="date"
                {...formik.getFieldProps("date")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label htmlFor="event-time" className="block text-gray-700">
                Event Time
              </label>
              <input
                type="time"
                {...formik.getFieldProps("time")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <input type="hidden" {...formik.getFieldProps("adminId")} />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Event
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddEvent;
