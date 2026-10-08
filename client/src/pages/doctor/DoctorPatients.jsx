import { useEffect, useState } from "react";
import {
  CalendarDays,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/doctors/patients");
        setPatients(data.patients || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const searchTerm = search.toLowerCase();

    const name =
      `${patient.first_name} ${patient.last_name}`.toLowerCase();

    return name.includes(searchTerm);
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Patients
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View patients associated with your appointments.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patients..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={19} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Your Patients
                </p>

                <p className="text-2xl font-semibold text-slate-900">
                  {patients.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div className="mt-5 h-5 w-40 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-28 rounded bg-slate-200" />
                <div className="mt-6 h-4 w-32 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredPatients.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Users size={22} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              {patients.length === 0
                ? "No patients yet"
                : "No patients found"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {patients.length === 0
                ? "Patients associated with your appointments will appear here."
                : "Try searching for a different patient name."}
            </p>
          </div>
        )}

        {/* Patient Cards */}
        {!loading && filteredPatients.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPatients.map((patient) => (
              <article
                key={patient.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <UserRound size={22} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Patient
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {patient.first_name} {patient.last_name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Date of birth
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {new Date(
                      `${patient.date_of_birth}T00:00:00`
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <CalendarDays size={15} />

                  <span>Associated with your appointments</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorPatients;