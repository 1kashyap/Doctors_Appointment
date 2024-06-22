// import React, { useEffect, useState } from "react";
// import { addDoc, collection, serverTimestamp, doc, getDoc } from "@firebase/firestore";
// import { getDownloadURL, ref } from "firebase/storage";
// import { db, auth, storage } from "../../firebase"; // Ensure the correct path to your firebase configuration

// const ConfirmationPopup = ({ onClose, clinicID, clinicName, doctorID, doctorName, timeSlot, selectedDate, setShowConfirmation }) => {
//   const [doctorProfilePic, setDoctorProfilePic] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("creditCard");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expirationDate, setExpirationDate] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [cardHolderName, setCardHolderName] = useState("");
//   const [amount] = useState(1500); // Fixed amount of ₹1500

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

//     if (!cardNumber || !expirationDate || !cvv || !cardHolderName) {
//       alert("All fields are required");
//       return;
//     }

//     try {
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       const userName = userDoc.exists() ? userDoc.data().name : "Unknown User";

//       const [time, period] = timeSlot.split(" ");
//       const [hours, minutes] = time.split(":").map(Number);
//       const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
//       const bookingDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), adjustedHours, minutes);

//       const paymentDocRef = await addDoc(collection(db, "payments"), {
//         userID: user.uid,
//         cardNumber,
//         expirationDate,
//         cvv,
//         cardHolderName,
//         amount,
//         paymentMethod,
//         paidAt: serverTimestamp()
//       });

//       await addDoc(collection(db, "bookings"), {
//         clinicID,
//         clinicName,
//         doctorID,
//         doctorName,
//         userID: user.uid,
//         userName,
//         date: bookingDate,
//         timeSlot,
//         paymentID: paymentDocRef.id,
//         bookedAt: serverTimestamp()
//       });

//       onClose();
//     } catch (error) {
//       console.error("Error confirming booking:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
//       <div className="bg-white w-11/12 max-w-4xl p-5 rounded-md shadow-lg overflow-y-auto flex">
//         <div className="w-full md:w-1/2 p-4 bg-green-100 rounded-md">
//           <h3 className="text-xl font-bold mb-4">Confirm Your Details</h3>
//           {doctorProfilePic && (
//             <div className="flex justify-center mb-4">
//               <img src={doctorProfilePic} alt="Doctor Profile" className="rounded-md w-32 h-32 object-cover" />
//             </div>
//           )}
//           <p className="mb-2"><strong>Clinic Name:</strong> {clinicName}</p>
//           <p className="mb-2"><strong>Doctor Name:</strong> {doctorName}</p>
//           <p className="mb-2"><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
//           <p className="mb-2"><strong>Time Slot:</strong> {timeSlot}</p>
//           <p className="mb-2"><strong>Amount:</strong> ₹{amount}</p>
//           <button
//             onClick={() => setShowConfirmation(false)}
//             className="btn bg-gray-300 text-black px-4 py-2 rounded-md mt-4"
//           >
//             Back
//           </button>
//         </div>
//         <div className="w-full md:w-1/2 p-4">
//           <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
//           <div className="flex mb-4">
//             <button
//               className={`px-4 py-2 rounded-t-md ${paymentMethod === "creditCard" ? 'bg-primaryColor text-white' : 'bg-gray-200 text-black'}`}
//               onClick={() => setPaymentMethod("creditCard")}
//             >
//               Credit Card
//             </button>
//             <button
//               className={`px-4 py-2 rounded-t-md ${paymentMethod === "mobilePayment" ? 'bg-primaryColor text-white' : 'bg-gray-200 text-black'}`}
//               onClick={() => setPaymentMethod("mobilePayment")}
//             >
//               Mobile Payment
//             </button>
//           </div>
//           {paymentMethod === "creditCard" && (
//             <div>
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-textColor mb-2">Credit Card Number</label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
//                   placeholder="1234 5678 9012 3456"
//                   value={cardNumber}
//                   onChange={(e) => setCardNumber(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mt-4 flex space-x-4">
//                 <div className="w-1/2">
//                   <label className="block text-sm font-medium text-textColor mb-2">Expiration Date</label>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
//                     placeholder="MM/YY"
//                     value={expirationDate}
//                     onChange={(e) => setExpirationDate(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <label className="block text-sm font-medium text-textColor mb-2">CVV</label>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
//                     placeholder="123"
//                     value={cvv}
//                     onChange={(e) => setCvv(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-textColor mb-2">Cardholder Name</label>
//                 <input
//                   type="text"
//                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
//                   placeholder="John Doe"
//                   value={cardHolderName}
//                   onChange={(e) => setCardHolderName(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//           )}
//           {paymentMethod === "mobilePayment" && (
//             <div className="mt-4">
//               {/* Add mobile payment fields if needed */}
//               <p>Mobile Payment is selected.</p>
//             </div>
//           )}
//           <button
//             onClick={handlePayment}
//             className="btn bg-primaryColor text-white px-4 py-2 rounded-md w-full mt-4"
//           >
//             Pay & Confirm Booking
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationPopup;

