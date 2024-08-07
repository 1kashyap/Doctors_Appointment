import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase"; // Ensure this is correctly importing your firebase app
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "./DoctorAbout";
import Feedback from "./Feedback";
import SidePanel from "./SidePanel";
import loadingGif from "../../assets/images/Loading.gif";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("about");

  useEffect(() => {
    const fetchDoctor = async () => {
      const db = getFirestore(app);
      const doctorRef = doc(db, "users", id);

      try {
        const doctorSnap = await getDoc(doctorRef);

        if (doctorSnap.exists()) {
          const doctorData = doctorSnap.data();
          const doctorProfileRef = doc(
            db,
            "doctors_profile",
            doctorData.doctorProfileId
          );
          const doctorProfileSnap = await getDoc(doctorProfileRef);

          if (doctorProfileSnap.exists()) {
            setDoctor({
              id: doctorSnap.id,
              ...doctorData,
              ...doctorProfileSnap.data(),
            });
          } else {
            setError("Doctor profile not found");
          }
        } else {
          setError("Doctor not found");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setError("Error fetching doctor data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center">
        <img src={loadingGif} alt="Loading..." />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <figure className="max-w-[200px] max-h-[200px]">
                <img
                  src={doctor.profilePhoto}
                  alt={doctor.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </figure>

              <div>
                <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
                  {doctor.specialization}
                </span>
                <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                  {doctor.name}
                </h3>
                
                

                <p className="text_para text-[14px] md:text-[15px] leading-6 lg:max-w-[390px]">
                  {doctor.description || "No description available"}
                </p>
              </div>
            </div>

            <div className="mt-[50px] border-b border-solid border-[#0066FF34]">
              <button
                onClick={() => setTab("about")}
                className={`${
                  tab === "about" && "border-b border-solid border-primaryColor"
                } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>
              <button
                onClick={() => setTab("feedback")}
                className={`${
                  tab === "feedback" &&
                  "border-b border-solid border-primaryColor"
                } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Feedback
              </button>
            </div>

            <div className="mt-[50px]">
              {tab === "about" && <DoctorAbout doctor={doctor} />}
              {tab === "feedback" && <Feedback doctorId={doctor.id} />}
            </div>
          </div>

          <div>
            <SidePanel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
