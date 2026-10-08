import { useEffect, useMemo, useState } from "react";

import { FileText, Search, UserRound } from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function DoctorMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/medical-records/doctor");
        setRecords(data.records);
      } catch (error) {
        setError(error.message || "Failed to fetch medical records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return records;
    }

    return records.filter((record) => {
      const patientName =
        `${record.patient_first_name} ${record.patient_last_name}`.toLowerCase();

      const diagnosis = (record.diagnosis || "").toLowerCase();

      return patientName.includes(query) || diagnosis.includes(query);
    });
  }, [records, search]);

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    return new Date(value).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Medical Records
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review medical records for patients under your care.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Records
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {records.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <FileText size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Matching Records
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {filteredRecords.length}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <Search size={20} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by patient or diagnosis..."
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
              Loading medical records...
            </p>
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </section>
        )}

        {!loading && !error && filteredRecords.length === 0 && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">
              No medical records found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different patient name or diagnosis."
                : "Medical records for your patients will appear here."}
            </p>
          </section>
        )}

        {!loading && !error && filteredRecords.length > 0 && (
          <section className="space-y-4">
            {filteredRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {record.patient_first_name}{" "}
                        {record.patient_last_name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Patient
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Recorded {formatDate(record.created_at)}
                  </p>
                </div>

                <div className="mt-6 grid gap-5 border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Diagnosis
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {record.diagnosis}
                    </p>
                  </div>

                  {record.notes && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Clinical Notes
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorMedicalRecords;