ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

ALTER TABLE medical_records FORCE ROW LEVEL SECURITY;

CREATE POLICY medical_records_patient_select
ON medical_records
FOR SELECT
USING (
    patient_id IN (
        SELECT id
        FROM patients
        WHERE user_id = current_setting('app.user_id', true)::uuid
    )
);

CREATE POLICY medical_records_doctor_select
ON medical_records
FOR SELECT
USING (
    doctor_id IN (
        SELECT id
        FROM doctors
        WHERE user_id = current_setting('app.user_id', true)::uuid
    )
);

CREATE POLICY medical_records_doctor_insert
ON medical_records
FOR INSERT
WITH CHECK (
    doctor_id IN (
        SELECT id
        FROM doctors
        WHERE user_id = current_setting('app.user_id', true)::uuid
    )
);

CREATE POLICY medical_records_doctor_update
ON medical_records
FOR UPDATE
USING (
    doctor_id IN (
        SELECT id
        FROM doctors
        WHERE user_id = current_setting('app.user_id', true)::uuid
    )
)
WITH CHECK (
    doctor_id IN (
        SELECT id
        FROM doctors
        WHERE user_id = current_setting('app.user_id', true)::uuid
    )
);