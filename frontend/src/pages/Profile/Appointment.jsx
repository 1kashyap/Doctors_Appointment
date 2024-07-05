
import React, { useState, useEffect } from "react";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import noResult from "../../assets/images/noResult.jpg";
import { Timestamp } from "firebase/firestore";
import tick from "../../assets/images/tick.jpg";
import x_mark from "../../assets/images/x_mark.jpg";

const Appointment = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsCollection = collection(db, "bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsList = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date:
          doc.data().date instanceof Timestamp
            ? doc.data().date.toDate()
            : doc.data().date,
        time:
          doc.data().time instanceof Timestamp
            ? doc.data().time.toDate()
            : doc.data().time,
      }));
      setBookings(bookingsList);
    };

    fetchBookings();
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleAction = async (id, action) => {
    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, { visit: action });
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, visit: action } : booking
      )
    );
  };

  const handlePostpone = (id) => {
    setCurrentBooking(bookings.find((booking) => booking.id === id));
    setNewDate(formatDate(currentBooking.date));
    setNewTime(formatTime(currentBooking.time));
  };

  const formatDate = (date) => {
    return date ? date.toISOString().split("T")[0] : "";
  };

  const formatTime = (time) => {
    return time ? time.toTimeString().split(" ")[0] : "";
  };

  const savePostpone = async (id) => {
    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, {
      date: new Date(newDate),
      timeSlot: newTime,
      visit: "postponed",
    });
    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              date: new Date(newDate),
              timeSlot: newTime,
              visit: "postponed",
            }
          : booking
      )
    );
    setNewDate("");
    setNewTime("");
    setCurrentBooking(null);
  };

  const cancelPostpone = () => {
    setNewDate("");
    setNewTime("");
    setCurrentBooking(null);
  };

  const renderAppointments = (type) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date

    // Filter appointments based on the type (today, future, past)
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = formatDate(booking.date);
      if (type === "today" && bookingDate === today) {
        // Only return appointments where date matches today's date
        return true;
      } else if (type === "future" && bookingDate > today) {
        return true;
      } else if (type === "past" && bookingDate < today) {
        return true;
      }
      return false;
    });

    if (filteredBookings.length === 0) {
      return (
        <p className="w-full h-96">
          <img
            src={noResult}
            alt=""
            className="h-96 w-full object-fill scale-95"
          />
        </p>
      );
    }

    // Render filtered appointments
    return filteredBookings.map((booking) => (
      <div
        key={booking.id}
        className={`booking-item border-b py-2 flex justify-between items-center ${
          type === "past" && booking.visit === "cancel"
            ? "bg-red-50 p-7 rounded-md"
            : type === "past" && booking.visit === "done"
            ? "bg-teal-50 p-7 rounded-md"
            : ""
        }`}
      >
        <div>
          <p className="text-2xl font-semibold pb-2">ID: {booking.id}</p>
          <p className="text-lg font-medium px-4 pb-1">Clinic: {booking.clinicName}</p>
          <p className="text-lg font-medium px-4 pb-1">Patient: {booking.userName}</p>
          <p className="text-lg font-medium px-4 pb-1">Date: {formatDate(booking.date)}</p>
          <p className="text-lg font-medium px-4 pb-1">Time: {booking.timeSlot}</p>
        </div>
        <div className="flex flex-col space-y-2">
          {type === "today" && (
            <>
              <button
                className="bg-green-500 text-white px-4 py-1 rounded"
                onClick={() => handleAction(booking.id, "done")}
              >
                Done
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-1 rounded"
                onClick={() => handlePostpone(booking.id)}
              >
                Postpone
              </button>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded"
                onClick={() => handleAction(booking.id, "cancel")}
              >
                Cancel
              </button>
            </>
          )}
          {type === "future" && (
            <>
              <button
                className="bg-yellow-500 text-white px-4 py-1 rounded"
                onClick={() => handlePostpone(booking.id)}
              >
                Postpone
              </button>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded"
                onClick={() => handleAction(booking.id, "cancel")}
              >
                Cancel
              </button>
            </>
          )}
          {type === "past" && (
            <>
              {booking.visit === "done" ? (
                <span className="text-green-500 text-xl">
                  <img src={tick} alt="" className="w-20 h-20 rounded-full" />
                </span>
              ) : (
                <span className="text-red-500 text-xl">
                  <img src={x_mark} alt="" className="w-20 h-20 rounded-full" />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="appointments-section px-16">
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

      {currentBooking && (
        <div className="fixed top-0 left-0 w-full h-full scale-125 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-emerald-100 bg-opacity-80 border-2 border-teal-600 w-96 h-64 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Postpone Appointment</h2>
            <label className="block mb-2">
              <span className="text-gray-700">New Date:</span>
              <input
                type="date"
                className="form-input mt-1 block w-full"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">New Time:</span>
              <input
                type="time"
                className="form-input mt-1 block w-full"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </label>
            <div className="flex justify-center">
              <button
                className="bg-teal-300 text-headingColor font-medium px-2 py-1 w-16 h-8 rounded mr-2"
                onClick={() => savePostpone(currentBooking.id)}
              >
                Save
              </button>
              <button
                className="bg-red-400 text-headingColor font-medium px-2 py-1 w-20 h-8 rounded"
                onClick={cancelPostpone}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;


