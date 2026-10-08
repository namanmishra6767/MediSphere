import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Stethoscope,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function PatientDashboard() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [booking, setBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState("");

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState("");

  const currentHour = new Date().getHours();

const greeting =
  currentHour < 12
    ? "Good morning"
    : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      setAppointmentError("");

      const data = await apiRequest("/appointments");
      setAppointments(data.appointments);
    } catch (error) {
      setAppointmentError(error.message);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      setLoadingRecords(true);
      setRecordsError("");

      const data = await apiRequest("/medical-records");
      setMedicalRecords(data.records);
    } catch (error) {
      setRecordsError(error.message);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiRequest("/doctors");
        setDoctors(data.doctors);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
    fetchAppointments();
    fetchMedicalRecords();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setAppointmentError("");

      await apiRequest(`/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
      });

      await fetchAppointments();
    } catch (error) {
      setAppointmentError(error.message);
    }
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    setBooking(true);
    setBookingMessage("");
    setBookingError("");

    try {
      await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          appointmentTime: new Date(
            appointmentTime
          ).toISOString(),
          reason: reason || undefined,
        }),
      });

      await fetchAppointments();

      setBookingMessage("Appointment booked successfully.");
      setSelectedDoctor(null);
      setAppointmentTime("");
      setReason("");
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setBooking(false);
    }
  };

  const scheduledAppointments = appointments.filter(
    (appointment) => appointment.status === "scheduled"
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Patient Portal
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {greeting}
          </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your appointments and medical records from one place.
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
                Upcoming
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
                Medical Records
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {medicalRecords.length}
              </p>
            </div>

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <FileText size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Appointments */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your upcoming appointments.
            </p>
          </div>
        </div>

        {loadingAppointments && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Loading appointments...
            </p>
          </div>
        )}

        {appointmentError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {appointmentError}
            </p>
          </div>
        )}

        {!loadingAppointments &&
          !appointmentError &&
          appointments.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <CalendarDays
                size={28}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-medium text-slate-700">
                No appointments yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Find a doctor below to schedule your first appointment.
              </p>
            </div>
          )}

        {!loadingAppointments &&
          !appointmentError &&
          appointments.length > 0 && (
            <div className="mt-4 space-y-3">
              {appointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Stethoscope size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Dr. {appointment.doctor_first_name}{" "}
                          {appointment.doctor_last_name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {appointment.doctor_specialization}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                          <span>
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

                    <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-end">
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
                            handleCancelAppointment(appointment.id)
                          }
                          className="text-sm font-medium text-red-600 transition hover:text-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* Find Doctor */}
      <section className="mt-10">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Find a Doctor
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Browse available specialists and schedule an appointment.
          </p>
        </div>

        {loadingDoctors && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Loading doctors...
            </p>
          </div>
        )}

        {!loadingDoctors && doctors.length === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Stethoscope
              size={28}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-medium text-slate-700">
              No doctors available
            </p>
          </div>
        )}

        {!loadingDoctors && doctors.length > 0 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <article
                key={doctor.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                    {doctor.first_name.charAt(0)}
                    {doctor.last_name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setBookingMessage("");
                    setBookingError("");
                  }}
                  className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Booking Form */}
      {selectedDoctor && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600">
                New Appointment
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Dr. {selectedDoctor.first_name}{" "}
                {selectedDoctor.last_name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedDoctor.specialization}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDoctor(null)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close booking form"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleBookAppointment}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="appointmentTime"
                className="block text-sm font-medium text-slate-700"
              >
                Appointment date and time
              </label>

              <input
                id="appointmentTime"
                type="datetime-local"
                value={appointmentTime}
                onChange={(event) =>
                  setAppointmentTime(event.target.value)
                }
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-slate-700"
              >
                Reason for visit
              </label>

              <textarea
                id="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Briefly describe the reason for your visit..."
                className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {bookingMessage && (
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {bookingMessage}
              </div>
            )}

            {bookingError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {bookingError}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={booking}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {booking ? "Booking..." : "Confirm Appointment"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Medical Records */}
      <section className="mt-10 pb-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Medical Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your available medical history and consultation records.
          </p>
        </div>

        {loadingRecords && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Loading medical records...
            </p>
          </div>
        )}

        {recordsError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {recordsError}
            </p>
          </div>
        )}

        {!loadingRecords &&
          !recordsError &&
          medicalRecords.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <FileText
                size={28}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-medium text-slate-700">
                No medical records yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Records from completed consultations will appear here.
              </p>
            </div>
          )}

        {!loadingRecords &&
          !recordsError &&
          medicalRecords.length > 0 && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {medicalRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Dr. {record.doctor_first_name}{" "}
                        {record.doctor_last_name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {record.specialization}
                      </p>
                    </div>

                    <FileText
                      size={20}
                      className="text-slate-400"
                    />
                  </div>

                  <div className="mt-5 rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Diagnosis
                    </p>

                    <p className="mt-1 text-sm text-slate-800">
                      {record.diagnosis}
                    </p>
                  </div>

                  {record.notes && (
                    <div className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Notes
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {record.notes}
                      </p>
                    </div>
                  )}

                  <p className="mt-5 text-xs text-slate-400">
                    Recorded{" "}
                    {new Date(record.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          )}
      </section>
    </DashboardLayout>
  );
}

export default PatientDashboard;