import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

const doctorId = "33bfc3ae-3d42-433e-b9d5-c9cf81d28817";

const login = async (email, password) => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  assert.equal(response.status, 200);
  assert.ok(response.headers["set-cookie"]);

  return response.headers["set-cookie"][0];
};

const patientCookie = await login(
  "patient@test.com",
  "TestPassword123!"
);

const patientTwoCookie = await login(
  "patient2@test.com",
  "PatientTwo123!"
);

const doctorCookie = await login(
  "doctor@test.com",
  "DoctorPassword123!"
);

const doctorTwoCookie = await login(
  "doctor2@test.com",
  "DoctorTwoPassword123!"
);

const createFutureAppointmentTime = (minutes) => {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
};

test("patient can book an appointment", async () => {
  const appointmentTime = createFutureAppointmentTime(120);

  const response = await request(app)
    .post("/api/appointments")
    .set("Cookie", patientCookie)
    .send({
      doctorId,
      appointmentTime,
      reason: "Automated appointment test",
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.message, "Appointment booked successfully");
  assert.ok(response.body.appointment.id);

  const cancelResponse = await request(app)
    .patch(`/api/appointments/${response.body.appointment.id}/cancel`)
    .set("Cookie", patientCookie);

  assert.equal(cancelResponse.status, 200);
});

test("patient can view their own appointments", async () => {
  const response = await request(app)
    .get("/api/appointments")
    .set("Cookie", patientCookie);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.appointments));
});

test("doctor can view assigned appointments", async () => {
  const response = await request(app)
    .get("/api/appointments")
    .set("Cookie", doctorCookie);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.appointments));
});

test("patient can access their appointment endpoint", async () => {
  const response = await request(app)
    .get("/api/appointments")
    .set("Cookie", patientCookie);

  assert.equal(response.status, 200);
});

test("patient cannot complete an appointment", async () => {
  const response = await request(app)
    .patch("/api/appointments/00000000-0000-0000-0000-000000000000/complete")
    .set("Cookie", patientCookie);

  assert.equal(response.status, 403);
});

test("doctor cannot cancel an appointment", async () => {
  const response = await request(app)
    .patch("/api/appointments/00000000-0000-0000-0000-000000000000/cancel")
    .set("Cookie", doctorCookie);

  assert.equal(response.status, 403);
});

test("patient cannot cancel another patient's appointment", async () => {
  const otherPatientAppointment = await pool.query(
    `SELECT a.id
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     WHERE p.user_id != (
       SELECT user_id
       FROM patients
       WHERE id = $1
     )
       AND a.status = 'scheduled'
     LIMIT 1`,
    ["9ab4a819-bea6-49c8-aa20-cafe5ea1bd14"]
  );

  if (otherPatientAppointment.rows.length === 0) {
    return;
  }

  const appointmentId = otherPatientAppointment.rows[0].id;

  const response = await request(app)
    .patch(`/api/appointments/${appointmentId}/cancel`)
    .set("Cookie", patientCookie);

  assert.equal(response.status, 404);
});

test("doctor cannot complete another doctor's appointment", async () => {
  const otherDoctorAppointment = await pool.query(
    `SELECT a.id
     FROM appointments a
     JOIN doctors d ON a.doctor_id = d.id
     WHERE d.user_id = $1
       AND a.status = 'scheduled'
     LIMIT 1`,
    ["d9b6d14b-f44a-4841-8d4b-d44c9888d948"]
  );

  if (otherDoctorAppointment.rows.length === 0) {
    return;
  }

  const appointmentId = otherDoctorAppointment.rows[0].id;

  const response = await request(app)
    .patch(`/api/appointments/${appointmentId}/complete`)
    .set("Cookie", doctorTwoCookie);

  assert.equal(response.status, 404);
});

test("invalid appointment data is rejected", async () => {
  const response = await request(app)
    .post("/api/appointments")
    .set("Cookie", patientCookie)
    .send({
      doctorId,
      appointmentTime: "invalid",
      reason: "",
    });

  assert.equal(response.status, 400);
});

test("booking the same doctor and time twice is rejected", async () => {
  const appointmentTime = createFutureAppointmentTime(180);

  const firstResponse = await request(app)
    .post("/api/appointments")
    .set("Cookie", patientCookie)
    .send({
      doctorId,
      appointmentTime,
      reason: "Duplicate appointment test",
    });

  assert.equal(firstResponse.status, 201);

  const secondResponse = await request(app)
    .post("/api/appointments")
    .set("Cookie", patientTwoCookie)
    .send({
      doctorId,
      appointmentTime,
      reason: "Duplicate appointment test",
    });

  assert.equal(secondResponse.status, 409);

  const cancelResponse = await request(app)
    .patch(`/api/appointments/${firstResponse.body.appointment.id}/cancel`)
    .set("Cookie", patientCookie);

  assert.equal(cancelResponse.status, 200);
});