import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, auth, storage } from "../../firebase"; // Ensure the correct path to your firebase configuration
import QRCode from "qrcode.react"; // Assuming you have this package installed

const ConfirmationPopup = ({
  onClose,
  clinicName,
  doctorID,
  doctorName,
  timeSlot,
  selectedDate,
  setShowConfirmation,
}) => {
  const [doctorProfilePic, setDoctorProfilePic] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount] = useState(1500); // Fixed amount of ₹1500

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

    if (
      (paymentMethod === "creditCard" &&
        (!cardNumber || !expirationDate || !cvv || !cardHolderName)) ||
      (paymentMethod === "mobilePayment" && !upiId)
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userName = userDoc.exists() ? userDoc.data().name : "Unknown User";

      const [time, period] = timeSlot.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours =
        period === "PM" && hours !== 12 ? hours + 12 : hours;
      const bookingDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        adjustedHours,
        minutes
      );

      const paymentData = {
        userID: user.uid,
        amount,
        paymentMethod,
        paidAt: serverTimestamp(),
      };

      if (paymentMethod === "creditCard") {
        paymentData.cardNumber = cardNumber;
        paymentData.expirationDate = expirationDate;
        paymentData.cvv = cvv;
        paymentData.cardHolderName = cardHolderName;
      } else if (paymentMethod === "mobilePayment") {
        paymentData.upiId = upiId;
      }

      const paymentDocRef = await addDoc(
        collection(db, "payments"),
        paymentData
      );

      await addDoc(collection(db, "bookings"), {
        clinicID: clinicName,
        clinicName,
        doctorID,
        doctorName,
        userID: user.uid,
        userName,
        date: bookingDate,
        timeSlot,
        paymentID: paymentDocRef.id,
        bookedAt: serverTimestamp(),
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
              <img
                src={doctorProfilePic}
                alt="Doctor Profile"
                className="rounded-md w-32 h-32 object-cover"
              />
            </div>
          )}
          <p className="mb-2">
            <strong>Clinic Name:</strong> {clinicName}
          </p>
          <p className="mb-2">
            <strong>Doctor Name:</strong> {doctorName}
          </p>
          <p className="mb-2">
            <strong>Date:</strong> {selectedDate.toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>Time Slot:</strong> {timeSlot}
          </p>
          <p className="mb-2">
            <strong>Amount:</strong> ₹{amount}
          </p>
          <div className="flex mt-32 ml-2">
          <button
            onClick={() => setShowConfirmation(false)}
            className="btn bg-gray-300 text-black px-4 py-2 rounded-md mt-4"
          >
            Back
          </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
          <div className="flex mb-4">
            <button
              className={`px-4 py-2 rounded-t-md ${
                paymentMethod === "creditCard"
                  ? "bg-primaryColor text-headingColor"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setPaymentMethod("creditCard")}
            >
              Credit Card
            </button>
            <button
              className={`px-4 py-2 rounded-t-md ${
                paymentMethod === "mobilePayment"
                  ? "bg-primaryColor text-headingColor"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setPaymentMethod("mobilePayment")}
            >
              UPI Payment
            </button>
          </div>
          {paymentMethod === "creditCard" && (
            <div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-textColor mb-2">
                  Credit Card Number
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-textColor mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
                    placeholder="MM/YY"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-textColor mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-textColor mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
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
              <label className="block text-sm font-medium text-textColor mb-2">
                UPI ID
              </label>
              <input
                type="text"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm rounded-md"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
              <p className=" text-center text-base text-semibold">or</p>
              <div className="flex justify-center mt-4">
                <QRCode
                  value={`upi://pay?pa=${upiId}&pn=${clinicName}&am=${amount}`}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handlePayment}
            className="btn bg-primaryColor border-btnColor border-1 text-white px-4 py-2 rounded-md mt-4 w-full"
            
          >
            Confirm Booking
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
