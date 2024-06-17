// import React, { useEffect, useState } from "react";
// import { addDoc, collection, serverTimestamp, doc, getDoc } from "@firebase/firestore";
// import { getDownloadURL, ref } from "firebase/storage";
// import { db, auth, storage } from "../../firebase"; // Ensure the correct path to your firebase configuration

// const ConfirmationPopup = ({ onClose, clinicID, clinicName, doctorID, doctorName, timeSlot, selectedDate, setShowConfirmation }) => {
//   const [doctorProfilePic, setDoctorProfilePic] = useState("");

//   useEffect(() => {
//     const fetchDoctorProfilePic = async () => {
//       try {
//         const profilePicRef = ref(storage, `doctorProfilePics/${doctorID}`);
//         const profilePicURL = await getDownloadURL(profilePicRef);
//         setDoctorProfilePic(profilePicURL);
//       } catch (error) {
//         console.error("Error fetching doctor's profile picture:", error);
//       }
//     };

//     fetchDoctorProfilePic();
//   }, [doctorID]);

//   const handlePayment = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       return;
//     }

//     try {
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       const userName = userDoc.exists() ? userDoc.data().name : "Unknown User";

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
//         date: bookingDate,
//         timeSlot,
//         bookedAt: serverTimestamp()
//       });

//       onClose();
//     } catch (error) {
//       console.error("Error confirming booking:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
//       <div className="bg-white w-11/12 max-w-4xl p-5 rounded-md shadow-lg overflow-y-auto">
//         <div className="flex flex-col md:flex-row">
//           <div className="w-full md:w-1/2 p-4">
//             <h3 className="text-xl font-bold mb-4">Confirm Your Details</h3>
//             <p><strong>Clinic Name:</strong> {clinicName}</p>
//             <p><strong>Doctor Name:</strong> {doctorName}</p>
//             <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
//             <p><strong>Time Slot:</strong> {timeSlot}</p>
//             {doctorProfilePic && (
//               <div className="mt-4">
//                 <img src={doctorProfilePic} alt="Doctor Profile" className="rounded-md w-full md:w-1/2"/>
//               </div>
//             )}
//           </div>
//           <div className="w-full md:w-1/2 p-4">
//             <h3 className="text-xl font-bold mb-4">Payment Gateway</h3>
//             {/* Add your payment gateway component or integration here */}
//             <button
//               onClick={handlePayment}
//               className="btn bg-green-500 text-white px-4 py-2 rounded-md"
//             >
//               Pay & Confirm Booking
//             </button>
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={() => setShowConfirmation(false)}
//             className="btn bg-gray-300 text-black px-4 py-2 rounded-md"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationPopup;

import React, { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "@firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, auth, storage } from "../../firebase"; // Ensure the correct path to your firebase configuration

const ConfirmationPopup = ({ onClose, clinicID, clinicName, doctorID, doctorName, timeSlot, selectedDate, setShowConfirmation }) => {
  const [doctorProfilePic, setDoctorProfilePic] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  useEffect(() => {
    const fetchDoctorProfilePic = async () => {
      try {
        const profilePicRef = ref(storage, `doctorProfilePics/${doctorID}`);
        const profilePicURL = await getDownloadURL(profilePicRef);
        setDoctorProfilePic(profilePicURL);
      } catch (error) {
        console.error("Error fetching doctor's profile picture:", error);
      }
    };

    fetchDoctorProfilePic();
  }, [doctorID]);

  const handlePayment = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    if (!cardNumber || !expirationDate || !cvv || !cardHolderName) {
      alert("All fields are required");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userName = userDoc.exists() ? userDoc.data().name : "Unknown User";

      const [time, period] = timeSlot.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
      const bookingDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), adjustedHours, minutes);

      const paymentDocRef = await addDoc(collection(db, "payments"), {
        userID: user.uid,
        cardNumber,
        expirationDate,
        cvv,
        cardHolderName,
        amount: 100, // Add the payment amount as per your requirements
        paymentMethod,
        paidAt: serverTimestamp()
      });

      await addDoc(collection(db, "bookings"), {
        clinicID,
        clinicName,
        doctorID,
        doctorName,
        userID: user.uid,
        userName,
        date: bookingDate,
        timeSlot,
        paymentID: paymentDocRef.id,
        bookedAt: serverTimestamp()
      });

      onClose();
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white w-11/12 max-w-4xl p-5 rounded-md shadow-lg overflow-y-auto flex">
        <div className="w-full md:w-1/2 p-4 bg-green-100 rounded-md">
          <h3 className="text-xl font-bold mb-4">Confirm Your Details</h3>
          {doctorProfilePic && (
            <div className="flex justify-center mb-4">
              <img src={doctorProfilePic} alt="Doctor Profile" className="rounded-md w-32 h-32 object-cover" />
            </div>
          )}
          <p className="mb-2"><strong>Clinic Name:</strong> {clinicName}</p>
          <p className="mb-2"><strong>Doctor Name:</strong> {doctorName}</p>
          <p className="mb-2"><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
          <p className="mb-2"><strong>Time Slot:</strong> {timeSlot}</p>
          <button
            onClick={() => setShowConfirmation(false)}
            className="btn bg-gray-300 text-black px-4 py-2 rounded-md mt-4"
          >
            Back
          </button>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
          <div className="flex mb-4">
            <button
              className={`px-4 py-2 rounded-t-md ${paymentMethod === "creditCard" ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setPaymentMethod("creditCard")}
            >
              Credit Card
            </button>
            <button
              className={`px-4 py-2 rounded-t-md ${paymentMethod === "mobilePayment" ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setPaymentMethod("mobilePayment")}
            >
              Mobile Payment
            </button>
          </div>
          {paymentMethod === "creditCard" && (
            <div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Credit Card Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                  <input
                    type="text"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    placeholder="MM/YY"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  placeholder="John Doe"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          {paymentMethod === "mobilePayment" && (
            <div className="mt-4">
              {/* Add mobile payment fields if needed */}
              <p>Mobile Payment is selected.</p>
            </div>
          )}
          <button
            onClick={handlePayment}
            className="btn bg-green-500 text-white px-4 py-2 rounded-md w-full mt-4"
          >
            Pay & Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
