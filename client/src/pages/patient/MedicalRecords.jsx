import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  Stethoscope,
} from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/medical-records");
        setRecords(data.records || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Medical Records
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View your medical history and records securely.
            </p>
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
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-6 w-32 rounded bg-slate-200" />
                <div className="mt-5 h-4 w-48 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && records.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <FileText size={22} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No medical records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your medical records will appear here after a doctor creates one.
            </p>
          </div>
        )}

        {/* Records */}
        {!loading && records.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {records.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={20} />
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    {new Date(record.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Diagnosis
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {record.diagnosis}
                  </h2>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <Stethoscope size={16} className="text-blue-600" />

                  <span>
                    Dr. {record.doctor_first_name}{" "}
                    {record.doctor_last_name}
                  </span>
                </div>

                {record.notes && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Notes
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {record.notes}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MedicalRecords;