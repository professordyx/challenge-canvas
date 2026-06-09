import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";

const content = {
  pt: {
    title: "Template de Declaração de Problema (Problem Statement)",
    description:
      "Guia prático com template e exemplos para escrever declarações de problema eficazes usando o formato 'Como Poderíamos' (How Might We) do Challenge Canvas.",
    h1: "Template de Declaração de Problema: guia prático com exemplos",
    intro:
      "Uma boa declaração de problema (problem statement) é a base para qualquer projeto de inovação. Ela alinha equipes, foca recursos e abre espaço para soluções criativas. Este guia apresenta um template testado, baseado em problem framing e no formato 'Como Poderíamos' (How Might We) usado no Challenge Canvas.",
    sections: [
      {
        h: "O que é uma declaração de problema?",
        body: "Uma declaração de problema é uma frase curta e específica que descreve uma lacuna entre o estado atual e o estado desejado. Ela responde quem é afetado, o que está acontecendo, onde, quando e por que isso importa — sem propor uma solução. Quando bem escrita, evita que equipes pulem direto para soluções sem entender o problema.",
      },
      {
        h: "Os 5 elementos de uma boa declaração de problema",
        list: [
          "Quem: usuários, clientes ou stakeholders afetados.",
          "O quê: o sintoma observável e mensurável.",
          "Onde / Quando: o contexto em que o problema ocorre.",
          "Por quê: o impacto no negócio, no usuário ou na sociedade.",
          "Restrições: limites de orçamento, tempo, regulação ou tecnologia.",
        ],
      },
      {
        h: "Template de Problem Statement",
        body: "Use este template como ponto de partida. Preencha cada campo com frases curtas e específicas.",
        code: `[Público / usuário] enfrenta [problema observável]
ao [contexto / momento],
o que resulta em [impacto mensurável].
Restrições: [orçamento, prazo, tecnologia, regulação].
Sucesso será atingido quando [critério mensurável].`,
      },
      {
        h: "Template de Problem Framing (How Might We)",
        body: "Depois de descrever o problema, reformule-o como uma pergunta aberta usando o formato 'Como Poderíamos' (HMW). Isso convida à exploração de soluções sem prescrever uma resposta.",
        code: `Como poderíamos [verbo de ação + resultado desejado]
para [público-alvo]
considerando [restrição-chave]?`,
      },
      {
        h: "Exemplos de declarações de problema eficazes",
        examples: [
          {
            bad: "Precisamos de um novo aplicativo para clientes.",
            good: "Clientes do varejo abandonam o carrinho em 68% das compras no mobile durante o checkout, gerando uma perda estimada de R$ 2,4M/ano. Restrições: integração com o ERP atual e prazo de 6 meses.",
            hmw: "Como poderíamos simplificar o checkout mobile para clientes do varejo, reduzindo o abandono em 30%, mantendo a integração com o ERP atual?",
          },
          {
            bad: "A equipe está desmotivada.",
            good: "Colaboradores da área de operações relatam queda de 22% no engajamento nas pesquisas trimestrais, especialmente após a fusão de 2024, o que está elevando o turnover em 15%. Restrição: política de remuneração já definida.",
            hmw: "Como poderíamos reconectar os colaboradores de operações ao propósito da nova organização, reduzindo o turnover em 10% em 12 meses?",
          },
        ],
      },
      {
        h: "Erros comuns a evitar",
        list: [
          "Misturar problema com solução ('precisamos de um app...').",
          "Generalizar demais ('a comunicação está ruim').",
          "Esquecer de quantificar o impacto.",
          "Ignorar restrições reais de orçamento, tempo ou regulação.",
          "Não definir critério de sucesso mensurável.",
        ],
      },
      {
        h: "Próximos passos",
        body: "Use o Challenge Canvas Builder para estruturar seu problema em um framework completo de 12 blocos, com apoio de IA para refinar cada seção e gerar declarações HMW automaticamente.",
      },
    ],
    cta: "Estruturar meu desafio no Challenge Canvas",
  },
  es: {
    title: "Plantilla de Declaración de Problema (Problem Statement)",
    description:
      "Guía práctica con plantilla y ejemplos para escribir declaraciones de problema eficaces usando el formato 'Cómo Podríamos' (How Might We) del Challenge Canvas.",
    h1: "Plantilla de Declaración de Problema: guía práctica con ejemplos",
    intro:
      "Una buena declaración de problema (problem statement) es la base de cualquier proyecto de innovación. Alinea equipos, enfoca recursos y abre espacio para soluciones creativas. Esta guía presenta una plantilla probada, basada en problem framing y en el formato 'Cómo Podríamos' (How Might We) usado en el Challenge Canvas.",
    sections: [
      {
        h: "¿Qué es una declaración de problema?",
        body: "Una declaración de problema es una frase corta y específica que describe una brecha entre el estado actual y el estado deseado. Responde quién se ve afectado, qué ocurre, dónde, cuándo y por qué importa — sin proponer una solución. Bien escrita, evita que los equipos salten directo a soluciones sin entender el problema.",
      },
      {
        h: "Los 5 elementos de una buena declaración de problema",
        list: [
          "Quién: usuarios, clientes o stakeholders afectados.",
          "Qué: el síntoma observable y medible.",
          "Dónde / Cuándo: el contexto en que ocurre el problema.",
          "Por qué: el impacto en el negocio, el usuario o la sociedad.",
          "Restricciones: límites de presupuesto, tiempo, regulación o tecnología.",
        ],
      },
      {
        h: "Plantilla de Problem Statement",
        body: "Usa esta plantilla como punto de partida. Completa cada campo con frases cortas y específicas.",
        code: `[Público / usuario] enfrenta [problema observable]
al [contexto / momento],
lo que resulta en [impacto medible].
Restricciones: [presupuesto, plazo, tecnología, regulación].
El éxito se alcanzará cuando [criterio medible].`,
      },
      {
        h: "Plantilla de Problem Framing (How Might We)",
        body: "Después de describir el problema, reformúlalo como una pregunta abierta usando el formato 'Cómo Podríamos' (HMW). Esto invita a explorar soluciones sin prescribir una respuesta.",
        code: `¿Cómo podríamos [verbo de acción + resultado deseado]
para [público objetivo]
considerando [restricción clave]?`,
      },
      {
        h: "Ejemplos de declaraciones de problema eficaces",
        examples: [
          {
            bad: "Necesitamos una nueva aplicación para clientes.",
            good: "Los clientes del retail abandonan el carrito en el 68% de las compras móviles durante el checkout, generando una pérdida estimada de USD 480k/año. Restricciones: integración con el ERP actual y plazo de 6 meses.",
            hmw: "¿Cómo podríamos simplificar el checkout móvil para clientes del retail, reduciendo el abandono en un 30%, manteniendo la integración con el ERP actual?",
          },
          {
            bad: "El equipo está desmotivado.",
            good: "Colaboradores de operaciones reportan una caída del 22% en el engagement en las encuestas trimestrales, especialmente tras la fusión de 2024, elevando la rotación en un 15%. Restricción: política de compensación ya definida.",
            hmw: "¿Cómo podríamos reconectar a los colaboradores de operaciones con el propósito de la nueva organización, reduciendo la rotación en un 10% en 12 meses?",
          },
        ],
      },
      {
        h: "Errores comunes a evitar",
        list: [
          "Mezclar problema con solución ('necesitamos una app...').",
          "Generalizar demasiado ('la comunicación está mal').",
          "Olvidar cuantificar el impacto.",
          "Ignorar restricciones reales de presupuesto, tiempo o regulación.",
          "No definir un criterio de éxito medible.",
        ],
      },
      {
        h: "Próximos pasos",
        body: "Usa el Challenge Canvas Builder para estructurar tu problema en un framework completo de 12 bloques, con apoyo de IA para refinar cada sección y generar declaraciones HMW automáticamente.",
      },
    ],
    cta: "Estructurar mi desafío en el Challenge Canvas",
  },
};

