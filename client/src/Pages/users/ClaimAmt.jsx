import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

  const handleClaimAmt = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !hrmsNo ||
      !name ||
      !address ||
      !date ||
      !mobile ||
      !retireDate ||
      !memberId ||
      !amount ||
      !bonus ||
      !accountNumber ||
      !branch
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const totalAmount = parseFloat(amount || 0) + parseFloat(bonus || 0);
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const id = decoded.id;
    console.log("Decoded ID:", id);
    const claimData = {
      id: id, // Generate a unique ID for the claim
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
      bankBranch: branch,
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

      if (response.status === 200) {
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

  return (
    <div className="max-w-6xl mx-auto border border-black p-8 bg-white shadow-md text-base leading-relaxed my-10 ">
      <ToastContainer />
      <form onSubmit={handleClaimAmt}>
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
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="border-b border-black w-52"
          />{" "}
          मध्ये जमा करण्यास माझी संमती आहे.
        </p>

        <p className="mt-4 mb-4">कळावे.</p>

        <div className="mt-6 text-right">
          <input type="file" className="w-30 border rounded p-2 m-2" />
          <div>आपला विश्वासू, </div>
        </div>

        <p className="mt-8 font-semibold underline text-lg mb-4">सोबत :</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">1. खर्चाची पावती (नाव व सही केलेली)</span>
            <input
              type="file"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">
              2. संस्थेचे सेवापुनर्वसन पत्र (झेरॉक्स प्रत)
            </span>
            <input
              type="file"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">
              3. कुटुंब कल्याण सभासद पत्र (मूळ प्रत)
            </span>
            <input
              type="file"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">4. रयत बँक पासबुक (झेरॉक्स प्रत)</span>
            <input
              type="file"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex-1">5. अन्य कागदपत्रे</span>
            <input
              type="file"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Request Claim
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimAmt;
