// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { app } from "../firebase";

// const auth = getAuth(app);


// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const navigate = useNavigate(); // Get navigate function

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
//       console.log(userCredential);
//       alert("SignIn Success");
//       // Navigate to desired route after successful login
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       alert("Incorrect email or password");
//     }
//   };

//   return (
//     <section className="px-5 lg:px-6">
//       <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
//         <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10 ">
//           Hello! <span className="text-primaryColor">Welcome</span> Back
//         </h3>

//         <form className="py-4 md:py-0" onSubmit={handleSubmit}>
//           <div className="mb-5">
//             <input
//               type="email"
//               placeholder="Enter Your Email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full  py-3 border-b border-solid border-[#0066FF34] focus:outline-none focus:border-b-primaryColor hover:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer"
//               required
//             />
//           </div>

//           <div className="mb-5">
//             <input
//               type="password"
//               placeholder="Password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="w-full  py-3 border-b border-solid border-[#0066FF34] focus:outline-none focus:border-b-primaryColor hover:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor  cursor-pointer"
//               required
//             />
//           </div>

//           <div className="mt-7">
//             <button
//               type="submit"
//               className=" w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-2 hover:text-[20px] hover:font-semibold"
//             >
//               Login
//             </button>
//           </div>

//           <p className="mt-5 text-textColor text-center">
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               className="text-primaryColor font-medium ml-1 hover:text-[18px] hover:font-semibold "
//             >
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import AdminLogin from "../components/Admin/AdminLogin";

const auth = getAuth(app);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selectedTab, setSelectedTab] = useState("User");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate(); // Get navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log(userCredential);
      alert("SignIn Success");
      // Navigate to desired route after successful login
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Incorrect email or password");
    }
  };

  return (
    <section className="px-5 lg:px-6">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <div className="flex justify-between mb-10">
          <button
            className={`w-1/2 py-2 rounded-sm ${selectedTab === "User" ? "text-white bg-primaryColor font-extrabold" : " text-primaryColor font-bold"}`}
            onClick={() => setSelectedTab("User")}
          >
            User
          </button>
          <button
            className={`w-1/2 py-2 rounded-sm ${selectedTab === "Admin" ? "text-white bg-primaryColor font-extrabold" : "text-primaryColor font-bold"}`}
            onClick={() => setSelectedTab("Admin")}
          >
            Admin
          </button>
        </div>

        {selectedTab === "User" ? (
          <>
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10 ">
              Hello! <span className="text-primaryColor">Welcome</span> Back
            </h3>
            <form className="py-4 md:py-0" onSubmit={handleSubmit}>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-3 border-b border-solid border-[#0066FF34] focus:outline-none focus:border-b-primaryColor hover:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full py-3 border-b border-solid border-[#0066FF34] focus:outline-none focus:border-b-primaryColor hover:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              <div className="mt-7">
                <button
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-2 hover:text-[20px] hover:font-semibold"
                >
                  Login
                </button>
              </div>

              <p className="mt-5 text-textColor text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primaryColor font-medium ml-1 hover:text-[18px] hover:font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </>
        ) : (
          <AdminLogin />
        )}
      </div>
    </section>
  );
};

export default Login;
