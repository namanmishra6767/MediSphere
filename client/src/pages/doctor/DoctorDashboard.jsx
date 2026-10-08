import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  Clock3,
  FileText,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function DoctorDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const [recordLoading, setRecordLoading] = useState(false);
  const [recordMessage, setRecordMessage] = useState("");
  const [recordError, setRecordError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/appointments");
      setAppointments(data.appointments);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      setError("");

      await apiRequest(`/appointments/${appointmentId}/complete`, {
        method: "PATCH",
      });

      await fetchAppointments();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreateMedicalRecord = async (event) => {
    event.preventDefault();

    if (!selectedPatient) {
      return;
    }

    setRecordLoading(true);
    setRecordMessage("");
    setRecordError("");

    try {
      await apiRequest("/medical-records", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedPatient.patient_id,
          diagnosis,
          notes: notes || undefined,
        }),
      });

      setRecordMessage("Medical record created successfully.");
      setDiagnosis("");
      setNotes("");
      setSelectedPatient(null);
    } catch (error) {
      setRecordError(error.message);
    } finally {
      setRecordLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const scheduledAppointments = appointments.filter(
    (appointment) => appointment.status === "scheduled"
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

  const uniquePatients = new Set(
    appointments.map((appointment) => appointment.patient_id)
  ).size;

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <DashboardLayout>
      {/* Header */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Doctor Portal
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {greeting}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your appointments and patient records.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            Signed in as{" "}
            <span className="font-medium text-slate-700">
              {user.email}
            </span>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Appointments
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {appointments.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Scheduled
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {scheduledAppointments.length}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock3 size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {completedAppointments.length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Patients
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {uniquePatients}
              </p>
            </div>

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <UserRound size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Appointments */}
      <section className="mt-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Appointments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review your assigned appointments and update their status.
          </p>
        </div>

        {loading && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Loading appointments...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          appointments.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <CalendarDays
                size={28}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-medium text-slate-700">
                No appointments assigned
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Assigned patient appointments will appear here.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          appointments.length > 0 && (
            <div className="mt-4 space-y-3">
              {appointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <UserRound size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {appointment.patient_first_name}{" "}
                          {appointment.patient_last_name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Patient
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Clock3 size={15} />
                            {new Date(
                              appointment.appointment_time
                            ).toLocaleString()}
                          </span>

                          <span>
                            {appointment.reason || "General consultation"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          appointment.status === "scheduled"
                            ? "bg-blue-50 text-blue-700"
                            : appointment.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {appointment.status}
                      </span>

                      {appointment.status === "scheduled" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCompleteAppointment(appointment.id)
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          <CheckCircle2 size={16} />
                          Complete
                        </button>
                      )}

                      {appointment.status === "completed" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatient(appointment);
                            setRecordMessage("");
                            setRecordError("");
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <ClipboardPlus size={16} />
                          Create Record
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* Medical Record Form */}
      {selectedPatient && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Patient Record
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {selectedPatient.patient_first_name}{" "}
                {selectedPatient.patient_last_name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a medical record for this completed consultation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPatient(null)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close medical record form"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleCreateMedicalRecord}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="diagnosis"
                className="block text-sm font-medium text-slate-700"
              >
                Diagnosis
              </label>

              <input
                id="diagnosis"
                type="text"
                value={diagnosis}
                onChange={(event) =>
                  setDiagnosis(event.target.value)
                }
                maxLength={500}
                required
                placeholder="Enter diagnosis"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-slate-700"
              >
                Clinical Notes
              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                maxLength={5000}
                rows={5}
                placeholder="Add relevant consultation notes..."
                className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {recordError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {recordError}
              </div>
            )}

            {recordMessage && (
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {recordMessage}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={recordLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileText size={17} />

                {recordLoading
                  ? "Creating..."
                  : "Create Medical Record"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </DashboardLayout>
  );
}

export default DoctorDashboard;