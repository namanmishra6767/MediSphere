import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  Search,
  Stethoscope,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/appointments");
      setAppointments(data.appointments);
    } catch (error) {
      setError(error.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      setCancelingId(appointmentId);
      setError("");

      await apiRequest(`/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
      });

      await fetchAppointments();
    } catch (error) {
      setError(error.message || "Failed to cancel appointment");
    } finally {
      setCancelingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return appointments;
    }

    return appointments.filter((appointment) => {
      const doctorName =
        `${appointment.doctor_first_name} ${appointment.doctor_last_name}`.toLowerCase();

      const specialization = (
        appointment.doctor_specialization || ""
      ).toLowerCase();

      const reason = (appointment.reason || "").toLowerCase();

      return (
        doctorName.includes(query) ||
        specialization.includes(query) ||
        reason.includes(query)
      );
    });
  }, [appointments, search]);

  const scheduledCount = appointments.filter(
    (appointment) => appointment.status === "scheduled"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  const canceledCount = appointments.filter(
    (appointment) => appointment.status === "canceled"
  ).length;

  const formatDate = (value) => {
    return new Date(value).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Appointments
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your upcoming and previous appointments.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {appointments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Scheduled
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {scheduledCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {completedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Canceled
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-600">
              {canceledCount}
            </p>
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by doctor, specialization, or reason..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {loading && (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading appointments...
            </p>
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </section>
        )}

        {!loading && !error && filteredAppointments.length === 0 && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">
              No appointments found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different search."
                : "Your appointments will appear here."}
            </p>
          </section>
        )}

        {!loading && !error && filteredAppointments.length > 0 && (
          <section className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Stethoscope size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Dr. {appointment.doctor_first_name}{" "}
                        {appointment.doctor_last_name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {appointment.doctor_specialization}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={15} />
                          {formatDate(appointment.appointment_time)}
                        </span>

                        <span>
                          {appointment.reason || "General consultation"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
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
                        onClick={() => handleCancel(appointment.id)}
                        disabled={cancelingId === appointment.id}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={16} />

                        {cancelingId === appointment.id
                          ? "Canceling..."
                          : "Cancel Appointment"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Appointments;