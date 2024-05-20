// Doctors.jsx

// import React from "react";
// import DoctorsList from "../../components/Doctors/DoctorsList";
// import Testimonial from "../../components/Testimonial/Testimonial";

// const Doctors = () => {
//   return (
//     <>
//       <section className="bg-[#fff9EA]">
//         <div className="container text-center">
//           <h2 className="heading">Find a Doctor</h2>
//           <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066FF2C] rounded-md flex items-center justify-between">
//             <input
//               type="search"
//               className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
//               placeholder="Search"
//             />
//             <button className="btn mt-0 rounded-[0px] rounded-r-md">
//               Search
//             </button>
//           </div>
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           <DoctorsList />
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           <div className="xl:w-[470px] mx-auto">
//             <h2 className="heading text-center">What our patient say</h2>
//             <p className="text_para text-center">
//               World-class care for everyone. Our health System offers unmatched,
//               expert health care
//             </p>
//           </div>

//           <Testimonial />
//         </div>
//       </section>
//     </>
//   );
// };

// export default Doctors;


import React, { useState } from "react";
import DoctorsList from "../../components/Doctors/DoctorsList";
import Testimonial from "../../components/Testimonial/Testimonial";

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <section className="bg-[#fff9EA]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066FF2C] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="btn mt-0 rounded-[0px] rounded-r-md">
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <DoctorsList searchQuery={searchQuery} />
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our patient say</h2>
            <p className="text_para text-center">
              World-class care for everyone. Our health System offers unmatched,
              expert health care
            </p>
          </div>

          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Doctors;
