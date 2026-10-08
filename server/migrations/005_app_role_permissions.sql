GRANT USAGE ON SCHEMA public TO medispheres_app;

GRANT SELECT, INSERT, UPDATE ON
    users,
    patients,
    doctors,
    appointments,
    medical_records
TO medispheres_app;

GRANT SELECT, INSERT ON audit_logs TO medispheres_app;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO medispheres_app;
