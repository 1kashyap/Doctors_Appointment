import React, { useEffect, useState } from "react";
import { app } from "../../firebase";
import { getFirestore, collection, getDocs, Timestamp } from "firebase/firestore";

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore(app);
        const collectionRef = collection(db, "bookings");
        const snapshot = await getDocs(collectionRef);
        const fetchedBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date:
            doc.data().date instanceof Timestamp
              ? doc.data().date.toDate()
              : doc.data().date,
        }));
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : "";
  };

  const getVisitStatus = (visit) => {
    if (!visit || visit === "postponed") {
      return (
        <div className="bg-gray-400 w-28 text-center font-semibold text-lg text-white px-2 py-1 rounded">
          Pending...
        </div>
      );
    } else if (visit === "done") {
      return (
        <div className="bg-teal-400 w-28 text-center font-semibold text-lg text-white px-2 py-1 rounded">
          Done
        </div>
      );
    } else if (visit === "cancel") {
      return (
        <div className="bg-red-400 w-28 text-center font-semibold text-lg text-white px-2 py-1 rounded">
          Cancel
        </div>
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-center text-3xl font-bold mb-4">Booking Details</h2>

      {/* Main Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-justify text-2xl">Patient's Name</th>
              <th className="py-2 px-4 border-b text-justify text-2xl">Doctor's Name</th>
              <th className="py-2 px-4 border-b text-justify text-2xl">Clinic's Name</th>
              <th className="py-2 px-4 border-b text-justify text-2xl">Date of Appointment</th>
              <th className="py-2 px-4 border-b text-justify text-2xl">Time Slot</th>
              <th className="py-2 px-4 border-b text-justify text-2xl">Visit</th>
            </tr>
          </thead>
          <tbody className="border-1 border-primaryColor rounded-md w-full">
            {bookings.map((booking) => (
             
              <tr key={booking.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-y-2 border-primaryColor text-justify text-xl">{booking.userName}</td>
                <td className="py-2 px-4 border-y-2 border-primaryColor text-justify text-xl">{booking.doctorName}</td>
                <td className="py-2 px-4 border-y-2 border-primaryColor text-justify text-xl">{booking.clinicName}</td>
                <td className="py-2 px-4 border-y-2 border-primaryColor text-justify text-xl">{formatDate(booking.date)}</td>
                <td className="py-2 px-4 border-y-2 border-primaryColor text-justify text-xl">{booking.timeSlot}</td>
                <td className="py-2 px-4 border-y-2 border-primaryColor text-justify text-xl">{getVisitStatus(booking.visit)}</td>
              </tr>
              
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingAdmin;
