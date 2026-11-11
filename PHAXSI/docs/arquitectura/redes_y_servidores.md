# Guía de Arquitectura de Red y Configuración entre Windows 11 y Ubuntu Server

## 1. Topología del Sistema
El proyecto PHAXSI utiliza una arquitectura de 3 capas distribuida:
- **Capa de Presentación (Frontend):** Ejecutada en Windows 11 (Vite/React en puerto 3000).
- **Capa de Lógica de Negocio (Backend):** Ejecutada en VirtualBox Ubuntu Server 1 (Node.js/Express en puerto 5000).
- **Capa de Datos (Base de Datos):** Ejecutada en VirtualBox Ubuntu Server 2 (MySQL Server en puerto 3306).

## 2. Configuración de Red en VirtualBox
Para permitir la comunicación sin interrupciones entre Windows y las máquinas virtuales:
1. Configurar cada Máquina Virtual con un adaptador en modo **Host-Only (Adaptador sólo-anfitrión)** o **Red Interna / Adaptador Puente (Bridged)**.
2. Asignar direcciones IP estáticas en `/etc/netplan/` en Ubuntu Server.
   - Host (Windows 11): `192.168.56.1`
   - VM Backend (Ubuntu): `192.168.56.10`
   - VM MySQL (Ubuntu): `192.168.56.20`

## 3. Configuración de MySQL para Conexión Remota
En la máquina de base de datos MySQL (Ubuntu):
1. Editar `/etc/mysql/mysql.conf.d/mysqld.cnf`:
   ```ini
   bind-address = 0.0.0.0
   ```
2. Crear usuario remoto en MySQL:
   ```sql
   CREATE USER 'phaxsi_user'@'%' IDENTIFIED BY 'phaxsi_password';
   GRANT ALL PRIVILEGES ON phaxsi_db.* TO 'phaxsi_user'@'%';
   FLUSH PRIVILEGES;
   ```
3. Reiniciar MySQL y habilitar puerto 3306 en el Firewall (UFW):
   ```bash
   sudo ufw allow 3306/tcp
   sudo systemctl restart mysql
   ```
