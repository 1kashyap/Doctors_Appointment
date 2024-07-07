

import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import loadingGif from "../../assets/images/Loading.gif";
import Appointment from "./Appointment";

const db = getFirestore(app);
const auth = getAuth(app);

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfileData = async (user) => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const doctorProfileId = userDocSnap.data().doctorProfileId;
          const doctorProfileDoc = await getDoc(
            doc(db, "doctors_profile", doctorProfileId)
          );

          if (doctorProfileDoc.exists()) {
            setProfileData(doctorProfileDoc.data());
          } else {
            setError("Doctor profile not found");
          }
        } else {
          setError("User data not found");
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
        setError("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfileData(user);
      } else {
        setError("User is not authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderProfileInfo = () => (
    <div className="profile-section">
      <div className="py-8 pl-16 pr-24 ">
        <div className="mt-8">
          <h3 className="heading mb-4">Description</h3>
          <p className="text_para">{profileData?.bio}</p>
        </div>
        <div className="mt-8">
          <h3 className="heading mb-4">Education</h3>
          <ul className="list-disc list-inside">
            {profileData?.education.map((edu, index) => (
              <li key={index} className="text_para">
                {edu}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h3 className="heading mb-4">Experience</h3>
          <ul className="list-disc list-inside">
            {profileData?.experience.map((exp, index) => (
              <li key={index} className="text_para">
                {exp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="appointments-section">
      <Appointment />
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center">
        <img src={loadingGif} alt="Loading..." />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container w-full mx-auto p-6">
      <div className="profile-header hero_section py-6 px-16 rounded-sm flex items-center mb-8">
        {profileData?.profilePhoto && (
          <img
            src={profileData.profilePhoto}
            alt="Profile"
            className="rounded-full border-2 border-primaryColor w-64 h-64 object-cover mb-4 mr-4"
          />
        )}
        <div className="ml-5">
          <h2 className="text-3xl font-bold">{profileData?.name}</h2>
          <br />
          <p className="text-xl ml-3 text-gray-600">
            {profileData?.specialization}
          </p>
        </div>
      </div>
      <div className="tabs mt-[50px] border-b px-16 text-xl border-solid border-[#0066FF34]">
        <button
          className={`${
            activeTab === "profile" &&
            "border-b-2 text-2xl border-solid border-primaryColor"
          } py-4 px-7 mr-8  leading-7 text-headingColor font-semibold`}
          onClick={() => setActiveTab("profile")}
        >
          Info
        </button>
        {"     "}
        <button
          className={`${
            activeTab === "appointments" &&
            "border-b-2 text-2xl border-solid border-primaryColor"
          } py-4 px-7 mr-8  leading-7 text-headingColor font-semibold`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
      </div>
      <section>
        {activeTab === "profile" ? renderProfileInfo() : renderAppointments()}
      </section>
    </div>
  );
};

export default ProfilePage;
