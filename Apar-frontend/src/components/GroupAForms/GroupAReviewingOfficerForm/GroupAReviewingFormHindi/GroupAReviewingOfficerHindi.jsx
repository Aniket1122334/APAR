import React, { useState } from "react";
import styles from "./GroupAReviewingOfficerFormHindi.module.css";

const GroupAReviewOfficerFormHindi = () => {
  const [formData, setFormData] = useState({
    serviceLength: "",
    assessmentAgreement: "",
    disagreementReason: "",
    penPicture: "",
    numericalGrading: "",
    place: "",
    name: "",
    designation: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted!");
  };

  return (
    <div className={`container ${styles.formOuter}`}>
      <h3 className="text-center mb-4 fw-bold">
        भाग-4 : समीक्षा अधिकारी की टिप्पणी
      </h3>

      <form onSubmit={handleSubmit} className={styles.formBox}>
        {/* 1 */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            1. समीक्षा अधिकारी के अंतर्गत सेवा की अवधि:
          </label>
          <textarea
            className="form-control"
            rows="2"
            name="serviceLength"
            value={formData.serviceLength}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* 2 */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            2. क्या आप भाग-2 एवं भाग-3 में कार्य निष्पादन तथा विभिन्न गुणों के
            संबंध में प्रतिवेदन अधिकारी द्वारा किए गए मूल्यांकन से सहमत हैं?
            <br />
            <small className="fw-normal">
              (यदि आप किसी भी गुण के संख्यात्मक मूल्यांकन से असहमत हैं, तो कृपया
              उस अनुभाग में दिए गए कॉलम में अपना मूल्यांकन अंकित करें और अपने
              हस्ताक्षर करें।)
            </small>
          </label>
          <textarea
            className="form-control"
            rows="3"
            name="assessmentAgreement"
            value={formData.assessmentAgreement}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* 3 */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            3. असहमति की स्थिति में कृपया उसका कारण स्पष्ट करें।
            <br />
            <small className="fw-normal">
              क्या आप इसमें कुछ संशोधित करना या अतिरिक्त टिप्पणी जोड़ना चाहते
              हैं?
            </small>
          </label>
          <textarea
            className="form-control"
            rows="3"
            name="disagreementReason"
            value={formData.disagreementReason}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* 4 */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            4. समीक्षा अधिकारी द्वारा संक्षिप्त विवरण (लगभग 100 शब्द):
            <br />
            <small className="fw-normal">
              कृपया अधिकारी के समग्र गुणों, उसकी प्रमुख क्षमताओं तथा अपेक्षाकृत
              कमजोर पक्षों का वर्णन करें।
            </small>
          </label>
          <textarea
            className="form-control"
            rows="4"
            name="penPicture"
            maxLength={100}
            value={formData.penPicture}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* 5 */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            5. समग्र संख्यात्मक मूल्यांकन (भाग-3 में निर्धारित भारांक के आधार
            पर):
          </label>
          <input
            type="text"
            className="form-control"
            name="numericalGrading"
            value={formData.numericalGrading}
            onChange={handleChange}
          />
        </div>

        <hr />

        {/* Footer fields */}
        <div className="row mt-4">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">स्थान:</label>
            <input
              type="text"
              className="form-control"
              name="place"
              value={formData.place}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">दिनांक:</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Name + Designation */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              नाम (ब्लॉक अक्षरों में):
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">पदनाम:</label>
            <input
              type="text"
              className="form-control"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn btn-primary px-4 mt-3" type="submit">
          जमा करें
        </button>
      </form>
    </div>
  );
};

export default GroupAReviewOfficerFormHindi;
