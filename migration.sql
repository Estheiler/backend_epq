-- 1. Modificar tabla 'users'
ALTER TABLE users 
    MODIFY COLUMN role ENUM('superadmin', 'admin', 'operario', 'hidraulico') DEFAULT 'hidraulico' NOT NULL,
    ADD COLUMN is_active TINYINT(1) DEFAULT 1 NOT NULL,
    ADD COLUMN created_by INT NULL,
    ADD COLUMN updated_by INT NULL,
    ADD COLUMN deleted_by INT NULL,
    ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- 2. Modificar tabla 'indicadores_tecnicos'
ALTER TABLE indicadores_tecnicos 
    ADD COLUMN created_by INT NULL,
    ADD COLUMN updated_by INT NULL,
    ADD COLUMN deleted_by INT NULL,
    ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- 3. Modificar tabla 'registro_macromedidor'
ALTER TABLE registro_macromedidor 
    ADD COLUMN created_by INT NULL,
    ADD COLUMN updated_by INT NULL,
    ADD COLUMN deleted_by INT NULL,
    ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL,
    ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- 4. Crear tabla 'auditoria_usuarios'
CREATE TABLE auditoria_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_afectado_id INT NOT NULL,
    usuario_afectado_username VARCHAR(255) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    ejecutor_id INT NULL,
    ejecutor_username VARCHAR(255) NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detalles TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Crear tabla 'auditoria_accesos'
CREATE TABLE auditoria_accesos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    user_agent VARCHAR(512) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detalles TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
