import { useEffect, useMemo, useState } from "react";

import { Search, UserRound, Users } from "lucide-react";

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
        setPatients(data.patients);
      } catch (error) {
        setError(error.message || "Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const fullName =
        `${patient.first_name} ${patient.last_name}`.toLowerCase();

      return fullName.includes(query);
    });
  }, [patients, search]);

  const formatDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) {
      return "Not provided";
    }

    return new Date(dateOfBirth).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Patients
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View patients associated with your appointments.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Patients
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {patients.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Matching Patients
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {filteredPatients.length}
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
                placeholder="Search patients by name..."
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
              Loading patients...
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

        {!loading && !error && filteredPatients.length === 0 && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <UserRound className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">
              No patients found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different patient name."
                : "Patients assigned through appointments will appear here."}
            </p>
          </section>
        )}

        {!loading && !error && filteredPatients.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Patient
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Date of Birth
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <UserRound size={18} />
                            </div>

                            <div>
                              <p className="font-medium text-slate-900">
                                {patient.first_name} {patient.last_name}
                              </p>

                              <p className="text-sm text-slate-500">
                                Patient
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDateOfBirth(patient.date_of_birth)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {filteredPatients.map((patient) => (
                <article
                  key={patient.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {patient.first_name} {patient.last_name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Date of birth:{" "}
                        {formatDateOfBirth(patient.date_of_birth)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorPatients;