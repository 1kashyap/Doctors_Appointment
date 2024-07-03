import React, { useState } from "react";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import PhotoUpload from "../../components/PhotoUpload/PhotoUpload";
import Select from "react-select";
import { countries } from "../../utils/countries";

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

function generateRandomId(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function uploadPhotos(files, folder) {
  const urls = [];
  for (const file of files) {
    const storagePath = `${folder}/${generateRandomId(28)}`;
    const storageRef = ref(storage, storagePath);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      urls.push(downloadURL);
    } catch (error) {
      console.error("Error uploading photo: ", error);
      throw error;
    }
  }
  return urls;
}

const specialties = [
  "Ophthalmologist",
  "Dermatologist",
  "Cardiologist",
  "Psychiatrist",
  "Gastroenterologist",
  "ENT Specialist",
  "Gynecologist/Obstetrician",
  "Neurologist",
  "Urologist",
  "Dentist",
  "Prosthodontist",
  "Orthodontist",
  "Pediatric Dentist",
  "Endodontist",
  "Implantologist",
  "Ayurveda",
  "Homeopath",
  "Siddha",
  "Unani",
  "Yoga & Naturopathy",
  "Acupuncturist",
  "Physiotherapist",
  "Psychologist",
  "Audiologist",
  "Speech Therapist",
  "Dietitian/Nutritionist",
];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const morningSlots = Array.from(
  { length: 12 },
  (_, i) => `${(i + 1).toString().padStart(2, "0")}:00 AM`
);
const eveningSlots = Array.from(
  { length: 12 },
  (_, i) => `${(i + 1).toString().padStart(2, "0")}:00 PM`
);
const timeSlotsPerDay = [...morningSlots, ...eveningSlots];

