
// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon
// import { auth, db } from "../../firebase"; // Ensure the correct path to your firebase configuration
// import { collection, getDocs, getDoc, doc, addDoc, serverTimestamp } from "@firebase/firestore";

// const BookingPopup = ({ onClose }) => {
//   const [clinics, setClinics] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [clinicID, setClinicID] = useState("");
//   const [doctorID, setDoctorID] = useState("");
//   const [doctorName, setDoctorName] = useState("");
//   const [timeSlot, setTimeSlot] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   useEffect(() => {
//     const fetchClinics = async () => {
//       try {
//         const clinicSnapshot = await getDocs(collection(db, "clinic")); // Corrected collection name
//         const clinicList = clinicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched Clinics:", clinicList); // Debug log
//         setClinics(clinicList);
//       } catch (error) {
//         console.error("Error fetching clinics:", error); // Debug log
//       }
//     };

//     const fetchDoctors = async () => {
//       try {
//         const userSnapshot = await getDocs(collection(db, "users"));
//         const doctorList = userSnapshot.docs
//           .filter(doc => doc.data().role === "doctor")
//           .map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log("Fetched Doctors:", doctorList); // Debug log
//         setDoctors(doctorList);
//       } catch (error) {
//         console.error("Error fetching doctors:", error); // Debug log
//       }
//     };

//     fetchClinics();
//     fetchDoctors();
//   }, []);

//   const handleBooking = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       setError("You must be logged in to book an appointment.");
//       return;
//     }

//     if (!clinicID || !doctorID || !timeSlot || !selectedDate) {
//       setError("Please select a clinic, doctor, time slot, and date.");
//       return;
//     }

//     try {
//       const clinicDoc = await getDoc(doc(db, "clinic", clinicID));
//       const clinicName = clinicDoc.exists() ? clinicDoc.data().name : "Unknown Clinic";

//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       const userName = userDoc.exists() ? userDoc.data().name : "Unknown User";

//       // Convert selectedDate and timeSlot to a timestamp
//       const [time, period] = timeSlot.split(" ");
//       const [hours, minutes] = time.split(":").map(Number);
//       const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
//       const bookingDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), adjustedHours, minutes);

//       await addDoc(collection(db, "bookings"), {
//         clinicID,
//         clinicName,
//         doctorID,
//         doctorName,
//         userID: user.uid,
//         userName,
//         timeSlot,
//         date: bookingDate,
//         bookedAt: serverTimestamp()
//       });

//       setSuccess("Appointment successfully booked!");
//       setTimeout(() => {
//         setSuccess(null);
//         onClose();
//       }, 2000);
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       setError("Failed to book the appointment. Please try again.");
//     }
//   };

//   const handleDoctorChange = (e) => {
//     const selectedDoctorID = e.target.value;
//     setDoctorID(selectedDoctorID);
//     const selectedDoctor = doctors.find(doc => doc.id === selectedDoctorID);
//     setDoctorName(selectedDoctor ? selectedDoctor.name : "");
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
//       <div className="bg-white w-11/12 max-w-3xl p-5 rounded-md shadow-lg overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {success && <p className="text-green-500 mb-4">{success}</p>}
//         <div className="mb-4">
//           <label htmlFor="clinic" className="block text-sm font-medium text-gray-700">Select Clinic:</label>
//           <select
//             id="clinic"
//             value={clinicID}
//             onChange={(e) => setClinicID(e.target.value)}
//             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           >
//             <option value="">Select a clinic</option>
//             {clinics.map(clinic => (
//               <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Select Doctor:</label>
//           <select
//             id="doctor"
//             value={doctorID}
//             onChange={handleDoctorChange}
//             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           >
//             <option value="">Select a doctor</option>
//             {doctors.map(doctor => (
//               <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date:</label>
//           <div className="relative">
//             <DatePicker
//               id="date"
//               selected={selectedDate}
//               onChange={(date) => setSelectedDate(date)}
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//             />
//             <div className="absolute inset-y-0 right-0 pr-[31.5rem] flex items-center pointer-events-none">
//               <FaCalendarAlt className="h-5 w-5 text-gray-400" aria-hidden="true" />
//             </div>
//           </div>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Select Time Slot:</label>
//           <div className="flex space-x-3">
//             {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"].map(slot => (
//               <button
//                 key={slot}
//                 onClick={() => setTimeSlot(slot)}
//                 className={`px-4 py-2 rounded-md ${timeSlot === slot ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
//               >
//                 {slot}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={handleBooking}
//             className="btn bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Book Appointment
//           </button>
//           <button
//             onClick={onClose}
//             className="btn bg-gray-300 text-black px-4 py-2 rounded-md"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPopup;


import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon
import { auth, db } from "../../firebase"; // Ensure the correct path to your firebase configuration
import { collection, getDocs, getDoc } from "@firebase/firestore";
import ConfirmationPopup from './ConfirmationPopup'; // Ensure the correct path to your ConfirmationPopup component

const BookingPopup = ({ onClose }) => {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinicID, setClinicID] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [doctorID, setDoctorID] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const clinicSnapshot = await getDocs(collection(db, "clinic")); // Corrected collection name
        const clinicList = clinicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Clinics:", clinicList); // Debug log
        setClinics(clinicList);
      } catch (error) {
        console.error("Error fetching clinics:", error); // Debug log
      }
    };

    const fetchDoctors = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        const doctorList = userSnapshot.docs
          .filter(doc => doc.data().role === "doctor")
          .map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Doctors:", doctorList); // Debug log
        setDoctors(doctorList);
      } catch (error) {
        console.error("Error fetching doctors:", error); // Debug log
      }
    };

    fetchClinics();
    fetchDoctors();
  }, []);

  const handleBooking = () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to book an appointment.");
      return;
    }

    if (!clinicID || !doctorID || !timeSlot || !selectedDate) {
      setError("Please select a clinic, doctor, time slot, and date.");
      return;
    }

    const selectedClinic = clinics.find(clinic => clinic.id === clinicID);
    setClinicName(selectedClinic ? selectedClinic.name : "");

    setShowConfirmation(true);
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorID = e.target.value;
    setDoctorID(selectedDoctorID);
    const selectedDoctor = doctors.find(doc => doc.id === selectedDoctorID);
    setDoctorName(selectedDoctor ? selectedDoctor.name : "");
  };

  return (
    <>
      {showConfirmation ? (
        <ConfirmationPopup
          onClose={onClose}
          clinicID={clinicID}
          clinicName={clinicName}
          doctorID={doctorID}
          doctorName={doctorName}
          timeSlot={timeSlot}
          selectedDate={selectedDate}
          setShowConfirmation={setShowConfirmation}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="bg-white w-11/12 max-w-3xl p-5 rounded-md shadow-lg overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="clinic" className="block text-sm font-medium text-gray-700">Select Clinic:</label>
              <select
                id="clinic"
                value={clinicID}
                onChange={(e) => setClinicID(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a clinic</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Select Doctor:</label>
              <select
                id="doctor"
                value={doctorID}
                onChange={handleDoctorChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date:</label>
              <div className="relative">
                <DatePicker
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                <div className="absolute inset-y-0 right-0 pr-[23rem] flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Time Slot:</label>
              <div className="flex space-x-3">
                {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"].map(slot => (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`px-4 py-2 rounded-md ${timeSlot === slot ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleBooking}
                className="btn bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Proceed to Payment
              </button>
              <button
                onClick={onClose}
                className="btn bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPopup;
