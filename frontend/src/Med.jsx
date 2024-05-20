import React, { useEffect, useState } from "react";
import { app } from "./firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const Just = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const collectionRef = collection(db, "users");
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

  return (
    <div>
      <h2 className="text-center text-3xl font-bold mb-4">Firestore Data</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <li key={item.id} className="border rounded-lg overflow-hidden shadow-md">
            {/* Adjust image size and fit */}
            <div className="w-full h-48 flex justify-center items-center">
              <img src={item.photo} alt="User Photo" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <p className="text-xl font-semibold">{item.name}</p>
              <ul>
                {/* Exclude displaying the ID */}
                {Object.entries(item).map(([key, value]) => (
                  key !== "photo" && key !== "id" && key !== "name" && (
                    key === "email" ? (
                      <li key={key}>
                        <span className="font-semibold">{key}: </span>
                        <span>{value}</span>
                      </li>
                    ) : null
                  )
                ))}
                {Object.entries(item).map(([key, value]) => (
                  key !== "photo" && key !== "id" && key !== "name" && (
                    key === "role" ? (
                      <li key={key}>
                        <span className="font-semibold">{key}: </span>
                        <span>{value}</span>
                      </li>
                    ) : null
                  )
                ))}
                {Object.entries(item).map(([key, value]) => (
                  key !== "photo" && key !== "id" && key !== "name" && (
                    key === "gender" ? (
                      <li key={key}>
                        <span className="font-semibold">{key}: </span>
                        <span>{value}</span>
                      </li>
                    ) : null
                  )
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Just;
