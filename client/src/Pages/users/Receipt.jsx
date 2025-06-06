import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Receipt = () => {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sign, setSign] = useState(null);
  const [userId, setUserId] = useState(null);

  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    address: "",
    mobile: "",
    amount: "",
    accountNumber: "",
    totalAmount: "",
    sendDate: "",
    signature: "",
    receipt: "",
    serviceLetter: "",
    bankPassbook: "",
    otherDocuments: "",
  });

  // Extract userId from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const extractedUserId = decoded.id;
        setUserId(extractedUserId);
        setFormData((prev) => ({
          ...prev,
          id: extractedUserId,
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
        toast.error("Invalid authentication token");
      }
    } else {
      toast.error("No authentication token found");
    }
  }, []);

  // Update the file upload function
  const fileUploadFunc = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload-pdf",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          validateStatus: (status) => status < 500, // Handle HTTP errors properly
        }
      );

      if (!response.data?.url) {
        throw new Error("Invalid response from server");
      }

      setUploadUrl(response.data.url);
      setSign(response.data.url);
      setFormData((prevData) => ({
        ...prevData,
        signature: response.data.url,
      }));

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate mobile number
    if (name === "mobile" && value.length > 10) {
      return;
    }

    // Validate name length
    if (name === "name" && value.length > 100) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update the form submission function
  const handleReceiptSubmit = async (e) => {
    e.preventDefault();

    if (!formData.signature) {
      toast.error("Please upload a signature document");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/receipt/createReceipt`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (response.data?.success) {
        toast.success("पावती यशस्वीरित्या तयार केली!");
        // Reset form
        setFormData({
          id: userId,
          name: "",
          address: "",
          mobile: "",
          amount: "",
          accountNumber: "",
          totalAmount: "",
          sendDate: "",
          signature: "",
        });
        setFile(null);
        setPreviewUrl(null);
        setUploadUrl("");
        setSign(null);
      } else {
        throw new Error(response.data?.message || "Failed to create receipt");
      }
    } catch (error) {
      console.error("Error submitting receipt:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setFile(selectedFile);
      const fileURL = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileURL);

      // Don't update formData.signature here - wait for actual upload
      // setFormData((prev) => ({
      //   ...prev,
      //   signature: fileURL,
      // }));
    }
  };

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="max-w-6xl mx-auto p-10 border shadow-xl my-10">
      <ToastContainer position="top-right" />
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
            type="tel"
            className="w-full border-b p-2 my-2"
            placeholder="मोबाईल नं"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            required
            maxLength={10}
            pattern="[0-9]{10}"
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
                  type="number"
                  className="w-full p-2 border-b border-dotted"
                  placeholder="रक्कम"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
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
          <span className="block">एकूण रुपये (अंकी):</span>
          <input
            type="number"
            className="w-full border-b p-2 my-2"
            placeholder="कृपया रक्कम प्रविष्ट करा"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <label className="block mb-2">Upload Signature Document:</label>
            <input
              type="file"
              className="w-full border rounded p-2"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
          </div>

          {previewUrl && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              {file && file.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-96 object-contain"
                />
              ) : (
                <embed
                  src={previewUrl}
                  type="application/pdf"
                  className="w-[50vw] h-[200px]"
                />
              )}
            </div>
          )}

          <div className="text-right mt-4">
            <div>पैसे घेणाऱ्याची सही</div>
            <div>(पावती तिकीट लावून)</div>
          </div>

          {file && !formData.signature && (
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={fileUploadFunc}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload Document
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!formData.signature}
          >
            Submit Receipt
          </button>
        </div>
      </form>
    </div>
  );
};

export default Receipt;
