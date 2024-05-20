import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async (user) => {
      try {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const doctorProfileId = userDocSnap.data().doctorProfileId;
          const doctorProfileDoc = await getDoc(doc(db, "doctors_profile", doctorProfileId));
          
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <section className="profile-section">
        <div className="hero_section py-8">
          <div className="text-center">
            <h1 className="heading mb-4">Doctor Profile</h1>
            {profileData?.profilePhoto && (
              <img
                src={profileData.profilePhoto}
                alt="Profile"
                className="mx-auto rounded-full w-40 h-40 object-cover mb-4"
              />
            )}
            <h2 className="text-3xl font-bold">{profileData?.name}</h2>
            <p className="text_para">{profileData?.specialization}</p>
            <p className="text_para">{profileData?.hospital}</p>
            <p className="text_para mt-4">{profileData?.bio}</p>
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
      </section>
    </div>
  );
};

export default ProfilePage;

