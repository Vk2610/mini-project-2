import React from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const navigate = useNavigate();

  const fetchFormData = () => {
    const formDataString = localStorage.getItem("formData");
    try {
      return formDataString ? JSON.parse(formDataString) : {};
    } catch (error) {
      console.error("Failed to parse formData:", error);
      return {};
    }
  };

  const formData = fetchFormData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-3/4 p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          रयत शिक्षण संस्था, सातारा
        </h3>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          रयत सेवक कुटुंब कल्याण योजना अर्ज
        </h2>
        <h3 className="text-xl text-gray-700 mb-4 text-center">
          (वर्गणीदार होण्यासाठी करावयाचा अर्ज व संमतीपत्र)
        </h3>
        <p className="text-lg">
          प्रति,
          <br />
          मा. चेअरमन,
          <br />
          रयत कुटुंब कल्याण योजना
          <br />
          रयत शिक्षण संस्था, सातारा
          <br />
          <br />
          यांना --
          <br />
          <br />
        </p>
        <p>
          महोदय,
          <br />
          रयत सेवक कुटुंब कल्याण योजनेची घटना व नियम मी वाचले असून ते मला मान्य
          आहेत. त्यासाठी या अर्जासोबत नियमाप्रमाणे प्रवेश फी रु. १००/- व वर्गणी
          रु. ______ मी माझ्या शाखेमार्फत पाठवित आहे. रयत कुटुंब कल्याण योजनेची
          संपूर्ण वर्गणी रु. ५०००/- ही एप्रिल{" "}
          <span className="underline">{formData.currentYear}</span> ते मार्च{" "}
          <span className="underline">{(formData.currentYear || 0) + 1}</span> या
          आर्थिक वर्षात समान ५ हप्त्याने माझ्या पगारातून कपात करून रयत सेवक
          कुटुंब कल्याण योजनेकडे पाठविणेबाबत मी माझ्या शाखेच्या शाखाप्रमुखांना
          संमती देत आहे. तरी मला रयत सेवक कुटुंब कल्याण योजनेचे सभासद करून
          घ्यावे.
          <br />
          <br />
          <br />
        </p>

        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          माझी माहिती खालीलप्रमाणे आहे
        </h3>
        <p className="text-lg font-">
          1. संपूण नाव: {formData.lastName} {formData.firstName}{" "}
          {formData.middleName}
        </p>
        <p className="text-lg">2. हुद्दा : {formData.position}</p>
        <p className="text-lg">3. शाखा : {formData.branch}</p>
        <p className="text-lg">4. कायमचा पत्ता: {formData.address}</p>
        <p className="text-lg">Mobile No. : {formData.mobileNo}</p>
        <p className="text-lg">Whatsapp Mobile No. : {formData.whatsappNo}</p>
        <p className="text-lg">Email : {formData.email}</p>
        <p className="text-lg">
          5. संस्थेतील नेमणूक तारीख : {formData.dateOfAppointment}
        </p>
        <p className="text-lg">
          6. कायम झाल्याची तारीख : {formData.permanentDate}
        </p>
        <p className="text-lg">7. जन्म तारीख: {formData.dateOfBirth}</p>
        <p className="text-lg">
          8. सेवानिवृत्तीची तारीख: {formData.dateOfRetirement}
        </p>
        <p className="text-lg flex gap-3">
          9. दि रयत सेवक कॉ- ऑफ बँकेचा सभासद क्र. : {formData.bankRegNo}{" "}
          <span>बँक शाखा: {formData.bankBranch}</span>
        </p>
        <p className="text-lg">HRMS क्रमांक: {formData.hrmsNo}</p>
        <p className="text-lg flex gap-3">
          10. 31 मार्च 2017 पूर्वी कुटुंब कल्याण योजनेचा सभासद असल्यास सभासद
          क्र.: {formData.oldUserID || "_______"}
          <span>
            वर्गणी रु. : {formData.oldSubscriptionAmt || "_______"}
          </span>
        </p>

        <h4 className="text-xl font-semibold text-gray-700 mt-4">
          नॉमिनी माहिती
        </h4>
        <p className="text-lg flex gap-3">
          1. प्रथम नॉमिनी: {formData.nominee1}{" "}
          <span> नाते :{formData.relation1}</span>
        </p>
        <p className="text-lg flex gap-3">
          2. द्वितीय नॉमिनी: {formData.nominee2}{" "}
          <span> नाते :{formData.relation2}</span>
        </p>

        <button
          onClick={() => navigate("/", { state: formData })}
          className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg"
        >
          Back to the Application
        </button>

        <button
          onClick={handlePrint}
          className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg"
        >
          Print
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg"
        >
          Back to the Home
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
