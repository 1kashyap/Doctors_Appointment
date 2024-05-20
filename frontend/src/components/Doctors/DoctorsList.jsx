// import React, { useEffect, useState } from "react";
// import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { app } from "../../firebase"; // Ensure this is correctly importing your firebase app
// import DoctorsCard from "./DoctorsCard";

// const DoctorsList = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
//       {doctors.map((doctor) => (
//         <DoctorsCard key={doctor.id} doctor={doctor} />
//       ))}
//     </div>
//   );
// };

// export default DoctorsList;


import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase";
import DoctorsCard from "./DoctorsCard";

const DoctorsList = ({ searchQuery = "" }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const db = getFirestore(app);

      try {
        const q = query(collection(db, "users"), where("role", "==", "doctor"));
        const querySnapshot = await getDocs(q);
        const doctorsData = [];

        for (const docSnap of querySnapshot.docs) {
          const doctorData = docSnap.data();
          const doctorProfileRef = doc(db, "doctors_profile", doctorData.doctorProfileId);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
      {filteredDoctors.map((doctor) => (
        <DoctorsCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorsList;

