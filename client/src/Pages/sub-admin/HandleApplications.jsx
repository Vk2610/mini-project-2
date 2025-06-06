import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const HandleApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [remarks, setRemarks] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const response = await axios.get(
          `http://localhost:3000/user/getFormData/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.success) {
          setApplication(response.data);
          console.log("Application data:", response.data);
        } else {
          throw new Error("Failed to fetch application details");
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast.error(error.message || "Failed to fetch application");
        setTimeout(() => navigate("/sub-admin/manage-applications"), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id, navigate]);

  const handleStatusUpdate = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await axios.put(
        `http://localhost:3000/sub-admin/application-form/${id}/status`,
        {
          status,
          remarks: status === "rejected" ? remarks : "Application Approved",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        toast.success(`Application ${status} successfully`);
        setTimeout(() => navigate("/sub-admin/manage-forms"), 2000);
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

          <div className="mt-6 flex items-center justify-end gap-4">
            {application.signature && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignature(!showSignature)}
                  className="p-2 text-blue-500 hover:text-blue-700 flex items-center gap-2"
                >
                  {showSignature ? <FaEyeSlash /> : <FaEye />}
                  <span>View Signature</span>
                </button>
              </div>
            )}

            {showSignature && application.signature && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  <div className="border-b p-4 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold">Signature Preview</h3>
                    <button
                      onClick={() => setShowSignature(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FaEyeSlash className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto border shadow-xl bg-white rounded-lg">
                      {application.signature.includes(".pdf") ? (
                        <embed
                          src={application.signature}
                          type="application/pdf"
                          className="w-full h-[70vh]"
                        />
                      ) : (
                        <img
                          src={application.signature}
                          alt="Signature"
                          className="w-full h-auto max-h-[70vh] object-contain p-4"
                        />
                      )}
                    </div>
                  </div>

                  <div className="border-t p-4 bg-gray-50 flex justify-end">
                    <button
                      onClick={() => setShowSignature(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="text-left">आपला विश्वासू</div>
          </div>
        </div>
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
  );
};

export default HandleApplications;
