import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

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

  const handleCancel = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);

      await apiRequest(`/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
      });

      await fetchAppointments();
    } catch (error) {
      setError(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyles = (status) => {
    if (status === "scheduled") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "completed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
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
                View and manage your healthcare appointments.
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

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              Loading appointments...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <CalendarDays size={22} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No appointments yet
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your booked appointments will appear here.
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
                      <h2 className="font-semibold text-slate-900">
                        Dr. {appointment.doctor_first_name}{" "}
                        {appointment.doctor_last_name}
                      </h2>

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
                      <span>
                        {appointment.doctor_specialization}
                      </span>

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
                      onClick={() => handleCancel(appointment.id)}
                      disabled={cancellingId === appointment.id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      {cancellingId === appointment.id
                        ? "Cancelling..."
                        : "Cancel Appointment"}
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

export default Appointments;