import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/logo-diocelio.png";

const Manual = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
                Manual do Challenge Canvas
              </h1>
              <p className="text-sm text-muted-foreground">
                dioceliogoulart.com.br
              </p>
            </div>
          </div>

          {/* Intro */}
          <section className="mb-10 rounded-lg border border-border bg-muted/30 p-6">
            <p className="text-base leading-relaxed text-foreground">
              Este manual apresenta a teoria e a prática do Challenge Canvas – uma ferramenta de gestão estratégica usada para diagnosticar problemas complexos e estruturar desafios organizacionais de forma colaborativa. Aqui descrevemos os fundamentos conceituais (pensamento de design, problem framing, wicked problems, inovação aberta) e detalhamos o uso prático do Canvas, incluindo o funcionamento do aplicativo Challenge Canvas Builder. Todo o conteúdo é fundamentado em referências acadêmicas (APA 7) para garantir rigor científico.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Desafios Complexos e Pensamento de Design
            </h2>
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
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Canvas e Inovação Aberta
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/90">
              Um Canvas é um quadro visual composto de blocos organizados, ideal para síntese colaborativa. Como destaca Sneij (2019), um Canvas força a redução de complexidade a uma página, facilitando a comunicação e a identificação de padrões. Ferramentas como o Business Model Canvas (Osterwalder) são exemplos famosos: elas condensam conceitos-chave de negócios em seções bem definidas. No mesmo espírito, o Challenge Canvas divide o problema em áreas críticas (contexto, stakeholders, metas, restrições, etc.), de modo que a relação entre essas partes se torna evidente.
            </p>
            <p className="mb-4 leading-relaxed text-foreground/90">
              Nos últimos anos, a inovação aberta tornou o Canvas ainda mais relevante. Grandes empresas usam desafios corporativos para atrair startups e parceiros externos. Pinto e Tamanine (2022) mostram que, em open innovation, sistematizar as informações de um desafio em formato visual aumenta a colaboração empresa-startup. Eles desenvolveram um "Corporate Challenge Canvas" justamente para captar de forma clara as informações essenciais de um desafio, visando melhorar o engajamento. Em suma, o Canvas ajuda a definir e comunicar o problema de maneira estruturada tanto internamente quanto para públicos externos (como possíveis solucionadores), aumentando a assertividade das iniciativas de inovação.
            </p>
            <p className="leading-relaxed text-foreground/90">
              Metodologias consagradas como a Double Diamond (Design Council) também reforçam a ideia de diferenciar fases de descoberta (problema) e entrega (solução). O Challenge Canvas atua na primeira parte: ele corresponde à fase "Define" (primeiro diamante), quando se reúne empatia e informações para clarificar o desafio antes de gerar ideias. Assim, a formulação adequada do problema (problema bem articulado) é tão crucial quanto a solução em si (Rittel & Webber, 1973).
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Estrutura do Challenge Canvas
            </h2>
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
          </section>

          {/* Section 4 - Preenchimento */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Preenchendo o Challenge Canvas
            </h2>

            <h3 className="mb-3 text-xl font-semibold text-foreground">1. Preparação</h3>
            <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90">
              <li><strong>Forme uma equipe multidisciplinar:</strong> inclua pessoas de negócio, técnica (TI/dados), marketing/usuário, finanças, etc. A diversidade de competências enriquece a definição do problema.</li>
              <li><strong>Colete dados e insights:</strong> reúna indicadores atuais (KPIs), feedbacks de clientes, entrevistas com stakeholders, análises de processo e causas-raiz (ex: 5 Whys, Diagrama de Ishikawa).</li>
              <li><strong>Contextualize estrategicamente:</strong> entenda como o desafio se insere na estratégia maior da organização (vantagem competitiva, metas de inovação, pressões externas). Isso reforça a relevância e direciona o foco.</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-foreground">2. Preenchimento Colaborativo</h3>
            <p className="mb-3 leading-relaxed text-foreground/90">
              Use o canvas como um guia dinâmico. Por exemplo:
            </p>
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
            <p className="mb-3 leading-relaxed text-foreground/90">
              Após o preenchimento inicial, revise o conteúdo:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-foreground/90">
              <li><strong>Verifique ambiguidade:</strong> se a pergunta HMW ou outro texto está vago, reescreva mais precisamente. Use auxílio de dados coletados.</li>
              <li><strong>Valide metas:</strong> confirme que os critérios são desafiadores mas alcançáveis, e relevantes para o negócio.</li>
              <li><strong>Objetividade:</strong> elimine jargões e soluções antecipadas no enunciado do desafio.</li>
              <li><strong>Integração:</strong> garanta que cada parte do canvas se conecte (ex.: metas de sucesso refletem impactos descritos).</li>
            </ul>
            <p className="leading-relaxed text-foreground/90">
              Essa etapa pode ser iterativa. O próprio formato de Canvas facilita detectar lacunas: se alguma caixa ficar em branco ou muito genérica, suspeite que mais análise é necessária.
            </p>
          </section>

          {/* Section 5 - App */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Funcionamento do Challenge Canvas Builder (Aplicativo)
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/90">
              O Challenge Canvas Builder é um produto digital desenhado para facilitar exatamente esse processo de elaboração de desafios. Trata-se de um web app responsivo (desktop e tablet) que implementa todos os elementos do Canvas, acrescentando inteligência artificial e ferramentas colaborativas. A seguir, os principais componentes e como usá-los:
            </p>
            <ul className="mb-6 list-disc space-y-3 pl-6 text-foreground/90">
              <li><strong>Autenticação e Dashboard:</strong> Usuários criam conta (email/senha) e acessam um painel com seus projetos. Cada desafio aparece como um cartão com título, data e status (rascunho, em andamento, concluído). É possível criar, editar, duplicar ou excluir desafios.</li>
              <li><strong>Editor de Canvas:</strong> Um formulário dividido em seções corresponde a cada bloco do Challenge Canvas (Contexto, Problema, Impacto etc.). Cada seção tem uma caixa de texto ampla e placeholders de exemplo (ex.: "Descreva o contexto e impacto estratégico aqui"). O layout é limpo e executivo (fonte legível, cores neutras). Há salvamento automático (autosave) a cada mudança.</li>
              <li>
                <strong>Assistente de IA:</strong> Em cada seção há botões para interação com IA. Principais funções internas:
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li><strong>"Melhorar com IA":</strong> reescreve o texto atual para ser mais claro, estratégico e conciso. Internamente usa um prompt como "Rewrite this content to be clear, strategic, concise and business-oriented."</li>
                  <li><strong>"Gerar HMW":</strong> cria ou melhora a pergunta desafio no formato "Como poderíamos…". Prompt: "Create a challenge statement using the format: How might we [verbo] [objetivo] for [alvo] considering [restrições]."</li>
                  <li><strong>"Sugerir KPIs":</strong> dado o desafio atual, gera uma lista de métricas mensuráveis relevantes. Prompt: "Suggest measurable business KPIs for this challenge."</li>
                  <li><strong>"Avaliar Canvas":</strong> analisa todo o conteúdo preenchido. A IA retorna uma pontuação (0–100), classificando o Canvas como "Fraco/Adequado/Estratégico", aponta lacunas principais e sugere melhorias gerais. Prompt: "Evaluate the quality of this challenge canvas. Return score 0-100, classification (Weak/Adequate/Strategic), main gaps and suggestions."</li>
                </ul>
              </li>
            </ul>
            <p className="mb-4 leading-relaxed text-foreground/90">
              Essas funções apoiam o problem framing: por exemplo, reformatar o enunciado HMW para maior clareza ou descobrir critérios de sucesso omitidos. O uso de GPT-4/5 garante que as sugestões sejam fundamentadas em boas práticas e dados de gestão.
            </p>
            <ul className="mb-4 list-disc space-y-3 pl-6 text-foreground/90">
              <li><strong>Exportação:</strong> Ao concluir o Canvas, o usuário pode gerar um relatório executivo. Há opções de exportar para PDF ou Word, com layout profissional (uma página de resumo com seções do Canvas formatadas como blocos, logo da empresa, datas e métricas principais). Também há visualização para impressão. Isso facilita compartilhar o desafio com executivos ou em reuniões de estratégia.</li>
              <li>
                <strong>Fluxo de uso típico:</strong>
                <ol className="mt-2 list-decimal space-y-1 pl-6">
                  <li>Login no app e criar um novo desafio.</li>
                  <li>Preencher inicialmente os blocos principais com informações conhecidas.</li>
                  <li>Utilizar o Assistente de IA em cada seção conforme necessário (refinar textos, gerar HMW, KPIs).</li>
                  <li>Revisar a avaliação geral da IA, ajustar o Canvas conforme indicado (por exemplo, "falta especificar restrições" ou "palavras muito vagas").</li>
                  <li>Completar os demais campos (Governança, Entregáveis, Hipóteses).</li>
                  <li>Exportar o documento final e apresentar à diretoria ou equipe de projeto.</li>
                </ol>
              </li>
              <li><strong>Integrações Técnicas (Arquitetura):</strong> O backend pode ser baseado em Supabase (banco de dados PostgreSQL + autenticação) e hospedado no Vercel ou similar. Frontend em React (Next.js) para responsividade. A IA é acessada via chamadas à API da OpenAI (chaves configuráveis). A arquitetura segue o padrão Jamstack/serverless, o que garante escalabilidade e manutenção simplificada. Todo o conteúdo do Canvas fica armazenado no banco de dados em tempo real.</li>
              <li><strong>Colaboração futura:</strong> Na versão inicial (MVP), o foco é no uso individual ou em pequenos grupos que compartilham tela. Futuras versões podem incluir edição simultânea (como em Google Docs), biblioteca de templates (por setor ou tipo de desafio) e integração com plataformas de gestão ágil (p.ex. Jira, Asana) para acompanhar execução das soluções.</li>
            </ul>
          </section>

          {/* Section 6 - Exemplo */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Exemplo Aplicado (caso fictício)
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/90">
              <strong>Contexto:</strong> Uma rede de varejo online enfrenta alta taxa de churn (cancelamento de clientes).
            </p>
            <ol className="mb-4 list-decimal space-y-3 pl-6 text-foreground/90">
              <li><strong>Contexto estratégico:</strong> A perda de clientes em 30 dias está em 25%, reduzindo vendas e aumentando custos de aquisição (CAC). A meta corporativa é reter +10% dos clientes anuais e subir NPS de 60 para 75.</li>
              <li><strong>Problema Atual:</strong> Dados internos indicam cancelamentos frequentes por "ruim experiência de checkout" e "entregas atrasadas". Mapeios mostram que 40% dos cancelamentos vêm de 10% dos clientes que compram grande volume.</li>
              <li><strong>Impacto:</strong> Churn atual custa cerca de R$ 2 milhões/ano. Reduzir churn em 10 pontos liberaria esse valor para reinvestir em marketing.</li>
              <li><strong>Stakeholders:</strong> Patrocinador executivo: Diretor de E-commerce. Equipe envolvida: TI (plataforma), UX/design, operações logísticas, BI (dados).</li>
              <li><strong>Desafio (HMW):</strong> "Como poderíamos reduzir o churn em 20% nos próximos 12 meses para compradores recorrentes, sem aumentar o CAC?" – aqui o "como poderíamos" busca solução.</li>
              <li><strong>Sucesso:</strong> Meta: churn mensal ≤15% em 6 meses. Métricas: taxa mensal de retenção, NPS de pós-venda, ROI do programa de retenção.</li>
              <li><strong>Restrições:</strong> Orçamento fixo de R$ 50 mil para MVP no próximo semestre; plataforma atual (no-code) sem modificações de back-end; política de entrega com correio padrão (não aplica frete expresso).</li>
              <li><strong>Recursos:</strong> Base de dados de vendas/histórico, equipe de BI + analista de dados, contrato com empresa de remessa, chatbots de atendimento.</li>
              <li><strong>Hipóteses:</strong> Suspeita-se que simplificar o checkout (menos cliques) e comunicar melhor datas de entrega reduzirá insatisfação.</li>
              <li><strong>Abordagem:</strong> Lançar um sprint de melhoria UX + piloto de comunicação proativa com clientes.</li>
              <li><strong>Governança:</strong> Reuniões quinzenais com CEO; relatório executivo mensal; ajuste de estratégia trimestral.</li>
              <li><strong>Entregáveis:</strong> Protótipo funcional de fluxo de checkout, relatório BI com clusterização de clientes de alto churn, plano de comunicação automação (e-mail/WhatsApp) agendada para 3 meses de teste.</li>
            </ol>
            <p className="leading-relaxed text-foreground/90">
              Este exemplo ilustrativo mostra como o Canvas ajuda a focar no problema (mau design no checkout, logística) e evita pressupor a solução exata de início. No app Challenge Canvas Builder, cada etapa acima seria registrada em seu respectivo campo, com ajuda da IA para refinar o enunciado do problema e sugerir métricas (ex: "Leve tempo médio de compra" ou "Taxa de abandono de carrinho" como KPIs).
            </p>
          </section>

          {/* Section 7 - Best Practices */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Melhores Práticas e Conclusão
            </h2>
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
          </section>

          {/* References */}
          <section className="mb-10 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Referências (APA 7)
            </h2>
            <ul className="list-none space-y-3 pl-0 text-sm text-foreground/80">
              <li>Brown, T. (2008). Design thinking. <em>Harvard Business Review</em>, 86(6), 84–92.</li>
              <li>Chesbrough, H. W. (2003). <em>Open innovation: The new imperative for creating and profiting from technology</em>. Harvard Business School Press.</li>
              <li>Dorst, K. (2011). The core of "design thinking" and its application. <em>Design Studies</em>, 32(6), 521–532. https://doi.org/10.1016/j.destud.2011.07.006</li>
              <li>Page, S. E. (2007). <em>The difference: How the power of diversity creates better groups, firms, schools, and societies</em>. Princeton University Press.</li>
              <li>Pinto, T. d. C. L., & Tamanine, A. M. B. (2022). Corporate challenge canvas: Visual tool to systematize open innovation challenges. <em>Revista Brasileira de Gestão e Inovação</em>, 10(1), 146–170. https://doi.org/10.18226/23190639.v10n1.07</li>
              <li>Rittel, H. W. J., & Webber, M. M. (1973). Dilemmas in a general theory of planning. <em>Policy Sciences</em>, 4(2), 155–169. https://doi.org/10.1007/BF01405730</li>
              <li>Snowden, D. J., & Boone, M. E. (2007). A leader's framework for decision making. <em>Harvard Business Review</em>, 85(11), 68–76.</li>
              <li>Sneij, J. (2019). The challenge canvas — Find focus before designing into the wild. <em>Medium</em>. https://medium.com/swlh/the-challenge-canvas-822c00750e32</li>
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
