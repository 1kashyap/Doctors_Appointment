import React, { useEffect, useState } from "react";
import { app } from "../../firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Modal Component
const Modal = ({ show, onClose, onConfirm, actionType }) => {
  if (!show) {
    return null;
  }

  const message =
    actionType === "delete"
      ? "Are you sure you want to delete this clinic?"
      : "Are you sure you want to disable/enable this clinic?";

  const confirmText = actionType === "delete" ? "Delete" : "Confirm";
  const confirmButtonClass =
    actionType === "delete" ? "bg-red-500" : "bg-teal-500";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-1/2 shadow-lg">
        <h3 className="text-2xl mb-4">Confirm Action</h3>
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ClinicAdmin = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [disableId, setDisableId] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const collectionRef = collection(db, "clinic");
        const snapshot = await getDocs(collectionRef);
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDisableEnable = (id) => {
    setDisableId(id);
    setActionType("disable");
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setActionType("delete");
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (actionType === "delete") {
      setData((prevData) => prevData.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } else if (actionType === "disable") {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === disableId
            ? {
                ...item,
                isDisabled: !item.isDisabled,
              }
            : item
        )
      );
      setDisableId(null);
    }
    setShowModal(false);
    setActionType("");
  };

  const handleModalClose = () => {
    setShowModal(false);
    setDeleteId(null);
    setDisableId(null);
    setActionType("");
  };

  const formatAddress = (address) => {
    const { line1, line2, city, state, country, pincode } = address;
    return `${line1}\n${line2}\n${city}\n${state}\n${country}\n${pincode}`;
  };

  return (
    <div>
      <h2 className="left-0 text-center text-3xl font-bold mb-4">
        Clinic Data
      </h2>
      <div className="w-fit">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item) => (
            <li
              key={item.id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              {/* Adjust image size and fit */}
              <div className="w-full h-56 flex justify-center items-center">
                <img
                  src={item.photos[0]}
                  alt="Clinic Photo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 text-xl">
                <p className="text-gray-500 font-medium mb-2">ID: {item.id}</p>
                <p className="text-2xl font-bold my-2">{item.name}</p>
                <ul>
                  {item.specialty && (
                    <li className="my-2 font-medium text-textColor">
                      <span className="font-semibold text-headingColor">
                        Specialty:{" "}
                      </span>
                      <span> {item.specialty}</span>
                    </li>
                  )}
                  {item.contactNumber && (
                    <li className="my-2 font-medium text-textColor">
                      <span className="font-semibold text-headingColor">
                        Contact Number:{" "}
                      </span>
                      <span>
                        {item.contactNumber.split("\n").map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </span>
                    </li>
                  )}
                  {item.address && (
                    <li className="my-2 font-medium text-textColor">
                      <span className="font-semibold text-headingColor">
                        Address:{" "}
                      </span>
                      <span>
                        {formatAddress(item.address)
                          .split("\n")
                          .map((line, index) => (
                            <React.Fragment key={index}>
                              {line},{" "}
                            </React.Fragment>
                          ))}
                      </span>
                    </li>
                  )}
                </ul>
                <div className=" text-lg mt-4 flex justify-between">
                  <button
                    onClick={() => handleDisableEnable(item.id)}
                    className={`px-10 py-2 rounded-full font-bold border-2 ${
                      item.isDisabled
                        ? "bg-teal-100 text-teal-900 border-teal-500 "
                        : "bg-gray-100 text-textColor border-gray-300 "
                    }`}
                  >
                    {item.isDisabled ? "Enable" : "Disable"}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="px-10 py-2 bg-red-500 text-white rounded-full font-bold border-red-700 border-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        show={showModal}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
        actionType={actionType}
      />
    </div>
  );
};

export default ClinicAdmin;
