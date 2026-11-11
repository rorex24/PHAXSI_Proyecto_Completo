USE phaxsi_db;

-- Inserción de Usuario de Prueba (Password: Password123!)
-- Hash bcrypt generado para 'Password123!'
INSERT INTO usuarios (nombre, email, password, rol, telefono, fecha_nacimiento, tipo_sangre, alergias, contacto_medico)
VALUES 
('Rodrigo Alba', 'rodrigo@phaxsi.org', '$2a$10$wE9mH60OaW8.7DxgY78AieXyqXJd84m12oK.6jW0m.9n4f0Yq2xKG', 'paciente', '+591 70000000', '2000-05-15', 'O+', 'Penicilina', 'Dr. Roberto Vargas - Tel: 44556677'),
('María Care', 'maria@phaxsi.org', '$2a$10$wE9mH60OaW8.7DxgY78AieXyqXJd84m12oK.6jW0m.9n4f0Yq2xKG', 'cuidador', '+591 71111111', '1995-08-20', 'A+', 'Ninguna', 'Dra. Elena Gómez - Tel: 44112233');

-- Insertar Registros de Crisis
INSERT INTO crisis (usuario_id, fecha_hora, duracion_minutos, tipo_crisis, sintomas, desencadenantes, observaciones)
VALUES
(1, NOW() - INTERVAL 2 DAY, 3, 'Tónico-Clónica Generalizada', 'Pérdida de conocimiento, rigidez muscular, convulsiones.', 'Falta de sueño, luces parpadeantes', 'Se recuperó favorablemente en 15 minutos sin complicaciones.'),
(1, NOW() - INTERVAL 10 DAY, 1, 'Ausencia Típica', 'Mirada fija, interrupción breve de actividad.', 'Estrés académico', 'Duró apenas 45 segundos.');

-- Insertar Medicamentos
INSERT INTO medicamentos (usuario_id, nombre_medicamento, dosis, frecuencia, horarios, instrucciones)
VALUES
(1, 'Ácido Valproico', '500 mg', 'Cada 12 horas', '08:00, 20:00', 'Tomar junto con los alimentos'),
(1, 'Lamotrigina', '100 mg', 'Cada 24 horas', '08:00', 'Tomar por la mañana');

-- Insertar Contactos de Emergencia
INSERT INTO contactos_emergencia (usuario_id, nombre, parentesco, telefono, es_prioritario)
VALUES
(1, 'Carlos Alba', 'Padre', '+591 72222222', TRUE),
(1, 'Laura Ricaldi', 'Madre', '+591 73333333', TRUE);
