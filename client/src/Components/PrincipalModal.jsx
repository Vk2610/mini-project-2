import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import AdminModal from '../Components/AdminModal'

const PrincipalModal = ({ name, designation, setPrincipalSignature }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }
      setFile(selectedFile);
      const fileURL = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileURL);
    }
  };

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
        }
      );

      if (!response.data?.url) {
        throw new Error("Invalid response from server");
      }

      // Pass the URL up to parent component
      setPrincipalSignature(response.data.url);
      toast.success("Signature uploaded successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload signature"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };

  return (
    <div className="mt-8 border-t-2 border-gray-300 pt-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="text-lg font-semibold">मा. शाखाप्रमुख,</p>
          <p>यांचेमार्फत रवाना,</p>
        </div>

        <div className="ml-4 space-y-2">
          <div className="flex items-center gap-2">
            <p className="min-w-[100px]">श्री./ श्रीमती :</p>
            <span className="font-medium">{name}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="min-w-[100px]">हुद्दा :</p>
            <span className="font-medium">{designation}</span>
          </div>
        </div>

        <div className="mt-4 space-y-6">
          <p className="text-justify leading-relaxed">
            यांच्या अर्जातील सर्व माहिती शाखेतील रेकॉर्डनुसार बरोबर व सत्य असून
            त्यांना सभासद करून घेण्यास शिफारस आहे.
          </p>

          <div className="flex justify-between items-start mt-8">
            <div className="flex items-center gap-2">
              <p>तारीख :</p>
              <span>{formatDate(new Date())}</span>
            </div>
            <div>
              <div className="flex justify-end mt-4">
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="border border-gray-300 rounded p-2 mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={fileUploadFunc}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Upload
                    </button>
                    {previewUrl && (
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                        title={showPreview ? "Hide Preview" : "Show Preview"}
                      >
                        {showPreview ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>
                  {showPreview && previewUrl && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">
                            Signature Preview
                          </h3>
                          <button
                            onClick={() => setShowPreview(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaEyeSlash />
                          </button>
                        </div>
                        <img
                          src={previewUrl}
                          alt="Principal Signature Preview"
                          className="w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="font-medium">शाखा प्रमुख सही व शिक्का</div>
            </div>
          </div>
        </div>
      </div>
      {/* <AdminModal /> */}
    </div>
  );
};

export default PrincipalModal;
