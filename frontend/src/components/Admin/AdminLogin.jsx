import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
import { doc, getDoc } from "@firebase/firestore";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const auth = getAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in with email and password using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Check if the user's UID exists in the admin collection
      const adminDoc = await getDoc(doc(db, "admin", user.uid));
      if (adminDoc.exists()) {
        alert("Admin SignIn Success");
        navigate("/adminpage");
      } else {
        alert("User not found");
        setFormData({ email: "", password: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  return (
    <div className="px-5 lg:px-6">
      <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
        Admin <span className="text-primaryColor">Login</span>
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
      </form>
    </div>
  );
};

export default AdminLogin;
