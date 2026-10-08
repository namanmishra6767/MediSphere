import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

const recordId = "ebd4c5a8-8ebf-474e-85cc-48c2483abe19";

const johnPatientId = "9ab4a819-bea6-49c8-aa20-cafe5ea1bd14";

const login = async (email, password) => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  assert.equal(response.status, 200);
  assert.ok(response.headers["set-cookie"]);

  return response.headers["set-cookie"][0];
};

test("patient can retrieve their own medical records", async () => {
  const cookie = await login(
    "patient@test.com",
    "TestPassword123!"
  );

  const response = await request(app)
    .get("/api/medical-records")
    .set("Cookie", cookie);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.records));
  assert.ok(
    response.body.records.some((record) => record.id === recordId)
  );
});

test("another patient cannot retrieve John's medical records", async () => {
  const cookie = await login(
    "patient2@test.com",
    "PatientTwo123!"
  );

  const response = await request(app)
    .get("/api/medical-records")
    .set("Cookie", cookie);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.records));
  assert.equal(
    response.body.records.some((record) => record.id === recordId),
    false
  );
});

test("Doctor B cannot update Doctor A's medical record", async () => {
  const cookie = await login(
    "doctor2@test.com",
    "DoctorTwoPassword123!"
  );

  const response = await request(app)
    .patch(`/api/medical-records/${recordId}`)
    .set("Cookie", cookie)
    .send({
      patientId: johnPatientId,
      diagnosis: "UNAUTHORIZED UPDATE",
      notes: "Doctor B must not modify Doctor A's record",
    });

  assert.equal(response.status, 404);
  assert.equal(
    response.body.message,
    "Medical record not found or access denied"
  );
});

test("Doctor A can update their own medical record", async () => {
  const cookie = await login(
    "doctor@test.com",
    "DoctorPassword123!"
  );

  const response = await request(app)
    .patch(`/api/medical-records/${recordId}`)
    .set("Cookie", cookie)
    .send({
      patientId: johnPatientId,
      diagnosis: "AUTHORIZED TEST",
      notes: "Doctor A RLS verification",
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.message, "Medical record updated successfully");
  assert.equal(response.body.record.id, recordId);
  assert.equal(response.body.record.diagnosis, "AUTHORIZED TEST");
});

test("patient cannot update a medical record", async () => {
  const cookie = await login(
    "patient@test.com",
    "TestPassword123!"
  );

  const response = await request(app)
    .patch(`/api/medical-records/${recordId}`)
    .set("Cookie", cookie)
    .send({
      patientId: johnPatientId,
      diagnosis: "PATIENT UPDATE",
      notes: "Patient must not modify medical records",
    });

  assert.equal(response.status, 403);
});
