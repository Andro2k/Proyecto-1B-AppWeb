"""Servidor Flask: entrega el juego (carpeta src/) y una API de puntajes."""
import json
from pathlib import Path

from flask import Flask, jsonify, request

BASE = Path(__file__).parent
ARCHIVO = BASE / "puntajes.json"
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
    registros = leer_puntajes()
    registros.append({"nombre": nombre.strip(), "puntos": puntos})
    ARCHIVO.write_text(json.dumps(registros[-200:], ensure_ascii=False), encoding="utf-8")
    return jsonify(ok=True), 201


if __name__ == "__main__":
    app.run(debug=True)
