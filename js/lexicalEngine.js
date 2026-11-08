/**
 * ==============================================================================
 * JC ANALYZER - LEXICAL ENGINE (MOTOR DE ANÁLISIS LÉXICO MULTILENGUAJE)
 * Autómatas I - Actividad 3
 * ==============================================================================
 * Implementación formal de un analizador léxico de primera fase para:
 * - Python
 * - Java
 * - JavaScript
 *
 * Cada lenguaje cuenta con sus propias reglas léxicas, palabras reservadas,
 * operadores, delimitadores, comentarios y patrones de cadenas y números.
 */

// Palabras reservadas por lenguaje
const PALABRAS_RESERVADAS = {
  python: new Set([
    "False", "None", "True", "and", "as", "assert", "async", "await",
    "break", "class", "continue", "def", "del", "elif", "else", "except",
    "finally", "for", "from", "global", "if", "import", "in", "is",
    "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
    "while", "with", "yield"
  ]),
  java: new Set([
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
    "class", "const", "continue", "default", "do", "double", "else", "enum",
    "extends", "final", "finally", "float", "for", "goto", "if", "implements",
    "import", "instanceof", "int", "interface", "long", "native", "new",
    "package", "private", "protected", "public", "return", "short", "static",
    "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
    "transient", "try", "void", "volatile", "while", "true", "false", "null"
  ]),
  javascript: new Set([
    "break", "case", "catch", "class", "const", "continue", "debugger",
    "default", "delete", "do", "else", "export", "extends", "finally",
    "for", "function", "if", "import", "in", "instanceof", "new", "return",
    "super", "switch", "this", "throw", "try", "typeof", "var", "void",
    "while", "with", "yield", "let", "static", "enum", "await", "async",
    "true", "false", "null", "undefined", "NaN"
  ])
};

// Configuraciones léxicas especializadas
const CONFIG_LENGUAJES = {
  python: {
    nombre: "Python",
    extension: "py",
    identificadorRegex: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    caracteresIdentificadorValidos: /[a-zA-Z0-9_]/,
    comentarioLineaRegex: /^#[^\r\n]*/,
    comentarioBloqueRegex: null, // Python usa triple comillas para docstrings
    soportaTemplateLiterals: false,
    caracteresNoPermitidos: new Set(["@", "$", "~", "?", "\\", "¡", "¿", "§"]),
    explicacionErrorChar: (char) => {
      if (char === "@") return "El símbolo '@' no es un operador válido en expresiones aritméticas/lógicas en Python (reservado únicamente para decoradores de funciones/clases).";
      if (char === "$") return "El carácter '$' no es válido en Python para identificadores ni operadores (a diferencia de lenguajes como PHP o JavaScript).";
      return `El carácter '${char}' no pertenece al alfabeto de operadores, identificadores o delimitadores válidos de Python.`;
    }
  },
  java: {
    nombre: "Java",
    extension: "java",
    identificadorRegex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
    caracteresIdentificadorValidos: /[a-zA-Z0-9_$]/,
    comentarioLineaRegex: /^\/\/[^\r\n]*/,
    comentarioBloqueRegex: /^\/\*[\s\S]*?\*\//,
    soportaTemplateLiterals: false,
    caracteresNoPermitidos: new Set(["#", "@", "~", "\\", "¡", "¿", "§"]),
    explicacionErrorChar: (char) => {
      if (char === "#") return "El símbolo '#' no es un operador ni carácter de comentario válido en Java (Java utiliza '//' o '/* */').";
      if (char === "@") return "El símbolo '@' en Java está reservado exclusivamente para anotaciones (@Override, @Entity) y no es válido dentro de expresiones.";
      return `El carácter '${char}' no pertenece al juego de caracteres léxicos reconocidos por la especificación de Java.`;
    }
  },
  javascript: {
    nombre: "JavaScript",
    extension: "js",
    identificadorRegex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
    caracteresIdentificadorValidos: /[a-zA-Z0-9_$]/,
    comentarioLineaRegex: /^\/\/[^\r\n]*/,
    comentarioBloqueRegex: /^\/\*[\s\S]*?\*\//,
    soportaTemplateLiterals: true,
    caracteresNoPermitidos: new Set(["#", "@", "~", "\\", "¡", "¿", "§"]),
    explicacionErrorChar: (char) => {
      if (char === "@") return "El símbolo '@' no es un operador en JavaScript estándar (reservado únicamente para propuestas de decoradores).";
      if (char === "#") return "El símbolo '#' en JavaScript solo es válido como prefijo de propiedades privadas dentro de clases (#miPropiedad).";
      return `El carácter '${char}' no está permitido en expresiones de JavaScript según el estándar ECMAScript.`;
    }
  }
};

