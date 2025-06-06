import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const DocumentPreview = ({ url, type, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="border-b p-4 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold">{type}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaEyeSlash className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
            {url && url.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={url}
                title={`${type} Preview`}
                className="w-full h-[70vh]"
                loading="lazy"
              />
            ) : (
              <img
                src={url}
                alt={`${type} Preview`}
                className="w-full h-auto max-h-[70vh] object-contain p-4"
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AmountClaimPreview = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreviews, setShowPreviews] = useState({
    signature: false,
    receipt: false,
    serviceLetter: false,
    familyWelfareLetter: false,
    bankPassbook: false,
    otherDocuments: false,
  });

  // Update useEffect to properly handle the response data
  useEffect(() => {
    const fetchClaimData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/claimAmt/getClaimAmtForm/${id}`
        );
        console.log("Fetched data:", response.data); // Debug log
        setData(response.data);
      } catch (error) {
        console.error("Error fetching claim data:", error);
        toast.error("Failed to fetch claim data");
      } finally {
        setLoading(false);
      }
    };

    fetchClaimData();
  }, [id]);

  const togglePreview = (documentType) => {
    setShowPreviews((prev) => ({
      ...prev,
      [documentType]: !prev[documentType],
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  const documents = [
    {
      key: "signature",
      type: "Signature",
      label: "सही",
    },
    {
      key: "receipt",
      type: "Receipt",
      label: "पावती",
    },
    {
      key: "serviceLetter",
      type: "Service Letter",
      label: "सेवा पत्र",
    },
    {
      key: "familyWelfareLetter",
      type: "Family Welfare Letter",
      label: "कुटुंब कल्याण पत्र",
    },
    {
      key: "bankPassbook",
      type: "Bank Passbook",
      label: "बँक पासबुक",
    },
    {
      key: "otherDocuments",
      type: "Other Documents",
      label: "इतर कागदपत्रे",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto border border-black p-8 bg-white shadow-md text-base leading-relaxed my-10">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-8">Amount मागणी अर्ज</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          HRMS No: <span className="font-semibold">{data.hrmsNo}</span>
        </div>
        <div>
          पूर्ण नाव: <span className="font-semibold">{data.name}</span>
        </div>
        <div>
          पत्ता: <span className="font-semibold">{data.address}</span>
        </div>
        <div>
          दिनांक:{" "}
          <span className="font-semibold">
            {new Date(data.date).toLocaleDateString()}
          </span>
        </div>
        <div>
          मोबाईल: <span className="font-semibold">{data.mobile}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-4">
          मी श्री./श्रीमती {data.name} दिनांक{" "}
          {new Date(data.retirementDate).toLocaleDateString()}
          रोजी संस्थेच्या {data.branch} या शाखेतून सेवानिवृत्त झालो/झाले असून
          माझा सभासद क्रमांक {data.memberId} हा आहे.
        </p>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            रक्कम रू.: <span className="font-semibold">{data.amount}</span>
          </div>
          <div>
            बोनस रू.: <span className="font-semibold">{data.bonus}</span>
          </div>
          <div>
            एकूण रू.: <span className="font-semibold">{data.totalAmount}</span>
          </div>
        </div>

        <p>
          वरील रक्कम माझ्या खाते क्र. {data.accountNumber},{data.bankBranch}{" "}
          शाखा मध्ये जमा करण्यास माझी संमती आहे.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-4">अपलोड केलेली कागदपत्रे:</h3>
        <div className="space-y-4">
          {documents.map(({ key, type, label }) => {
            const url = data[key];
            return url ? (
              <div
                key={key}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="font-medium">
                  {type} ({label})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePreview(key)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    {showPreviews[key] ? <FaEyeSlash /> : <FaEye />}
                    <span>कागदपत्र पहा</span>
                  </button>
                  {showPreviews[key] && (
                    <DocumentPreview
                      url={url}
                      type={type}
                      onClose={() => togglePreview(key)}
                    />
                  )}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default AmountClaimPreview;
