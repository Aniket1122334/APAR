import React, { useState } from "react";
import styles from "./GroupAReviewingOfficerFormEnglish.module.css";

const GroupAReviewOfficerFormEnglish = () => {
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
        Part-4: Remarks of the Reviewing Officer
      </h3>

      <form onSubmit={handleSubmit} className={styles.formBox}>
        {/* 1 */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            1. Length of service under the Reviewing Officer:
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
            2. Do you agree with the assessment made by the reporting officer
            with respect to the work output and the various attributes in Part-2
            and Part-3?
            <br />
            <small className="fw-normal">
              (If you do not agree with any numerical assessment of attributes,
              please record your assessment in the column provided in that
              section and initial your entries.)
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
            3. In case of disagreement, please specify the reason.
            <br />
            <small className="fw-normal">
              Is there anything you wish to modify or add?
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
            4. Pen picture by Reviewing Officer (approx. 100 words):
            <br />
            <small className="fw-normal">
              Please comment on the overall qualities of the officer, including
              areas of strength and lesser strength.
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
            5. Overall numerical grading
            <br />
            <small className="fw-normal">
              (Based on the weightage given in Part-3 of the Report)
            </small>
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
            <label className="form-label fw-bold">Place:</label>
            <input
              type="text"
              className="form-control"
              name="place"
              value={formData.place}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Date:</label>
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
              Name (in BLOCK letters):
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
            <label className="form-label fw-bold">Designation:</label>
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default GroupAReviewOfficerFormEnglish;
