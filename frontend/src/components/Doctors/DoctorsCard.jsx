
// import React from "react";
// import { Link } from "react-router-dom";
// import { BiSolidRightArrowAlt } from "react-icons/bi";
// import starIcon from "../../assets/images/Star.png";

// const DoctorsCard = ({ doctor, homePage }) => {
//   const {
//     id,
//     name,
//     avgRating,
//     totalRating,
//     profilePhoto,
//     specialization,
//     hospital,
//   } = doctor;

//   return (
//     <div className="p-3 lg:p-5 border-2 border-gray-200 bg-slate-50 rounded-lg">
//       <div>
//         <img src={profilePhoto} className="w-full h-64 object-contain rounded" alt={name} />
//       </div>

//       <h2 className="text-[18px] lg:text-[20px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5">
//         {name}
//       </h2>

//       <div className="mt-2 lg:mt-4 flex items-center justify-between">
//         <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[18px] rounded-full lg:text-[16px] leading-7 font-semibold">
//           {specialization}
//         </span>

//         <div className="flex items-center gap-[6px]">
//           <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
//             <img src={starIcon} alt="" />
//             {avgRating}
//           </span>
//           <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[500] text-textColor">
//             ({totalRating})
//           </span>
//         </div>
//       </div>

//       <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
//         <div>
//           <p className="text-[18px] leading-6 font-[400] text-textColor">
//             At {hospital}
//           </p>
//         </div>
//         <Link
//           to={homePage ? `/doctors` : `/doctors/${id}`}
//           className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none"
//         >
//           <BiSolidRightArrowAlt className="group-hover:text-white w-9 h-7" />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DoctorsCard;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiSolidRightArrowAlt } from "react-icons/bi";
import starIcon from "../../assets/images/Star.png";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase";

const DoctorsCard = ({ doctor, homePage }) => {
  const {
    id,
    name,
    avgRating,
    totalRating,
    profilePhoto,
    specialization,
    hospital,
    hospitalAddressId, // assuming this is the ID to fetch hospital address
  } = doctor;

  const [hospitalAddress, setHospitalAddress] = useState("");

  useEffect(() => {
    const fetchHospitalAddress = async () => {
      const db = getFirestore(app);
      const hospitalRef = doc(db, "hospital_addresses", hospitalAddressId);
      try {
        const docSnap = await getDoc(hospitalRef);
        if (docSnap.exists()) {
          const addressData = docSnap.data();
          // Format address here to display city, state, country only
          const formattedAddress = `${addressData.city}, ${addressData.state}, ${addressData.country}`;
          setHospitalAddress(formattedAddress);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching hospital address:", error);
      }
    };

    fetchHospitalAddress();
  }, [hospitalAddressId]);

  return (
    <div className="p-3 lg:p-5 border-2 border-gray-200 bg-slate-50 rounded-lg">
      <div>
        <img
          src={profilePhoto}
          className="w-full h-64 object-contain rounded"
          alt={name}
        />
      </div>

      <h2 className="text-[18px] lg:text-[20px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5">
        {name}
      </h2>

      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[18px] rounded-full lg:text-[16px] leading-7 font-semibold">
          {specialization}
        </span>

        <div className="flex items-center gap-[6px]">
          <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
            <img src={starIcon} alt="" />
            {avgRating}
          </span>
          <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[500] text-textColor">
            ({totalRating})
          </span>
        </div>
      </div>

      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <div>
          <p className="text-[18px] leading-6 font-[400] text-textColor">
            At {hospital}
            <br />
            {hospitalAddress}
          </p>
        </div>
        <Link
          to={homePage ? `/doctors` : `/doctors/${id}`}
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none"
        >
          <BiSolidRightArrowAlt className="group-hover:text-white w-9 h-7" />
        </Link>
      </div>
    </div>
  );
};

export default DoctorsCard;
