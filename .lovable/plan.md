# Plano Gratuito e Premium (USD 5/mês) + nova página inicial

## Regras dos planos
**Gratuito**
- 1 canvas novo por mês (mês do calendário)
- 1 avaliação com IA por mês
- 1 infográfico por mês
- Bloqueados: gravador de entrevista e "Melhorar com IA"

**Premium (USD 5,00/mês, assinatura mensal)**
- Canvas ilimitados (interpretamos "limitados" como "ilimitados" — corrija se não for isso)
- Avaliações e infográficos ilimitados
- Gravador de entrevista e "Melhorar com IA" liberados
- Administrador sempre tem acesso Premium

Canvas compartilhados com o usuário não contam no limite dele. Canvas já existentes continuam acessíveis.

## Pagamentos
- Primeiro rodamos a verificação de qual provedor de pagamento integrado é mais adequado (Paddle ou Stripe) e pedimos sua confirmação antes de ativar.
- Ambiente de teste é criado na hora; receber dinheiro real exige verificação/conta do provedor.
- Criamos o produto "Premium" a USD 5/mês, página de checkout e área "Minha assinatura" (cancelar/gerenciar).

## Experiência no app
- Selo do plano no topo e contador de uso ("1 de 1 avaliações este mês") no painel e no editor.
- Botões bloqueados mostram cadeado e abrem uma janela "Seja Premium" com o botão de assinar.
- Ao atingir um limite, aviso claro com convite para o Premium.
- Tudo em português, espanhol e inglês.

## Nova página inicial
- Topo mais visual: título forte, ilustração/mockup do canvas, botões "Começar grátis" e "Ver Premium".
- Seção "Como funciona" em 3 passos (entrevista → canvas → avaliação/infográfico).
- Galeria de recursos com ícones (assistente de IA, gravação de entrevista, avaliação, infográfico, PDF, compartilhamento).
- Tabela comparativa Gratuito x Premium com preço destacado.
- Perguntas frequentes e chamada final. Mantém identidade challenge canvas (navy/teal, Exo 2 + Inter).

## Detalhes técnicos
- Tabela de assinaturas atualizada pelo webhook do provedor; função no banco `get_plan_usage()` calcula uso mensal (canvas criados, avaliações e infográficos via api_usage_logs com sucesso).
- Limites aplicados no servidor: trigger em `challenges` bloqueia insert acima do limite gratuito; edge functions `evaluate-canvas`, `generate-infographic`, `improve-section`, `transcribe-interview`, `fill-canvas` checam plano antes de chamar a IA (retorno 200 com `{error, upgrade:true}`).
- Hook `usePlan` no frontend só para exibição; a autoridade é o servidor.
- Testes de regra: limites 1/1/1 do gratuito e liberação total do premium.
- Salvar as regras de planos na memória do projeto.
