#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
JC ANALYZER - SERVIDOR WEB LOCAL Y LANZADOR AUTOMÁTICO
Autómatas I - Actividad 3
================================================================================
Inicia un servidor HTTP local de alta velocidad y abre automáticamente
el navegador web predeterminado en la aplicación JC ANALYZER.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PUERTO = 8000
DIRECTORIO = os.path.dirname(os.path.abspath(__file__))

class HandlerPersonalizado(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORIO, **kwargs)

    def end_headers(self):
        # Deshabilitar cache para desarrollo en caliente
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        # Log simplificado y limpio
        pass

def iniciar_servidor():
    os.chdir(DIRECTORIO)
    puerto_actual = PUERTO

    # Intentar vincular puerto o buscar siguiente disponible
    servidor = None
    while puerto_actual < 8050:
        try:
            socketserver.TCPServer.allow_reuse_address = True
            servidor = socketserver.TCPServer(("", puerto_actual), HandlerPersonalizado)
            break
        except OSError:
            puerto_actual += 1

    if not servidor:
        print("[ERROR] No se pudo encontrar un puerto disponible entre 8000 y 8050.")
        sys.exit(1)

    url = f"http://localhost:{puerto_actual}/index.html"
    print("=" * 75)
    print("   JC ANALYZER – LEXICAL ERROR DETECTOR | AUTÓMATAS I")
    print("=" * 75)
    print(f" Servidor iniciado correctamente.")
    print(f" URL de la aplicación: {url}")
    print(" Abriendo en tu navegador predeterminado...")
    print(" Para detener el servidor presiona: [Ctrl + C]")
    print("=" * 75)

    # Abrir navegador
    webbrowser.open(url)

    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido por el usuario.")
        servidor.server_close()

if __name__ == "__main__":
    iniciar_servidor()
