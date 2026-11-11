# Proyecto PHAXSI - Plataforma de Apoyo para Personas con Epilepsia

PHAXSI es una plataforma web completa desarrollada para brindar soporte a personas con epilepsia, sus cuidadores y familiares.

## Estructura del Proyecto

- `frontend/`: Aplicación React + Vite + CSS (JavaScript ES6+).
- `backend/`: Servidor Node.js + Express + JWT + bcrypt + MySQL2.
- `db/`: Scripts de base de datos MySQL (tablas e inserciones de prueba).
- `docs/`: Guía de arquitectura y despliegue en red entre Windows 11 y Ubuntu Server.

## Tecnologías Utilizadas

- **Frontend:** React, Vite, CSS Grid/Flexbox, Lucide React Icons.
- **Backend:** Node.js, Express, JSON Web Tokens (JWT), bcryptjs, CORS, dotenv, MySQL2.
- **Base de Datos:** MySQL Server 8.0 / MySQL Workbench.
- **Redes:** VirtualBox (NAT + Host-Only / Red Interna).

## Instrucciones Rápidas

1. Configurar la base de datos ejecutando `db/schema.sql` y `db/seeds/sample_data.sql`.
2. En `backend/`, instalar dependencias (`npm install`), configurar `.env` y ejecutar (`npm run dev`).
3. En `frontend/`, instalar dependencias (`npm install`) y ejecutar (`npm run dev`).
