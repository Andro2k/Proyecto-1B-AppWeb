/* Efectos de pantalla del clima: lluvia, oscurecimiento y destellos de relámpago. */
export function dibClima(c, m) {
  const { g, W, H, t } = c;
  if (m.cfg.lluvia) {
    g.fillStyle = 'rgba(10,16,32,.2)'; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(200,215,240,.38)'; g.lineWidth = Math.max(1, H * 0.0025); g.beginPath();
    const n = Math.round(W / 9), largo = H * 0.035;
    for (let i = 0; i < n; i++) {                                                 // gotas inclinadas, posición determinista por índice
      const x = (i * 97.3 + t * 140) % (W + 60) - 30, y = (i * 53.7 + t * H * 1.5 * (0.8 + (i % 5) * 0.1)) % (H + 40) - 20;
      g.moveTo(x, y); g.lineTo(x - largo * 0.28, y + largo);
    }
    g.stroke();
    const lejano = Math.sin(t * 0.9) * Math.sin(t * 2.3 + 1);                    // relámpagos lejanos ocasionales
    if (lejano > 0.96) { g.fillStyle = 'rgba(220,230,255,.14)'; g.fillRect(0, 0, W, H); }
  }
  if (m.flash > 0) { g.fillStyle = `rgba(255,255,255,${Math.min(0.55, m.flash * 1.6)})`; g.fillRect(0, 0, W, H); }
}
