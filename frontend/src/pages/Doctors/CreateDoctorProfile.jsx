import React, { useState } from "react";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import PhotoUpload from "../../components/PhotoUpload/PhotoUpload";

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

function generateRandomId(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function uploadPhoto(file, storagePath) {
  const storageRef = ref(storage, storagePath);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading photo: ", error);
    throw error;
  }
}

const CreateDoctorProfile = () => {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState([""]);
  const [experience, setExperience] = useState([""]);
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadProfilePhoto = (files) => {
    setProfilePhoto(files);
  };

  const handleAddEducationField = () => {
    setEducation((prevEducation) => [...prevEducation, ""]);
  };

  const handleRemoveEducationField = (index) => {
    setEducation((prevEducation) => {
      const updatedEducation = [...prevEducation];
      updatedEducation.splice(index, 1);
      return updatedEducation;
    });
  };

  const handleAddExperienceField = () => {
    setExperience((prevExperience) => [...prevExperience, ""]);
  };

  const handleRemoveExperienceField = (index) => {
    setExperience((prevExperience) => {
      const updatedExperience = [...prevExperience];
      updatedExperience.splice(index, 1);
      return updatedExperience;
    });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const profilePhotoURL =
        profilePhoto.length > 0
          ? await uploadPhoto(
              profilePhoto[0],
              `doctors/profiles/${generateRandomId(28)}`
            )
          : null;

      const docId = generateRandomId(28);

      const doctorData = {
        name: name,
        specialization: specialization,
        hospital: hospital,
        bio: bio,
        education: education,
        experience: experience,
        profilePhoto: profilePhotoURL,
      };

      // Save doctor profile in doctors_profile collection with a random ID
      await setDoc(doc(db, "doctors_profile", docId), doctorData);

      // Save the reference to the doctor's profile in the users collection under the authenticated user's document
      await setDoc(doc(db, "users", user.uid), {
        doctorProfileId: docId,
      }, { merge: true });

      setLoading(false);
      alert("Doctor profile created successfully!");

      // Clear form fields
      setName("");
      setSpecialization("");
      setHospital("");
      setBio("");
      setEducation([""]);
      setExperience([""]);
      setProfilePhoto([]);
    } catch (error) {
      setError("Error adding doctor details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="heading mb-4">Create Doctor Profile</h1>
      <form onSubmit={handlePost} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label className="form_label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form_input"
            required
          />
        </div>

        <div>
          <label className="form_label">Specialization</label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="form_input"
            required
          />
        </div>

        <div>
          <label className="form_label">Hospital/Clinic Name</label>
          <input
            type="text"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="form_input"
            required
          />
        </div>

        <div>
          <label className="form_label">Bio (Max 800 characters)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            className="form_input"
            rows="4"
            maxLength="800"
            required
          ></textarea>
        </div>

        <div>
          <label className="form_label">Education</label>
          {education.map((educationField, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={educationField}
                onChange={(e) => {
                  const updatedEducation = [...education];
                  updatedEducation[index] = e.target.value;
                  setEducation(updatedEducation);
                }}
                className="form_input"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveEducationField(index)}
                className="btn bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEducationField}
            className="btn bg-green-500 text-white px-3 py-1 rounded mt-2"
          >
            Add Education
          </button>
        </div>

        <div>
          <label className="form_label">Experience</label>
          {experience.map((experienceField, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={experienceField}
                onChange={(e) => {
                  const updatedExperience = [...experience];
                  updatedExperience[index] = e.target.value;
                  setExperience(updatedExperience);
                }}
                className="form_input"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveExperienceField(index)}
                className="btn bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExperienceField}
            className="btn bg-green-500 text-white px-3 py-1 rounded mt-2"
          >
            Add Experience
          </button>
        </div>

        <div>
          <PhotoUpload
            label="Upload Profile Photo"
            onPhotoChange={handleUploadProfilePhoto}
          />
        </div>

        <button type="submit" className="btn w-full" disabled={loading}>
          {loading ? "Creating Profile..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateDoctorProfile;
