import React from "react";
import Sidebar from "../Components/Sidebar";
import RegistrationForm from "../Components/RegistrationForm";

const FormPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Registration Form */}
      <div className="flex-grow overflow-y-auto">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default FormPage;
