import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

const login = async (email, password) => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  assert.equal(response.status, 200);

  return response.headers["set-cookie"][0];
};

test("patient cannot access admin users", async () => {
  const cookie = await login(
    "patient@test.com",
    "TestPassword123!"
  );

  const response = await request(app)
    .get("/api/admin/users")
    .set("Cookie", cookie);

  assert.equal(response.status, 403);
});

test("patient cannot create medical records", async () => {
  const cookie = await login(
    "patient@test.com",
    "TestPassword123!"
  );

  const response = await request(app)
    .post("/api/medical-records")
    .set("Cookie", cookie)
    .send({
      patientId: "9ab4a819-bea6-49c8-aa20-cafe5ea1bd14",
      diagnosis: "UNAUTHORIZED TEST",
      notes: "Patient should not create this",
    });

  assert.equal(response.status, 403);
});

test("doctor cannot access admin users", async () => {
  const cookie = await login(
    "doctor@test.com",
    "DoctorPassword123!"
  );

  const response = await request(app)
    .get("/api/admin/users")
    .set("Cookie", cookie);

  assert.equal(response.status, 403);
});

test("admin can access admin users", async () => {
  const cookie = await login(
    "admin@test.com",
    "AdminPassword123!"
  );

  const response = await request(app)
    .get("/api/admin/users")
    .set("Cookie", cookie);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.users));
});