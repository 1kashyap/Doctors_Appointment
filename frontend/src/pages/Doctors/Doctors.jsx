import React, { useState, useEffect } from "react";
import DoctorsList from "../../components/Doctors/DoctorsList";
import loadingGif from "../../assets/images/Loading.gif"; // Ensure you have a loading GIF at this path

const commonSpecializations = [
  "Ayurveda",
  "Pediatrician",
  "Dentist",
  "Neurologist",
  "Psychiatrist",
];

const allSpecializations = [
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

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust the timeout as needed
    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSpecializations = () => {
    setShowAllSpecializations(!showAllSpecializations);
  };

  return (
    <div className="container mx-auto p-5">
      <div className="container mx-auto p-5 bg-primaryColor rounded-lg">
        <div className="my-5 flex justify-center">
          <input
            type="text"
            placeholder="Search doctors, clinics, hospitals, etc."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border rounded-lg"
            style={{ maxWidth: "600px" }}
          />
        </div>
        <div className="my-5 flex justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {commonSpecializations.map((specialization, index) => (
              <span
                key={index}
                className="cursor-pointer text-white px-3 py-1 rounded hover:bg-white hover:text-primaryColor"
                onClick={() => setSearchQuery(specialization)}
              >
                {specialization}
              </span>
            ))}
            {showAllSpecializations && (
              allSpecializations
                .filter(spec => !commonSpecializations.includes(spec))
                .map((specialization, index) => (
                  <span
                    key={index}
                    className="cursor-pointer text-white px-3 py-1 rounded hover:bg-white hover:text-primaryColor"
                    onClick={() => setSearchQuery(specialization)}
                  >
                    {specialization}
                  </span>
                ))
            )}
          </div>
          <div className="flex justify-center mt-3">
            <button
              onClick={toggleSpecializations}
              className="text-white px-3 py-1 rounded hover:bg-white hover:text-primaryColor"
            >
              {showAllSpecializations ? "Show Less" : "Show More"}
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <img src={loadingGif} alt="Loading..." />
        </div>
      ) : (
        <DoctorsList searchQuery={searchQuery} />
      )}
    </div>
  );
};

export default Doctors;
