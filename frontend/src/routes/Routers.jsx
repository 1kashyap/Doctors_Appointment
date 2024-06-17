import Home from "../pages/Home";
import Login from "../pages/Login";
import Services from "../pages/Services";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors/Doctors";
import DoctorDetails from "../pages/Doctors/DoctorDetails";

import { Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile/Profile";
import Just from "../Med";
import DoctorData from "../pages/Doctors/CreateDoctorProfile";
import AddClinic from "../pages/Doctors/AddClinic";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/doctordata" element={<DoctorData />} />
      <Route path="/just" element={<Just />} />
      <Route path="/addclinic" element={<AddClinic />} />
    </Routes>
  );
};

export default Routers;
