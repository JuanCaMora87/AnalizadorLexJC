# JC ANALYZER – LEXICAL ERROR DETECTOR
### Analizador de Errores Léxicos | Autómatas I (Actividad 3)

[![Estado](https://img.shields.io/badge/Estado-100%25_Terminado-emerald?style=flat-square)](#)
[![Materia](https://img.shields.io/badge/Materia-Aut%C3%B3matas_I-indigo?style=flat-square)](#)
[![Fase](https://img.shields.io/badge/Fase_del_Compilador-1._An%C3%A1lisis_L%C3%A9xico_(Scanner)-blue?style=flat-square)](#)
[![Lenguajes](https://img.shields.io/badge/Lenguajes-Python_|_Java_|_JavaScript-purple?style=flat-square)](#)

**JC ANALYZER** es una aplicación web profesional de análisis léxico y detección de errores para compiladores, desarrollada bajo estándares visuales modernos (inspirada en herramientas para desarrolladores como **Visual Studio Code, Linear, Raycast y Vercel**).

Permite inspeccionar código fuente en **Python, Java y JavaScript**, reconocer tokens en tiempo real, clasificar lexemas conforme a la teoría formal de autómatas finitos deterministas (AFD) y compiladores, y distinguir con precisión matemática entre **errores léxicos** y **errores sintácticos**.

---

## 🚀 Guía Rápida para el Profesor / Evaluador

Para ejecutar y probar la aplicación web, solo necesitas elegir cualquiera de estas opciones:

### Opción 1: Apertura Directa en el Navegador (Recomendada)
Haz **doble clic en el archivo `index.html`** (o en el acceso directo `Abrir_JC_Analyzer.url`).
Se abrirá instantáneamente en cualquier navegador moderno (**Google Chrome, Microsoft Edge, Firefox**) sin necesidad de instalar `node`, `npm` ni paquetes adicionales.

### Opción 2: Con Servidor Local en Python (Opcional)
Si deseas servirlo mediante servidor HTTP local:
```bash
python server.py
```
O simplemente haciendo doble clic en `abrir_jc_analyzer.bat`.

---

## 📁 Estructura del Repositorio

El proyecto cuenta con una arquitectura desacoplada y modular:

```text
analizador_errores_lexicos/
├── index.html                   # Interfaz de usuario SPA profesional (React + Tailwind)
├── Abrir_JC_Analyzer.url        # Acceso directo nativo de Windows (abre con 1 clic)
├── abrir_jc_analyzer.bat        # Script de apertura directa para Windows
├── server.py                    # Servidor local opcional con apertura automática
├── README.md                    # Documentación técnica para el repositorio
├── .gitignore                   # Exclusiones de control de versiones
├── js/
│   ├── lexicalEngine.js         # Motor de escaneo léxico formal (AFD y Reglas por lenguaje)
│   ├── syntaxAdvisory.js        # Módulo de diferenciación sintáctica vs léxica (Caso '20 + * 5;')
│   ├── presets.js               # Casos de prueba obligatorios de la rúbrica precargados
│   ├── pdfGenerator.js          # Motor de generación de reportes PDF técnicos (jsPDF)
│   └── app.jsx                  # Código modular de los componentes React
└── vendor/                      # Bibliotecas locales para funcionamiento 100% offline
    ├── react.production.min.js
    ├── react-dom.production.min.js
    ├── babel.min.js
    ├── lucide.min.js
    ├── jspdf.umd.min.js
    └── jspdf.plugin.autotable.min.js
```

---

## 🏷️ Categorías Léxicas Reconocidas

El motor implementa las 10 categorías formales del diseño de compiladores:

| # | Categoría | Explicación Formal | Ejemplos en Python / Java / JS |
|:---:|---|---|---|
| **1** | **Palabra reservada** | Símbolos terminales fijos del lenguaje | `if`, `else`, `while`, `def`, `class`, `public`, `return`, `let`, `const` |
| **2** | **Identificador** | Nombres definidos por el programador | `edad`, `nombre`, `resultado`, `salario`, `_contador` |
| **3** | **Número entero** | Secuencias exclusivas de dígitos | `23`, `10`, `0`, `5`, `100` |
| **4** | **Número decimal** | Número con parte entera, punto y decimal | `15.50`, `0.16`, `100.0`, `3.14159` |
| **5** | **Cadena de texto** | Literales entre comillas simples/dobles/template | `"Juan"`, `'Hola mundo'`, `` `Texto ${var}` `` |
| **6** | **Operador aritmético** | Operaciones matemáticas básicas y potencias | `+`, `-`, `*`, `/`, `%`, `**`, `//`, `++`, `--` |
| **7** | **Operador de comparación** | Operadores relacionales y de igualdad | `==`, `!=`, `>`, `<`, `>=`, `<=`, `===`, `!==` |
| **8** | **Operador de asignación** | Asignación simple y compuesta | `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=` |
| **9** | **Delimitador** | Símbolos de puntuación y agrupación | `(`, `)`, `{`, `}`, `[`, `]`, `,`, `:`, `;`, `.` |
| **10** | **Comentario** | Anotaciones ignoradas por el compilador | `# Comentario` (Python), `// Comentario`, `/* Bloque */` (Java/JS) |

---

## 🔬 Casos de Prueba Obligatorios de la Rúbrica

Dentro de la aplicación, en el menú lateral **"Ejemplos de Rúbrica"** (o en la barra inferior del editor) se pueden cargar los casos requeridos con un solo clic:

### Caso 1: Código Correcto
```python
edad = 23
nombre = "Juan"
resultado = edad + 5
```
- **Resultado:** 11 tokens reconocidos, **0 errores léxicos**. Todos los componentes son clasificados con estado `Válido`.

### Caso 2: Error Léxico con `@`
```python
numero = 10 @ 5
```
- **Resultado:** Identifica `@` como **Error Léxico** en **Línea 1, Columna 13**.
- **Fundamento Teórico:** El símbolo `@` no pertenece al alfabeto de operadores aritméticos de Python (reservado únicamente para decoradores).

### Caso 3: Error Sintáctico, NO Léxico (`20 + * 5;`)
```python
20 + * 5;
```
- **Resultado:**
  - Tokens reconocidos: `20` (Número entero), `+` (Operador aritmético), `*` (Operador aritmético), `5` (Número entero), `;` (Delimitador).
  - **Total de errores léxicos:** **0**.
  - **Aviso Educativo Activado:** La aplicación despliega un banner ámbar que explica:
    > *"Los operadores adyacentes '+ *' son lexemas individualmente válidos en el vocabulario del lenguaje. Sin embargo, violan la regla gramatical <Expresion> ::= <Expresion> <Operador> <Expresion> en la fase de Análisis Sintáctico (Parser). El Analizador Léxico no debe marcar esta expresión como un error léxico."*

### Caso 4: Cadena sin Cerrar
```python
nombre = "Juan
```
- **Resultado:** Reporta inmediatamente **Cadena de texto sin cerrar** en **Línea 1, Columna 10**.

---

## 📊 Características Destacadas

1. **Prioridad de Operadores Multicarácter:** Se evalúan operadores de 3 caracteres (`===`, `!==`, `**=`), luego de 2 (`==`, `!=`, `>=`, `<=`, `+=`, `**`, `//`) y finalmente de 1 carácter (`=`, `>`, `<`, `+`), impidiendo que `==` se confunda con dos asignaciones `=`.
2. **Diferenciación Decimal vs. Entero:** Se evalúa `\d+\.\d+` antes que `\d+`, garantizando que `15.50` no se fraccione en `15` y `50`.
3. **Métricas Reales en Milisegundos:** El tiempo de análisis se mide con precisión de microsegundos mediante `performance.now()`.
4. **Reporte PDF Académico:** Botón directo para exportar el análisis completo a un documento PDF profesional con metadatos, tabla de tokens, errores y dictamen técnico.
5. **Historial Persistente:** Almacenado en `localStorage` del navegador para consultar y restaurar análisis previos en 1 clic.
6. **Comparador 3 Lenguajes:** Vista simultánea para contrastar el comportamiento del mismo código en Python, Java y JavaScript.
