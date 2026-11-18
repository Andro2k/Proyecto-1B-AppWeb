"""Pruebas de la API de puntajes. Ejecutar: python -m unittest discover -s tests"""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import app as servidor  # noqa: E402


class PuntajesApi(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        servidor.ARCHIVO = Path(self.tmp.name) / "puntajes.json"
        self.cliente = servidor.app.test_client()

    def tearDown(self):
        self.tmp.cleanup()

    def enviar(self, **datos):
        return self.cliente.post("/api/puntajes", json=datos)

    def lista(self):
        return self.cliente.get("/api/puntajes").get_json()

    def test_mismo_id_no_se_duplica(self):
        self.assertEqual(self.enviar(id="p1-0", nombre="Ana", puntos=500).status_code, 201)
        r = self.enviar(id="p1-0", nombre="Ana", puntos=500)
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.get_json()["duplicado"])
        self.assertEqual(len(self.lista()), 1)

    def test_ids_distintos_se_guardan(self):
        self.enviar(id="p1-0", nombre="Ana", puntos=500)
        self.enviar(id="p1-1", nombre="Luis", puntos=300)
        self.assertEqual([r["nombre"] for r in self.lista()], ["Ana", "Luis"])

    def test_sin_id_sigue_funcionando(self):
        self.assertEqual(self.enviar(nombre="Ana", puntos=10).status_code, 201)

    def test_id_invalido(self):
        self.assertEqual(self.enviar(id=123, nombre="Ana", puntos=10).status_code, 400)
        self.assertEqual(self.enviar(id="x" * 65, nombre="Ana", puntos=10).status_code, 400)

    def test_validaciones_previas(self):
        self.assertEqual(self.enviar(nombre="", puntos=10).status_code, 400)
        self.assertEqual(self.enviar(nombre="Ana", puntos=-1).status_code, 400)

    def test_la_lista_no_expone_ids(self):
        self.enviar(id="secreto", nombre="Ana", puntos=10)
        self.assertEqual(self.lista(), [{"nombre": "Ana", "puntos": 10}])


if __name__ == "__main__":
    unittest.main()
