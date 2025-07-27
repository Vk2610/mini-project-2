import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import
import RegistrationForm from "../../Components/RegistrationForm";
import AlreadySubmitted from "./AlreadySubmitted"; // Show when already submitted

const FormPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(null); // null while loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsSubmitted(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      console.log("Decoded ID:", userId);

      // API call to check submission status
      fetch(`http://localhost:3000/user/checkFormSubmitted/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API Response:", data); // Debug the response
          setIsSubmitted(data.isSubmitted || false);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error checking submission:", error);
          setIsSubmitted(false);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsSubmitted(false);
      setLoading(false);
    }
  }, []);

  if (loading) return <div>लोड होत आहे...</div>;

  return (
    <div className="p-4">
      {isSubmitted ? <AlreadySubmitted /> : <RegistrationForm />}
    </div>
  );
};

export default FormPage;