// import React, { useState } from "react";

// // Import your components for different pages
// import Users from "./UserAdmin";
// import Doctors from "./DoctorAdmin";
// import Clinics from "./ClinicAdmin";
// import Booking from "./BookingAdmin";
// import Payment from "./PaymentAdmin";

// const AdminPage = () => {
//   // State to track the selected tab
//   const [selectedTab, setSelectedTab] = useState("Users");

//   // Function to render the selected tab content
//   const renderContent = () => {
//     switch (selectedTab) {
//       case "Users":
//         return <Users />;
//       case "Doctors":
//         return <Doctors />;
//       case "Clinics":
//         return <Clinics />;
//       case "Booking":
//         return <Booking />;
//       case "Payment":
//         return <Payment />;
//       default:
//         return <Users />;
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Top Part */}
//       <div className="h-1/6 bg-primaryColor flex">
//         <h1 className="text-7xl font-bold mt-10 ml-10">Admin Dashboard</h1>
//       </div>

//       <div className="flex flex-1">
//         {/* Side Part */}
//         <div className="w-1/5 bg-teal-50 p-4">
//           <ul>
//             <li>
//               <button
//                 className={`w-full text-headingColor cursor-pointer text-xl text-justify p-2 rounded-lg mt-3 ${
//                   selectedTab === "Users"
//                     ? "text-primaryColor text-3xl font-bold border-b-[3px] border-solid rounded-2xl border-primaryColor"
//                     : "hover:bg-teal-100"
//                 }`}
//                 onClick={() => setSelectedTab("Users")}
//               >
//                 <h6 className="mx-32 my-2">Users</h6>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`w-full text-headingColor cursor-pointer text-xl text-justify p-2 rounded-lg mt-3 ${
//                   selectedTab === "Doctors"
//                     ? "text-primaryColor text-3xl font-bold border-b-[3px] border-solid rounded-2xl border-primaryColor"
//                     : "hover:bg-teal-100"
//                 }`}
//                 onClick={() => setSelectedTab("Doctors")}
//               >
//                 <h6 className="mx-32 my-2">Doctors</h6>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`w-full text-headingColor cursor-pointer text-xl text-justify p-2 rounded-lg mt-3 ${
//                   selectedTab === "Clinics"
//                     ? "text-primaryColor text-3xl font-bold border-b-[3px] border-solid rounded-2xl border-primaryColor"
//                     : "hover:bg-teal-100"
//                 }`}
//                 onClick={() => setSelectedTab("Clinics")}
//               >
//                 <h6 className="mx-32 my-2">Clinics</h6>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`w-full text-headingColor cursor-pointer text-xl text-justify p-2 rounded-lg mt-3 ${
//                   selectedTab === "Booking"
//                     ? "text-primaryColor text-3xl font-bold border-b-[3px] border-solid rounded-2xl border-primaryColor"
//                     : "hover:bg-teal-100"
//                 }`}
//                 onClick={() => setSelectedTab("Booking")}
//               >
//                 <h6 className="mx-32 my-2">Booking</h6>
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`w-full text-headingColor cursor-pointer text-xl text-justify p-2 rounded-lg mt-3 ${
//                   selectedTab === "Payment"
//                     ? "text-primaryColor text-3xl font-bold border-b-[3px] border-solid rounded-2xl border-primaryColor"
//                     : "hover:bg-teal-100"
//                 }`}
//                 onClick={() => setSelectedTab("Payment")}
//               >
//                 <h6 className="mx-32 my-2">Payment</h6>
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Main Part */}
//         <div className="w-4/5 p-4">{renderContent()}</div>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;

import React, { useState } from "react";

// Import your components for different pages
import Users from "./UserAdmin";
import Doctors from "./DoctorAdmin";
import Clinics from "./ClinicAdmin";
import Booking from "./BookingAdmin";
import Payment from "./PaymentAdmin";

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
      case "Payment":
        return <Payment />;
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
        <button
          className={`flex-1 text-headingColor cursor-pointer text-xl p-2 rounded-lg ${
            selectedTab === "Payment"
              ? "text-primaryColor rounded-xl font-bold border-b-4 border-primaryColor bg-gradient-to-b from-slate-50 via-slate-50 to-teal-100"
              : "hover:bg-teal-100"
          }`}
          onClick={() => setSelectedTab("Payment")}
        >
          Payment
        </button>
      </div>

      {/* Main Part */}
      <div className="flex-1 p-4">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
