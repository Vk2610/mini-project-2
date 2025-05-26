import React, { useState } from "react";
import ViewForm from "../../Components/ViewForm";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io"; // Import the close icon

const AlreadySubmitted = () => {
  const [showViewForm, setShowViewForm] = useState(false); // State to toggle ViewForm

  const handleButtonClick = () => {
    setShowViewForm(true); // Show the ViewForm component when the button is clicked
  };

  const handleCloseForm = () => {
    setShowViewForm(false); // Hide the ViewForm component when the close button is clicked
  };

  return ( 
    <div className="relative">
      {!showViewForm ? (
        <div>
          <p>You have already submitted the form. Thank you!</p>
          <Button className="mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleButtonClick}>View Submitted Form</Button>
        </div>
      ) : (
        <div className="relative">
          {/* Close button with IoMdClose icon */}
          <button
            onClick={handleCloseForm}
            className="absolute top-2 right-2 bg-red-600 text-white hover:bg-red-700 transition border rounded-lg w-10 h-10 flex items-center justify-center"
          >
            <IoMdClose size={28} /> {/* Close icon with increased size */}
          </button>
          <ViewForm /> {/* Render the ViewForm component */}
        </div>
      )}
    </div>
  );
};

export default AlreadySubmitted;