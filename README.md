Mi Prompt ( para chatgpt hacia antigravity)

No quiero una simulación visual ni una página genérica.
Quiero una herramienta profesional para desarrolladores, con excelente diseño, editor funcional, análisis léxico real, resultados precisos y una experiencia de usuario sobresaliente.
No sacrifiques la funcionalidad por el diseño ni modifiques funciones que ya estén funcionando al realizar mejoras visuales.
Entrega instrucciones para ejecutar y probar el proyecto.


/////////////////////////////////////////////////////// (Prompt de chat para Antigravity)
# JC ANALYZER – LEXICAL ERROR DETECTOR
## Actividad  – Autómatas I

Actúa como desarrollador Full Stack Senior, arquitecto de software y diseñador UI/UX especializado en herramientas profesionales para desarrolladores y compiladores.

Desarrolla una aplicación web completa llamada **JC ANALYZER – Lexical Error Detector**.

Subtítulo: Analizador de errores léxicos | Autómatas I.

### 1. Objetivo

Crear una aplicación web interactiva que permita introducir fragmentos de código, analizarlos léxicamente, identificar tokens y detectar errores léxicos.

Debe soportar tres lenguajes:
- Python.
- Java.
- JavaScript.

### 2. Diseño e identidad visual

La calidad visual es una prioridad muy alta.

Diseña una interfaz inspirada en herramientas profesionales como Visual Studio Code, GitHub Desktop, Linear, Vercel y Raycast, sin copiar sus diseños literalmente.

Características:
- Tema oscuro elegante.
- Fondo negro y gris carbón.
- Acentos azul eléctrico y violeta.
- Verde para resultados correctos.
- Rojo para errores.
- Tipografía moderna.
- Iconografía profesional.
- Paneles bien organizados.
- Bordes sutiles y esquinas redondeadas.
- Sombras discretas.
- Animaciones suaves.
- Excelente jerarquía visual.

Evita interfaces genéricas, diseños escolares básicos, botones decorativos y espacios vacíos innecesarios.

### 3. Estructura de la aplicación

Implementa una barra lateral con:
- Inicio.
- Nuevo análisis.
- Ejemplos de código.
- Comparación de lenguajes.
- Historial de análisis.
- Documentación y teoría.
- Configuración.

La barra superior debe contener:
- Selector de Python, Java y JavaScript.
- Indicador de errores léxicos.
- Botón Ejecutar Análisis.
- Botón Reporte PDF.

### 4. Editor de código

Implementa un editor profesional con:
- Resaltado de sintaxis.
- Numeración de líneas.
- Fuente monoespaciada.
- Identificación visual de errores.
- Edición de código.
- Botón analizar.
- Botón limpiar.
- Botón cargar ejemplos.

### 5. Motor de análisis léxico

Desarrolla un motor real que recorra el código fuente de izquierda a derecha y clasifique:

- Palabras reservadas.
- Identificadores.
- Números enteros.
- Números decimales.
- Cadenas de texto.
- Operadores aritméticos.
- Operadores de comparación.
- Operadores de asignación.
- Delimitadores.
- Comentarios.

Utiliza expresiones regulares, reglas de reconocimiento, estructuras condicionales, listas y conjuntos de palabras reservadas.

Implementa reglas independientes para cada lenguaje.

### 6. Detección de errores

Detecta:
- Caracteres desconocidos.
- Símbolos no permitidos según las reglas implementadas.
- Cadenas sin cerrar.
- Números mal formados.
- Identificadores inválidos.
- Secuencias que no correspondan a tokens reconocibles.

Cada error debe mostrar:
- Tipo.
- Lexema.
- Línea.
- Columna.
- Explicación.

El análisis debe continuar después de encontrar errores.

### 7. Diferencia entre error léxico y sintáctico

Implementa obligatoriamente estas pruebas.

Prueba A:

`numero = 10 @ 5`

En el contexto de la actividad, identificar @ como error léxico, explicando que su clasificación depende del lenguaje y las reglas del caso.

Prueba B:

`20 + * 5;`

Reconocer todos los elementos como tokens válidos y mostrar cero errores léxicos.

Explicar que existe un problema estructural o sintáctico, no léxico.

### 8. Panel de resultados

Implementa pestañas interactivas:

1. Tokens.
2. Errores léxicos.
3. Detalles.
4. Comparación.

La tabla de tokens debe mostrar:

| No. | Lexema | Categoría | Línea | Columna | Estado |
|---|---|---|---|---|---|

Los errores deben resaltarse y permitir localizar su posición en el editor.

Incluye indicadores de:
- Total de tokens.
- Tokens válidos.
- Errores léxicos.
- Tiempo real de análisis.

El tiempo debe calcularse, no inventarse.

### 9. Comparación de lenguajes

Permite analizar un mismo fragmento bajo Python, Java y JavaScript.

Muestra tres paneles independientes con sus tokens, errores y resultados.

### 10. Reportes PDF

Implementa generación de reportes PDF con:
- Nombre de la aplicación.
- Lenguaje analizado.
- Código fuente.
- Tabla de tokens.
- Errores detectados.
- Ubicación.
- Resumen estadístico.
- Conclusión.

Utiliza los resultados reales del análisis.

### 11. Historial

Guarda análisis anteriores con:
- Fecha.
- Lenguaje.
- Total de tokens.
- Errores.
- Resultado.

Permite consultar los resultados anteriores.

### 12. Tecnologías

Preferentemente utiliza:
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Lucide Icons.
- Monaco Editor o CodeMirror.
- Biblioteca para generación de PDF.

Mantén una arquitectura modular y separa la interfaz del motor léxico.

### 13. Validación

Ejecuta pruebas reales:
- Python válido.
- Java válido.
- JavaScript válido.
- Símbolos desconocidos.
- Cadenas sin cerrar.
- Caso @.
- Caso 20 + * 5;.
- Ubicación de errores.
- Historial.
- Generación PDF.

Corrige los errores antes de finalizar.

### 14. Resultado final

No quiero una simulación visual ni una página genérica.

Quiero una herramienta profesional para desarrolladores, con excelente diseño, editor funcional, análisis léxico real, resultados precisos y una experiencia de usuario sobresaliente.

No sacrifiques la funcionalidad por el diseño ni modifiques funciones que ya estén funcionando al realizar mejoras visuales.

Entrega instrucciones para ejecutar y probar el proyecto.
