const fs = require('fs');
const mysql = require('mysql2/promise');

// Manual .env parser to avoid dependency issues
let env = {};
try {
  const envFile = fs.readFileSync('.env', 'utf-8');
  envFile.split(/\r?\n/).forEach((line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
      env[key] = val;
    }
  });
} catch (e) {
  console.error('No se pudo leer el archivo .env, usando variables del proceso.');
  env = process.env;
}

async function main() {
  const data = JSON.parse(fs.readFileSync('indicadores_clean.json', 'utf-8'));
  console.log(`Leídos ${data.length} registros para importar.`);

  const connection = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '3306', 10),
    user: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_DATABASE || 'ciudadela_mia',
  });

  console.log('Conexión con Hostinger MySQL establecida exitosamente.');

  // Clean indicators_tecnicos table first so we do not get duplicate primary key errors or duplicate dates
  console.log('Limpiando registros antiguos de indicadores_tecnicos...');
  await connection.execute('DELETE FROM indicadores_tecnicos');

  let imported = 0;
  for (const record of data) {
    const query = `
      INSERT INTO indicadores_tecnicos (
        fecha, cobertura_acueducto, usuarios_acueducto, micromedicion_nominal, micromedicion_real,
        irca, ianc_promedio, produccion_acueducto, consumo_acueducto, continuidad_acueducto,
        cobertura_alcantarillado, usuarios_alcantarillado, cobertura_aseo, usuarios_aseo,
        barrido_km, continuidad_aseo, produccion_residuos_ton
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      record.fecha,
      record.cobertura_acueducto,
      record.usuarios_acueducto,
      record.micromedicion_nominal,
      record.micromedicion_real,
      record.irca,
      record.ianc_promedio,
      record.produccion_acueducto,
      record.consumo_acueducto,
      record.continuidad_acueducto,
      record.cobertura_alcantarillado,
      record.usuarios_alcantarillado,
      record.cobertura_aseo,
      record.usuarios_aseo,
      record.barrido_km,
      record.continuidad_aseo,
      record.produccion_residuos_ton,
    ];

    await connection.execute(query, params);
    imported++;
  }

  console.log(`Éxito: Se importaron ${imported} registros a la tabla 'indicadores_tecnicos'.`);
  await connection.end();
}

main().catch((err) => {
  console.error('Error durante la importación:', err);
});
