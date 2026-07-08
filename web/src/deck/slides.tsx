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
    note: "Introducción del ensayo final. Tesis: la ciudad posible es la que asigna cada asunto al registro capaz de resolverlo. No es utopía: es Medellín recombinada. 10 minutos.",
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
        <p className="kicker">La tesis · asignar cada asunto a su registro</p>
        <h2>
          La ciudad posible es la ciudad <strong>bien asignada</strong>
        </h2>
        <TriadViz />
      </>
    ),
    note: "Esta es la contribución. Cada registro tiene su autor y su demostración. La simetría funcionalismo/smart-city es el corazón retórico.",
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
              El funcionalismo no falló por planificar: falló por <strong>computar lo emergente</strong>{" "}
              —uno fija la regla, millones son subsumidos—.
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
        <p className="kicker">Eje 3 · Técnica — agenciamiento</p>
        <h2>Qué se automatiza, qué se reserva</h2>
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
            <b>Decidir</b>
            <span>el juicio de relevancia queda con quien habita: el presupuesto participativo como órgano.</span>
          </div>
        </div>
        <p className="muted">El Banco Epistémico Urbano: órgano epistémico de la ciudad, no su cerebro.</p>
      </>
    ),
    note: "Viabilidad material que vale oro: la ciudad posible cuesta un nodo universitario, no un hiperescalador. Coherente con la tesis: escalar no cambia la categoría.",
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
          Reservar a los habitantes lo único que ninguna máquina puede hacer:{" "}
          <strong>producir lo posible.</strong>
        </p>
        <p className="sub">
          A las seis en Junín, la cámara tendrá una métrica pública, su junta podrá computar la
          contraria, y diciembre seguirá siendo ilegible para todos los tableros.
        </p>
        <p className="meta">Gracias. · filosofia-de-la-ciudad.vercel.app</p>
      </>
    ),
    note: "Cerrar con la escena que abrió (inclusio). El límite categorial de la IA deja de ser lamento y se vuelve el fundamento positivo de la ciudad posible.",
  },
];