/**
 * Función principal del Analizador Léxico (Scanner)
 * Recorre el código fuente carácter por carácter de izquierda a derecha.
 *
 * @param {string} codigo - Código fuente a analizar
 * @param {string} lenguaje - 'python' | 'java' | 'javascript'
 * @returns {Object} Resultado con tokens, errores, métricas y detalles
 */
function analizarLexico(codigo, lenguaje = "python") {
  const tiempoInicio = performance.now();
  const config = CONFIG_LENGUAJES[lenguaje] || CONFIG_LENGUAJES.python;
  const palabrasClave = PALABRAS_RESERVADAS[lenguaje] || PALABRAS_RESERVADAS.python;

  const tokens = [];
  const errores = [];

  let pos = 0;
  let linea = 1;
  let columna = 1;
  let tokenNum = 1;
  let errorNum = 1;
  const longitud = codigo.length;

  while (pos < longitud) {
    const restante = codigo.slice(pos);

    // 1. GESTIÓN DE SALTOS DE LÍNEA
    if (restante.startsWith("\r\n")) {
      pos += 2;
      linea += 1;
      columna = 1;
      continue;
    }
    if (restante[0] === "\n" || restante[0] === "\r") {
      pos += 1;
      linea += 1;
      columna = 1;
      continue;
    }

    // 2. ESPACIOS Y TABULACIONES (Ignorar manteniendo columnas)
    const matchEspacios = restante.match(/^[ \t]+/);
    if (matchEspacios) {
      const len = matchEspacios[0].length;
      pos += len;
      columna += len;
      continue;
    }

    // 3. COMENTARIOS DE BLOQUE (Java y JavaScript: /* ... */)
    if (config.comentarioBloqueRegex) {
      const matchBloque = restante.match(config.comentarioBloqueRegex);
      if (matchBloque) {
        const lex = matchBloque[0];
        tokens.push({
          numero: tokenNum++,
          lexema: lex,
          categoria: "Comentario",
          linea: linea,
          columna: columna,
          estado: "Válido"
        });
        // Actualizar líneas y columnas dentro del comentario
        const saltos = (lex.match(/\n/g) || []).length;
        if (saltos > 0) {
          linea += saltos;
          const ultSalto = lex.lastIndexOf("\n");
          columna = lex.length - ultSalto;
        } else {
          columna += lex.length;
        }
        pos += lex.length;
        continue;
      }
    }

    // 4. COMENTARIOS DE LÍNEA (# en Python, // en Java/JS)
    if (config.comentarioLineaRegex) {
      const matchLinea = restante.match(config.comentarioLineaRegex);
      if (matchLinea) {
        const lex = matchLinea[0];
        tokens.push({
          numero: tokenNum++,
          lexema: lex,
          categoria: "Comentario",
          linea: linea,
          columna: columna,
          estado: "Válido"
        });
        pos += lex.length;
        columna += lex.length;
        continue;
      }
    }

    // 5. ERRORES PREVENTIVOS ESPECÍFICOS:
    // 5A. Números decimales mal formados con múltiples puntos (ej. 15.50.25)
    const matchMultiPuntos = restante.match(/^\d+\.\d+(?:\.\d+)+/);
    if (matchMultiPuntos) {
      const lex = matchMultiPuntos[0];
      errores.push({
        numero: errorNum++,
        tipo: "Número decimal mal formado",
        lexema: lex,
        linea: linea,
        columna: columna,
        descripcion: `Número con múltiples puntos decimales no válidos ('${lex}')`,
        explicacion: "En autómatas finitos y compiladores, un número real (flotante) solo puede contener un único punto decimal delimitando la parte entera de la parte fraccionaria."
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 5B. Identificador inválido que inicia con dígito (ej. 10codigo, 23edad)
    const matchIdentConDigito = restante.match(/^\d+[a-zA-Z_]+/);
    if (matchIdentConDigito) {
      const lex = matchIdentConDigito[0];
      errores.push({
        numero: errorNum++,
        tipo: "Identificador inválido",
        lexema: lex,
        linea: linea,
        columna: columna,
        descripcion: `Identificador no puede comenzar con dígitos ('${lex}')`,
        explicacion: "La gramática léxica de identificadores define que deben comenzar estrictamente con una letra o guion bajo ('[a-zA-Z_]'), nunca con dígitos."
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 6. CADENAS DE TEXTO (Entre comillas dobles, simples o template literals en JS)
    // Cadenas completas cerradas:
    let regexCadenaCompleta = /^("(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*')/;
    if (lenguaje === "javascript") {
      // Soportar también template literals multilínea `...`
      regexCadenaCompleta = /^("(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|`(?:\\[\s\S]|[^`\\])*`)/;
    }

    const matchCadena = restante.match(regexCadenaCompleta);
    if (matchCadena) {
      const lex = matchCadena[0];
      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: "Cadena de texto",
        linea: linea,
        columna: columna,
        estado: "Válido"
      });

      const saltos = (lex.match(/\n/g) || []).length;
      if (saltos > 0) {
        linea += saltos;
        const ultSalto = lex.lastIndexOf("\n");
        columna = lex.length - ultSalto;
      } else {
        columna += lex.length;
      }
      pos += lex.length;
      continue;
    }

    // Cadenas abiertas sin cerrar (alcanzan salto de línea o fin de archivo)
    if (restante.startsWith('"') || restante.startsWith("'") || (lenguaje === "javascript" && restante.startsWith("`"))) {
      const delimitador = restante[0];
      // Tomar hasta fin de línea o fin de texto
      const finLineaIdx = restante.search(/[\r\n]/);
      const lexSinCerrar = finLineaIdx === -1 ? restante : restante.slice(0, finLineaIdx);

      errores.push({
        numero: errorNum++,
        tipo: "Cadena de texto sin cerrar",
        lexema: lexSinCerrar,
        linea: linea,
        columna: columna,
        descripcion: `Literal de cadena no cerrada con comilla ${delimitador}`,
        explicacion: `Las cadenas deben cerrarse en la misma línea con la comilla delimitadora correspondiente (${delimitador}). No se encontró la comilla de cierre antes del salto de línea.`
      });

      pos += lexSinCerrar.length;
      columna += lexSinCerrar.length;
      continue;
    }

    // 7. NÚMEROS DECIMALES (Debe ir antes que enteros y que el delimitador '.')
    let matchDecimal = null;
    if (lenguaje === "java") {
      matchDecimal = restante.match(/^\d+\.\d+[fFdD]?/);
    } else {
      matchDecimal = restante.match(/^\d+\.\d+/);
    }

    if (matchDecimal) {
      const lex = matchDecimal[0];
      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: "Número decimal",
        linea: linea,
        columna: columna,
        estado: "Válido"
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 8. NÚMEROS ENTEROS
    let matchEntero = null;
    if (lenguaje === "java") {
      matchEntero = restante.match(/^\d+[lL]?/);
    } else if (lenguaje === "javascript" || lenguaje === "python") {
      // Soportar también prefijos hexadecimales 0x... y binarios 0b...
      matchEntero = restante.match(/^(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+)/);
    } else {
      matchEntero = restante.match(/^\d+/);
    }

    if (matchEntero) {
      const lex = matchEntero[0];
      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: "Número entero",
        linea: linea,
        columna: columna,
        estado: "Válido"
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 9. OPERADORES (PRIORIDAD: Multicarácter de 3 caracteres, luego 2, luego 1)

    // 9A. Operadores de 3 caracteres (ej. ===, !==, >>>, <<=, >>=, **=)
    let matchOp3 = null;
    if (lenguaje === "javascript") {
      matchOp3 = restante.match(/^(===|!==|\*\*=|&&=|\|\|=|\?\?=|>>>)/);
    } else if (lenguaje === "java") {
      matchOp3 = restante.match(/^(>>>=|<<=|>>=)/);
    } else if (lenguaje === "python") {
      matchOp3 = restante.match(/^(\*\*=|\/\/=)/);
    }

    if (matchOp3) {
      const lex = matchOp3[0];
      let cat = "Operador de asignación";
      if (lex === "===" || lex === "!==") cat = "Operador de comparación";
      if (lex === ">>>") cat = "Operador aritmético";

      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: cat,
        linea: linea,
        columna: columna,
        estado: "Válido"
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 9B. Operadores de 2 caracteres (==, !=, <=, >=, +=, -=, *=, /=, %=, **, //, &&, ||, ++, --, =>)
    let regexOp2 = /^(==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\*\*|\/\/)/;
    if (lenguaje === "javascript") {
      regexOp2 = /^(==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\*\*|\+\+|--|&&|\|\||\?\?|=>)/;
    } else if (lenguaje === "java") {
      regexOp2 = /^(==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\+\+|--|&&|\|\||<<|>>|&=|\|=|\^=)/;
    }

    const matchOp2 = restante.match(regexOp2);
    if (matchOp2) {
      const lex = matchOp2[0];
      let cat = "Operador de comparación";
      if (["==", "!=", "<=", ">="].includes(lex)) {
        cat = "Operador de comparación";
      } else if (["+=", "-=", "*=", "/=", "%=", "**=", "&=", "|=", "^="].includes(lex)) {
        cat = "Operador de asignación";
      } else if (["**", "//", "++", "--", "<<", ">>"].includes(lex)) {
        cat = "Operador aritmético";
      } else if (["&&", "||", "??"].includes(lex)) {
        cat = "Operador lógico";
      } else if (lex === "=>") {
        cat = "Operador flecha";
      }

      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: cat,
        linea: linea,
        columna: columna,
        estado: "Válido"
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 9C. Operadores de 1 carácter (=, <, >, +, -, *, /, %, !)
    const matchOp1 = restante.match(/^(=|<|>|\+|-|\*|\/|%|!|&|\||\^)/);
    if (matchOp1) {
      const lex = matchOp1[0];
      let cat = "Operador aritmético";
      if (lex === "=") {
        cat = "Operador de asignación";
      } else if (lex === "<" || lex === ">") {
        cat = "Operador de comparación";
      } else if (lex === "!") {
        cat = "Operador lógico";
      } else if (["+", "-", "*", "/", "%"].includes(lex)) {
        cat = "Operador aritmético";
      } else {
        cat = "Operador bitwise";
      }

      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: cat,
        linea: linea,
        columna: columna,
        estado: "Válido"
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 10. DELIMITADORES: (, ), {, }, [, ], ,, :, ;, .
    const matchDelim = restante.match(/^[\(\)\{\}\[\]\,\:\;\.]/);
    if (matchDelim) {
      const lex = matchDelim[0];
      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: "Delimitador",
        linea: linea,
        columna: columna,
        estado: "Válido"
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 11. IDENTIFICADORES Y PALABRAS RESERVADAS
    const matchIdent = restante.match(config.identificadorRegex);
    if (matchIdent) {
      const lex = matchIdent[0];
      const esPalabraReservada = palabrasClave.has(lex);
      const cat = esPalabraReservada ? "Palabra reservada" : "Identificador";

      tokens.push({
        numero: tokenNum++,
        lexema: lex,
        categoria: cat,
        linea: linea,
        columna: columna,
        estado: "Válido"
      });
      pos += lex.length;
      columna += lex.length;
      continue;
    }

    // 12. ERROR LÉXICO: Carácter no reconocido o no permitido
    const charInvalido = restante[0];
    const explicacion = config.explicacionErrorChar(charInvalido);

    errores.push({
      numero: errorNum++,
      tipo: "Carácter no permitido",
      lexema: charInvalido,
      linea: linea,
      columna: columna,
      descripcion: `Símbolo no reconocido '${charInvalido}' en la gramática de ${config.nombre}`,
      explicacion: explicacion
    });

    pos += 1;
    columna += 1;
  }

  const tiempoFin = performance.now();
  const duracionMs = parseFloat((tiempoFin - tiempoInicio).toFixed(2));

  // Generar resumen y estadísticas
  const conteoCategorias = {};
  tokens.forEach(t => {
    conteoCategorias[t.categoria] = (conteoCategorias[t.categoria] || 0) + 1;
  });

  return {
    lenguaje: config.nombre,
    codigoOriginal: codigo,
    tokens: tokens,
    errores: errores,
    totalTokens: tokens.length,
    tokensValidos: tokens.filter(t => t.estado === "Válido").length,
    totalErrores: errores.length,
    conteoCategorias: conteoCategorias,
    duracionMs: duracionMs,
    estadoGeneral: errores.length === 0 ? "Exitoso" : "Errores detectados",
    reglasAplicadas: 12
  };
}

// Exportar globalmente para navegador
window.analizarLexico = analizarLexico;
window.PALABRAS_RESERVADAS = PALABRAS_RESERVADAS;
window.CONFIG_LENGUAJES = CONFIG_LENGUAJES;
