import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("GET /api/auth/me rejects unauthenticated requests", async () => {
  const response = await request(app)
    .get("/api/auth/me");

  assert.equal(response.status, 401);
});

test("GET /api/admin/users rejects unauthenticated requests", async () => {
  const response = await request(app)
    .get("/api/admin/users");

  assert.equal(response.status, 401);
});

test("POST /api/medical-records rejects unauthenticated requests", async () => {
  const response = await request(app)
    .post("/api/medical-records")
    .send({
      patientId: "9ab4a819-bea6-49c8-aa20-cafe5ea1bd14",
      diagnosis: "TEST",
      notes: "TEST",
    });

  assert.equal(response.status, 401);
});

test("POST /api/auth/register rejects public doctor registration", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      role: "doctor",
      firstName: "Unauthorized",
      lastName: "Doctor",
      email: `unauthorized-${Date.now()}@test.com`,
      password: "TestPassword123!",
      dateOfBirth: "1990-01-01",
    });

  assert.equal(response.status, 400);
});