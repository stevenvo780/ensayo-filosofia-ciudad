import type { ReactNode } from "react";
import { Logo } from "../components/Logo";
import { CountUp } from "../components/CountUp";
import { MetricCenterViz } from "./MetricCenterViz";
import { SchellingViz } from "./SchellingViz";
import { TriadViz } from "./TriadViz";
import { ZipfViz } from "./ZipfViz";
import { DiffusionViz } from "./DiffusionViz";

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
        <p className="kicker">La escena · desde una esquina se teoriza</p>
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
        <p className="muted">
          La informalidad no es ruido del flujo: es la ciudad como <em>obra</em> (Lefebvre) —un
          componente que la ciudad produce y que la produce—.
        </p>
      </>
    ),
    note: "La informalidad no es ruido: es producción de ciudad (Lefebvre, la ciudad como obra). Lo que el tablero no puede leer —diciembre— es justo lo que hay que proteger. Regla de oro del guion: si cortan el tiempo, sacar ejemplos, nunca la tesis ni el delta.",
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
          <strong>abierta</strong> su autoproducción —genera los componentes que la generan y los
          deja disputables desde dentro—.
        </p>
        <TriadViz />
      </>
    ),
    note: "Giro autopoiético: la ciudad se autoproduce (lente de lectura, no teorema). El peligro no es una máquina que gobierne desde afuera, sino que la autoproducción se CIERRE sobre una sola distinción —la retícula, la métrica—. Funcionalismo (computó lo emergente) y smart city (computa lo relevante) son esa clausura con signo invertido. «Bien asignada» = computa lo computable, cultiva lo emergente, delibera lo relevante.",
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
          <strong>límite categorial</strong> mostrable desde el oficio —y medido sobre datos reales
          de esta ciudad—.
        </p>
        <p className="muted">
          Honestidad: el límite de lo <em>computable</em> lo medí; las otras dos fronteras —lo que
          solo existe desplegándose, lo que ningún optimizador se fija a sí mismo— las sostengo como
          distinción argumentada. «Posible» = la <em>utopía experimental</em> de Lefebvre: explorar
          lo posible implicado en lo real.
        </p>
      </>
    ),
    note: "Nombrar precedentes convierte la vulnerabilidad (¿no es esto ya conocido?) en fortaleza. Objeción Jasanoff: la subsidiariedad asigna por escala/jurisdicción; la mía por límite modal-categorial, y lo demuestro desde el oficio. No pelear con Jasanoff: usarla de trampolín.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 1 · Ontológico — ¿de qué está hecha?</p>
        <h2>Tres materias trenzadas; ninguna es el silicio</h2>
        <div className="row">
          <div className="col">
            <ul>
              <li>
                <strong>Tejido relacional vivo</strong> — se auto-organiza (Zipf, q≈1);{" "}
                <em>symploké</em> (Bueno). La informalidad produce ciudad, no es ruido.
              </li>
              <li>
                <strong>Realidad institucional</strong> (Searle) — la métrica es función de estatus
                con <strong>poderes deónticos</strong>: «X cuenta como Y en C», revisable. EPM y
                presupuesto participativo lo prueban.
              </li>
              <li>
                <strong>Singularidad situada</strong> — contra el <em>no-lugar</em> (Augé) y la
                nivelación métrica (Simmel): cosmotécnica (Hui). El Metrocable como singularidad
                producida.
              </li>
            </ul>
          </div>
          <div className="col">
            <ZipfViz />
          </div>
        </div>
      </>
    ),
    note: "Responde la pregunta guía: tejido relacional / institucional / singularidad-vs-genérico. Zipf (D1): la jerarquía de tamaños del SISTEMA de ciudades emerge sin planificador (33.933 ciudades, q≈1) —cara empírica consistente con la lectura autopoiética, nunca su prueba; es restricción de realismo, no programa—. Simmel es la genealogía de la métrica.",
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
          no ruido—. Robusto en N = 10–60 (2,1–3,9×). Computar <em>para</em> ella, no contra ella.
        </p>
      </>
    ),
    note: "El ventero de la escena inicial, ahora medido: equilibrio de mejor-respuesta robusto en N=10–60 (2,1–3,9× vs óptimo). Siete de cada diez medellinenses asocian el centro con esa informalidad (Medellín Cómo Vamos, 2024). La informalidad no es fricción del flujo sino producción de ciudad (Lefebvre). Honestidad: la mejor-respuesta cicla (no hay Nash puro); demanda ∝ densidad.",
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
              tres centralidades <strong>exactas</strong> —intermediación, cercanía, vector propio—
              señalan centros <strong>casi disjuntos</strong>: Jaccard <CountUp to={0.1} decimals={2} />{" "}
              / <CountUp to={0.04} decimals={2} /> / <CountUp to={0} decimals={2} />. Probá las
              métricas ▶
            </p>
            <p className="lede">
              El centro no se descubre: <strong>se decide.</strong>
            </p>
            <p className="muted">
              Verificación local de Crucitti-Latora-Porta (2006). Nada <em>en el grafo</em> dice qué
              métrica debe importar: elegirla es un acto exterior al cómputo.
            </p>
          </div>
        </div>
      </>
    ),
    note: "Verificación local de un resultado de ciencia de redes (Crucitti-Latora-Porta 2006). El corredor prominente no es artefacto (D9: z≈188). Sobrevive al gradualismo: ningún optimizador fija su propia función objetivo; decidir qué se optimiza es exterior a la optimización, y donde esa métrica es pública y disputada, es político.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 2 · Poder — el cuerpo reescribe el alcance</p>
        <div className="row">
          <div className="col">
            <DiffusionViz />
          </div>
          <div className="col">
            <h2>La pendiente encoge la ciudad</h2>
            <p>
              El <em>footfall</em> es un campo relacional cerrado sobre la propia red —
              <strong>clausura operacional</strong>—. La isócrona de 15 min cae{" "}
              <CountUp to={16} suffix=" %" /> en el centro plano y <CountUp to={24} suffix=" %" /> en
              la ladera.
            </p>
            <p className="lede">
              El alcance no es del mapa: es del <strong>cuerpo que sube.</strong>
            </p>
            <p className="muted">
              La fatiga —el cuerpo de Merleau-Ponty— reescribe la centralidad que la métrica declara
              neutral. Es el fundamento del Metrocable (D6, D8, D12).
            </p>
          </div>
        </div>
      </>
    ),
    note: "D12: el footfall salió DIFUSO (top 1% concentra 2,4%) y se reporta tal cual; el hallazgo con filo es la asimetría del alcance por pendiente (isócrona −16% plano, −24% ladera). Campo relacional cerrado sobre la red (clausura operacional) que el terreno reescribe (acoplamiento con el medio). El centro del cuerpo dista 710 m del centro del flujo a escala ciudad.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 2 · Poder — cambiar el estatuto del mirar</p>
        <h2>Instituciones de una ciudad que se deja disputar</h2>
        <ul>
          <li>
            <strong>Pluralismo métrico obligatorio:</strong> ninguna cartografía pública en disputa
            con una sola métrica; toda foto oficial lleva su disenso a la vista.
          </li>
          <li>
            <strong>Derecho a la contra-métrica:</strong> datos y cómputo municipales como bien común
            auditable (EPM); cualquier junta computa y publica su lectura.
          </li>
          <li>
            <strong>Presupuesto participativo epistémico:</strong> del 5 % de la inversión a las
            funciones objetivo — la comunidad decide qué se mide y qué no se vigila.
          </li>
          <li>
            <strong>Asimetría invertida:</strong> algoritmo transparente, ciudadano opaco; espacios
            libres y autogestionados por diseño.
          </li>
        </ul>
        <p className="muted">
          La captura del PP está <strong>tratada</strong>, no silenciada: pluralidad, sorteo, disenso
          publicado. Deleuze, por su final: «buscar nuevas armas».
        </p>
      </>
    ),
    note: "Anti-captura: la pluralidad obliga a capturar varias métricas a la vez; contra-métrica refutable con los mismos datos; sorteo y veedurías (Ley 850). Admito la captura documentada del PP por clientelismos y actores armados. No una ciudad sin conflicto: una donde el conflicto tiene escenarios en vez de algoritmos que prometen suprimirlo.",
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
              distinción del plano —trató como <em>instrucción</em> lo que solo puede ser{" "}
              <em>perturbación</em>—.
            </p>
            <p>
              «Aprender de la calle» no lo salva: la subsunción estadística <em>forcluye lo posible</em>{" "}
              —congela el pasado como futuro— donde un proyecto de ciudad necesita abrirlo.
            </p>
          </div>
          <div className="col">
            <SchellingViz />
          </div>
        </div>
      </>
    ),
    note: "Objeción funcionalismo→IA: aprender la distribución de lo actual congela el pasado como futuro; el error no es la subsunción sino el MONOPOLIO del juicio (uno reflexiona, millones son subsumidos). Cultivar ≠ Hayek: Schelling muestra que lo emergente no es benigno (0,50→0,87); cultivar = condiciones + monitoreo + umbral deliberado. Urbanismo social = cultivo estatal probado (Cerdá 2012).",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 3 · Técnica — el todo, autónomo de las partes</p>
        <h2>Cerrar una calle mejora el flujo</h2>
        <p>
          Miles de rutas egoístas sobre la red vial <strong>real</strong> (<CountUp to={22863} />{" "}
          nodos) producen un flujo que nadie eligió. Existe una{" "}
          <strong>arista-Braess robusta</strong>: cerrarla mejora el tiempo agregado{" "}
          <CountUp to={1.37} decimals={2} suffix=" %" /> (PoA ≈ <CountUp to={1.03} decimals={2} />).
        </p>
        <div className="fig">
          <img
            src="/figs/D10_mega.png"
            alt="Flujo de equilibrio de Wardrop sobre la red vial real de Medellín y escaneo de Braess: una arista cuya remoción mejora el tiempo agregado +1,37%."
          />
        </div>
        <p className="cap">
          D10 · La ciudad computada devuelve lo que su computador no controla —el todo es autónomo de
          sus partes—. Autopoiesis, no metáfora.
        </p>
      </>
    ),
    note: "Braess = el todo es autónomo de sus partes: el ruteo agregado no es la suma de óptimos egoístas, y cerrar una calle puede mejorarlo. Refutación viva del sueño funcionalista de computar lo emergente. Honestidad: red REAL, demanda O-D sintética (300 zonas), capacidad constante → magnitudes modestas; lo robusto es el hallazgo cualitativo, no la cifra fina.",
  },
  {
    content: (
      <>
        <p className="kicker">Eje 3 · Técnica — agencia inmanente</p>
        <h2>Ni soberana ni ausente: la agencia es <strong>inmanente</strong></h2>
        <p>
          Quien habita no programa la ciudad desde afuera —ese es el sueño funcionalista—; la{" "}
          <strong>perturba desde dentro</strong>: gatilla el cambio, no lo especifica (acoplamiento
          estructural). Su medida la gradúa la asignación.
        </p>
        <div className="three">
          <div className="card">
            <b>Computar</b>
            <span>
              lo formalizable: automatización barata. Todo el aparato corrió en{" "}
              <strong>
                un nodo de <CountUp to={32} /> núcleos
              </strong>{" "}
              —la suficiencia no necesita hiperescaladores—.
            </span>
          </div>
          <div className="card">
            <b>Sugerir</b>
            <span>la IA aventura escenarios sin autoridad para decidir: decidir exige un para-qué situado que no está en los datos.</span>
          </div>
          <div className="card">
            <b>Deliberar</b>
            <span>donde las métricas divergen, la ciudad reingresa y disputa sus distinciones a través de quien la habita: el presupuesto participativo como órgano.</span>
          </div>
        </div>
        <p className="muted">El Banco Epistémico Urbano: órgano epistémico de la ciudad, no su cerebro. Cuatro métricas rankean prioridades casi disjuntas; ninguna «la» correcta (D13).</p>
      </>
    ),
    note: "Agencia inmanente (acoplamiento estructural): la perturbación gatilla, no especifica; su medida la gradúa el registro —delegada al cómputo, sugerida por la IA, o intensificada como deliberación—. D13: margen inmanente que ningún optimizador fija. Viabilidad: la ciudad posible cuesta un nodo universitario, no un hiperescalador; escalar no cambia la categoría.",
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
              <td>EPM (100 % pública, ~20 % del presupuesto) + universidades — soberanía de infraestructura ya existente</td>
            </tr>
            <tr>
              <td>Vehículo legal</td>
              <td>Presupuesto participativo (Acuerdo 028/2017, 5 % de la inversión) + veedurías (Ley 850)</td>
            </tr>
            <tr>
              <td>Piloto 100 días</td>
              <td>deliberar públicamente UNA función objetivo ya operante: la métrica que hoy prioriza el centro</td>
            </tr>
            <tr>
              <td>Adversarios</td>
              <td>vendedores de vigilancia llave en mano; administraciones con KPIs opacos</td>
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
    note: "Esto separa «posible» de «utópico»: operador, vehículo legal, piloto, adversarios y riesgo, todos reales. ¿Quién asigna la asignación? No hay primer asignador soberano: la asignación es un componente que la ciudad produce y reingresa; la constitución solo la vuelve explícita y re-perturbable. Y es por aspecto, no por asunto: un semáforo tiene núcleo computable, métrica disputable y efectos emergentes a la vez.",
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
