import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  UserRound,
  Stethoscope,
  UserPlus,
  X,
} from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState("");
  const [doctorSuccess, setDoctorSuccess] = useState("");

  const [doctorForm, setDoctorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialization: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/admin/users");
        setUsers(data.users);
      } catch (error) {
        setError(error.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.email
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const getRoleIcon = (role) => {
    if (role === "admin") return ShieldCheck;
    if (role === "doctor") return Stethoscope;
    return UserRound;
  };

  const getRoleClasses = (role) => {
    if (role === "admin") {
      return "bg-purple-50 text-purple-700 ring-purple-600/10";
    }

    if (role === "doctor") {
      return "bg-blue-50 text-blue-700 ring-blue-600/10";
    }

    return "bg-slate-100 text-slate-700 ring-slate-500/10";
  };

  const handleDoctorChange = (event) => {
    const { name, value } = event.target;

    setDoctorForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleDoctorSubmit = async (event) => {
    event.preventDefault();

    setDoctorError("");
    setDoctorSuccess("");
    setDoctorLoading(true);

    try {
      const data = await apiRequest("/admin/doctors", {
        method: "POST",
        body: JSON.stringify(doctorForm),
      });

      setUsers((current) => [data.user, ...current]);

      setDoctorForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        specialization: "",
      });

      setDoctorSuccess("Doctor account created successfully.");
    } catch (error) {
      setDoctorError(error.message || "Failed to create doctor account");
    } finally {
      setDoctorLoading(false);
    }
  };

  const closeDoctorForm = () => {
    if (doctorLoading) return;

    setShowDoctorForm(false);
    setDoctorError("");
    setDoctorSuccess("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Users
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage and review MediSphere user accounts.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowDoctorForm(true);
              setDoctorError("");
              setDoctorSuccess("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <UserPlus className="h-4 w-4" />
            Create Doctor
          </button>
        </div>

        {showDoctorForm && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Create Doctor Account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create an account for a healthcare professional.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDoctorForm}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDoctorSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={doctorForm.firstName}
                    onChange={handleDoctorChange}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="Sarah"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={doctorForm.lastName}
                    onChange={handleDoctorChange}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="Wilson"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={doctorForm.email}
                    onChange={handleDoctorChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="doctor@medisphere.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="specialization"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Specialization
                  </label>

                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={doctorForm.specialization}
                    onChange={handleDoctorChange}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="Cardiology"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Temporary password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={doctorForm.password}
                    onChange={handleDoctorChange}
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="Minimum 8 characters"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Provide this temporary password securely to the doctor.
                  </p>
                </div>
              </div>

              {doctorError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {doctorError}
                  </p>
                </div>
              )}

              {doctorSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-medium text-emerald-700">
                    {doctorSuccess}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDoctorForm}
                  disabled={doctorLoading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={doctorLoading}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {doctorLoading ? "Creating..." : "Create Doctor"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All roles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading users...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No users found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        User
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Role
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Created
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => {
                      const RoleIcon = getRoleIcon(user.role);

                      return (
                        <tr
                          key={user.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900">
                              {user.email}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {user.id}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getRoleClasses(
                                user.role
                              )}`}
                            >
                              <RoleIcon className="h-3.5 w-3.5" />
                              {user.role}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);

                return (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {user.email}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-400">
                          {user.id}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getRoleClasses(
                          user.role
                        )}`}
                      >
                        <RoleIcon className="h-3.5 w-3.5" />
                        {user.role}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-400">Created</p>

                      <p className="mt-1 text-sm text-slate-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminUsers;