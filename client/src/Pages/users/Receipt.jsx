import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const Receipt = () => {
  const token = localStorage.getItem("token");
  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  const [formData, setFormData] = useState({
    id: userId,
    name: "",
    address: "",
    mobile: "",
    amount: "",
    accountNumber: "",
    totalAmount: "",
    sendDate: "", // Added sendDate to formData
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReceiptSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.name ||
      !formData.address ||
      !formData.mobile ||
      !formData.amount ||
      !formData.accountNumber ||
      !formData.totalAmount ||
      !formData.sendDate
    ) {
      toast.error("कृपया सर्व माहिती भरा."); // "Please fill in all the details."
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/receipt/createReceipt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success("Receipt created successfully!");
        console.log("Receipt created:", result);
        // Optionally, redirect or reset the form
      } else {
        toast.error(
          result.message || "Failed to create receipt. Please try again."
        );
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error submitting receipt:", error);
      toast.error("An error occurred while creating the receipt.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 border xl shadow my-10">
      <ToastContainer />
      <h1 className="text-center text-xl font-bold mb-2">खर्चाची पावती</h1>
      <div className="text-right mb-4">
        दिनांक:
        <span>
          <input
            type="date"
            name="sendDate"
            value={formData.sendDate}
            onChange={handleInputChange}
            className="border-b p-2 ml-2"
            required
          />
        </span>
      </div>
      <div className="text-center font-semibold text-lg">
        <div>रयत शिक्षण संस्था, सातारा</div>
        <div>रयत सेवक कुटुंब कल्याण योजना</div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleReceiptSubmit}>
        <div>
          <span className="block">पावती लिहून देणाऱ्याचे नाव:</span>
          <input
            type="text"
            className="w-full border-b p-2 my-2"
            placeholder="संपूर्ण नाव"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            maxLength={100}
          />
        </div>
        <div>
          <span className="block">शाखा / राहणार:</span>
          <input
            type="text"
            className="w-full border-b p-2 my-2"
            placeholder="पत्ता"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <p className="mt-2">
          पावती लिहून देतो की, खालील तपशील प्रमाणे आज रोजी पैसे मिळाले. काही
          तक्रार नाही.
        </p>
        <div>
          <span className="block">संपर्क क्रमांक:</span>
          <input
            type="text"
            className="w-full border-b p-2 my-2"
            placeholder="मोबाईल नं"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            required
            maxLength={10}
          />
        </div>

        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">खाते - वर्गणी व बोनस</th>
              <th className="border px-2 py-1">तपशील</th>
              <th className="border px-2 py-1">रुपये</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">
                रयत सेवक कुटुंब कल्याण योजनेतील
              </td>
              <td className="border px-2 py-1">वर्गणीची व बोनसाची रक्कम</td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  className="w-full p-2 border-b border-dotted"
                  placeholder="रक्कम"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1">
                रयत सेवक को-ऑप. बँक लि., सातारा शाखा
              </td>
              <td className="border px-2 py-1 text-center">खाते क्र.</td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  className="w-full p-2 border-b border-dotted"
                  placeholder="खाते क्र."
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1">अन्वये मिळाली</td>
              <td className="border px-2 py-1">इ.</td>
              <td className="border px-2 py-1"></td>
            </tr>
          </tbody>
        </table>

        <div>
          <span className="flex">एकूण रुपये (अंकी):</span>
          <input
            type="text"
            className="w-full border-b p-2 my-2"
            placeholder="कृपया रक्कम प्रविष्ट करा"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mt-6 text-right">
          <input type="file" className="w-30 border rounded p-2 my-2" />
          <div>पैसे घेणाऱ्याची सही</div>
          <div>(पावती तिकीट लावून)</div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Receipt;
