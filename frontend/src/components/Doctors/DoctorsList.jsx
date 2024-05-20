// import React, { useEffect, useState } from "react";
// import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { app } from "../../firebase";
// import DoctorsCard from "./DoctorsCard";
// import { useLocation } from "react-router-dom";

// const DoctorsList = ({ searchQuery = "", limit = null }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       const db = getFirestore(app);

//       try {
//         const q = query(collection(db, "users"), where("role", "==", "doctor"));
//         const querySnapshot = await getDocs(q);
//         const doctorsData = [];

//         for (const docSnap of querySnapshot.docs) {
//           const doctorData = docSnap.data();
//           const doctorProfileRef = doc(db, "doctors_profile", doctorData.doctorProfileId);
//           const doctorProfileSnap = await getDoc(doctorProfileRef);

//           if (doctorProfileSnap.exists()) {
//             doctorsData.push({
//               id: docSnap.id,
//               ...doctorData,
//               ...doctorProfileSnap.data(),
//             });
//           }
//         }

//         setDoctors(doctorsData);
//       } catch (error) {
//         console.error("Error fetching doctors data:", error);
//         setError("Error fetching doctors data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   const filteredDoctors = doctors.filter(doctor =>
//     doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const displayedDoctors = limit ? filteredDoctors.slice(0, limit) : filteredDoctors;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
//       {displayedDoctors.map((doctor) => (
//         <DoctorsCard key={doctor.id} doctor={doctor} homePage={location.pathname === '/'} />
//       ))}
//     </div>
//   );
// };

// export default DoctorsList;

import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { app } from "../../firebase";
import DoctorsCard from "./DoctorsCard";
import { useLocation } from "react-router-dom";
import loadingGif from "../../assets/images/Loading.gif";

const DoctorsList = ({ searchQuery = "", limit = null }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchDoctors = async () => {
      const db = getFirestore(app);

      try {
        const q = query(collection(db, "users"), where("role", "==", "doctor"));
        const querySnapshot = await getDocs(q);
        const doctorsData = [];

        for (const docSnap of querySnapshot.docs) {
          const doctorData = docSnap.data();
          const doctorProfileRef = doc(
            db,
            "doctors_profile",
            doctorData.doctorProfileId
          );
          const doctorProfileSnap = await getDoc(doctorProfileRef);

          if (doctorProfileSnap.exists()) {
            doctorsData.push({
              id: docSnap.id,
              ...doctorData,
              ...doctorProfileSnap.data(),
            });
          }
        }

        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors data:", error);
        setError("Error fetching doctors data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center">
        <img src={loadingGif} alt="Loading..." />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedDoctors = limit
    ? filteredDoctors.slice(0, limit)
    : filteredDoctors;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
      {displayedDoctors.map((doctor) => (
        <DoctorsCard
          key={doctor.id}
          doctor={doctor}
          homePage={location.pathname === "/"}
        />
      ))}
    </div>
  );
};

export default DoctorsList;
