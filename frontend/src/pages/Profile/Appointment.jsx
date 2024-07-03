import React, { useState } from "react";
import { AiOutlineDoubleRight } from "react-icons/ai";
import noResult from "../../assets/images/noResult.jpg";

const Appointment = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderAppointments = (type) => {
    switch (type) {
      case "future":
        return (
          <p className="w-full h-96">
            <img src={noResult} alt="" className="h-96 w-full object-fill scale-95"/>
          </p>
        );
      case "today":
        return (
          <p className="text_para">Today's appointments will be listed here.</p>
        );
      case "past":
        return (
          <p className="text_para">Past appointments will be listed here.</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="appointments-section">
      <div className="appointment-bar mb-4 border border-gray-300 rounded w-full">
        <button
          className="appointment-bar-button py-2 px-5 w-full text-left text-[16px] leading-7 text-headingColor font-semibold flex justify-between items-center"
          onClick={() => toggleSection("future")}
        >
          Future Appointments
          <span
            className={`transform transition-transform scale-125 ${
              activeSection === "future" ? "rotate-[270deg]" : "rotate-90"
            }`}
          >
            <AiOutlineDoubleRight />
          </span>
        </button>
        {activeSection === "future" && (
          <div className="appointment-content p-4 bg-gray-100 rounded border-t border-gray-300">
            {renderAppointments("future")}
          </div>
        )}
      </div>
      <div className="appointment-bar mb-4 border border-gray-300 rounded w-full">
        <button
          className="appointment-bar-button py-2 px-5 w-full text-left text-[16px] leading-7 text-headingColor font-semibold flex justify-between items-center"
          onClick={() => toggleSection("today")}
        >
          Today's Appointments
          <span
            className={`transform transition-transform scale-125 ${
              activeSection === "today" ? "rotate-[270deg]" : "rotate-90"
            }`}
          >
            <AiOutlineDoubleRight />
          </span>
        </button>
        {activeSection === "today" && (
          <div className="appointment-content p-4 bg-gray-100 rounded border-t border-gray-300">
            {renderAppointments("today")}
          </div>
        )}
      </div>
      <div className="appointment-bar mb-4 border border-gray-300 rounded w-full">
        <button
          className="appointment-bar-button py-2 px-5 w-full text-left text-[16px] leading-7 text-headingColor font-semibold flex justify-between items-center"
          onClick={() => toggleSection("past")}
        >
          Past Appointments
          <span
            className={`transform transition-transform scale-125 ${
              activeSection === "past" ? "rotate-[270deg]" : "rotate-90"
            }`}
          >
            <AiOutlineDoubleRight />
          </span>
        </button>
        {activeSection === "past" && (
          <div className="appointment-content p-4 bg-gray-100 rounded border-t border-gray-300">
            {renderAppointments("past")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
