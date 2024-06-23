import React, { useState } from "react";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import PhotoUpload from "../../components/PhotoUpload/PhotoUpload";
import Select from 'react-select';
import { countries } from "../../utils/countries";

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

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const morningSlots = Array.from({ length: 12 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}:00 AM`);
const eveningSlots = Array.from({ length: 12 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}:00 PM`);
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
    setContactNumbers((prevContacts) => prevContacts.filter((_, i) => i !== index));
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
          Object.entries(timeSlots).map(([day, slots]) => [day, slots.filter(slot => slot)])
        )
      };

      await setDoc(doc(db, "clinic", docId), clinicData);
      await setDoc(doc(db, "users", user.uid), { clinicId: docId }, { merge: true });

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
      setTimeSlots(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {}));
      setSelectedDay(daysOfWeek[0]);
    } catch (error) {
      setError("Error adding clinic details. Please try again.");
      setLoading(false);
    }
  };

  const countryOptions = Object.keys(countries).map(country => ({ value: country, label: country }));
  const stateOptions = address.country ? Object.keys(countries[address.country]).map(state => ({ value: state, label: state })) : [];
  const cityOptions = address.state ? countries[address.country][address.state].map(city => ({ value: city, label: city })) : [];

  const specialtyOptions = specialties.map(specialty => ({ value: specialty, label: specialty }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="heading mb-4">Add Clinic</h1>
      <form onSubmit={handlePost} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label className="form_label">Clinic Name</label>
          <input
            type="text"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className="form_input"
            required
          />
        </div>

        <div>
          <label className="form_label text-red-500">Address Line 1 *</label>
          <input
            type="text"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="form_input"
            required
          />
        </div>

        <div>
          <label className="form_label">Address Line 2</label>
          <input
            type="text"
            value={address.line2}
            onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            className="form_input"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="form_label">Country</label>
            <Select
              options={countryOptions}
              value={countryOptions.find(option => option.value === address.country)}
              onChange={(option) => setAddress({ ...address, country: option.value, state: "", city: "" })}
              isSearchable
            />
          </div>
          <div>
            <label className="form_label">State</label>
            <Select
              options={stateOptions}
              value={stateOptions.find(option => option.value === address.state)}
              onChange={(option) => setAddress({ ...address, state: option.value, city: "" })}
              isSearchable
            />
          </div>
          <div>
            <label className="form_label">City</label>
            <Select
              options={cityOptions}
              value={cityOptions.find(option => option.value === address.city)}
              onChange={(option) => setAddress({ ...address, city: option.value })}
              isSearchable
            />
          </div>
          <div>
            <label className="form_label">Pincode</label>
            <input
              type="text"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="form_input"
              required
            />
          </div>
        </div>

        <div>
          <label className="form_label">Specialty</label>
          <Select
            options={specialtyOptions}
            value={specialtyOptions.find(option => option.value === selectedSpecialty)}
            onChange={(option) => setSelectedSpecialty(option.value)}
            isSearchable
          />
        </div>

        <div>
          <label className="form_label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form_input"
            maxLength={800}
            required
          />
        </div>

        <div>
          <label className="form_label">Contact Numbers</label>
          {contactNumbers.map((number, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={number}
                onChange={(e) => {
                  const updatedContacts = [...contactNumbers];
                  updatedContacts[index] = e.target.value;
                  setContactNumbers(updatedContacts);
                }}
                className="form_input"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveContactField(index)}
                className="btn bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddContactField}
            className="btn bg-green-500 text-white px-3 py-1 rounded mt-2"
          >
            Add Contact Number
          </button>
        </div>

        <div>
          <label className="form_label">Time Slots</label>
          <div className="flex justify-center mb-4">
            {daysOfWeek.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`btn ${selectedDay === day ? 'bg-primaryColor' : 'bg-gray-300'} text-white px-3 py-1 rounded`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {timeSlotsPerDay.map((slot, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleToggleTimeSlot(selectedDay, slot)}
                className={`btn ${timeSlots[selectedDay].includes(slot) ? 'bg-primaryColor' : 'bg-gray-300'} text-white px-3 py-1 rounded`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <PhotoUpload
            label="Upload Clinic Photos"
            onPhotoChange={handleUploadClinicPhotos}
            multiple={true}
          />
        </div>

        <button type="submit" className="btn w-full" disabled={loading}>
          {loading ? "Adding Clinic..." : "Add Clinic"}
        </button>
      </form>
    </div>
  );
};

export default AddClinicForm;

