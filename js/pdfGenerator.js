/**
 * ==============================================================================
 * JC ANALYZER - GENERADOR DE REPORTES PDF PROFESIONALES
 * Autómatas I - Actividad 3
 * ==============================================================================
 * Genera reportes académicos y técnicos en formato PDF con jsPDF y jsPDF-AutoTable.
 * Incluye metadatos, código fuente, resumen estadístico, tabla de tokens,
 * diagnóstico de errores léxicos y fundamentación teórica de compiladores.
 */

function generarReportePDF(resultadoAnalisis, advertenciasSintacticas = []) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("La biblioteca jsPDF no está disponible en este momento.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 15;
  const marginRight = 15;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = 15;

  // Helper para verificar salto de página
  const revisarSaltoPagina = (espacioRequerido) => {
    if (y + espacioRequerido > pageHeight - 20) {
      doc.addPage();
      y = 15;
      dibujarEncabezadoPagina();
    }
  };

  const dibujarEncabezadoPagina = () => {
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, pageWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("JC ANALYZER  |  REPORTE OFICIAL DE ANÁLISIS LÉXICO  |  AUTÓMATAS I", marginLeft, 5.5);
    doc.text(new Date().toLocaleDateString("es-MX"), pageWidth - marginRight, 5.5, { align: "right" });
  };

  // ----------------------------------------------------------------------------
  // 1. PORTADA Y ENCABEZADO INSTITUCIONAL
  // ----------------------------------------------------------------------------
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(marginLeft, y, contentWidth, 34, "F");

  // Barra de acento izquierda
  doc.setFillColor(99, 102, 241); // Indigo #6366f1
  doc.rect(marginLeft, y, 4, 34, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(248, 250, 252);
  doc.text("JC ANALYZER – LEXICAL ERROR DETECTOR", marginLeft + 8, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Analizador de errores léxicos | Autómatas I (Fase 1: Escáner de Compiladores)", marginLeft + 8, y + 17);

  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const fechaStr = new Date().toLocaleString("es-MX", { dateStyle: "long", timeStyle: "medium" });
  doc.text(`Fecha de emisión: ${fechaStr}  |  Lenguaje: ${resultadoAnalisis.lenguaje.toUpperCase()}  |  Tiempo: ${resultadoAnalisis.duracionMs} ms`, marginLeft + 8, y + 26);

  y += 40;

  // ----------------------------------------------------------------------------
  // 2. RESUMEN ESTADÍSTICO (TARJETAS KPI)
  // ----------------------------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Resumen Estadístico del Análisis", marginLeft, y);
  y += 5;

  const cardWidth = (contentWidth - 9) / 4;
  const cards = [
    { label: "Total Tokens", val: resultadoAnalisis.totalTokens.toString(), color: [37, 99, 235] },
    { label: "Tokens Válidos", val: resultadoAnalisis.tokensValidos.toString(), color: [16, 185, 129] },
    { label: "Errores Léxicos", val: resultadoAnalisis.totalErrores.toString(), color: resultadoAnalisis.totalErrores > 0 ? [239, 68, 68] : [16, 185, 129] },
    { label: "Tiempo Ejecución", val: `${resultadoAnalisis.duracionMs} ms`, color: [139, 92, 246] }
  ];

  cards.forEach((c, idx) => {
    const cx = marginLeft + idx * (cardWidth + 3);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(cx, y, cardWidth, 16, 2, 2, "F");

    doc.setFillColor(...c.color);
    doc.rect(cx, y, 2.5, 16, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...c.color);
    doc.text(c.val, cx + 5, y + 7.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.label, cx + 5, y + 13);
  });

  y += 22;

  // ----------------------------------------------------------------------------
  // 3. CÓDIGO FUENTE ANALIZADO
  // ----------------------------------------------------------------------------
  revisarSaltoPagina(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Código Fuente Analizado", marginLeft, y);
  y += 4;

  const lineasCodigo = resultadoAnalisis.codigoOriginal.split("\n");
  const codigoConNumeros = lineasCodigo.map((l, i) => `${(i + 1).toString().padStart(3, " ")} |  ${l}`).join("\n");

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  const alturaBloqueCodigo = Math.min(Math.max(lineasCodigo.length * 4.2 + 8, 20), 75);

  doc.rect(marginLeft, y, contentWidth, alturaBloqueCodigo, "FD");

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  // Imprimir código recortado si es muy extenso en la caja
  const lineasVisibles = lineasCodigo.slice(0, 15).map((l, i) => `${(i + 1).toString().padStart(3, " ")} |  ${l}`);
  if (lineasCodigo.length > 15) {
    lineasVisibles.push(`... [${lineasCodigo.length - 15} líneas adicionales ocultas en la vista previa]`);
  }
  doc.text(lineasVisibles, marginLeft + 4, y + 5);

  y += alturaBloqueCodigo + 8;

  // ----------------------------------------------------------------------------
  // 4. SECCIÓN DE ERRORES LÉXICOS DETECTADOS
  // ----------------------------------------------------------------------------
  revisarSaltoPagina(35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("3. Diagnóstico de Errores Léxicos", marginLeft, y);
  y += 4;

  if (resultadoAnalisis.totalErrores === 0) {
    doc.setFillColor(236, 253, 245); // Verde suave
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(marginLeft, y, contentWidth, 14, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text("✓ CERO ERRORES LÉXICOS DETECTADOS", marginLeft + 5, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(4, 120, 87);
    doc.text("Todos los caracteres, operadores, números y cadenas pertenecen al alfabeto válido de la gramática.", marginLeft + 5, y + 10.5);
    y += 20;
  } else {
    const filasErrores = resultadoAnalisis.errores.map(e => [
      e.numero.toString(),
      e.lexema,
      `Línea ${e.linea}, Col ${e.columna}`,
      e.tipo,
      e.descripcion
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: marginLeft, right: marginRight },
      head: [["#", "Lexema Inválido", "Ubicación", "Tipo de Error", "Explicación"]],
      body: filasErrores,
      theme: "grid",
      headStyles: {
        fillColor: [225, 29, 72], // Rose 600
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        textColor: [15, 23, 42],
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 28, font: "courier", fontStyle: "bold" },
        2: { cellWidth: 32 },
        3: { cellWidth: 35, fontStyle: "bold" },
        4: { cellWidth: "auto" }
      }
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // ----------------------------------------------------------------------------
  // 5. DIAGNÓSTICO SINTÁCTICO VS LÉXICO (CASO 3 RÚBRICA)
  // ----------------------------------------------------------------------------
  if (advertenciasSintacticas && advertenciasSintacticas.length > 0) {
    revisarSaltoPagina(35);
    doc.setFillColor(254, 242, 242); // Red/Amber tint
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(marginLeft, y, contentWidth, 24, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9);
    doc.text("⚠ DISTINCIÓN CRÍTICA: ERROR SINTÁCTICO (NO LÉXICO) DETECTADO", marginLeft + 5, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    const adv = advertenciasSintacticas[0];
    doc.text(`Secuencia observada: ${adv.secuencia} en Línea ${adv.linea}.`, marginLeft + 5, y + 11);
    doc.text(doc.splitTextToSize(adv.mensajeFormal, contentWidth - 10), marginLeft + 5, y + 15.5);

    y += 28;
  }

  // ----------------------------------------------------------------------------
  // 6. TABLA DETALLADA DE TOKENS RECONOCIDOS
  // ----------------------------------------------------------------------------
  revisarSaltoPagina(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("4. Tabla Detallada de Componentes Léxicos (Tokens)", marginLeft, y);
  y += 4;

  const filasTokens = resultadoAnalisis.tokens.map(t => [
    t.numero.toString(),
    t.lexema,
    t.categoria,
    t.linea.toString(),
    t.columna.toString(),
    t.estado
  ]);

  doc.autoTable({
    startY: y,
    margin: { left: marginLeft, right: marginRight },
    head: [["No.", "Lexema", "Categoría", "Línea", "Columna", "Estado"]],
    body: filasTokens,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [56, 189, 248], // Sky 400
      fontStyle: "bold",
      fontSize: 8.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    styles: {
      fontSize: 7.8,
      cellPadding: 2,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 42, font: "courier", fontStyle: "bold" },
      2: { cellWidth: 48 },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 22, halign: "center" }
    }
  });

  y = doc.lastAutoTable.finalY + 10;

  // ----------------------------------------------------------------------------
  // 7. CONCLUSIÓN Y DICTAMEN DE AUTÓMATAS I
  // ----------------------------------------------------------------------------
  revisarSaltoPagina(30);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(marginLeft, y, contentWidth, 24, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Conclusión y Dictamen Técnico", marginLeft + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  const conclusion = resultadoAnalisis.totalErrores === 0
    ? `El código analizado superó satisfactoriamente la Fase de Análisis Léxico para el lenguaje ${resultadoAnalisis.lenguaje}. Se generaron ${resultadoAnalisis.totalTokens} tokens estructurados y clasificados conforme a las reglas de autómatas finitos deterministas (AFD).`
    : `Se identificaron ${resultadoAnalisis.totalErrores} error(es) léxico(s) que violan las expresiones regulares del lenguaje ${resultadoAnalisis.lenguaje}. El analizador aplicó recuperación ante errores completando el reconocimiento de los ${resultadoAnalisis.totalTokens} tokens restantes.`;

  doc.text(doc.splitTextToSize(conclusion, contentWidth - 10), marginLeft + 5, y + 11.5);
  doc.text("Validado por el motor de análisis léxico JC Analyzer v2.0 PRO | Autómatas I", marginLeft + 5, y + 19.5);

  // ----------------------------------------------------------------------------
  // 8. NUMERACIÓN DE PÁGINAS Y PIE DE PÁGINA
  // ----------------------------------------------------------------------------
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`JC Analyzer - Autómatas I  |  Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 6, { align: "center" });
  }

  // Descargar archivo PDF
  const nombreArchivo = `Reporte_Lexico_JCAnalyzer_${resultadoAnalisis.lenguaje}_${Date.now()}.pdf`;
  doc.save(nombreArchivo);
}

window.generarReportePDF = generarReportePDF;