const ProblemStatementGuide = () => {
  const { language } = useLanguage();
  const c = content[language] ?? content.pt;
  const url = "https://challengecanvas.com/guides/problem-statement-template";

  return (
    <>
      <Helmet>
        <title>{c.title} | Challenge Canvas</title>
        <meta name="description" content={c.description} />
        <meta property="og:title" content={c.title} />
        <meta property="og:description" content={c.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://challengecanvas.com/og-image.jpg" />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: c.title,
            description: c.description,
            inLanguage: language,
            mainEntityOfPage: url,
            author: { "@type": "Person", name: "Diocélio Goulart" },
            publisher: {
              "@type": "Organization",
              name: "Challenge Canvas Builder",
              logo: {
                "@type": "ImageObject",
                url: "https://challengecanvas.com/logo.png",
              },
            },
          })}
        </script>
      </Helmet>

      <div className="flex min-h-[calc(100vh-4rem)] flex-col">
        <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {c.h1}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {c.intro}
          </p>

          {c.sections.map((s, i) => (
            <section key={i} className="mt-10">
              <h2 className="text-2xl font-semibold text-foreground">{s.h}</h2>
              {"body" in s && s.body && (
                <p className="mt-3 leading-relaxed text-foreground/90">{s.body}</p>
              )}
              {"list" in s && s.list && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground/90">
                  {s.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
              {"code" in s && s.code && (
                <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-relaxed text-foreground">
                  <code>{s.code}</code>
                </pre>
              )}
              {"examples" in s && s.examples && (
                <div className="mt-4 space-y-6">
                  {s.examples.map((ex, j) => (
                    <div key={j} className="rounded-lg border border-border p-4">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-destructive">✗ </strong>
                        {ex.bad}
                      </p>
                      <p className="mt-3 text-sm text-foreground/90">
                        <strong className="text-primary">✓ </strong>
                        {ex.good}
                      </p>
                      <p className="mt-3 text-sm italic text-foreground/80">
                        HMW: {ex.hmw}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          <div className="mt-12 flex justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                {c.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </article>
        <Footer />
      </div>
    </>
  );
};

export default ProblemStatementGuide;
