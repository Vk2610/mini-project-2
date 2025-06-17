const AdminModal = ({name, designation, hrmsNo}) => {

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans text-lg">
      <div className="text-center font-semibold mb-4 pb-2">
        -------------------------------------- कार्यालय निर्णय --------------------------------------
      </div>

      <div className="mb-4">
        <p className="">श्री./ श्रीमती. {name}</p>
        <p>हुद्दा : {designation}</p>
      </div>

      <div className="mb-4 flex items-center">
        <p>
          यांना कुटुंब कल्याण योजनचे सभासदत्व देण्यात येत आहे/नाही.
        </p>
        <p className="ml-2">त्यांचा</p>
        <div className="ml-2 border border-black px-4 py-1 font-bold">
          सभासद क्र.: KK-{hrmsNo}
        </div>
        <p className="ml-2">असा आहे.</p>
      </div>

      <div className="text-right mt-16 leading-tight">
        <p>सेक्रेटरी,</p>
        <p>रयत सेवक कुटुंब कल्याण योजना,</p>
        <p>रयत शिक्षण संस्था, सातारा</p>
      </div>
    </div>
  );
};

export default AdminModal;
