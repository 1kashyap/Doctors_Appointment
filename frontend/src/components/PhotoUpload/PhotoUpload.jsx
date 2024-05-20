import React, { useState, useEffect } from "react";

const PhotoUpload = ({ label, onPhotoChange, multiple = false }) => {
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    setPhotoPreviews([]);
  }, []);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prevPreviews) =>
      multiple ? [...prevPreviews, ...newPreviews] : newPreviews
    );
    onPhotoChange(files);
  };

  const handleRemovePhoto = (index) => {
    setPhotoPreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews];
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

  return (
    <div className="relative flex space-x-4">
      <label className="flex flex-col items-center justify-center w-60 h-40 border-2 border-dotted border-gray-400 rounded-lg cursor-pointer">
        <span className="text-2xl text-gray-500 mb-2">+</span>
        <span className="text-gray-500">{label}</span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handlePhotoChange}
          className="hidden"
        />
      </label>
      <div className="flex flex-wrap space-x-2">
        {photoPreviews.map((preview, index) => (
          <div
            key={index}
            className="relative w-60 h-40 rounded-lg overflow-hidden border-2 border-gray-300 group"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover opacity-70 transition-opacity duration-200 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-50"></div>
            <button
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full text-black hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.293-7.707a1 1 0 00-1.414 1.414L8.586 12 4.293 16.293a1 1 0 101.414 1.414L10 13.414l4.293 4.293a1 1 0 001.414-1.414L11.414 12l4.293-4.293a1 1 0 00-1.414-1.414L10 10.586 5.707 6.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUpload;

// import React, { useState, useEffect } from "react";

// const PhotoUpload = ({ label, onPhotoChange, multiple = false }) => {
//   const [photoPreviews, setPhotoPreviews] = useState([]);

//   useEffect(() => {
//     setPhotoPreviews([]);
//   }, []);

//   const handlePhotoChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newPreviews = files.map((file) => URL.createObjectURL(file));
//     setPhotoPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
//     onPhotoChange(files);
//   };

//   const handleRemovePhoto = (index) => {
//     setPhotoPreviews((prevPreviews) => {
//       const updatedPreviews = [...prevPreviews];
//       updatedPreviews.splice(index, 1);
//       return updatedPreviews;
//     });
//   };

//   return (
//     <div className="relative">
//       <div className="flex items-center space-x-2">
//         <label className="bg-primaryColor py-1 px-2 rounded-full text-white cursor-pointer">
//           {label}
//           <input
//             type="file"
//             accept="image/*"
//             multiple={multiple}
//             onChange={handlePhotoChange}
//             className="hidden"
//           />
//         </label>
//         {photoPreviews.map((preview, index) => (
//           <div key={index} className="relative w-20 h-16 rounded-lg overflow-hidden border-2 border-gray-300 group">
//             <img
//               src={preview}
//               alt="Preview"
//               className="w-full h-full object-cover opacity-70 transition-opacity duration-200 group-hover:opacity-100"
//             />
//             <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-50"></div>
//             <button
//               onClick={() => handleRemovePhoto(index)}
//               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full text-black hover:bg-gray-300 focus:outline-none"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.293-7.707a1 1 0 00-1.414 1.414L8.586 12 4.293 16.293a1 1 0 101.414 1.414L10 13.414l4.293 4.293a1 1 0 001.414-1.414L11.414 12l4.293-4.293a1 1 0 00-1.414-1.414L10 10.586 5.707 6.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PhotoUpload;
