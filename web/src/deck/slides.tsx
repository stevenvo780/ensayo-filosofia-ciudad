import type { ReactNode } from "react";
import { Logo } from "../components/Logo";
import { CountUp } from "../components/CountUp";
import { MetricCenterViz } from "./MetricCenterViz";
import { SchellingViz } from "./SchellingViz";
import { TriadViz } from "./TriadViz";

export interface Slide {
  content: ReactNode;
  note: string;
  title?: boolean;
}

export const slides: Slide[] = [
  {
    title: true,
    content: (
      <>
        <div className="mark">
          <Logo size={52} animated />
        </div>
        <p className="kicker">Cartografía crítica · Filosofía de la Ciudad · U. de Antioquia</p>
        <h1>La ciudad bien asignada</h1>
        <p className="sub">Cartografía crítica de una Medellín posible</p>
        <p className="meta">
          Steven Vallejo Ortiz · 10 de julio de 2026 · presentación de la introducción
        </p>
      </>
    ),
    note: "Introducción del ensayo final. Giro: la ciudad se autoproduce; el peligro no es una máquina que la gobierne desde afuera, sino que su autoproducción se CIERRE sobre una sola distinción. «Bien asignada» = la constitución que la mantiene abierta. No es utopía: es Medellín recombinada. 10 minutos.",
  },
  {
    content: (
      <>
        <p className="kicker">La escena</p>
        <h2>Seis de la tarde en Junín</h2>
        <p>
          El ventero mueve su carreta dos metros para quedar bajo el alero. La cámara del poste lo
          registra como <em>obstrucción del flujo</em>. En diciembre, este corredor será un río de
          gente bajo los alumbrados, y ningún tablero sabrá decir qué se celebra.
        </p>
        <p className="lede">
          Desde esta esquina quiero teorizar una ciudad posible. <strong>No una utopía:</strong> una
          Medellín que ya existe en fragmentos y solo falta componer.
        </p>
      </>
    ),
    note: "La informalidad no es ruido: es producción de ciudad (Lefebvre, la ciudad como obra). Lo que el tablero no puede leer —diciembre— es justo lo que hay que proteger.",
  },
  {
    content: (
      <>
        <p className="kicker">La tesis · la ciudad se autoproduce</p>
        <h2>
          La ciudad posible es la ciudad <strong>bien asignada</strong>
        </h2>
        <p className="lede">
          No el orden que un soberano impone: la constitución con que la ciudad mantiene{" "}
          <strong>abierta</strong> su autoproducción —genera los componentes que la generan—.
        </p>
        <TriadViz />
      </>
    ),
    note: "Giro autopoiético: la ciudad se autoproduce (lente de lectura, no teorema). El peligro no es una máquina que gobierne desde afuera, sino que la autoproducción se CIERRE sobre una sola distinción —la retícula, la métrica—. Funcionalismo y smart city son esa clausura con signo distinto. «Bien asignada» sobrevive como la propuesta: la constitución que la mantiene abierta.",
  },
  {
    content: (
      <>
        <p className="kicker">Originalidad, con honestidad</p>
        <h2>Tiene parientes; se distingue por el fundamento</h2>
        <p>
          <span className="pill">Scott · métis</span>
          <span className="pill">Ostrom · policentría</span>
          <span className="pill">Healey · deliberación</span>
          <span className="pill">Jasanoff · subsidiariedad</span>
        </p>
        <p>
          No asigna por prudencia ante fracasos ni por jurisdicción, sino por un{" "}
          <strong>límite categorial</strong> demostrable desde el oficio —y medido sobre datos reales
          de esta ciudad—. «Posible» = la <em>utopía experimental</em> de Lefebvre: explorar lo
          posible implicado en lo real.
        </p>
      </>
    ),
    note: "Nombrar precedentes convierte la vulnerabilidad (¿no es esto ya conocido?) en fortaleza: sé exactamente qué añado: fundamento categorial + demostración propia + anclaje Medellín.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 1 · Ontológico — ¿de qué está hecha?</p>
        <h2>Tres materias trenzadas; ninguna es el silicio</h2>
        <ul>
          <li>
            <strong>Tejido relacional vivo</strong> — se autoproduce (Zipf, q≈1); <em>symploké</em>{" "}
            (Bueno). La informalidad como productor de ciudad, no como ruido.
          </li>
          <li>
            <strong>Realidad institucional</strong> (Searle) — la métrica es función de estatus: «X
            cuenta como Y en C», revisable. EPM y presupuesto participativo lo prueban.
          </li>
          <li>
            <strong>Singularidad situada</strong> — contra el <em>no-lugar</em> (Augé) y la nivelación
            métrica (Simmel): cosmotécnica (Hui). El Metrocable como singularidad producida.
          </li>
        </ul>
      </>
    ),
    note: "Responde literalmente la pregunta guía: tejido relacional / institucional / no-lugar / singularidad-vs-genérico. Simmel es la genealogía de la métrica.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 1 · Ontológico — el tejido se autoproduce</p>
        <h2>El ventero es un equilibrio emergente</h2>
        <p>
          Un juego de localización de Hotelling sobre la red <strong>real</strong> de Medellín (
          <CountUp to={7598} /> nodos): el comercio informal <strong>se aglomera</strong>{" "}
          <CountUp to={2.6} decimals={1} suffix="×" /> más que un óptimo de cobertura. El foco de
          Junín no es desorden: es orden que <strong>nadie diseñó</strong>.
        </p>
        <div className="fig">
          <img
            src="/figs/D11_mega.png"
            alt="Equilibrio de localización de venteros sobre la red real de Medellín: se aglomeran 2,6× más que el óptimo de cobertura."
          />
        </div>
        <p className="cap">
          D11 · La informalidad como componente que la ciudad produce y que la produce —tejido vivo,
          no ruido—.
        </p>
      </>
    ),
    note: "El ventero de la escena inicial, ahora medido: equilibrio de mejor-respuesta robusto en N=10–60 (2,1–3,9× vs óptimo). La informalidad no es fricción del flujo sino producción de ciudad (Lefebvre, la ciudad como obra) —un componente que la ciudad se autoproduce—. Computar PARA ella, no contra ella.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 2 · Poder — medido, no intuido</p>
        <div className="row">
          <div className="col">
            <MetricCenterViz />
          </div>
          <div className="col">
            <h2>La métrica decide el centro</h2>
            <p>
              Sobre la red peatonal <strong>real</strong> de Medellín (<CountUp to={7598} /> nodos),
              tres centralidades exactas señalan centros <strong>casi disjuntos</strong>: Jaccard{" "}
              <CountUp to={0.1} decimals={2} /> / <CountUp to={0.04} decimals={2} /> /{" "}
              <CountUp to={0} decimals={2} />. Probá las métricas ▶
            </p>
            <p className="lede">
              El centro no se descubre: <strong>se decide.</strong>
            </p>
          </div>
        </div>
      </>
    ),
    note: "Verificación local de un resultado de ciencia de redes (Crucitti-Latora-Porta 2006). Sobrevive al gradualismo: ningún optimizador fija su propia función objetivo.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 2 · Poder — la decisión de diseño</p>
        <h2>Cambiar el estatuto del mirar</h2>
        <ul>
          <li>
            <strong>Pluralismo métrico obligatorio:</strong> ninguna cartografía pública con una sola
            métrica.
          </li>
          <li>
            <strong>Derecho a la contra-métrica:</strong> datos y cómputo como bien común auditable
            (EPM).
          </li>
          <li>
            <strong>Presupuesto participativo epistémico:</strong> la comunidad decide qué se mide y
            qué no se vigila.
          </li>
          <li>
            <strong>Asimetría invertida:</strong> algoritmo transparente, ciudadano opaco; espacios
            autogestionados por diseño.
          </li>
        </ul>
        <p className="muted">Deleuze, por su final: no lamentar la modulación — «buscar nuevas armas».</p>
      </>
    ),
    note: "Anti-captura: la pluralidad obliga a capturar varias métricas a la vez; contra-métrica refutable; sorteo y veedurías. Admito la captura documentada del PP.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 3 · Técnica — superar el funcionalismo</p>
        <div className="row">
          <div className="col">
            <h2>El monopolio del juicio</h2>
            <p>
              El Plan Piloto de Wiener y Sert (1948–52) fue desbordado por la ciudad de las laderas.
              El funcionalismo no falló por planificar: <strong>cerró la ciudad</strong> sobre la
              distinción del plano —computó lo emergente; uno fija la regla, millones son subsumidos—.
            </p>
            <p>
              «Aprender de la calle» es <em>congelar el pasado como futuro</em>: la subsunción
              estadística forcluye lo posible.
            </p>
          </div>
          <div className="col">
            <SchellingViz />
          </div>
        </div>
      </>
    ),
    note: "Capital vs emancipación se decide en la propiedad: cómputo público y local. Cultivar = condiciones + monitoreo + umbral deliberado (anti-Hayek). Urbanismo social = cultivo estatal probado.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 3 · Técnica — el todo, autónomo de las partes</p>
        <h2>Cerrar una calle mejora el flujo</h2>
        <p>
          Miles de rutas egoístas sobre la red vial <strong>real</strong> (<CountUp to={22863} />{" "}
          nodos, <CountUp to={33988} /> aristas) producen un flujo que nadie eligió. Existe una{" "}
          <strong>arista-Braess robusta</strong>: cerrarla mejora el tiempo agregado un{" "}
          <CountUp to={1.37} decimals={2} suffix=" %" /> (paradoja de Braess; PoA ≈{" "}
          <CountUp to={1.03} decimals={2} />).
        </p>
        <div className="fig">
          <img
            src="/figs/D10_mega.png"
            alt="Flujo de equilibrio de Wardrop sobre la red vial real de Medellín y escaneo de Braess: una arista cuya remoción mejora el tiempo agregado +1,37%."
          />
        </div>
        <p className="cap">
          D10 · La ciudad computada devuelve resultados que su computador no controla. Autopoiesis,
          no metáfora.
        </p>
      </>
    ),
    note: "Braess = el todo es autónomo de sus partes: el ruteo agregado no es la suma de óptimos egoístas, y cerrar una calle puede mejorarlo. Refutación viva del sueño funcionalista de computar lo emergente: la ciudad se autoproduce y devuelve lo que ningún planificador programó. Honestidad: red REAL, demanda O-D sintética (300 zonas).",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 3 · Técnica — agencia inmanente</p>
        <h2>Ni soberana ni ausente: la agencia es <strong>inmanente</strong></h2>
        <p>
          Quien habita no programa la ciudad desde afuera; la perturba desde dentro —gatilla el
          cambio, no lo especifica—. Su medida la gradúa la asignación.
        </p>
        <div className="three">
          <div className="card">
            <b>Computar</b>
            <span>
              lo formalizable: automatización bienvenida. Todo el aparato corrió en{" "}
              <strong>
                un nodo de <CountUp to={32} /> núcleos
              </strong>
              .
            </span>
          </div>
          <div className="card">
            <b>Sugerir</b>
            <span>la IA aventura escenarios sin autoridad para decidir.</span>
          </div>
          <div className="card">
            <b>Deliberar</b>
            <span>donde las métricas divergen, la ciudad reingresa y disputa sus distinciones a través de quien la habita: el presupuesto participativo como órgano.</span>
          </div>
        </div>
        <p className="muted">El Banco Epistémico Urbano: órgano epistémico de la ciudad, no su cerebro.</p>
      </>
    ),
    note: "Agencia inmanente (acoplamiento estructural): la perturbación gatilla, no especifica; su medida la gradúa el registro —delegada al cómputo, sugerida por la IA, o intensificada como deliberación—. Y la viabilidad vale oro: la ciudad posible cuesta un nodo universitario, no un hiperescalador; escalar no cambia la categoría.",
  },
  {
    content: (
      <>
        <p className="kicker">Cierre · realista y viable</p>
        <h2>La prueba del lunes</h2>
        <table>
          <tbody>
            <tr>
              <td>Operador</td>
              <td>EPM (pública) + universidades — soberanía de infraestructura ya existente</td>
            </tr>
            <tr>
              <td>Vehículo legal</td>
              <td>Presupuesto participativo + veedurías ciudadanas</td>
            </tr>
            <tr>
              <td>Piloto 100 días</td>
              <td>deliberar públicamente UNA métrica ya operante del centro</td>
            </tr>
            <tr>
              <td>Adversarios</td>
              <td>vendedores de vigilancia; administraciones con KPIs opacos</td>
            </tr>
            <tr>
              <td>Riesgo</td>
              <td>captura del PP — tratada por las salvaguardas, no silenciada</td>
            </tr>
          </tbody>
        </table>
        <p className="muted">
          No refunda la política ni inventa tecnología: recombina piezas que Medellín ya construyó.
        </p>
      </>
    ),
    note: "Esto separa «posible» de «utópico»: operador, vehículo legal, piloto, adversarios y riesgo, todos reales.",
  },
  {
    title: true,
    content: (
      <>
        <p className="kicker">Cierre</p>
        <p className="big">
          Producir lo posible no es un privilegio que la ciudad reserve a sus habitantes: es lo que
          su autoproducción realiza <strong>a través</strong> de ellos.
        </p>
        <p className="sub">
          A las seis en Junín, la cámara tendrá una métrica pública, su junta podrá computar la
          contraria, y diciembre seguirá siendo ilegible para todos los tableros.
        </p>
        <p className="meta">Gracias. · filosofia-de-la-ciudad.vercel.app</p>
      </>
    ),
    note: "Cerrar con la escena que abrió (inclusio). La agencia es inmanente: producir lo posible no se RESERVA a los habitantes —la autoproducción de la ciudad lo realiza a través de ellos—, y ninguna máquina, que procesa sin habitar, lo comparte. El límite de la IA deja de ser lamento: es el fundamento positivo de la ciudad posible.",
  },
];
