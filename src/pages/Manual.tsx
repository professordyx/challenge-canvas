import { useLanguage } from "@/i18n/LanguageContext";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/logo-diocelio.png";
import type { Language } from "@/i18n/translations";

interface ManualContent {
  title: string;
  intro: string;
  sections: { heading: string; content: React.ReactNode }[];
}

const getContent = (lang: Language): ManualContent => {
  if (lang === "es") return esContent;
  return ptContent;
};

const ptContent: ManualContent = {
  title: "Manual do Challenge Canvas",
  intro:
    "Este manual apresenta a teoria e a prática do Challenge Canvas – uma ferramenta de gestão estratégica usada para diagnosticar problemas complexos e estruturar desafios organizacionais de forma colaborativa. Aqui descrevemos os fundamentos conceituais (pensamento de design, problem framing, wicked problems, inovação aberta) e detalhamos o uso prático do Canvas, incluindo o funcionamento do aplicativo Challenge Canvas Builder. Todo o conteúdo é fundamentado em referências acadêmicas (APA 7) para garantir rigor científico.",
  sections: [
    {
      heading: "Desafios Complexos e Pensamento de Design",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Desafios organizacionais complexos costumam ser <em>wicked problems</em> (problemas perversos): eles envolvem múltiplos atores, causas interdependentes, valores conflitantes e consequências imprevisíveis. Rittel e Webber (1973) observaram que, nesses casos, "não existem soluções certas ou erradas, apenas melhores ou piores dadas as condições atuais". Por isso, métodos lineares de análise falham: é preciso reformular o problema antes de buscar soluções (o próprio problema só se esclarece após tentativas de solução).
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            O campo da ciência da complexidade reforça essa visão. No contexto do modelo Cynefin, problemas complexos exigem um estilo de liderança baseado na experimentação: "probe–sense–respond" (explorar, identificar padrões e reagir). Isso significa criar protótipos e hipóteses para testar rapidamente, em vez de tentar planejar tudo antecipadamente.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            O pensamento de design (design thinking) fornece práticas-chave para isso. Tim Brown (2008) define design thinking como uma disciplina que "usa a sensibilidade e os métodos do designer para casar as necessidades das pessoas com o que é tecnologicamente viável e o que uma estratégia de negócios pode converter em valor para o cliente". Ou seja, parte-se da compreensão profunda do usuário e do contexto antes de conceber soluções. Kees Dorst (2011) destaca que o núcleo do design thinking é a criação de "frames" (novos pontos de vista) para abordar situações-problema. Para Dorst, "framing" é justamente a prática de criar um ponto de vista (frame) inédito a partir do qual o problema se torna abordável. Designers experientes identificam o paradoxo central do desafio (o que o torna difícil) e só depois começam a buscar soluções, evitando conclusões precipitadas. Esse processo criativo (abdução) permite redefinir o problema à medida que se aprende sobre ele. Em resumo, antes de "ir à solução", equipes orientadas por design questionam e reformulam o problema, garantindo foco no que importa.
          </p>
          <p className="leading-relaxed text-foreground/90">
            Outro ponto teórico importante é a diversidade cognitiva. Estudos mostram que equipes cognitivamente diversas geram soluções melhores para problemas complexos que equipes homogêneas, mesmo que estas sejam altamente habilidosas. Scott Page (2007) argumenta que "na solução de um problema, a diversidade cognitiva pode superar a habilidade". Em outras palavras, pontos de vista distintos (de diferentes disciplinas, experiências ou formações) enriquecem a definição do problema e elevam o potencial inovador do grupo.
          </p>
        </>
      ),
    },
    {
      heading: "Canvas e Inovação Aberta",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Um Canvas é um quadro visual composto de blocos organizados, ideal para síntese colaborativa. Como destaca Sneij (2019), um Canvas força a redução de complexidade a uma página, facilitando a comunicação e a identificação de padrões. Ferramentas como o Business Model Canvas (Osterwalder) são exemplos famosos: elas condensam conceitos-chave de negócios em seções bem definidas. No mesmo espírito, o Challenge Canvas divide o problema em áreas críticas (contexto, stakeholders, metas, restrições, etc.), de modo que a relação entre essas partes se torna evidente.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Nos últimos anos, a inovação aberta tornou o Canvas ainda mais relevante. Grandes empresas usam desafios corporativos para atrair startups e parceiros externos. Pinto e Tamanine (2022) mostram que, em open innovation, sistematizar as informações de um desafio em formato visual aumenta a colaboração empresa-startup. Eles desenvolveram um "Corporate Challenge Canvas" justamente para captar de forma clara as informações essenciais de um desafio, visando melhorar o engajamento. Em suma, o Canvas ajuda a definir e comunicar o problema de maneira estruturada tanto internamente quanto para públicos externos (como possíveis solucionadores), aumentando a assertividade das iniciativas de inovação.
          </p>
          <p className="leading-relaxed text-foreground/90">
            Metodologias consagradas como a Double Diamond (Design Council) também reforçam a ideia de diferenciar fases de descoberta (problema) e entrega (solução). O Challenge Canvas atua na primeira parte: ele corresponde à fase "Define" (primeiro diamante), quando se reúne empatia e informações para clarificar o desafio antes de gerar ideias. Assim, a formulação adequada do problema (problema bem articulado) é tão crucial quanto a solução em si (Rittel & Webber, 1973).
          </p>
        </>
      ),
    },
    {
      heading: "Estrutura do Challenge Canvas",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            O Challenge Canvas geralmente contempla blocos de conteúdo que ajudam a enquadrar o desafio. Embora existam variações, um modelo amplo pode incluir, por exemplo:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Contexto Estratégico:</strong> cenário atual, metas corporativas, urgência e impacto esperado (financeiro, cliente, eficiência).</li>
            <li><strong>Problema Atual:</strong> descrição sintomática do que se observa, dados e evidências, histórico e causas raiz identificadas.</li>
            <li><strong>Impacto:</strong> consequências quantificáveis do problema (custos, riscos, métricas-chave afetadas).</li>
            <li><strong>Stakeholders/Usuários:</strong> quem é afetado pelo desafio? Quem decide sobre ele? Quem são patrocinadores ou usuários-alvo?</li>
            <li><strong>Declaração do Desafio:</strong> síntese no formato "Como poderíamos [objetivo desejado] para [público/processo] considerando [restrições-chave]?". Esse enunciado (HMW – How Might We) é orientado a resultado, não prescritivo de solução.</li>
            <li><strong>Critérios de Sucesso:</strong> quais indicadores demonstrarão que o desafio está bem-resolvido (ex: metas numéricas, prazo, ROI mínimo).</li>
            <li><strong>Restrições e Premissas:</strong> limitações orçamentárias, tecnológicas ou regulatórias; crenças que não precisam ser testadas.</li>
            <li><strong>Recursos Disponíveis:</strong> dados existentes, infraestrutura, equipes dedicadas, parcerias externas etc.</li>
            <li><strong>Hipóteses Iniciais:</strong> possíveis causas ou soluções emergentes que serão testadas.</li>
            <li><strong>Abordagem de Solução:</strong> ideias gerais de como atacar o problema (metodologias a aplicar, tipo de protótipo, frameworks, ex.: design sprint, experimento com algoritmo, etc.).</li>
            <li><strong>Governança:</strong> patrocinador executivo, líderes do projeto, grupo decisório e datas de acompanhamento.</li>
            <li><strong>Entregáveis Esperados:</strong> protótipos, pilotos, business case, documentação final, plano de implementação.</li>
          </ul>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Cada seção deve ser preenchida colaborativamente (workshop ou office) com texto breve e direto. Auxiliações como perguntas-guia podem ser usadas: por exemplo, para Contexto, perguntar "Por que este desafio importa agora?"; para Stakeholders, "Quem são as partes essenciais para resolver este problema?". Em geral, evita-se termos vagos (ex: "otimizar processo X") ou soluções pré-concebidas ("usar IA para…"); busca-se escrita clara e baseada em dados.
          </p>
          <p className="leading-relaxed text-foreground/90">
            <strong>Modelo Visual:</strong> Em geral, o canvas é apresentado em uma única página, com caixas distintas para cada bloco. Isso "obriga" a equipe a focar no que é realmente relevante e permite que todos vejam de relance como os elementos se conectam. Fontes recomendadas de inspiração incluem o Challenge Canvas de Jorge Sneij (que sugere até dividir o quadro em duas partes: problema e contexto) e templates de consultorias de inovação (ou o "Corporate Challenge Canvas" do RBGI 2022).
          </p>
        </>
      ),
    },
    {
      heading: "Preenchendo o Challenge Canvas",
      content: (
        <>
          <h3 className="mb-3 text-xl font-semibold text-foreground">1. Preparação</h3>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Forme uma equipe multidisciplinar:</strong> inclua pessoas de negócio, técnica (TI/dados), marketing/usuário, finanças, etc. A diversidade de competências enriquece a definição do problema.</li>
            <li><strong>Colete dados e insights:</strong> reúna indicadores atuais (KPIs), feedbacks de clientes, entrevistas com stakeholders, análises de processo e causas-raiz (ex: 5 Whys, Diagrama de Ishikawa).</li>
            <li><strong>Contextualize estrategicamente:</strong> entenda como o desafio se insere na estratégia maior da organização (vantagem competitiva, metas de inovação, pressões externas). Isso reforça a relevância e direciona o foco.</li>
          </ul>

          <h3 className="mb-3 text-xl font-semibold text-foreground">2. Preenchimento Colaborativo</h3>
          <p className="mb-3 leading-relaxed text-foreground/90">Use o canvas como um guia dinâmico. Por exemplo:</p>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Contexto Estratégico:</strong> registre metas e impactos esperados. Ex: "Reduzir rupturas em estoque em 30% para maximizar receita do trimestre."</li>
            <li><strong>Problema Atual:</strong> descreva sintomas claros ("a taxa de churn subiu 15% no último ano"), apoiado por dados. Separe sintomas de possíveis causas (evite pular direto à solução).</li>
            <li><strong>Impacto:</strong> calcule perdas/perigos atuais (perda de receita, reclamações, riscos regulatórios). Use estimativas concretas para priorizar o esforço.</li>
            <li><strong>Usuários/Stakeholders:</strong> liste quem sofre e quem decide. Por exemplo, "Gerentes de loja (decisão), equipe de supply chain (execução), cliente final (afetado)". Isso evita abordagens muito tecnocêntricas.</li>
            <li><strong>Desafio (How Might We):</strong> formule a pergunta central nos moldes sugeridos. Certifique-se de que seja mensurável e alinhada à estratégia. Por exemplo: "Como poderíamos diminuir o churn em 20% nos próximos 12 meses sem aumentar o CAC?".</li>
            <li><strong>Critérios de Sucesso:</strong> defina metas numéricas (ex: tempo médio de atendimento, NPS, ROI mínimo) e horizontes de tempo.</li>
            <li><strong>Restrições/Premissas:</strong> esclareça o que está fixo ("sem investimento extra", "vigente até o fim do ano fiscal", "restrições legais X") e o que será tratado como hipótese.</li>
            <li><strong>Recursos:</strong> liste bases de dados, orçamentos, frameworks ágeis disponíveis, parcerias (ex.: fornecedores, startups, universidades) que podem apoiar o projeto.</li>
            <li><strong>Hipóteses:</strong> anote suposições iniciais ("achamos que falta integração entre sistemas causa o churn").</li>
          </ul>

          <h3 className="mb-3 text-xl font-semibold text-foreground">3. Refinamento</h3>
          <p className="mb-3 leading-relaxed text-foreground/90">Após o preenchimento inicial, revise o conteúdo:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Verifique ambiguidade:</strong> se a pergunta HMW ou outro texto está vago, reescreva mais precisamente. Use auxílio de dados coletados.</li>
            <li><strong>Valide metas:</strong> confirme que os critérios são desafiadores mas alcançáveis, e relevantes para o negócio.</li>
            <li><strong>Objetividade:</strong> elimine jargões e soluções antecipadas no enunciado do desafio.</li>
            <li><strong>Integração:</strong> garanta que cada parte do canvas se conecte (ex.: metas de sucesso refletem impactos descritos).</li>
          </ul>
          <p className="leading-relaxed text-foreground/90">
            Essa etapa pode ser iterativa. O próprio formato de Canvas facilita detectar lacunas: se alguma caixa ficar em branco ou muito genérica, suspeite que mais análise é necessária.
          </p>
        </>
      ),
    },
    {
      heading: "Funcionamento do Challenge Canvas Builder (Aplicativo)",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            O Challenge Canvas Builder é um produto digital desenhado para facilitar exatamente esse processo de elaboração de desafios. Trata-se de um web app responsivo (desktop e tablet) que implementa todos os elementos do Canvas, acrescentando inteligência artificial e ferramentas colaborativas. A seguir, os principais componentes e como usá-los:
          </p>
          <ul className="mb-6 list-disc space-y-3 pl-6 text-foreground/90">
            <li><strong>Autenticação e Dashboard:</strong> Usuários criam conta (email/senha) e acessam um painel com seus projetos. Cada desafio aparece como um cartão com título, data e status (rascunho, em andamento, concluído). É possível criar, editar, duplicar ou excluir desafios.</li>
            <li><strong>Editor de Canvas:</strong> Um formulário dividido em seções corresponde a cada bloco do Challenge Canvas (Contexto, Problema, Impacto etc.). Cada seção tem uma caixa de texto ampla e placeholders de exemplo. O layout é limpo e executivo. Há salvamento automático (autosave) a cada mudança.</li>
            <li>
              <strong>Assistente de IA:</strong> Em cada seção há botões para interação com IA. Principais funções internas:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>"Melhorar com IA":</strong> reescreve o texto atual para ser mais claro, estratégico e conciso.</li>
                <li><strong>"Gerar HMW":</strong> cria ou melhora a pergunta desafio no formato "Como poderíamos…".</li>
                <li><strong>"Sugerir KPIs":</strong> dado o desafio atual, gera uma lista de métricas mensuráveis relevantes.</li>
                <li><strong>"Avaliar Canvas":</strong> analisa todo o conteúdo preenchido. A IA retorna uma pontuação (0–100), classificando o Canvas como "Fraco/Adequado/Estratégico", aponta lacunas principais e sugere melhorias gerais.</li>
              </ul>
            </li>
          </ul>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Essas funções apoiam o problem framing: por exemplo, reformatar o enunciado HMW para maior clareza ou descobrir critérios de sucesso omitidos. O uso de GPT-4/5 garante que as sugestões sejam fundamentadas em boas práticas e dados de gestão.
          </p>
          <ul className="mb-4 list-disc space-y-3 pl-6 text-foreground/90">
            <li><strong>Exportação:</strong> Ao concluir o Canvas, o usuário pode gerar um relatório executivo. Há opções de exportar para PDF ou Word, com layout profissional. Isso facilita compartilhar o desafio com executivos ou em reuniões de estratégia.</li>
            <li>
              <strong>Fluxo de uso típico:</strong>
              <ol className="mt-2 list-decimal space-y-1 pl-6">
                <li>Login no app e criar um novo desafio.</li>
                <li>Preencher inicialmente os blocos principais com informações conhecidas.</li>
                <li>Utilizar o Assistente de IA em cada seção conforme necessário (refinar textos, gerar HMW, KPIs).</li>
                <li>Revisar a avaliação geral da IA, ajustar o Canvas conforme indicado.</li>
                <li>Completar os demais campos (Governança, Entregáveis, Hipóteses).</li>
                <li>Exportar o documento final e apresentar à diretoria ou equipe de projeto.</li>
              </ol>
            </li>
            <li><strong>Integrações Técnicas (Arquitetura):</strong> O backend é baseado em banco de dados PostgreSQL + autenticação. Frontend em React para responsividade. A IA é acessada via chamadas de API. A arquitetura segue o padrão Jamstack/serverless, garantindo escalabilidade e manutenção simplificada. Todo o conteúdo do Canvas fica armazenado no banco de dados em tempo real.</li>
            <li><strong>Colaboração futura:</strong> Na versão inicial (MVP), o foco é no uso individual ou em pequenos grupos que compartilham tela. Futuras versões podem incluir edição simultânea, biblioteca de templates e integração com plataformas de gestão ágil.</li>
          </ul>
        </>
      ),
    },
    {
      heading: "Exemplo Aplicado (caso fictício)",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            <strong>Contexto:</strong> Uma rede de varejo online enfrenta alta taxa de churn (cancelamento de clientes).
          </p>
          <ol className="mb-4 list-decimal space-y-3 pl-6 text-foreground/90">
            <li><strong>Contexto estratégico:</strong> A perda de clientes em 30 dias está em 25%, reduzindo vendas e aumentando custos de aquisição (CAC). A meta corporativa é reter +10% dos clientes anuais e subir NPS de 60 para 75.</li>
            <li><strong>Problema Atual:</strong> Dados internos indicam cancelamentos frequentes por "ruim experiência de checkout" e "entregas atrasadas". Mapeios mostram que 40% dos cancelamentos vêm de 10% dos clientes que compram grande volume.</li>
            <li><strong>Impacto:</strong> Churn atual custa cerca de R$ 2 milhões/ano. Reduzir churn em 10 pontos liberaria esse valor para reinvestir em marketing.</li>
            <li><strong>Stakeholders:</strong> Patrocinador executivo: Diretor de E-commerce. Equipe envolvida: TI (plataforma), UX/design, operações logísticas, BI (dados).</li>
            <li><strong>Desafio (HMW):</strong> "Como poderíamos reduzir o churn em 20% nos próximos 12 meses para compradores recorrentes, sem aumentar o CAC?"</li>
            <li><strong>Sucesso:</strong> Meta: churn mensal ≤15% em 6 meses. Métricas: taxa mensal de retenção, NPS de pós-venda, ROI do programa de retenção.</li>
            <li><strong>Restrições:</strong> Orçamento fixo de R$ 50 mil para MVP no próximo semestre; plataforma atual (no-code) sem modificações de back-end; política de entrega com correio padrão (não aplica frete expresso).</li>
            <li><strong>Recursos:</strong> Base de dados de vendas/histórico, equipe de BI + analista de dados, contrato com empresa de remessa, chatbots de atendimento.</li>
            <li><strong>Hipóteses:</strong> Suspeita-se que simplificar o checkout (menos cliques) e comunicar melhor datas de entrega reduzirá insatisfação.</li>
            <li><strong>Abordagem:</strong> Lançar um sprint de melhoria UX + piloto de comunicação proativa com clientes.</li>
            <li><strong>Governança:</strong> Reuniões quinzenais com CEO; relatório executivo mensal; ajuste de estratégia trimestral.</li>
            <li><strong>Entregáveis:</strong> Protótipo funcional de fluxo de checkout, relatório BI com clusterização de clientes de alto churn, plano de comunicação automação (e-mail/WhatsApp) agendada para 3 meses de teste.</li>
          </ol>
          <p className="leading-relaxed text-foreground/90">
            Este exemplo ilustrativo mostra como o Canvas ajuda a focar no problema (mau design no checkout, logística) e evita pressupor a solução exata de início. No app Challenge Canvas Builder, cada etapa acima seria registrada em seu respectivo campo, com ajuda da IA para refinar o enunciado do problema e sugerir métricas.
          </p>
        </>
      ),
    },
    {
      heading: "Melhores Práticas e Conclusão",
      content: (
        <>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground/90">
            <li>Diferentes pontos de vista garantem que o problema seja bem compreendido.</li>
            <li>Use o Canvas para lutar contra a tendência de "correr para a solução". Desafios adaptativos exigem reflexão iterativa.</li>
            <li>Formule metas claras, mas deixe espaço para criatividade na solução. O formato "Como poderíamos…" ajuda nisso.</li>
            <li>O Challenge Canvas Builder aumenta produtividade, mas o valor vem do pensamento coletivo e do alinhamento estratégico. A IA é um co-piloto para clarificar e criticar, não um substituto do julgamento.</li>
            <li>Mesmo que a solução final mude ou falhe, documentar hipóteses e resultados (no próprio Canvas ou no app) gera conhecimento organizacional.</li>
          </ul>
          <p className="leading-relaxed text-foreground/90">
            Em suma, o Challenge Canvas combina insights de design thinking e inovação aberta para estruturar problemas complexos em desafios mensuráveis. Com a ferramenta digital de apoio, equipes podem criar, iterar e compartilhar esses desafios de forma ágil e colaborativa. Isso aumenta a probabilidade de soluções inovadoras de fato alinhadas à estratégia, evitando esforços dispersos. Como Page (2007) nos lembra, quanto mais diversos e bem definidos os inputs (frames), mais provável encontraremos respostas eficazes.
          </p>
        </>
      ),
    },
  ],
};

