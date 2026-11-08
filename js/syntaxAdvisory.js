/**
 * ==============================================================================
 * JC ANALYZER - SYNTAX ADVISORY (DIAGNÓSTICO SINTÁCTICO VS LÉXICO)
 * Autómatas I - Actividad 3
 * ==============================================================================
 * Evalúa las secuencias de tokens reconocidas para advertir sobre problemas
 * estructurales o sintácticos (como '20 + * 5;'), sin clasificarlos
 * erróneamente como errores léxicos.
 */

function evaluarSintaxisVsLexico(tokens, erroresLexicos, lenguaje = "python") {
  const advertenciasSintacticas = [];

  // Si ya hubo errores léxicos, el flujo primario se enfoca en ellos primero
  // pero aún podemos inspeccionar los tokens válidos adyacentes.

  for (let i = 0; i < tokens.length - 1; i++) {
    const actual = tokens[i];
    const siguiente = tokens[i + 1];

    // Caso 3 Requerido: Operadores aritméticos o binarios adyacentes (ej. '20 + * 5;')
    const esOpAritActual = actual.categoria === "Operador aritmético" && ["+", "-", "*", "/", "%"].includes(actual.lexema);
    const esOpAritSig = siguiente.categoria === "Operador aritmético" && ["+", "-", "*", "/", "%"].includes(siguiente.lexema);

    if (esOpAritActual && esOpAritSig) {
      advertenciasSintacticas.push({
        tipo: "Error sintáctico (Gramática)",
        linea: actual.linea,
        columna: actual.columna,
        secuencia: `'${actual.lexema} ${siguiente.lexema}'`,
        titulo: "Operadores binarios adyacentes sin operando intermedio",
        mensajeFormal: `La secuencia de operadores '${actual.lexema} ${siguiente.lexema}' es LÉXICAMENTE VÁLIDA (ambos son lexemas reconocibles), pero viola las reglas gramaticales del Análisis Sintáctico (Parser).`,
        explicacionAcademica: "En la teoría de compiladores, el analizador léxico solo certifica que cada palabra pertenece al vocabulario permitido. Es tarea del analizador sintáctico (Parser) construir el Árbol de Sintaxis Abstracta (AST) y validar que un operador binario tenga operandos a su izquierda y derecha según la regla gramatical: <Expresion> ::= <Expresion> <Operador> <Expresion>."
      });
    }

    // Doble asignación consecutiva (ej. '= =')
    if (actual.lexema === "=" && siguiente.lexema === "=" && actual.categoria === "Operador de asignación" && siguiente.categoria === "Operador de asignación") {
      advertenciasSintacticas.push({
        tipo: "Posible error sintáctico",
        linea: actual.linea,
        columna: actual.columna,
        secuencia: "'= ='",
        titulo: "Operadores de asignación consecutivos",
        mensajeFormal: "Se encontraron dos signos de asignación separados por espacio '= ='. Si la intención era comparación de igualdad, debe escribirse '==' sin espacio.",
        explicacionAcademica: "Léxicamente son dos tokens independientes de asignación. Sintácticamente no es una estructura válida en la mayoría de gramáticas."
      });
    }
  }

  // Verificación de balanceo básico de paréntesis y llaves
  const pilaDelimitadores = [];
  const parejas = { ")": "(", "]": "[", "}": "{" };

  for (const t of tokens) {
    if (t.categoria === "Delimitador") {
      if (["(", "[", "{"].includes(t.lexema)) {
        pilaDelimitadores.push(t);
      } else if ([")", "]", "}"].includes(t.lexema)) {
        if (pilaDelimitadores.length === 0) {
          advertenciasSintacticas.push({
            tipo: "Delimitador huérfano",
            linea: t.linea,
            columna: t.columna,
            secuencia: `'${t.lexema}'`,
            titulo: `Delimitador de cierre '${t.lexema}' sin apertura previa`,
            mensajeFormal: `El delimitador '${t.lexema}' no tiene una apertura correspondiente.`,
            explicacionAcademica: "El balanceo de paréntesis pertenece al Análisis Sintáctico mediante Autómatas de Pila (Gramáticas Libres de Contexto)."
          });
        } else {
          const ultimo = pilaDelimitadores.pop();
          if (ultimo.lexema !== parejas[t.lexema]) {
            advertenciasSintacticas.push({
              tipo: "Delimitadores cruzados",
              linea: t.linea,
              columna: t.columna,
              secuencia: `'${ultimo.lexema}' cerrado con '${t.lexema}'`,
              titulo: "Incompatibilidad de apertura y cierre",
              mensajeFormal: `Se abrió con '${ultimo.lexema}' pero se intentó cerrar con '${t.lexema}'.`,
              explicacionAcademica: "Conflicto sintáctico de anidamiento de estructuras."
            });
          }
        }
      }
    }
  }

  while (pilaDelimitadores.length > 0) {
    const noCerrado = pilaDelimitadores.pop();
    advertenciasSintacticas.push({
      tipo: "Delimitador no cerrado",
      linea: noCerrado.linea,
      columna: noCerrado.columna,
      secuencia: `'${noCerrado.lexema}'`,
      titulo: `Delimitador de apertura '${noCerrado.lexema}' sin cerrar`,
      mensajeFormal: `El delimitador '${noCerrado.lexema}' abierto en Línea ${noCerrado.linea}, Columna ${noCerrado.columna} no fue cerrado en el código.`,
      explicacionAcademica: "Léxicamente el token es válido, pero el árbol de derivación sintáctica queda incompleto."
    });
  }

  return {
    tieneAdvertencias: advertenciasSintacticas.length > 0,
    advertencias: advertenciasSintacticas
  };
}

window.evaluarSintaxisVsLexico = evaluarSintaxisVsLexico;
