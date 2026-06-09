const fs = require('fs');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');

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

const MONTH_MAP = {
  'ABRIL': 4,
  'MAYO': 5,
  'JUNIO': 6,
  'JUNIIO': 6
};

function parseSheetDate(sheetName) {
  const clean = sheetName.trim();
  const parts = clean.split('-');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const monthStr = parts[1].toUpperCase();
  const year = parseInt(parts[2], 10);

  const month = MONTH_MAP[monthStr];
  if (!month || isNaN(day) || isNaN(year)) return null;

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

async function main() {
  const filePath = 'lecturas_macro_mia.xlsx';
  if (!fs.existsSync(filePath)) {
    console.error(`Error: No se encontró el archivo ${filePath} en la raíz del proyecto.`);
    return;
  }

  console.log('Cargando archivo Excel...');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  console.log('Conectando a la base de datos MySQL...');
  const connection = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '3306', 10),
    user: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_DATABASE || 'ciudadela_mia',
  });

  console.log('Limpiando registros existentes en la tabla registro_macromedidor...');
  await connection.execute('DELETE FROM registro_macromedidor');

  let importedCount = 0;

  // Let's sort worksheets to insert them in chronological order
  const worksheetsData = workbook.worksheets.map(sheet => {
    const dateStr = parseSheetDate(sheet.name);
    return { sheet, dateStr };
  }).filter(item => item.dateStr !== null);

  // Sort worksheets chronologically
  worksheetsData.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

  console.log(`Iniciando importación programática de ${worksheetsData.length} días...`);

  let previousReading = null;

  for (const { sheet, dateStr } of worksheetsData) {
    console.log(`Procesando hoja: ${sheet.name.trim()} -> Fecha: ${dateStr}`);
    let runningDailySum = 0;

    for (let r = 1; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      const hCell = row.getCell(2).value; // Hora
      const lCell = row.getCell(3).value; // Lectura

      // Check if row corresponds to hour (1-24)
      if (typeof hCell === 'number' && hCell >= 1 && hCell <= 24) {
        // Resolve reading
        let rawReading = lCell;
        if (typeof lCell === 'object' && lCell !== null) {
          rawReading = lCell.result;
        }

        // If reading is empty/null, skip
        if (rawReading === null || rawReading === undefined || rawReading === '') {
          continue;
        }

        const readingVal = Number(rawReading);

        // Calculate consolidado_m3
        let consolidadoM3 = 0;
        if (previousReading !== null) {
          consolidadoM3 = Number(((readingVal - previousReading) * 10).toFixed(2));
        }

        // Special case in Excel for April 27 Hour 14 (starts recording/reset, consolidado is 0)
        if (dateStr === '2026-04-27' && hCell === 14) {
          consolidadoM3 = 0;
        }

        // Calculate running daily sum (acumulado)
        runningDailySum = Number((runningDailySum + consolidadoM3).toFixed(2));

        // Reading in m3 (multiplied by 10 to keep mathematical consistency with consolidado)
        const lecturaM3 = Number((readingVal * 10).toFixed(2));

        const query = `
          INSERT INTO registro_macromedidor (
            fecha, hora, lectura_m3, consolidado_m3, consumo_acumulado_dia,
            operario_id, created_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
          dateStr,
          hCell,
          lecturaM3,
          consolidadoM3,
          runningDailySum,
          3, // lmosquera (operario_id)
          3  // created_by (lmosquera)
        ];

        await connection.execute(query, params);
        importedCount++;
        previousReading = readingVal;
      }
    }
  }

  console.log(`\nImportación finalizada con éxito.`);
  console.log(`Total de registros horarios importados: ${importedCount}`);

  await connection.end();
}

main().catch(err => {
  console.error('Error durante la importación de macromedidor:', err);
});