const esContent: ManualContent = {
  title: "Manual del Challenge Canvas",
  intro:
    "Este manual presenta la teoría y la práctica del Challenge Canvas – una herramienta de gestión estratégica utilizada para diagnosticar problemas complejos y estructurar desafíos organizacionales de forma colaborativa. Aquí describimos los fundamentos conceptuales (pensamiento de diseño, problem framing, wicked problems, innovación abierta) y detallamos el uso práctico del Canvas, incluyendo el funcionamiento de la aplicación Challenge Canvas Builder. Todo el contenido está fundamentado en referencias académicas (APA 7) para garantizar rigor científico.",
  sections: [
    {
      heading: "Desafíos Complejos y Pensamiento de Diseño",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Los desafíos organizacionales complejos suelen ser <em>wicked problems</em> (problemas perversos): involucran múltiples actores, causas interdependientes, valores conflictivos y consecuencias imprevisibles. Rittel y Webber (1973) observaron que, en estos casos, "no existen soluciones correctas o incorrectas, solo mejores o peores dadas las condiciones actuales". Por eso, los métodos lineales de análisis fallan: es necesario reformular el problema antes de buscar soluciones (el propio problema solo se aclara después de intentos de solución).
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            El campo de la ciencia de la complejidad refuerza esta visión. En el contexto del modelo Cynefin, los problemas complejos exigen un estilo de liderazgo basado en la experimentación: "probe–sense–respond" (explorar, identificar patrones y reaccionar). Esto significa crear prototipos e hipótesis para probar rápidamente, en lugar de intentar planificar todo de antemano.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            El pensamiento de diseño (design thinking) proporciona prácticas clave para esto. Tim Brown (2008) define el design thinking como una disciplina que "usa la sensibilidad y los métodos del diseñador para combinar las necesidades de las personas con lo que es tecnológicamente viable y lo que una estrategia de negocios puede convertir en valor para el cliente". Es decir, se parte de la comprensión profunda del usuario y del contexto antes de concebir soluciones. Kees Dorst (2011) destaca que el núcleo del design thinking es la creación de "frames" (nuevos puntos de vista) para abordar situaciones-problema. Para Dorst, "framing" es justamente la práctica de crear un punto de vista (frame) inédito desde el cual el problema se vuelve abordable. Diseñadores experimentados identifican la paradoja central del desafío (lo que lo hace difícil) y solo después comienzan a buscar soluciones, evitando conclusiones precipitadas. Este proceso creativo (abducción) permite redefinir el problema a medida que se aprende sobre él. En resumen, antes de "ir a la solución", equipos orientados por diseño cuestionan y reformulan el problema, garantizando enfoque en lo que importa.
          </p>
          <p className="leading-relaxed text-foreground/90">
            Otro punto teórico importante es la diversidad cognitiva. Estudios muestran que equipos cognitivamente diversos generan mejores soluciones para problemas complejos que equipos homogéneos, aunque estos sean altamente habilidosos. Scott Page (2007) argumenta que "en la solución de un problema, la diversidad cognitiva puede superar la habilidad". En otras palabras, puntos de vista distintos (de diferentes disciplinas, experiencias o formaciones) enriquecen la definición del problema y elevan el potencial innovador del grupo.
          </p>
        </>
      ),
    },
    {
      heading: "Canvas e Innovación Abierta",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Un Canvas es un cuadro visual compuesto de bloques organizados, ideal para síntesis colaborativa. Como destaca Sneij (2019), un Canvas fuerza la reducción de complejidad a una página, facilitando la comunicación y la identificación de patrones. Herramientas como el Business Model Canvas (Osterwalder) son ejemplos famosos: condensan conceptos clave de negocios en secciones bien definidas. En el mismo espíritu, el Challenge Canvas divide el problema en áreas críticas (contexto, stakeholders, metas, restricciones, etc.), de modo que la relación entre estas partes se vuelve evidente.
          </p>
          <p className="mb-4 leading-relaxed text-foreground/90">
            En los últimos años, la innovación abierta ha hecho al Canvas aún más relevante. Grandes empresas usan desafíos corporativos para atraer startups y socios externos. Pinto y Tamanine (2022) muestran que, en open innovation, sistematizar la información de un desafío en formato visual aumenta la colaboración empresa-startup. Desarrollaron un "Corporate Challenge Canvas" justamente para captar de forma clara la información esencial de un desafío, buscando mejorar el engagement. En suma, el Canvas ayuda a definir y comunicar el problema de manera estructurada tanto internamente como para públicos externos (como posibles solucionadores), aumentando la asertividad de las iniciativas de innovación.
          </p>
          <p className="leading-relaxed text-foreground/90">
            Metodologías consagradas como la Double Diamond (Design Council) también refuerzan la idea de diferenciar fases de descubrimiento (problema) y entrega (solución). El Challenge Canvas actúa en la primera parte: corresponde a la fase "Define" (primer diamante), cuando se reúne empatía e información para clarificar el desafío antes de generar ideas. Así, la formulación adecuada del problema es tan crucial como la solución en sí (Rittel & Webber, 1973).
          </p>
        </>
      ),
    },
    {
      heading: "Estructura del Challenge Canvas",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            El Challenge Canvas generalmente contempla bloques de contenido que ayudan a encuadrar el desafío. Aunque existen variaciones, un modelo amplio puede incluir, por ejemplo:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Contexto Estratégico:</strong> escenario actual, metas corporativas, urgencia e impacto esperado (financiero, cliente, eficiencia).</li>
            <li><strong>Problema Actual:</strong> descripción sintomática de lo que se observa, datos y evidencias, histórico y causas raíz identificadas.</li>
            <li><strong>Impacto:</strong> consecuencias cuantificables del problema (costos, riesgos, métricas clave afectadas).</li>
            <li><strong>Stakeholders/Usuarios:</strong> ¿quién es afectado por el desafío? ¿Quién decide sobre él? ¿Quiénes son patrocinadores o usuarios objetivo?</li>
            <li><strong>Declaración del Desafío:</strong> síntesis en el formato "¿Cómo podríamos [objetivo deseado] para [público/proceso] considerando [restricciones clave]?". Este enunciado (HMW – How Might We) está orientado a resultado, no prescriptivo de solución.</li>
            <li><strong>Criterios de Éxito:</strong> qué indicadores demostrarán que el desafío está bien resuelto (ej: metas numéricas, plazo, ROI mínimo).</li>
            <li><strong>Restricciones y Premisas:</strong> limitaciones presupuestarias, tecnológicas o regulatorias; creencias que no necesitan ser probadas.</li>
            <li><strong>Recursos Disponibles:</strong> datos existentes, infraestructura, equipos dedicados, alianzas externas, etc.</li>
            <li><strong>Hipótesis Iniciales:</strong> posibles causas o soluciones emergentes que serán probadas.</li>
            <li><strong>Enfoque de Solución:</strong> ideas generales de cómo atacar el problema (metodologías a aplicar, tipo de prototipo, frameworks, ej.: design sprint, experimento con algoritmo, etc.).</li>
            <li><strong>Gobernanza:</strong> patrocinador ejecutivo, líderes del proyecto, grupo decisorio y fechas de seguimiento.</li>
            <li><strong>Entregables Esperados:</strong> prototipos, pilotos, business case, documentación final, plan de implementación.</li>
          </ul>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Cada sección debe ser completada colaborativamente (taller u oficina) con texto breve y directo. Ayudas como preguntas guía pueden usarse: por ejemplo, para Contexto, preguntar "¿Por qué este desafío importa ahora?"; para Stakeholders, "¿Quiénes son las partes esenciales para resolver este problema?". En general, se evitan términos vagos (ej: "optimizar proceso X") o soluciones preconcebidas ("usar IA para…"); se busca escritura clara y basada en datos.
          </p>
          <p className="leading-relaxed text-foreground/90">
            <strong>Modelo Visual:</strong> En general, el canvas se presenta en una única página, con cajas distintas para cada bloque. Esto "obliga" al equipo a enfocarse en lo realmente relevante y permite que todos vean de un vistazo cómo se conectan los elementos.
          </p>
        </>
      ),
    },
    {
      heading: "Completando el Challenge Canvas",
      content: (
        <>
          <h3 className="mb-3 text-xl font-semibold text-foreground">1. Preparación</h3>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Forme un equipo multidisciplinario:</strong> incluya personas de negocio, técnica (TI/datos), marketing/usuario, finanzas, etc. La diversidad de competencias enriquece la definición del problema.</li>
            <li><strong>Recolecte datos e insights:</strong> reúna indicadores actuales (KPIs), feedback de clientes, entrevistas con stakeholders, análisis de proceso y causas raíz (ej: 5 Whys, Diagrama de Ishikawa).</li>
            <li><strong>Contextualice estratégicamente:</strong> entienda cómo el desafío se inserta en la estrategia mayor de la organización (ventaja competitiva, metas de innovación, presiones externas). Esto refuerza la relevancia y dirige el enfoque.</li>
          </ul>

          <h3 className="mb-3 text-xl font-semibold text-foreground">2. Llenado Colaborativo</h3>
          <p className="mb-3 leading-relaxed text-foreground/90">Use el canvas como una guía dinámica. Por ejemplo:</p>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Contexto Estratégico:</strong> registre metas e impactos esperados. Ej: "Reducir rupturas de stock en 30% para maximizar ingresos del trimestre."</li>
            <li><strong>Problema Actual:</strong> describa síntomas claros ("la tasa de churn subió 15% en el último año"), apoyado por datos. Separe síntomas de posibles causas.</li>
            <li><strong>Impacto:</strong> calcule pérdidas/peligros actuales (pérdida de ingresos, reclamaciones, riesgos regulatorios). Use estimaciones concretas para priorizar el esfuerzo.</li>
            <li><strong>Usuarios/Stakeholders:</strong> liste quién sufre y quién decide. Por ejemplo, "Gerentes de tienda (decisión), equipo de supply chain (ejecución), cliente final (afectado)".</li>
            <li><strong>Desafío (How Might We):</strong> formule la pregunta central. Asegúrese de que sea medible y alineada con la estrategia. Por ejemplo: "¿Cómo podríamos disminuir el churn en 20% en los próximos 12 meses sin aumentar el CAC?".</li>
            <li><strong>Criterios de Éxito:</strong> defina metas numéricas (ej: tiempo medio de atención, NPS, ROI mínimo) y horizontes de tiempo.</li>
            <li><strong>Restricciones/Premisas:</strong> aclare qué está fijo ("sin inversión extra", "vigente hasta fin del año fiscal", "restricciones legales X") y qué se tratará como hipótesis.</li>
            <li><strong>Recursos:</strong> liste bases de datos, presupuestos, frameworks ágiles disponibles, alianzas que puedan apoyar el proyecto.</li>
            <li><strong>Hipótesis:</strong> anote suposiciones iniciales ("creemos que la falta de integración entre sistemas causa el churn").</li>
          </ul>

          <h3 className="mb-3 text-xl font-semibold text-foreground">3. Refinamiento</h3>
          <p className="mb-3 leading-relaxed text-foreground/90">Después del llenado inicial, revise el contenido:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Verifique ambigüedad:</strong> si la pregunta HMW u otro texto está vago, reescriba más precisamente. Use ayuda de datos recolectados.</li>
            <li><strong>Valide metas:</strong> confirme que los criterios son desafiantes pero alcanzables, y relevantes para el negocio.</li>
            <li><strong>Objetividad:</strong> elimine jerga y soluciones anticipadas en el enunciado del desafío.</li>
            <li><strong>Integración:</strong> garantice que cada parte del canvas se conecte (ej.: metas de éxito reflejan impactos descritos).</li>
          </ul>
          <p className="leading-relaxed text-foreground/90">
            Esta etapa puede ser iterativa. El propio formato de Canvas facilita detectar lagunas: si alguna caja queda en blanco o muy genérica, sospeche que más análisis es necesario.
          </p>
        </>
      ),
    },
    {
      heading: "Funcionamiento del Challenge Canvas Builder (Aplicación)",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            El Challenge Canvas Builder es un producto digital diseñado para facilitar exactamente este proceso de elaboración de desafíos. Se trata de una web app responsiva (escritorio y tablet) que implementa todos los elementos del Canvas, agregando inteligencia artificial y herramientas colaborativas. A continuación, los principales componentes y cómo usarlos:
          </p>
          <ul className="mb-6 list-disc space-y-3 pl-6 text-foreground/90">
            <li><strong>Autenticación y Dashboard:</strong> Los usuarios crean cuenta (email/contraseña) y acceden a un panel con sus proyectos. Cada desafío aparece como una tarjeta con título, fecha y estado (borrador, en desarrollo, finalizado). Es posible crear, editar, duplicar o eliminar desafíos.</li>
            <li><strong>Editor de Canvas:</strong> Un formulario dividido en secciones corresponde a cada bloque del Challenge Canvas (Contexto, Problema, Impacto, etc.). Cada sección tiene un campo de texto amplio y placeholders de ejemplo. El layout es limpio y ejecutivo. Hay guardado automático (autosave) en cada cambio.</li>
            <li>
              <strong>Asistente de IA:</strong> En cada sección hay botones para interacción con IA. Principales funciones internas:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>"Mejorar con IA":</strong> reescribe el texto actual para ser más claro, estratégico y conciso.</li>
                <li><strong>"Generar HMW":</strong> crea o mejora la pregunta desafío en el formato "¿Cómo podríamos…?".</li>
                <li><strong>"Sugerir KPIs":</strong> dado el desafío actual, genera una lista de métricas medibles relevantes.</li>
                <li><strong>"Evaluar Canvas":</strong> analiza todo el contenido completado. La IA retorna una puntuación (0–100), clasificando el Canvas como "Débil/Adecuado/Estratégico", señala lagunas principales y sugiere mejoras generales.</li>
              </ul>
            </li>
          </ul>
          <p className="mb-4 leading-relaxed text-foreground/90">
            Estas funciones apoyan el problem framing: por ejemplo, reformatear el enunciado HMW para mayor claridad o descubrir criterios de éxito omitidos.
          </p>
          <ul className="mb-4 list-disc space-y-3 pl-6 text-foreground/90">
            <li><strong>Exportación:</strong> Al concluir el Canvas, el usuario puede generar un informe ejecutivo. Hay opciones de exportar a PDF o Word, con layout profesional. Esto facilita compartir el desafío con ejecutivos o en reuniones de estrategia.</li>
            <li>
              <strong>Flujo de uso típico:</strong>
              <ol className="mt-2 list-decimal space-y-1 pl-6">
                <li>Login en la app y crear un nuevo desafío.</li>
                <li>Llenar inicialmente los bloques principales con información conocida.</li>
                <li>Utilizar el Asistente de IA en cada sección según sea necesario (refinar textos, generar HMW, KPIs).</li>
                <li>Revisar la evaluación general de la IA, ajustar el Canvas según lo indicado.</li>
                <li>Completar los demás campos (Gobernanza, Entregables, Hipótesis).</li>
                <li>Exportar el documento final y presentar a la dirección o equipo de proyecto.</li>
              </ol>
            </li>
            <li><strong>Integraciones Técnicas (Arquitectura):</strong> El backend está basado en base de datos PostgreSQL + autenticación. Frontend en React para responsividad. La IA se accede mediante llamadas de API. La arquitectura sigue el patrón Jamstack/serverless, garantizando escalabilidad y mantenimiento simplificado.</li>
            <li><strong>Colaboración futura:</strong> En la versión inicial (MVP), el foco es en uso individual o en pequeños grupos que comparten pantalla. Futuras versiones pueden incluir edición simultánea, biblioteca de templates e integración con plataformas de gestión ágil.</li>
          </ul>
        </>
      ),
    },
    {
      heading: "Ejemplo Aplicado (caso ficticio)",
      content: (
        <>
          <p className="mb-4 leading-relaxed text-foreground/90">
            <strong>Contexto:</strong> Una red de retail online enfrenta alta tasa de churn (cancelación de clientes).
          </p>
          <ol className="mb-4 list-decimal space-y-3 pl-6 text-foreground/90">
            <li><strong>Contexto estratégico:</strong> La pérdida de clientes en 30 días está en 25%, reduciendo ventas y aumentando costos de adquisición (CAC). La meta corporativa es retener +10% de los clientes anuales y subir NPS de 60 a 75.</li>
            <li><strong>Problema Actual:</strong> Datos internos indican cancelaciones frecuentes por "mala experiencia de checkout" y "entregas atrasadas". Mapeos muestran que 40% de las cancelaciones vienen del 10% de los clientes que compran gran volumen.</li>
            <li><strong>Impacto:</strong> El churn actual cuesta cerca de R$ 2 millones/año. Reducir churn en 10 puntos liberaría ese valor para reinvertir en marketing.</li>
            <li><strong>Stakeholders:</strong> Patrocinador ejecutivo: Director de E-commerce. Equipo involucrado: TI (plataforma), UX/diseño, operaciones logísticas, BI (datos).</li>
            <li><strong>Desafío (HMW):</strong> "¿Cómo podríamos reducir el churn en 20% en los próximos 12 meses para compradores recurrentes, sin aumentar el CAC?"</li>
            <li><strong>Éxito:</strong> Meta: churn mensual ≤15% en 6 meses. Métricas: tasa mensual de retención, NPS de postventa, ROI del programa de retención.</li>
            <li><strong>Restricciones:</strong> Presupuesto fijo de R$ 50 mil para MVP en el próximo semestre; plataforma actual (no-code) sin modificaciones de back-end; política de entrega con correo estándar.</li>
            <li><strong>Recursos:</strong> Base de datos de ventas/historial, equipo de BI + analista de datos, contrato con empresa de envío, chatbots de atención.</li>
            <li><strong>Hipótesis:</strong> Se sospecha que simplificar el checkout (menos clics) y comunicar mejor fechas de entrega reducirá insatisfacción.</li>
            <li><strong>Enfoque:</strong> Lanzar un sprint de mejora UX + piloto de comunicación proactiva con clientes.</li>
            <li><strong>Gobernanza:</strong> Reuniones quincenales con CEO; informe ejecutivo mensual; ajuste de estrategia trimestral.</li>
            <li><strong>Entregables:</strong> Prototipo funcional de flujo de checkout, informe BI con clusterización de clientes de alto churn, plan de comunicación automatizada (email/WhatsApp) programada para 3 meses de prueba.</li>
          </ol>
          <p className="leading-relaxed text-foreground/90">
            Este ejemplo ilustrativo muestra cómo el Canvas ayuda a enfocarse en el problema (mal diseño en el checkout, logística) y evita presuponer la solución exacta desde el inicio.
          </p>
        </>
      ),
    },
    {
      heading: "Mejores Prácticas y Conclusión",
      content: (
        <>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground/90">
            <li>Diferentes puntos de vista garantizan que el problema sea bien comprendido.</li>
            <li>Use el Canvas para luchar contra la tendencia de "correr hacia la solución". Desafíos adaptativos exigen reflexión iterativa.</li>
            <li>Formule metas claras, pero deje espacio para creatividad en la solución. El formato "¿Cómo podríamos…?" ayuda en eso.</li>
            <li>El Challenge Canvas Builder aumenta la productividad, pero el valor viene del pensamiento colectivo y la alineación estratégica. La IA es un copiloto para clarificar y criticar, no un sustituto del juicio.</li>
            <li>Aunque la solución final cambie o falle, documentar hipótesis y resultados (en el propio Canvas o en la app) genera conocimiento organizacional.</li>
          </ul>
          <p className="leading-relaxed text-foreground/90">
            En suma, el Challenge Canvas combina insights de design thinking e innovación abierta para estructurar problemas complejos en desafíos medibles. Con la herramienta digital de apoyo, equipos pueden crear, iterar y compartir estos desafíos de forma ágil y colaborativa. Esto aumenta la probabilidad de soluciones innovadoras de hecho alineadas con la estrategia, evitando esfuerzos dispersos. Como Page (2007) nos recuerda, cuanto más diversos y bien definidos los inputs (frames), más probable será encontrar respuestas eficaces.
          </p>
        </>
      ),
    },
  ],
};

