"""Servidor Flask: entrega el juego (carpeta src/) y una API de puntajes."""
import json
import os
import threading
from pathlib import Path

from flask import Flask, jsonify, request

BASE = Path(__file__).parent
ARCHIVO = Path(os.environ.get("DATA_DIR", BASE)) / "puntajes.json"
CANDADO = threading.Lock()
app = Flask(__name__, static_folder=str(BASE / "src"), static_url_path="")


def leer_puntajes():
    try:
        return json.loads(ARCHIVO.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []


@app.get("/")
def inicio():
    return app.send_static_file("index.html")


@app.get("/api/puntajes")
def obtener_puntajes():
    return jsonify(sorted(leer_puntajes(), key=lambda r: r["puntos"], reverse=True)[:10])


@app.post("/api/puntajes")
def guardar_puntaje():
    datos = request.get_json(silent=True) or {}
    nombre, puntos = datos.get("nombre"), datos.get("puntos")
    if not isinstance(nombre, str) or not 1 <= len(nombre.strip()) <= 20:
        return jsonify(error="Nombre inválido (1 a 20 caracteres)"), 400
    if not isinstance(puntos, int) or isinstance(puntos, bool) or not 0 <= puntos <= 1_000_000:
        return jsonify(error="Puntos inválidos"), 400
    with CANDADO:
        registros = leer_puntajes()
        registros.append({"nombre": nombre.strip(), "puntos": puntos})
        temporal = ARCHIVO.with_suffix(".tmp")
        temporal.write_text(json.dumps(registros[-200:], ensure_ascii=False), encoding="utf-8")
        temporal.replace(ARCHIVO)
    return jsonify(ok=True), 201


if __name__ == "__main__":
    # Por defecto escucha en todas las interfaces (accesible desde otros equipos).
    # FLASK_DEBUG=1 solo para desarrollo: activa el depurador, así que se limita a localhost.
    depurar = os.environ.get("FLASK_DEBUG") == "1"
    app.run(host="127.0.0.1" if depurar else os.environ.get("HOST", "0.0.0.0"),
            port=int(os.environ.get("PORT", 5000)), debug=depurar)
