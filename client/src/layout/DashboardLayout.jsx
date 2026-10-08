import { useState } from "react";
import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = {
    patient: [
      {
        label: "Dashboard",
        to: "/patient",
        icon: LayoutDashboard,
      },
      {
        label: "Appointments",
        to: "/patient/appointments",
        icon: CalendarDays,
      },
      {
        label: "Doctors",
        to: "/patient/doctors",
        icon: Stethoscope,
      },
      {
        label: "Medical Records",
        to: "/patient/medical-records",
        icon: FileText,
      },
    ],

    doctor: [
      {
        label: "Dashboard",
        to: "/doctor",
        icon: LayoutDashboard,
      },
      {
        label: "Appointments",
        to: "/doctor/appointments",
        icon: CalendarDays,
      },
      {
        label: "Patients",
        to: "/doctor/patients",
        icon: Users,
      },
      {
        label: "Medical Records",
        to: "/doctor/medical-records",
        icon: FileText,
      },
    ],

    admin: [
      {
        label: "Dashboard",
        to: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Users",
        to: "/admin/users",
        icon: Users,
      },
      {
        label: "Appointments",
        to: "/admin/appointments",
        icon: CalendarDays,
      },
      {
        label: "Audit Logs",
        to: "/admin/audit-logs",
        icon: FileText,
      },
    ],
  };

  const links = navigation[user.role] || [];

  const handleMobileLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Stethoscope size={20} />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                MediSphere
              </h1>

              <p className="text-xs text-slate-500">
                Healthcare platform
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            type="button"
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white transition-transform duration-200 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Stethoscope size={20} />
            </div>

            <span className="text-lg font-semibold">
              MediSphere
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-6">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleMobileLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          {/* Desktop Role */}
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              {user.role.charAt(0).toUpperCase() +
                user.role.slice(1)}
            </p>
          </div>

          {/* User */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">
                {user.email}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {user.role}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;