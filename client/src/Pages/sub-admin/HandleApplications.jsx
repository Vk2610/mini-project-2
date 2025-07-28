import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrincipalModal from "../../Components/PrincipalModal";
import ShowPayment from "../../Components/ShowPayment";

const HandleApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [principalSignature, setPrincipalSignature] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  useEffect(() => {
    // Fetch application details by ID
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        console.log("Fetching form with ID:", id);

        const response = await axios.get(
          `http://localhost:3000/user/getFormData/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Application response:", response.data);

        if (response.data) {
          setApplication(response.data);
          setLoading(false);
        } else {
          throw new Error("No application data found");
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast.error(error.message || "Failed to fetch application details");
      }
    };
    fetchApplication();
  }, [id]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (2MB limit)
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }

      setFile(selectedFile);
      const fileURL = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileURL);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      // For approved status, require principal signature
      if (status === "approved" && !principalSignature) {
        toast.error("Please upload principal signature first");
        return;
      }

      const data = {
        status,
        remarks: status === "rejected" ? remarks : "Application Approved",
        principal_sign_stamp: principalSignature, // Include the signature URL
        approval_date: new Date().toISOString().split("T")[0],
      };

      const response = await axios.put(
        `http://localhost:3000/sub-admin/application-form/${id}/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        toast.success(`Application ${status} successfully`);
        setApplication((prev) => ({
          ...prev,
          Status: status,
          remarks: status === "rejected" ? remarks : "Application Approved",
          principal_sign_stamp: principalSignature,
        }));
        setTimeout(() => navigate("/sub-admin/manage-applications"), 2000);
      } else {
        throw new Error(`Failed to ${status} application`);
      }
    } catch (error) {
      console.error(`Error updating status:`, error);
      toast.error(error.message || `Failed to ${status} application`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Application not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer />
      {/* Form preview */}
      <div className="p-6 max-w-6xl mx-auto font-sans">
        <ToastContainer />
        <div className="border p-14 border-black">
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <p className="font-bold">रयत शिक्षण संस्था, सातारा</p>
              <p className="font-bold">रयत सेवक कुटुंब कल्याण योजना </p>
              <p>(वर्गणीदार होण्यासाठीचा करावयाचा अर्ज व संमतीपत्रक)</p>
            </div>
            <div className="border border-black w-1/4 h-14 flex items-center justify-center">
              <label>सभासद क्र. KK-</label>
              <span className="ml-2">{application.memberNo}</span>
            </div>
          </div>

          <div className="mt-6">
            <p>प्रति,</p>
            <p>मा. चेअरमन,</p>
            <p>रयत सेवक कुटुंब कल्याण योजना</p>
            <p>रयत शिक्षण संस्था, सातारा</p>
            <p>यांना--</p>
          </div>

          <div className="mt-4">
            <p>
              महोदय,
              <br />
              रयत सेवक कुटुंब कल्याण योजनेची घटना व नियम मी वाचले असून ते मला
              मान्य आहेत.त्यासाठी या अर्जासोबत नियमाप्रमाणे प्रवेश फी रु. १००/-
              व वर्गणी रु. ५०००/- ही एप्रिल {new Date().getFullYear()} ते मार्च{" "}
              {new Date().getFullYear() + 1} या आर्थिक वर्षात सामान ५ हप्त्याने
              माझ्या पगारातून कपात करून रयत सेवक कुटुंब कल्याण योजनेकडे
              पाठविणेबाबत मी माझ्या शाखाप्रमुखांना संमती देत आहे . तरी मला रयत
              सेवक कुटुंब कल्याण योजनेचे सभासद करून घ्यावे.
            </p>
          </div>

          <h2 className="font-bold mt-6 underline text-center">
            माझी माहिती खालीलप्रमाणे आहे
          </h2>

          <div className="space-y-4 mt-4">
            <div>
              <label>संपूर्ण नाव: </label>
              <span className="ml-2">{application.name}</span>
            </div>

            <div>
              <label>हुद्दा: </label>
              <span className="ml-2">{application.designation}</span>
            </div>

            <div>
              <label>शाखा: </label>
              <span className="ml-2">{application.branch}</span>
            </div>

            <div>
              <label>कायमचा पत्ता: </label>
              <span className="ml-2">{application.permanentAddress}</span>
            </div>

            <div>
              <label>Mobile No: </label>
              <span className="ml-2">{application.mobile}</span>
            </div>

            <div>
              <label>Email: </label>
              <span className="ml-2">{application.email}</span>
            </div>

            <div>
              <label>संस्थेतील नेमणूक तारीख: </label>
              <span className="ml-2">
                {formatDate(application.appointmentDate)}
              </span>
            </div>

            <div>
              <label>कायम झाल्याची तारीख: </label>
              <span className="ml-2">
                {formatDate(application.confirmationDate)}
              </span>
            </div>

            <div>
              <label>जन्म तारीख: </label>
              <span className="ml-2">{formatDate(application.birthDate)}</span>
            </div>

            <div>
              <label>सेवानिवृत्ती तारीख: </label>
              <span className="ml-2">
                {formatDate(application.retirementDate)}
              </span>
            </div>

            <div>
              <label>दि रयत सेवक कॉ-ऑफ बँकेचा सभासद क्र.: </label>
              <span className="ml-2">{application.bankMemberNo}</span>
            </div>

            <div>
              <label>
                ३१ मार्च २०१७ पूर्वी कुटुंब कल्याण योजनेचा सभासद असल्यास सभासद
                क्र.:{" "}
              </label>
              <span className="ml-2">{application.pre2017MemberNo}</span>
            </div>

            <div>
              <label>व वर्गणी रु.: </label>
              <span className="ml-2">{application.subscriptionAmount}</span>
            </div>

            <div>
              <label>HRMS NO: </label>
              <span className="ml-2">{application.hrmsNo}</span>
            </div>

            <div>
              <label>पहिल्या वारसाचे नाव : </label>
              <span className="ml-2">{application.nomineeName}</span>
            </div>

            <div>
              <label>पहिल्या वारसाशी नाते: </label>
              <span className="ml-2">{application.nomineeRelation}</span>
            </div>

            <div>
              <label>दुसऱ्या वारसाचे नाव : </label>
              <span className="ml-2">{application.alternateNomineeName}</span>
            </div>

            <div>
              <label>दुसऱ्या वारसाशी नाते : </label>
              <span className="ml-2 highlight">
                {application.alternateNomineeRelation}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-col items-end gap-4">
              {application.signature && (
                <div className="w-48">
                  {" "}
                  {/* Adjust width as needed */}
                  <img
                    src={application.signature}
                    alt="Applicant Signature"
                    className="h-16 object-contain mx-20"
                  />
                </div>
              )}
              <div className="text-left">आपला विश्वासू</div>
            </div>
          </div>

          {/* Principal Signature Section */}
          <PrincipalModal
            name={application.name}
            designation={application.designation}
            setPrincipalSignature={setPrincipalSignature}
          />
        </div>

        {/* Action Buttons - keep them outside ViewForm */}
        <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-end gap-4">
            <button
              onClick={() => handleStatusUpdate("approved")}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Approve Application
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reject Application
            </button>
          </div>
        </div>
        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[480px] shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Rejection Remarks</h3>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full h-32 p-3 border rounded-md mb-4 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Please provide detailed reason for rejection..."
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!remarks.trim()) {
                      toast.error("Please enter rejection remarks");
                      return;
                    }
                    handleStatusUpdate("rejected");
                    setShowRejectModal(false);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Payment status */}
      <ShowPayment />
    </div>
  );
};

export default HandleApplications;
