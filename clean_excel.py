import pandas as pd
import json

df = pd.read_excel('indicadores_epq.xlsx')

def clean_percentage(val):
    if pd.isna(val) or val == '':
        return None
    if isinstance(val, str):
        val = val.strip().replace('%', '')
        try:
            return float(val)
        except ValueError:
            return None
    val = float(val)
    if val <= 1.0:
        return round(val * 100.0, 2)
    return round(val, 2)

def clean_float(val):
    if pd.isna(val) or val == '':
        return None
    try:
        return round(float(val), 2)
    except (ValueError, TypeError):
        return None

def clean_int(val):
    if pd.isna(val) or val == '':
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None

data = []
for idx, row in df.iterrows():
    fecha_dt = pd.to_datetime(row['Fecha'])
    fecha = fecha_dt.strftime('%Y-%m-%d')
    
    record = {
        'fecha': fecha,
        'cobertura_acueducto': clean_percentage(row['Cobertura acueducto']),
        'usuarios_acueducto': clean_int(row['Usuarios acueducto']),
        'micromedicion_nominal': clean_percentage(row['Micromedicion nominal']),
        'micromedicion_real': clean_percentage(row['Micromedicion real']),
        'irca': clean_percentage(row['IRCA']),
        'ianc_promedio': clean_percentage(row['ianc promedio']),
        'produccion_acueducto': clean_float(row['produccion acueducto']),
        'consumo_acueducto': clean_float(row['consumo acueducto']),
        'continuidad_acueducto': clean_float(row['Continuidad acueducto']),
        'cobertura_alcantarillado': clean_percentage(row['Cobertura alcantarillado']),
        'usuarios_alcantarillado': clean_int(row['usuarios alcantarillado']),
        'cobertura_aseo': clean_percentage(row['Cobertura aseo']),
        'usuarios_aseo': clean_int(row['Usuarios aseo']),
        'barrido_km': clean_float(row['Barrido']),
        'continuidad_aseo': clean_percentage(row['Continuidad aseo']),
        'produccion_residuos_ton': clean_float(row['Produccion de residuos'])
    }
    data.append(record)

with open('indicadores_clean.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Éxito: Se procesaron {len(data)} registros y se guardaron en 'indicadores_clean.json'")