const references = [
  'Brown, T. (2008). Design thinking. Harvard Business Review, 86(6), 84–92.',
  'Chesbrough, H. W. (2003). Open innovation: The new imperative for creating and profiting from technology. Harvard Business School Press.',
  'Dorst, K. (2011). The core of "design thinking" and its application. Design Studies, 32(6), 521–532. https://doi.org/10.1016/j.destud.2011.07.006',
  'Page, S. E. (2007). The difference: How the power of diversity creates better groups, firms, schools, and societies. Princeton University Press.',
  'Pinto, T. d. C. L., & Tamanine, A. M. B. (2022). Corporate challenge canvas: Visual tool to systematize open innovation challenges. Revista Brasileira de Gestão e Inovação, 10(1), 146–170. https://doi.org/10.18226/23190639.v10n1.07',
  'Rittel, H. W. J., & Webber, M. M. (1973). Dilemmas in a general theory of planning. Policy Sciences, 4(2), 155–169. https://doi.org/10.1007/BF01405730',
  'Snowden, D. J., & Boone, M. E. (2007). A leader\'s framework for decision making. Harvard Business Review, 85(11), 68–76.',
  'Sneij, J. (2019). The challenge canvas — Find focus before designing into the wild. Medium. https://medium.com/swlh/the-challenge-canvas-822c00750e32',
];

const Manual = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const content = getContent(language);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("dashboard")}
        </Button>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          {/* Header */}
          <div className="mb-10 flex items-center gap-4 border-b border-border pb-6">
            <img src={logo} alt="Diocélio Goulart" className="h-14" />
            <div>
              <h1 className="mb-1 text-3xl font-bold text-foreground sm:text-4xl">
                {content.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                dioceliogoulart.com.br
              </p>
            </div>
          </div>

          {/* Intro */}
          <section className="mb-10 rounded-lg border border-border bg-muted/30 p-6">
            <p className="text-base leading-relaxed text-foreground">
              {content.intro}
            </p>
          </section>

          {/* Sections */}
          {content.sections.map((s, i) => (
            <section key={i} className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                {s.heading}
              </h2>
              {s.content}
            </section>
          ))}

          {/* References */}
          <section className="mb-10 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              {language === "es" ? "Referencias (APA 7)" : "Referências (APA 7)"}
            </h2>
            <ul className="list-none space-y-3 pl-0 text-sm text-foreground/80">
              {references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ul>
          </section>

          {/* Footer credits */}
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>Challenge Canvas Builder · dioceliogoulart.com.br</p>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Manual;
