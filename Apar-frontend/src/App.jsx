import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/Login/Login";
import GroupAReviewOfficerFormBilingual from "./components/GroupAForms/GroupAReviewingOfficerForm/GroupAReviewFormBilingual/GroupAReviewingOfficerFormBilingual";
import GroupAEmployeeFormBilingual from "./components/GroupAForms/GroupAEmployeeForm/GroupAEmployeeFormBilingual";
import ViewCards from "./components/GroupAForms/ViewCards/ViewCards";
import ViewGroupAFullForm from "./components/GroupAForms/ViewGroupAFullEmployeeForm/ViewGroupAFullEmployeeForm";
import GroupAReportingOfficerForm from "./components/GroupAForms/GroupAReportingOfficerForm/GroupAReportingOfficerForm";
import ViewCardsReview from "./components/GroupAForms/GroupAViewCardReviewingOfficer/ViewCardsReview";
import ViewGroupAFullReportingForm from "./components/GroupAForms/ViewGroupAFullReportingForm/ViewGroupAFullReportingForm";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  const location = useLocation();

  // ❌ Login page par Navbar nahi dikhana
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {/* Navbar only if NOT on login page */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/group-a-reviewing-officer-form"
          element={<GroupAReviewOfficerFormBilingual />}
        />

        {/* Employee Routes */}
        <Route path="/employeeForm" element={<GroupAEmployeeFormBilingual />} />

        {/* Reporting Officer Routes */}
        <Route path="/reporting-officer" element={<ViewCards />} />
        <Route
          path="/reporting-officer/groupA/form/:id"
          element={<ViewGroupAFullForm />}
        />
        <Route
          path="/reporting-officer/groupA/report/:id"
          element={<GroupAReportingOfficerForm />}
        />

        {/* Reviewing Officer Routes */}
        <Route path="/reviewing-officer" element={<ViewCardsReview />} />
        <Route
          path="/reviewing-officer/groupA/reportForm/:id"
          element={<ViewGroupAFullReportingForm />}
        />

        <Route
          path="/reviewing-officer/groupA/reviewForm/:id"
          element={<GroupAReviewOfficerFormBilingual />}
        />
      </Routes>
    </>
  );
};

export default App;
