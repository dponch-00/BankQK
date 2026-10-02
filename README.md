# BanQK

Registro minimalista de gastos e ingresos en español de México, para Android y pesos mexicanos (MXN).

## Funciones

- Gasté: Casa, Medicinas, Trabajo, Gustos, Niños y Otros.
- Recibí: Consultas, Cirugías y Otros.
- Chip + para crear categorías por tipo, guardadas en la base de datos del usuario. No permite nombres duplicados, ignorando mayúsculas y acentos.
- Modo claro y oscuro con botón en el encabezado. La preferencia se recuerda en el dispositivo; al inicio usa el tema del sistema.
- Registro con monto, categoría opcional (Otros por defecto), nota y fecha.
- Movimientos: mes, búsqueda, filtros de tipo/categoría, subtotales, agrupación por día, edición, eliminación confirmada y exportación JSON.
- Resumen: ingresos, gastos, diferencia; distribución de ambos por categoría; tendencia diaria; seis meses; diferencia acumulada; mayor categoría de gasto; promedio por día con gastos; gastos como porcentaje de ingresos.
- Incluye categorías anteriores y personalizadas en los análisis. Los registros existentes conservan sus categorías originales.
- La tendencia del mes actual se limita a los días transcurridos o las fechas ya registradas; no proyecta movimientos en días futuros. Gráficas con punto visible cuando hay un solo día.

## Vista local

Desde esta carpeta: `node scripts/run-framework.mjs dev`. Abrir la dirección local indicada. El desarrollo usa una sesión simulada. Los datos locales están en `.wrangler/state`, ignorados por Git. No borrar esa carpeta si se ingresan registros que se quieran conservar.

## Base de datos

La migración original crea movements. La nueva `drizzle/0001_easy_stingray.sql` agrega categories sin modificar los registros. Se aplicó al entorno local. La identidad de sitio privada se conserva en `.openai/hosting.json` para una publicación posterior, sin crear un sitio duplicado.

Los registros y las categorías se separan por usuario en servidor. Las cantidades se guardan como centavos enteros y se validan. Guardar cambios conserva el identificador y evita movimientos duplicados. La diferencia del mes es ingresos menos gastos, no saldo bancario.

## Verificación

- `node scripts/check-money.mjs`: montos, fechas, categorías, porcentajes, agrupación mensual, acumulados y límites del mes actual.
- `node scripts/check-api.mjs`: requiere el servidor local; categorías persistentes, duplicados, guardar/editar sin duplicar, rechazo de datos inválidos, sesión y origen. Crea datos sintéticos y los elimina al finalizar.
- `node node_modules/typescript/bin/tsc --noEmit`: validación de tipos.
- `node scripts/run-framework.mjs build`: versión de producción.
- UI: chips, formulario de categorías y duplicados, filtros y búsqueda, gráficas, modo oscuro y persistencia del tema.

## Estado

GitHub Pages publica una edición autónoma desde main usando GitHub Actions. La PWA está disponible en https://dponch-00.github.io/BankQK/ y guarda movimientos y categorías en el almacenamiento local del teléfono; no sincroniza entre dispositivos. Después de abrirla una vez con internet, se puede usar sin conexión. En Chrome para Android, abre el enlace y elige Instalar aplicación o Agregar a pantalla principal. Los datos se guardan en el dispositivo; conserva la descarga JSON como respaldo. La vista local de desarrollo sigue usando Cloudflare D1.


