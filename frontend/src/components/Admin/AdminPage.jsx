

import React, { useState } from "react";

// Import your components for different pages
import Users from "./UserAdmin";
import Doctors from "./DoctorAdmin";
import Clinics from "./ClinicAdmin";
import Booking from "./BookingAdmin";


const AdminPage = () => {
  // State to track the selected tab
  const [selectedTab, setSelectedTab] = useState("Users");

  // Function to render the selected tab content
  const renderContent = () => {
    switch (selectedTab) {
      case "Users":
        return <Users />;
      case "Doctors":
        return <Doctors />;
      case "Clinics":
        return <Clinics />;
      case "Booking":
        return <Booking />;
      
      default:
        return <Users />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Part */}
      <div className="h-28  bg-gradient-to-br from-teal-100 via-slate-50 to-slate-50 flex items-center justify-between px-10">
        <h1 className="text-7xl font-bold mt-4">Admin Dashboard</h1>
      </div>

      {/* Horizontal Side Part */}
      <div className="flex bg-gradient-to-t from-teal-50 via-slate-50 to-slate-50 p-4">
        <button
          className={`flex-1 text-headingColor cursor-pointer text-xl p-2 rounded-lg ${
            selectedTab === "Users"
              ? "text-primaryColor rounded-xl font-bold border-b-4 border-primaryColor bg-gradient-to-b from-slate-50 via-slate-50 to-teal-100"
              : "hover:bg-teal-100"
          }`}
          onClick={() => setSelectedTab("Users")}
        >
          Users
        </button>
        <button
          className={`flex-1 text-headingColor cursor-pointer text-xl p-2 rounded-lg ${
            selectedTab === "Doctors"
              ? "text-primaryColor rounded-xl font-bold border-b-4 border-primaryColor bg-gradient-to-b from-slate-50 via-slate-50 to-teal-100"
              : "hover:bg-teal-100"
          }`}
          onClick={() => setSelectedTab("Doctors")}
        >
          Doctors
        </button>
        <button
          className={`flex-1 text-headingColor cursor-pointer text-xl p-2 rounded-lg ${
            selectedTab === "Clinics"
              ? "text-primaryColor rounded-xl font-bold border-b-4 border-primaryColor bg-gradient-to-b from-slate-50 via-slate-50 to-teal-100"
              : "hover:bg-teal-100"
          }`}
          onClick={() => setSelectedTab("Clinics")}
        >
          Clinics
        </button>
         <button
          className={`flex-1 text-headingColor cursor-pointer text-xl p-2 rounded-lg ${
            selectedTab === "Booking"
              ? "text-primaryColor rounded-xl font-bold border-b-4 border-primaryColor bg-gradient-to-b from-slate-50 via-slate-50 to-teal-100"
              : "hover:bg-teal-100"
          }`}
          onClick={() => setSelectedTab("Booking")}
        >
          Booking
        </button>
        
      </div>

      {/* Main Part */}
      <div className="flex-1 p-4">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
