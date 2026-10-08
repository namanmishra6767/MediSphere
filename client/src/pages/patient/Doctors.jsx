import { useEffect, useState } from "react";
import {
  CalendarPlus,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/doctors");
        setDoctors(data.doctors || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchTerm = search.toLowerCase();

    const name = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();
    const specialization = doctor.specialization.toLowerCase();

    return (
      name.includes(searchTerm) ||
      specialization.includes(searchTerm)
    );
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Stethoscope size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Find a Doctor
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Browse available doctors and their specialties.
                </p>
              </div>
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
              placeholder="Search doctors..."
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

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-40 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-28 rounded bg-slate-200" />
                <div className="mt-6 h-10 w-full rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Stethoscope size={22} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No doctors found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try searching for a different name or specialization.
            </p>
          </div>
        )}

        {/* Doctor Cards */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserRound size={22} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Available
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Dr. {doctor.first_name} {doctor.last_name}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Stethoscope size={15} />
                    <span>{doctor.specialization}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/patient";
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <CalendarPlus size={17} />
                  Book Appointment
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Doctors;