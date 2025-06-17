import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// PdfViewer component outside main component
const PdfViewer = ({ pdfUrl }) => (
  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
    <div style={{ height: "600px", width: "100%", maxWidth: "600px" }}>
      <Viewer fileUrl={pdfUrl} />
    </div>
  </Worker>
);

const AmountClaimPreview = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;
  const [form, setForm] = useState(null);

  const fetchform = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/claimAmt/getClaimAmtForm/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Receipt Data:", response.data.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching receipt data:", error);
      toast.error("Failed to fetch receipt data.");
      return null;
    }
  };

  useEffect(() => {
    fetchform().then((data) => {
      setForm(data);
    });
  }, []);

  // Add this state for tracking PDF loading
  const [pdfUrl, setPdfUrl] = useState(null);

  // Add this effect to transform Cloudinary URL
  useEffect(() => {
    if (form?.signature) {
      // Use the original Cloudinary URL to allow in-browser viewing
      setPdfUrl(form.signature);
    }
  }, [form?.signature]);

  // State for toggling PDF previews
  const [showPdf, setShowPdf] = useState({
    bankPassbook: false,
    receipt: false,
    familyWelfareLetter: false,
    serviceLetter: false,
    otherDocuments: false,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "__________";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // fallback if not a valid date
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Helper to render PDF section
  const renderPdfSection = (label, key, url) => (
    <div className="mt-8">
      {url ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
            <p className="font-semibold">{label} Preview</p>
            <button
              onClick={() =>
                setShowPdf((prev) => ({
                  ...prev,
                  [key]: !prev[key],
                }))
              }
              className="p-2 text-blue-500 hover:text-blue-700 transition-colors flex items-center"
            >
              {showPdf[key] ? <FaEyeSlash /> : <FaEye />}
              <span className="ml-2">{showPdf[key] ? "Hide" : "Show"}</span>
            </button>
          </div>
          {showPdf[key] && (
            <div className="flex justify-center py-4">
              <PdfViewer pdfUrl={url} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-500 italic">
          No {label.toLowerCase()} uploaded
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto border border-black p-8 bg-white shadow-md text-base leading-relaxed my-10 ">
      <ToastContainer />
      <div className="text-center">
        <h1 className="font-bold text-2xl mt-3 mb-12">Amount मागणी अर्ज</h1>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex-1">
          <p>HRMS NO: {form?.hrmsNo || "__________"}</p>
        </div>
        <div className="flex-1 text-right space-y-2">
          <p>पूर्ण नाव : {form?.name || "__________"}</p>
          <p>पत्रव्यवहाराचा पत्ता : {form?.address || "__________"}</p>
          <p>दिनांक : {formatDate(form?.date) || "__________"}</p>
          <p>मोबा. : {form?.mobile || "__________"}</p>
        </div>
      </div>

      <p className="mt-4 mb-4">
        मा.चेअरमन, <br />
        रयत सेवक कुटुंब कल्याण योजना, <br />
        रयत शिक्षण संस्था, सातारा <br />
        यांना……
      </p>

      <p className="mt-4 font-semibold underline text-lg mb-4">
        विषय - सेवक कुटुंब कल्याण योजने कडील रक्कम मिळण्याबाबत..
      </p>

      <p className="mt-4 mb-4">महोदय,</p>

      <p className="mt-3 mb-4">
        मी श्री./सौ. {form?.name || "__________"} दिनांक :{" "}
        {formatDate(form?.retirementDate) || "__________"} रोजी रोजी संस्थेच्या{" "}
        {form?.branch || "__________"} या शाखेतून सेवानिवृत्त झालो / झाले असून
        माझा सभासद क्रमांक {form?.memberId || "__________"} हा आहे. सदर
        क्रमांकावर जमा झालेली रक्कम मला बोनससह मिळावी, अशी विनंती आहे.
      </p>

      <p className="mb-4">रक्कम रू. :{form?.amount || "__________"} </p>
      <p className="mb-4">बोनस रू. :{form?.bonus || "__________"} </p>
      <p className="mb-4">एकूण रू. :{form?.totalAmount || "__________"} </p>

      <p className="mt-4 mb-4">
        वरील रयत सेवक कुटुंब कल्याण योजना सभासद वर्गणी व बोनस रक्कम माझ्या रयत
        सेवक को-ऑप. बँक लि., सातारा सेव्हिंग खाते नं.{" "}
        {form?.accountNumber || "__________"} शाखा{" "}
        {form?.bankBranch || "__________"} मध्ये जमा करण्यास माझी संमती आहे.
      </p>

      <p className="mt-4 mb-4">कळावे.</p>

      {/* Signature section remains unchanged */}
      <div className="mt-6 flex flex-col items-end gap-4">
        {form?.signature ? (
          <div className="flex flex-col items-center">
            <img
              src={form.signature}
              alt="User Signature"
              className="h-20 object-contain mb-2"
            />
            <div className="text-right font-medium">आपला विश्वासू</div>
          </div>
        ) : (
          <div className="text-gray-500 italic">No signature available</div>
        )}
      </div>

      {/* PDF Previews */}
      {renderPdfSection("Receipt", "receipt", form?.receipt)}
      {renderPdfSection(
        "Family Welfare Letter",
        "familyWelfareLetter",
        form?.familyWelfareLetter
      )}
      {renderPdfSection("Service Letter", "serviceLetter", form?.serviceLetter)}
      {renderPdfSection("Bank Passbook", "bankPassbook", form?.bankPassbook)}
      {renderPdfSection(
        "Other Documents",
        "otherDocuments",
        form?.otherDocuments
      )}
    </div>
  );
};

export default AmountClaimPreview;
