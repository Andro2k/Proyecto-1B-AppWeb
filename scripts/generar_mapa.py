import json, math, sys
# Uso: python scripts/generar_mapa.py ne_50m_admin_0_countries.geojson (Natural Earth, GeoJSON)
d = json.load(open(sys.argv[1]))
def geom(a3):
    for f in d['features']:
        if f['properties'].get('ADM0_A3') == a3: return f['geometry']
def polys(g): return [r[0] for r in (g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']])]
def dp(pts, eps):
    if len(pts) < 3: return pts
    (x1,y1),(x2,y2) = pts[0], pts[-1]; dx,dy = x2-x1,y2-y1; n = math.hypot(dx,dy) or 1e-9
    idx, dm = 0, 0
    for i in range(1,len(pts)-1):
        dist = abs(dy*pts[i][0]-dx*pts[i][1]+x2*y1-y2*x1)/n
        if dist > dm: idx, dm = i, dist
    if dm > eps: return dp(pts[:idx+1],eps)[:-1] + dp(pts[idx:],eps)
    return [pts[0], pts[-1]]
def clip(poly, box):
    x0,y0,x1,y1 = box
    def pas(pts, inside, inter):
        out=[]
        for i,p in enumerate(pts):
            q = pts[i-1]
            if inside(p):
                if not inside(q): out.append(inter(q,p))
                out.append(p)
            elif inside(q): out.append(inter(q,p))
        return out
    def ix(xc):  return lambda a,b: [xc, a[1]+(b[1]-a[1])*(xc-a[0])/(b[0]-a[0])]
    def iy(yc):  return lambda a,b: [a[0]+(b[0]-a[0])*(yc-a[1])/(b[1]-a[1]), yc]
    p = poly
    for ins,it in [(lambda v:v[0]>=x0,ix(x0)),(lambda v:v[0]<=x1,ix(x1)),(lambda v:v[1]>=y0,iy(y0)),(lambda v:v[1]<=y1,iy(y1))]:
        if not p: break
        p = pas(p, ins, it)
    return p
r = lambda pts: [[round(x,2),round(y,2)] for x,y in pts]
ecu = sorted(polys(geom('ECU')), key=len, reverse=True)
cont = r(dp(ecu[0][:-1], 0.025))
costa = [r(dp(p[:-1], 0.02)) for p in ecu[1:] if min(q[0] for q in p) > -85]
gal = [r(dp(p[:-1], 0.02)) for p in ecu[1:] if min(q[0] for q in p) <= -85]
islas = gal
box = (-82.6,-6.3,-73.6,2.7)
vec = {}
for k,a3 in (('colombia','COL'),('peru','PER')):
    best=[]
    for p in polys(geom(a3)):
        c = clip(p, box)
        if len(c)>2: best.append(r(dp(c,0.04)))
    vec[k]=best
print(len(cont), [len(i) for i in costa], [len(i) for i in gal], {k:[len(p) for p in v] for k,v in vec.items()})
js = "/* Geografía del mapa de Ecuador (Natural Earth, dominio público), simplificada.\n   Puntos [longitud, latitud]. Generado con scripts/generar_mapa.py */\n"
js += "export const CONTORNO = %s;\n" % json.dumps(cont, separators=(',',':'))
js += "export const ISLAS_COSTA = %s;\n" % json.dumps(costa, separators=(',',':'))
js += "export const ISLAS = %s;\n" % json.dumps(islas, separators=(',',':'))
js += "export const VECINOS = %s;\n" % json.dumps(vec, separators=(',',':'))
open('src/javascript/datos/geografia.js','w').write(js); print(len(js))
