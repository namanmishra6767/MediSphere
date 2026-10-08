ALTER TABLE medical_records
ADD COLUMN diagnosis_ciphertext TEXT,
ADD COLUMN diagnosis_iv TEXT,
ADD COLUMN diagnosis_auth_tag TEXT,
ADD COLUMN notes_ciphertext TEXT,
ADD COLUMN notes_iv TEXT,
ADD COLUMN notes_auth_tag TEXT;