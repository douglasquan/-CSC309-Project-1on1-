import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import BasicTabs from "../components/Tab";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getNotes();
  }, []);

  let getNotes = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/notes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setNotes(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  // Dummy state for modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Dummy function to handle deletion, you can replace it with your actual function
  const handleDelete = (itemId) => {
    console.log("Deleting item with id: ", itemId);
    // Perform deletion operation
  };

  // Dummy function to show modal
  const handleRequestAvailability = () => {
    setIsModalVisible(true);
  };

  return (
    <div className='flex min-h-screen'>
      <div className='w-1/3 border-r border-gray-300'>
        {/* Left container with tabs */}
        <BasicTabs />
      </div>
      <div className='w-2/3 p-4'>
        {/* Right container */}
        {/* Temporary placeholder content */}
        <div className='bg-gray-100 p-8 rounded shadow'>
          Content associated with the selected tab will be displayed here.
        </div>
        {/* End of placeholder content */}
      </div>
    </div>
  );
};

export default HomePage;
