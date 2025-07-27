import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ViewForm = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [statusToUpdate, setStatusToUpdate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/getFormData/${userId}`
        );
        if (response.status === 200) {
          setFormData(response.data);
        } else {
          throw new Error("Failed to fetch form data");
        }
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Failed to fetch form data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  const updateApplicationStatus = async (id, newStatus, remarks) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3000/admin/applications/${id}/status`,
        {
          status: newStatus,
          remarks: remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response exists and has data
      if (response && response.data) {
        toast.success(`Application ${newStatus} successfully`);
        // Refresh the page or update UI state
        window.location.reload();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleStatusUpdate = async (id, status, remarks) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:3000/admin/applications/${id}/status`,
        { status, remarks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Application ${status} successfully`);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
      setShowRemarkModal(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading form data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!formData) {
    return (
      <div className="text-center mt-10">
        No form data found. Please submit the form first.
      </div>
    );
  }

  return (
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
            <span className="ml-2">{formData.memberNo}</span>
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
            मान्य आहेत.त्यासाठी या अर्जासोबत नियमाप्रमाणे प्रवेश फी रु. १००/- व
            वर्गणी रु. ५०००/- ही एप्रिल {new Date().getFullYear()} ते मार्च{" "}
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
            <span className="ml-2">{formData.name}</span>
          </div>

          <div>
            <label>हुद्दा: </label>
            <span className="ml-2">{formData.designation}</span>
          </div>

          <div>
            <label>शाखा: </label>
            <span className="ml-2">{formData.branch}</span>
          </div>

          <div>
            <label>कायमचा पत्ता: </label>
            <span className="ml-2">{formData.permanentAddress}</span>
          </div>

          <div>
            <label>Mobile No: </label>
            <span className="ml-2">{formData.mobile}</span>
          </div>

          <div>
            <label>Email: </label>
            <span className="ml-2">{formData.email}</span>
          </div>

          <div>
            <label>संस्थेतील नेमणूक तारीख: </label>
            <span className="ml-2">{formatDate(formData.appointmentDate)}</span>
          </div>

          <div>
            <label>कायम झाल्याची तारीख: </label>
            <span className="ml-2">
              {formatDate(formData.confirmationDate)}
            </span>
          </div>

          <div>
            <label>जन्म तारीख: </label>
            <span className="ml-2">{formatDate(formData.birthDate)}</span>
          </div>

          <div>
            <label>सेवानिवृत्ती तारीख: </label>
            <span className="ml-2">{formatDate(formData.retirementDate)}</span>
          </div>

          <div>
            <label>दि रयत सेवक कॉ-ऑफ बँकेचा सभासद क्र.: </label>
            <span className="ml-2">{formData.bankMemberNo}</span>
          </div>

          <div>
            <label>
              ३१ मार्च २०१७ पूर्वी कुटुंब कल्याण योजनेचा सभासद असल्यास सभासद
              क्र.:{" "}
            </label>
            <span className="ml-2">{formData.pre2017MemberNo}</span>
          </div>

          <div>
            <label>व वर्गणी रु.: </label>
            <span className="ml-2">{formData.subscriptionAmount}</span>
          </div>

          <div>
            <label>HRMS NO: </label>
            <span className="ml-2">{formData.hrmsNo}</span>
          </div>

          <div>
            <label>पहिल्या वारसाचे नाव : </label>
            <span className="ml-2">{formData.nomineeName}</span>
          </div>

          <div>
            <label>पहिल्या वारसाशी नाते: </label>
            <span className="ml-2">{formData.nomineeRelation}</span>
          </div>

          <div>
            <label>दुसऱ्या वारसाचे नाव : </label>
            <span className="ml-2">{formData.alternateNomineeName}</span>
          </div>

          <div>
            <label>दुसऱ्या वारसाशी नाते : </label>
            <span className="ml-2 highlight">
              {formData.alternateNomineeRelation}
            </span>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-8">
          {formData.signature && (
            <div className="flex justify-end mb-4">
              <img
                src={formData.signature}
                alt="Signature"
                className="h-16 object-contain" // Adjust height as needed
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            <div>दिनांक: {formatDate(new Date())}</div>
            <div>आपला विश्वासू,</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
