import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserRound,
  XCircle,
} from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingId, setCompletingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/appointments");
      setAppointments(data.appointments || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleComplete = async (appointmentId) => {
    try {
      setCompletingId(appointmentId);
      setError("");

      await apiRequest(`/appointments/${appointmentId}/complete`, {
        method: "PATCH",
      });

      await fetchAppointments();
    } catch (error) {
      setError(error.message);
    } finally {
      setCompletingId(null);
    }
  };

  const scheduledAppointments = appointments.filter(
    (appointment) => appointment.status === "scheduled"
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

  const getStatusStyles = (status) => {
    if (status === "scheduled") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "completed") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (status === "scheduled") return <Clock3 size={14} />;
    if (status === "completed") return <CheckCircle2 size={14} />;

    return <XCircle size={14} />;
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Appointments
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your scheduled and completed appointments.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}
        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Scheduled
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {scheduledAppointments.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock3 size={19} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Completed
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {completedAppointments.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={19} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-5 w-48 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-64 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <CalendarDays size={22} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your assigned appointments will appear here.
            </p>
          </div>
        )}

        {/* Appointments */}
        {!loading && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          <UserRound size={17} />
                        </div>

                        <h2 className="font-semibold text-slate-900">
                          {appointment.patient_first_name}{" "}
                          {appointment.patient_last_name}
                        </h2>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles(
                          appointment.status
                        )}`}
                      >
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:gap-5">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={15} />
                        {new Date(
                          appointment.appointment_time
                        ).toLocaleDateString()}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 size={15} />
                        {new Date(
                          appointment.appointment_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {appointment.reason && (
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-700">
                          Reason:
                        </span>{" "}
                        {appointment.reason}
                      </p>
                    )}
                  </div>

                  {appointment.status === "scheduled" && (
                    <button
                      type="button"
                      onClick={() => handleComplete(appointment.id)}
                      disabled={completingId === appointment.id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 size={16} />

                      {completingId === appointment.id
                        ? "Completing..."
                        : "Mark Complete"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorAppointments;