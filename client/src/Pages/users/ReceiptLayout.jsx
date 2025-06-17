import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import
import Receipt from "../users/Receipt"; // Component to create a receipt
// import AlreadySubmitted from "./AlreadySubmitted"; // Component to show if receipt is already created
import ReceiptCreated from "../../Components/ReceiptCreated";

const ReceiptLayout = () => {
  const [isReceiptCreated, setIsReceiptCreated] = useState(null); // null while loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsReceiptCreated(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      console.log("Decoded ID:", userId);

      // API call to check if the receipt is already created
      fetch(`http://localhost:3000/receipt/checkReceipt/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API Response:", data); // Debugging
          setIsReceiptCreated(data.isReceiptCreated || false);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error checking receipt:", error);
          setIsReceiptCreated(false);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsReceiptCreated(false);
      setLoading(false);
    }
  }, []);

  if (loading) return <div>लोड होत आहे...</div>;

  return (
    <div className="p-4">
      {isReceiptCreated ? <ReceiptCreated /> : <Receipt />}
    </div>
  );
};

export default ReceiptLayout;
