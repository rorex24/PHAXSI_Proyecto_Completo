-- Script de Creación de la Base de Datos PHAXSI
CREATE DATABASE IF NOT EXISTS phaxsi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE phaxsi_db;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('paciente', 'cuidador', 'admin') DEFAULT 'paciente',
    telefono VARCHAR(30),
    fecha_nacimiento DATE,
    tipo_sangre VARCHAR(10),
    condiciones_adicionales TEXT,
    alergias TEXT,
    contacto_medico TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Crisis Epilépticas
CREATE TABLE IF NOT EXISTS crisis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    duracion_minutos INT NOT NULL,
    tipo_crisis VARCHAR(100) NOT NULL,
    sintomas TEXT,
    desencadenantes TEXT,
    observaciones TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_medicamento VARCHAR(150) NOT NULL,
    dosis VARCHAR(50) NOT NULL,
    frecuencia VARCHAR(100) NOT NULL,
    horarios VARCHAR(255) NOT NULL,
    instrucciones TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Cumplimiento de Medicamentos
CREATE TABLE IF NOT EXISTS registros_medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicamento_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    tomado BOOLEAN DEFAULT TRUE,
    notas TEXT,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
);

-- Tabla de Contactos de Emergencia
CREATE TABLE IF NOT EXISTS contactos_emergencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    es_prioritario BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
