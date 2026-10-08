import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";

import PatientDashboard from "./pages/patient/PatientDashboard";
import Appointments from "./pages/patient/Appointments";
import Doctors from "./pages/patient/Doctors";
import MedicalRecords from "./pages/patient/MedicalRecords";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorMedicalRecords from "./pages/doctor/DoctorMedicalRecords";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAppointments from "./pages/admin/AdminAppointments";

import ProtectedRoute from "./components/ProtectedRoute";

function Unauthorized() {
  return (
    <main>
      <h1>403</h1>
      <h2>Unauthorized</h2>
      <p>You don't have permission to access this page.</p>
    </main>
  );
}

function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </main>
  );
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route
          path="/patient"
          element={<PatientDashboard />}
        />

        <Route
          path="/patient/appointments"
          element={<Appointments />}
        />

        <Route
          path="/patient/doctors"
          element={<Doctors />}
        />

        <Route
          path="/patient/medical-records"
          element={<MedicalRecords />}
        />
      </Route>

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        <Route
          path="/doctor"
          element={<DoctorDashboard />}
        />

        <Route
          path="/doctor/appointments"
          element={<DoctorAppointments />}
        />

        <Route
          path="/doctor/patients"
          element={<DoctorPatients />}
        />

        <Route
          path="/doctor/medical-records"
          element={<DoctorMedicalRecords />}
        />
      </Route>

      {/* Admin Routes */}
<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  <Route
    path="/admin"
    element={<AdminDashboard />}
  />

  <Route
    path="/admin/users"
    element={<AdminUsers />}
  />

  <Route
    path="/admin/appointments"
    element={<AdminAppointments />}
  />
</Route>

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;