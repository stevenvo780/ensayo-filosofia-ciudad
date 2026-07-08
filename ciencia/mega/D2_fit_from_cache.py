import json, numpy as np, pandas as pd
from scipy import stats
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt

cache = json.load(open('ciencia/data/d2_osm_cache.json'))
gids = {int(k.split('_')[0]): v for k, v in cache.items()}
print("cache entries:", len(gids), flush=True)
cols = ["geonameid","name","asciiname","alt","lat","lon","fc","fcode","cc","cc2",
        "a1","a2","a3","a4","population","elev","dem","tz","mod"]
df = pd.read_csv("ciencia/data/cities15000.txt", sep="\t", header=None, names=cols,
                 usecols=["geonameid","name","cc","population"], low_memory=False)
df["geonameid"] = pd.to_numeric(df["geonameid"], errors="coerce")
df = df[df["geonameid"].isin(gids)].copy()
df["Y"] = df["geonameid"].map(gids)
df["population"] = pd.to_numeric(df["population"], errors="coerce")
df = df.dropna(subset=["population","Y"])
df = df[(df["Y"] > 0) & (df["population"] > 0)]
print("n =", len(df), " paises:", sorted(df['cc'].dropna().unique().tolist()), flush=True)
print("rango pob:", int(df.population.min()), "-", int(df.population.max()), flush=True)

x = np.log(df.population.to_numpy(float)); y = np.log(df.Y.to_numpy(float))
r = stats.linregress(x, y); ts = stats.theilslopes(y, x)
b = float(r.slope); lo, hi = b - 1.96*r.stderr, b + 1.96*r.stderr
r2 = float(r.rvalue**2)
print(f"beta_OLS={b:.3f} IC95=({lo:.3f},{hi:.3f}) R2={r2:.4f} TheilSen={ts[0]:.3f} ({ts[2]:.3f},{ts[3]:.3f})", flush=True)

xv = df.population.to_numpy(float); yv = df.Y.to_numpy(float)
xl = np.logspace(np.log10(xv.min()*0.85), np.log10(xv.max()*1.15), 100)
yl = np.exp(r.intercept) * xl**b
lin = np.mean(np.log(yv)) - np.mean(np.log(xv)); ylin = np.exp(lin) * xl
fig, ax = plt.subplots(figsize=(8.5, 5.6))
ax.scatter(xv, yv, s=44, color="#153b66", edgecolor="white", lw=0.5, alpha=0.9,
           label=f"Ciudades europeas reales (n={len(df)})")
ax.plot(xl, yl, color="#d62728", lw=2.3,
        label=rf"OLS: $\hat\beta$={b:.3f} (IC {lo:.2f}-{hi:.2f}), $R^2$={r2:.3f}")
ax.plot(xl, ylin, color="#888", ls="--", lw=1.5, label=r"Referencia lineal $\beta=1$")
ax.set_xscale("log"); ax.set_yscale("log")
ax.set_xlabel("Poblacion N (GeoNames)"); ax.set_ylabel("Amenities OSM en radio 2,5 km")
ax.set_title("Ley de escala urbana Bettencourt-West sobre datos reales (OSM, Europa)")
ax.grid(True, which="both", ls=":", lw=0.7, alpha=0.6); ax.legend(frameon=True, fontsize=9)
fig.tight_layout(); fig.savefig("ciencia/figs/D2_mega.png", dpi=150, bbox_inches="tight")
print("JSONRESULT", json.dumps({"beta": round(b,3), "ci": [round(lo,3), round(hi,3)],
      "ts": round(ts[0],3), "r2": round(r2,4), "n": int(len(df)),
      "superlineal": bool(lo > 1.0)}), flush=True)
