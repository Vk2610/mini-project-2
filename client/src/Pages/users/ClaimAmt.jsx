import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ClaimAmt = () => {
  // State variables for form inputs
  const [hrmsNo, setHrmsNo] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [mobile, setMobile] = useState("");
  const [retireDate, setRetireDate] = useState("");
  const [memberId, setMemberId] = useState("");
  const [branch, setBranch] = useState("");
  const [amount, setAmount] = useState("");
  const [bonus, setBonus] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankBranch, setBankBranch] = useState("");

  const [files, setFiles] = useState({
    signature: null,
    receipt: null,
    serviceLetter: null,
    familyWelfareLetter: null,
    bankPassbook: null,
    otherDocuments: null,
  });

  const [previews, setPreviews] = useState({
    signature: null,
    receipt: null,
    serviceLetter: null,
    familyWelfareLetter: null,
    bankPassbook: null,
    otherDocuments: null,
  });

  const [showPreviews, setShowPreviews] = useState({
    signature: false,
    receipt: false,
    serviceLetter: false,
    familyWelfareLetter: false,
    bankPassbook: false,
    otherDocuments: false,
  });

  const [fileUrls, setFileUrls] = useState({
    signature: "",
    receipt: "",
    serviceLetter: "",
    familyWelfareLetter: "",
    bankPassbook: "",
    otherDocuments: "",
  });

  const handleClaimAmt = async (e) => {
    e.preventDefault();

    // Check if signature is uploaded
    if (!fileUrls.signature) {
      toast.error("कृपया सही अपलोड करा");
      return;
    }

    // Check for other required files
    const requiredFiles = [
      "receipt",
      "serviceLetter",
      "familyWelfareLetter",
      "bankPassbook",
    ];
    const missingFiles = requiredFiles.filter((file) => !fileUrls[file]);

    if (missingFiles.length > 0) {
      toast.error("कृपया सर्व आवश्यक कागदपत्रे अपलोड करा");
      return;
    }

    const totalAmount = parseFloat(amount || 0) + parseFloat(bonus || 0);
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const id = decoded.id;

    const claimData = {
      id,
      hrmsNo,
      name,
      address,
      date,
      mobile,
      retirementDate: retireDate,
      memberId,
      branch,
      amount,
      bonus,
      totalAmount,
      accountNumber,
      bankBranch,
      signature: fileUrls.signature,
      receipt: fileUrls.receipt,
      serviceLetter: fileUrls.serviceLetter,
      familyWelfareLetter: fileUrls.familyWelfareLetter,
      bankPassbook: fileUrls.bankPassbook,
      otherDocuments: fileUrls.otherDocuments,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/claimAmt/saveClaimAmt",
        claimData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Claim amount submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });

        // Reset form fields
        setHrmsNo("");
        setName("");
        setAddress("");
        setDate("");
        setMobile("");
        setRetireDate("");
        setMemberId("");
        setBranch("");
        setAmount("");
        setBonus("");
        setAccountNumber("");
        setBankBranch("");

        // Reset file states and previews
        setFiles({
          signature: null,
          receipt: null,
          serviceLetter: null,
          familyWelfareLetter: null,
          bankPassbook: null,
          otherDocuments: null,
        });
        setPreviews({
          signature: null,
          receipt: null,
          serviceLetter: null,
          familyWelfareLetter: null,
          bankPassbook: null,
          otherDocuments: null,
        });
        setFileUrls({
          signature: "",
          receipt: "",
          serviceLetter: "",
          familyWelfareLetter: "",
          bankPassbook: "",
          otherDocuments: "",
        });
      }
    } catch (error) {
      console.error("Error submitting claim amount:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit claim amount.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: previewUrl,
      }));
    }
  };

  const uploadFile = async (fieldName) => {
    if (!files[fieldName]) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[fieldName]);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.url) {
        setFileUrls((prev) => ({
          ...prev,
          [fieldName]: response.data.url,
        }));
        toast.success(`${fieldName} uploaded successfully!`);
      }
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      toast.error(`Failed to upload ${fieldName}`);
    }
  };

  const togglePreview = (fieldName) => {
    setShowPreviews((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview) => {
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  return (
    <div className="max-w-6xl mx-auto border border-black p-8 bg-white shadow-md text-base leading-relaxed my-10 ">
      <ToastContainer />
      <form onSubmit={handleClaimAmt}>
        <div className="text-center">
          <h1 className="font-bold text-2xl mt-3 mb-12">Amount मागणी अर्ज</h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <p>
              HRMS NO:{" "}
              <input
                type="text"
                value={hrmsNo}
                onChange={(e) => setHrmsNo(e.target.value)}
                className="border-b border-black ml-2 w-44"
              />
            </p>
          </div>
          <div className="flex-1 text-right space-y-2">
            <p>
              पूर्ण नाव:{" "}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b border-black ml-2 w-66"
              />
            </p>
            <p>
              पत्रव्यवहाराचा पत्ता:{" "}
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-b border-black ml-2 w-66"
              />
            </p>
            <p>
              दिनांक:{" "}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-b border-black ml-2 w-44"
              />
            </p>
            <p>
              मोबा.:{" "}
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border-b border-black ml-2 w-44"
              />
            </p>
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
          मी श्री./सौ.{" "}
          <input
            type="text"
            className="border-b border-black w-52"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />{" "}
          दिनांक:{" "}
          <input
            type="date"
            value={retireDate}
            onChange={(e) => setRetireDate(e.target.value)}
            className="border-b border-black px-2"
          />{" "}
          रोजी संस्थेच्या{" "}
          <input
            type="text"
            className="border-b border-black w-52"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />{" "}
          या शाखेतून सेवानिवृत्त झालो / झाले असून माझा सभासद क्रमांक{" "}
          <input
            type="text"
            className="border-b border-black w-36"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />{" "}
          हा आहे.
        </p>

        <p className="mb-4">
          सदर क्रमांकावर जमा झालेली रक्कम मला बोनससह मिळावी, अशी विनंती आहे.
        </p>

        <p className="mb-4">
          रक्कम रू. :{" "}
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-b border-black w-36"
          />
        </p>
        <p className="mb-4">
          बोनस रू. :{" "}
          <input
            type="text"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            className="border-b border-black w-36"
          />
        </p>
        <p className="mb-4">
          एकूण रू. :{" "}
          <input
            type="text"
            value={parseFloat(amount || 0) + parseFloat(bonus || 0)}
            readOnly
            className="border-b border-black w-36"
          />
        </p>

        <p className="mt-4 mb-4">
          वरील रयत सेवक कुटुंब कल्याण योजना सभासद वर्गणी व बोनस रक्कम माझ्या रयत
          सेवक को-ऑप. बँक लि., सातारा सेव्हिंग खाते नं.{" "}
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="border-b border-black w-52"
          />{" "}
          शाखा{" "}
          <input
            type="text"
            value={bankBranch}
            onChange={(e) => setBankBranch(e.target.value)} // Fix this line
            className="border-b border-black w-52"
          />{" "}
          मध्ये जमा करण्यास माझी संमती आहे.
        </p>

        <p className="mt-4 mb-4">कळावे.</p>

        <div className="mt-6 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "signature")}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {files["signature"] && (
              <>
                <button
                  type="button"
                  onClick={() => uploadFile("signature")}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => togglePreview("signature")}
                  className="p-2 text-blue-500 hover:text-blue-700"
                >
                  {showPreviews["signature"] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </>
            )}
          </div>
          {showPreviews["signature"] && previews["signature"] && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="border-b p-4 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-semibold">Signature Preview</h3>
                  <button
                    onClick={() => togglePreview("signature")}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaEyeSlash className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 bg-gray-50">
                  <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
                    {files["signature"]?.type.startsWith("image/") ? (
                      <img
                        src={previews["signature"]}
                        alt="Signature Preview"
                        className="w-full h-auto max-h-[70vh] object-contain p-4"
                      />
                    ) : (
                      <embed
                        src={previews["signature"]}
                        type="application/pdf"
                        className="w-full h-[70vh]"
                      />
                    )}
                  </div>
                </div>

                <div className="border-t p-4 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => togglePreview("signature")}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="text-right">आपला विश्वासू</div>
        </div>

        <p className="mt-8 font-semibold underline text-lg mb-4">सोबत :</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">1. खर्चाची पावती (नाव व सही केलेली)</span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "receipt")}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {files["receipt"] && (
                <>
                  <button
                    type="button"
                    onClick={() => uploadFile("receipt")}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePreview("receipt")}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    {showPreviews["receipt"] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </>
              )}
            </div>
            {showPreviews["receipt"] && previews["receipt"] && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  {/* Header */}
                  <div className="border-b p-4 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold">Document Preview</h3>
                    <button
                      onClick={() => togglePreview("receipt")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FaEyeSlash className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
                      {files["receipt"]?.type.startsWith("image/") ? (
                        <img
                          src={previews["receipt"]}
                          alt="Preview"
                          className="w-full h-auto max-h-[70vh] object-contain p-4"
                        />
                      ) : (
                        <embed
                          src={previews["receipt"]}
                          type="application/pdf"
                          className="w-full h-[70vh]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button
                      onClick={() => togglePreview("receipt")}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">
              2. संस्थेचे सेवापुनर्वसन पत्र (झेरॉक्स प्रत)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "serviceLetter")}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {files["serviceLetter"] && (
                <>
                  <button
                    type="button"
                    onClick={() => uploadFile("serviceLetter")}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePreview("serviceLetter")}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    {showPreviews["serviceLetter"] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </>
              )}
            </div>
            {showPreviews["serviceLetter"] && previews["serviceLetter"] && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  {/* Header */}
                  <div className="border-b p-4 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold">Document Preview</h3>
                    <button
                      onClick={() => togglePreview("serviceLetter")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FaEyeSlash className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
                      {files["serviceLetter"]?.type.startsWith("image/") ? (
                        <img
                          src={previews["serviceLetter"]}
                          alt="Preview"
                          className="w-full h-auto max-h-[70vh] object-contain p-4"
                        />
                      ) : (
                        <embed
                          src={previews["serviceLetter"]}
                          type="application/pdf"
                          className="w-full h-[70vh]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button
                      onClick={() => togglePreview("serviceLetter")}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">
              3. कुटुंब कल्याण सभासद पत्र (मूळ प्रत)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "familyWelfareLetter")}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {files["familyWelfareLetter"] && (
                <>
                  <button
                    type="button"
                    onClick={() => uploadFile("familyWelfareLetter")}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePreview("familyWelfareLetter")}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    {showPreviews["familyWelfareLetter"] ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </>
              )}
            </div>
            {showPreviews["familyWelfareLetter"] &&
              previews["familyWelfareLetter"] && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="border-b p-4 flex justify-between items-center bg-gray-50">
                      <h3 className="text-lg font-semibold">
                        Document Preview
                      </h3>
                      <button
                        onClick={() => togglePreview("familyWelfareLetter")}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <FaEyeSlash className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-gray-50">
                      <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
                        {files["familyWelfareLetter"]?.type.startsWith(
                          "image/"
                        ) ? (
                          <img
                            src={previews["familyWelfareLetter"]}
                            alt="Preview"
                            className="w-full h-auto max-h-[70vh] object-contain p-4"
                          />
                        ) : (
                          <embed
                            src={previews["familyWelfareLetter"]}
                            type="application/pdf"
                            className="w-full h-[70vh]"
                          />
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4 bg-gray-50 flex justify-end">
                      <button
                        onClick={() => togglePreview("familyWelfareLetter")}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">4. बँक पासबुक (झेरॉक्स प्रत)</span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "bankPassbook")}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {files["bankPassbook"] && (
                <>
                  <button
                    type="button"
                    onClick={() => uploadFile("bankPassbook")}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePreview("bankPassbook")}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    {showPreviews["bankPassbook"] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </>
              )}
            </div>
            {showPreviews["bankPassbook"] && previews["bankPassbook"] && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  {/* Header */}
                  <div className="border-b p-4 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold">Document Preview</h3>
                    <button
                      onClick={() => togglePreview("bankPassbook")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FaEyeSlash className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
                      {files["bankPassbook"]?.type.startsWith("image/") ? (
                        <img
                          src={previews["bankPassbook"]}
                          alt="Preview"
                          className="w-full h-auto max-h-[70vh] object-contain p-4"
                        />
                      ) : (
                        <embed
                          src={previews["bankPassbook"]}
                          type="application/pdf"
                          className="w-full h-[70vh]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button
                      onClick={() => togglePreview("bankPassbook")}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">5. इतर दस्तऐवज (झेरॉक्स प्रत)</span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "otherDocuments")}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {files["otherDocuments"] && (
                <>
                  <button
                    type="button"
                    onClick={() => uploadFile("otherDocuments")}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePreview("otherDocuments")}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    {showPreviews["otherDocuments"] ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </>
              )}
            </div>
            {showPreviews["otherDocuments"] && previews["otherDocuments"] && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  {/* Header */}
                  <div className="border-b p-4 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold">Document Preview</h3>
                    <button
                      onClick={() => togglePreview("otherDocuments")}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FaEyeSlash className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
                      {files["otherDocuments"]?.type.startsWith("image/") ? (
                        <img
                          src={previews["otherDocuments"]}
                          alt="Preview"
                          className="w-full h-auto max-h-[70vh] object-contain p-4"
                        />
                      ) : (
                        <embed
                          src={previews["otherDocuments"]}
                          type="application/pdf"
                          className="w-full h-[70vh]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button
                      onClick={() => togglePreview("otherDocuments")}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="w-xl py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            सबमिट करा
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimAmt;
