import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase"; // Import Firebase modules
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import signupImg from "../assets/images/signup.gif";
import avatar from "../assets/images/doctor-img01.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: null, // Change to null
    gender: "",
    role: "patient",
  });
  
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState(null); // State to hold photo preview URL

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, photo: file }); // Set photo in form data

    // Create a preview URL for the uploaded image
    const previewURL = URL.createObjectURL(file);
    setPhotoPreview(previewURL);
  };


  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(formData);
  
    // Update button text and disable it to indicate loading
    event.target.querySelector("button[type=submit]").disabled = true;
    event.target.querySelector("button[type=submit]").innerText = "Creating Account.....";
  
    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
  
      // Upload the photo to Firebase Storage
      const file = formData.photo;
      const imgRef = ref(storage, `profile_photos/${user.uid}/${v4()}`);
      await uploadBytes(imgRef, file);
      const imageUrl = await getDownloadURL(imgRef);
  
      // Update user profile with photo URL
      await updateProfile(user, { photoURL: imageUrl });
  
      // Add user data along with the photo URL to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        gender: formData.gender,
        photo: imageUrl,
      });
  
      // If successful, alert success message
      alert("Signup successful!");
  
      // Redirect to login page
      navigate("/");
  
    } catch (error) {
      // If there's an error, log it and alert the user
      console.error("Error signing up or adding user to Firestore:", error);
      alert("Signup failed. Please check the console for details.");
  
      // Re-enable the button and restore its text
      event.target.querySelector("button[type=submit]").disabled = false;
      event.target.querySelector("button[type=submit]").innerText = "Create Account";
    }
  };
  

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor">account</span>
            </h3>
            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066FF34] focus:outline-none focus:border-b-primaryColor hover:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066FF34] focus:outline-none focus:border-b-primaryColor hover:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
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
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066FF34] focus:outline-none focus:border-b-primaryColor hover:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className=" mb-5 flex items-center justify-between">
                <label className=" text-headingColor font-bold text-[16px] leading-7">
                  Are you a:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>
                <label className=" text-headingColor font-bold text-[16px] leading-7">
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Transgender</option>
                  </select>
                </label>
              </div>
              <div className=" mb-5 flex items-center gap-3">
                <figure className=" w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-between">
                  <img
                    src={photoPreview || avatar}
                    alt=""
                    className="w-full rounded-full"
                  />
                </figure>
                <div className=" relative w-[130px] h-[50px]">
                  {" "}
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleImageUpload}
                    accept=".jpg, .png"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className="mt-7">
                <button
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[20px] leading-[30px] rounded-lg px-4 py-2 font-semibold"
                >
                  Create Account
                </button>
              </div>
              <p className="mt-6 text-textColor text-center mb-4">
                Already have an account?&nbsp;
                <Link
                  to="/login"
                  className="text-primaryColor font-medium ml-1 hover:text-[18px] hover:font-semibold"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;