const AddClinicForm = () => {
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [contactNumbers, setContactNumbers] = useState([""]);
  const [description, setDescription] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [clinicPhotos, setClinicPhotos] = useState([]);
  const [timeSlots, setTimeSlots] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadClinicPhotos = (files) => {
    setClinicPhotos(files);
  };

  const handleAddContactField = () => {
    setContactNumbers((prevContacts) => [...prevContacts, ""]);
  };

  const handleRemoveContactField = (index) => {
    setContactNumbers((prevContacts) =>
      prevContacts.filter((_, i) => i !== index)
    );
  };

  const handleToggleTimeSlot = (day, slot) => {
    setTimeSlots((prevTimeSlots) => ({
      ...prevTimeSlots,
      [day]: prevTimeSlots[day].includes(slot)
        ? prevTimeSlots[day].filter((s) => s !== slot)
        : [...prevTimeSlots[day], slot],
    }));
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
      const clinicPhotoURLs = await uploadPhotos(clinicPhotos, "clinic/photos");
      const docId = generateRandomId(28);

      const clinicData = {
        name: clinicName,
        address: address,
        contactNumbers: contactNumbers,
        description: description,
        specialty: selectedSpecialty,
        photos: clinicPhotoURLs,
        timeSlots: Object.fromEntries(
          Object.entries(timeSlots).map(([day, slots]) => [
            day,
            slots.filter((slot) => slot),
          ])
        ),
      };

      await setDoc(doc(db, "clinic", docId), clinicData);
      await setDoc(
        doc(db, "users", user.uid),
        { clinicId: docId },
        { merge: true }
      );

      setLoading(false);
      alert("Clinic details added successfully!");

      setClinicName("");
      setAddress({
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
      setContactNumbers([""]);
      setDescription("");
      setSelectedSpecialty("");
      setClinicPhotos([]);
      setTimeSlots(
        daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
      );
      setSelectedDay(daysOfWeek[0]);
    } catch (error) {
      setError("Error adding clinic details. Please try again.");
      setLoading(false);
    }
  };

  const countryOptions = Object.keys(countries).map((country) => ({
    value: country,
    label: country,
  }));
  const stateOptions = address.country
    ? Object.keys(countries[address.country]).map((state) => ({
        value: state,
        label: state,
      }))
    : [];
  const cityOptions = address.state
    ? countries[address.country][address.state].map((city) => ({
        value: city,
        label: city,
      }))
    : [];

  const specialtyOptions = specialties.map((specialty) => ({
    value: specialty,
    label: specialty,
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="heading mb-4">Add Clinic</h1>
      <form onSubmit={handlePost} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex items-center space-x-4">
          <label className="form_label w-48">Clinic Name</label>
          <input
            type="text"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className="form_input"
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="form_label w-48 text-red-500">
            Address Line 1 *
          </label>
          <input
            type="text"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="form_input"
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="form_label w-48">Address Line 2</label>
          <input
            type="text"
            value={address.line2}
            onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            className="form_input"
          />
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className="flex items-center space-x-8">
            <label className="form_label w-36">Country</label>
            <Select
              className="w-72 h-10"
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.value === address.country
              )}
              onChange={(option) =>
                setAddress({
                  ...address,
                  country: option.value,
                  state: "",
                  city: "",
                })
              }
              isSearchable
            />
          </div>
          <div className="flex items-center space-x-14">
            <label className="form_label w-20">State</label>
            <Select
              className="w-72 h-10"
              options={stateOptions}
              value={stateOptions.find(
                (option) => option.value === address.state
              )}
              onChange={(option) =>
                setAddress({ ...address, state: option.value, city: "" })
              }
              isSearchable
              isDisabled={!address.country}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="flex items-center space-x-24">
            <label className="form_label w-20">City</label>
            <Select
              className="w-72 h-10"
              options={cityOptions}
              value={cityOptions.find(
                (option) => option.value === address.city
              )}
              onChange={(option) =>
                setAddress({ ...address, city: option.value })
              }
              isSearchable
              isDisabled={!address.state}
            />
          </div>
          <div className="flex items-center space-x-6">
            <label className="form_label w-28">Pincode</label>
            <input
              type="text"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              className="form_input w-72 h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {contactNumbers.map((number, index) => (
            <div key={index} className="flex items-center space-x-4">
              <label className="form_label w-48">
                Contact Number {index + 1}
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  value={number}
                  onChange={(e) => {
                    const newContactNumbers = [...contactNumbers];
                    newContactNumbers[index] = e.target.value;
                    setContactNumbers(newContactNumbers);
                  }}
                  className="form_input w-full"
                  required
                />
                {contactNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveContactField(index)}
                    className="absolute right-0 top-0 mt-2 mr-2 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddContactField}
          className="bg-primaryColor text-white px-4 py-2 rounded"
        >
          Add Contact Number
        </button>

        <div className="flex items-center space-x-4">
          <label className="form_label w-48">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form_textarea w-full h-36 mt-12 rounded-md border-2 border-slate-200"
            required
          ></textarea>
        </div>

        <div className="flex items-center space-x-4">
          <label className="form_label w-48">Specialty</label>
          <Select
            className="w-72 h-10"
            options={specialtyOptions}
            value={specialtyOptions.find(
              (option) => option.value === selectedSpecialty
            )}
            onChange={(option) => setSelectedSpecialty(option.value)}
            isSearchable
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="form_label w-48">Photos</label>
          <PhotoUpload onUpload={handleUploadClinicPhotos} />
        </div>

        <div>
          <label className="form_label">Time Slots</label>
          <div className="flex justify-center gap-8 mb-4">
            {daysOfWeek.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`btn ${
                  selectedDay === day ? "bg-primaryColor" : "bg-gray-300"
                } text-white px-3 py-1 rounded`}
                style={{ whiteSpace: "nowrap" }}
              >
                {day}
              </button>
            ))}
          </div>
          {/* <div className="grid grid-cols-6 gap-4">
            {timeSlotsPerDay.map((slot, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={timeSlots[selectedDay].includes(slot)}
                  onChange={() => handleToggleTimeSlot(selectedDay, slot)}
                />
                <span>{slot}</span>
              </label>
            ))}
          </div> */}
          <div className="grid grid-cols-8 gap-4">
            {timeSlotsPerDay.map((slot, index) => (
              <label
                key={index}
                className={`flex items-center space-x-1 pl-3 py-2 cursor-pointer w-32 ${
                  timeSlots[selectedDay].includes(slot)
                    ? "bg-teal-100 rounded-md border-teal-200"
                    : ""
                }`}
                onClick={() => handleToggleTimeSlot(selectedDay, slot)} // Add onClick handler
              >
                <input
                  type="checkbox"
                  checked={timeSlots[selectedDay].includes(slot)}
                  onChange={() => handleToggleTimeSlot(selectedDay, slot)}
                  className="focus:ring-1 focus:ring-offset-2 focus:ring-teal-200" // Focus styling
                />
                <span
                  className={`text-gray-700 ${
                    timeSlots[selectedDay].includes(slot)
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {slot}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button type="submit" className="btn w-full" disabled={loading}>
            {loading ? "Adding Clinic..." : "Add Clinic"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClinicForm;
