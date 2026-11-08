/**
 * ==============================================================================
 * JC ANALYZER - PRESETS Y CASOS DE PRUEBA
 * Autómatas I - Actividad 3
 * ==============================================================================
 * Contiene los casos de prueba obligatorios de la rúbrica y casos equivalentes
 * para los tres lenguajes soportados (Python, Java, JavaScript).
 */

const PRESETS = [
  {
    id: "caso-1-correcto",
    titulo: "Caso 1: Código correcto (Sin errores)",
    lenguaje: "python",
    badge: "Válido 100%",
    descripcion: "Prueba oficial: asignaciones, números enteros, cadenas y suma aritmética.",
    codigo: `edad = 23
nombre = "Juan"
resultado = edad + 5`
  },
  {
    id: "caso-2-error-lexico",
    titulo: "Caso 2: Error léxico con símbolo '@'",
    lenguaje: "python",
    badge: "Error Léxico",
    descripcion: "Identifica el símbolo '@' como error léxico al no pertenecer al alfabeto de operadores.",
    codigo: `numero = 10 @ 5`
  },
  {
    id: "caso-3-sintactico",
    titulo: "Caso 3: Error sintáctico, NO léxico ('20 + * 5;')",
    lenguaje: "python",
    badge: "Aviso Sintáctico",
    descripcion: "Tokens léxicamente válidos, pero con problema estructural de operadores adyacentes '+ *'.",
    codigo: `20 + * 5;`
  },
  {
    id: "caso-4-cadena-abierta",
    titulo: "Caso 4: Cadena sin cerrar",
    lenguaje: "python",
    badge: "Cadena Incompleta",
    descripcion: "Detecta una cadena que no fue cerrada antes del salto de línea o final de archivo.",
    codigo: `nombre = "Juan`
  },
  {
    id: "caso-5-multiples-errores",
    titulo: "Caso 5: Batería completa de errores léxicos",
    lenguaje: "python",
    badge: "Múltiples Errores",
    descripcion: "Detecta $, @, decimales con múltiples puntos, identificadores con dígitos y cadenas abiertas.",
    codigo: `# Prueba exhaustiva de robustez del escaner
x = 10
$saldo = 1500.50
precio = 15.50.25
@usuario = "Carlos"
23variable_erronea = 99
mensaje = "Cadena sin comilla final
resultado = x + 10`
  },
  {
    id: "caso-6-java-correcto",
    titulo: "Java: Clase y cálculo de nómina",
    lenguaje: "java",
    badge: "Java Válido",
    descripcion: "Clase Java con tipos primitivos, palabras reservadas (public, class, int, double) y métodos.",
    codigo: `public class Nomina {
    public static void main(String[] args) {
        int dias = 30;
        double salarioDiario = 150.75;
        double total = dias * salarioDiario;
        if (total >= 4000.0) {
            System.out.println("Salario validado");
        }
    }
}`
  },
  {
    id: "caso-7-java-error-lexico",
    titulo: "Java: Error léxico con símbolo '#' no permitido",
    lenguaje: "java",
    badge: "Java Error",
    descripcion: "El símbolo '#' no existe en el alfabeto de Java (los comentarios usan '//').",
    codigo: `public class Test {
    int valor = 10 # 5; // Error lexico con #
}`
  },
  {
    id: "caso-8-java-sintactico",
    titulo: "Java: Error sintáctico ('20 + * 5;')",
    lenguaje: "java",
    badge: "Java Sintaxis",
    descripcion: "Secuencia '+ *' en Java: tokens válidos individualmente, pero error gramatical.",
    codigo: `int resultado = 20 + * 5;`
  },
  {
    id: "caso-9-js-correcto",
    titulo: "JavaScript: Funciones flecha y desestructuración",
    lenguaje: "javascript",
    badge: "JS Válido",
    descripcion: "Uso de const, let, template strings, operadores flecha (=>) y comparación estricta (===).",
    codigo: `const calcularTotal = (precio, cantidad) => {
    let subtotal = precio * cantidad;
    if (subtotal >= 100.0) {
        return subtotal * 0.90;
    }
    return subtotal;
};`
  },
  {
    id: "caso-10-js-error-lexico",
    titulo: "JavaScript: Error léxico con '@'",
    lenguaje: "javascript",
    badge: "JS Error",
    descripcion: "El símbolo '@' en una expresión JavaScript estándar es un carácter no permitido.",
    codigo: `let numero = 10 @ 5;`
  },
  {
    id: "caso-11-js-sintactico",
    titulo: "JavaScript: Error sintáctico ('20 + * 5;')",
    lenguaje: "javascript",
    badge: "JS Sintaxis",
    descripcion: "Operadores adyacentes '+ *' válidos como tokens, inválidos en el árbol sintáctico.",
    codigo: `let resultado = 20 + * 5;`
  }
];

window.PRESETS = PRESETS;
