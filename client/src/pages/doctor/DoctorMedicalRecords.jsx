import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  Plus,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import { apiRequest } from "../../services/api";

function DoctorMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/medical-records/doctor");
      setRecords(data.records || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);

      const data = await apiRequest("/doctors/patients");
      setPatients(data.patients || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openCreateForm = async () => {
    setError("");
    setShowForm(true);

    if (patients.length === 0) {
      await fetchPatients();
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedPatient(null);
    setDiagnosis("");
    setNotes("");
  };

  const handleCreateRecord = async (event) => {
    event.preventDefault();

    if (!selectedPatient) {
      setError("Please select a patient.");
      return;
    }

    if (!diagnosis.trim()) {
      setError("Diagnosis is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await apiRequest("/medical-records", {
        method: "POST",
        body: JSON.stringify({
          patientId: selectedPatient.id,
          diagnosis: diagnosis.trim(),
          notes: notes.trim() || null,
        }),
      });

      closeForm();
      await fetchRecords();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Medical Records
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage medical records for your patients.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Create Record
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Create Record Form */}
        {showForm && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Create Medical Record
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Records can only be created for patients associated with a
                  completed appointment.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleCreateRecord}
              className="space-y-5 p-5"
            >
              <div>
                <label
                  htmlFor="patient"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Patient
                </label>

                <select
                  id="patient"
                  value={selectedPatient?.id || ""}
                  onChange={(event) => {
                    const patient = patients.find(
                      (item) => item.id === event.target.value
                    );

                    setSelectedPatient(patient || null);
                  }}
                  disabled={patientsLoading || submitting}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    {patientsLoading
                      ? "Loading patients..."
                      : "Select a patient"}
                  </option>

                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="diagnosis"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Diagnosis
                </label>

                <input
                  id="diagnosis"
                  type="text"
                  value={diagnosis}
                  onChange={(event) => setDiagnosis(event.target.value)}
                  placeholder="Enter diagnosis"
                  disabled={submitting}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Notes
                </label>

                <textarea
                  id="notes"
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add clinical notes..."
                  disabled={submitting}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || patientsLoading}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Record"}
                </button>
              </div>
            </form>
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
                <div className="h-11 w-11 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-40 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-32 rounded bg-slate-200" />
                <div className="mt-5 h-16 rounded bg-slate-200" />
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
              Medical records you create will appear here.
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
                    Patient
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {record.patient_first_name}{" "}
                    {record.patient_last_name}
                  </h2>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <UserRound size={15} />

                  <span>
                    Patient ID: {record.patient_id}
                  </span>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Diagnosis
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {record.diagnosis}
                  </p>
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

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <Stethoscope size={14} />
                  Medical record
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorMedicalRecords;