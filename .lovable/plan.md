# Agente de suporte com chat flutuante

Observação: este app não roda na Base44, então o agente será criado com as ferramentas que ele já usa: Claude Sonnet 5.5 (chave anthropic_challenge_canvas), banco de dados e funções do Lovable Cloud.

## O que o usuário verá
- Um botão flutuante de ajuda no canto inferior direito, em todas as telas que exigem login (painel, canvas, assinatura, manual, admin).
- Ao clicar, abre uma janela (no celular, ocupa a tela toda) com:
  - lista de conversas anteriores e botão "Nova conversa";
  - mensagens com respostas da IA aparecendo enquanto são escritas;
  - um botão "Falar com uma pessoa".
- As conversas ficam salvas na conta: fechar e reabrir o chat (ou o navegador) retoma onde parou.
- Textos em português, espanhol e inglês, com a identidade visual do Challenge Canvas.

## Como o agente responde
- Responde dúvidas frequentes e ajuda a resolver problemas comuns usando um guia de suporte embutido: criar/editar/compartilhar canvas, salvamento automático, avaliação, infográfico, gravação de entrevista, microfone, PDF, planos Gratuito/Premium, limites mensais, assinatura e cancelamento, login.
- Usa como contexto a conversa atual e um resumo curto das conversas anteriores do próprio usuário. Ele não tem acesso a canvas, pagamentos nem a outros dados do usuário.
- Responde no idioma escolhido pelo usuário, em texto simples.

## Encaminhamento para suporte humano
- Acontece quando o usuário pede uma pessoa ou quando o agente percebe que não consegue resolver.
- O app registra uma solicitação com o assunto, um resumo feito pela IA e a conversa recente, e mostra no chat:
  - um cartão "Solicitação registrada nº ..." com o status;
  - o contato humano: diocelio@bluestars.com.br.
- No painel de administração, uma nova aba "Suporte" lista as solicitações (e-mail do usuário, resumo, data, link para a conversa), e o administrador pode marcar como "aberta", "em andamento" ou "resolvida".
- Nenhum e-mail é enviado automaticamente; as solicitações só aparecem no painel.

## Detalhes técnicos
- Tabelas: `support_conversations` (user_id, title, updated_at), `support_messages` (conversation_id, role, content), `support_requests` (user_id, conversation_id, summary, transcript_excerpt, status). Permissões: o usuário só lê e escreve as próprias conversas; quem lê as solicitações e muda o status é só o administrador (`has_role`). Com GRANTs e políticas de acesso.
- Realtime ativado em `support_messages`, filtrado pela conversa aberta, para atualizar em outras abas/aparelhos.
- Função `support-chat`: confere o login e se a conversa pertence ao usuário, limita o tamanho das mensagens, salva a mensagem do usuário, chama o Claude por streaming com o guia + histórico (últimas ~30 mensagens + títulos/resumos das conversas anteriores) e salva a resposta completa. O modelo retorna um marcador de "encaminhar" que cria a solicitação no servidor. Usa o monitoramento de uso da API (nova operação `support-chat`, ajustando a restrição de operações e os filtros do painel).
- O chat de suporte não conta nos limites do plano Gratuito.
- Frontend: `SupportWidget` montado em `ProtectedRoute`, conversa ativa guardada na conta (reabre a mais recente), mensagens renderizadas como texto simples, foco no campo de texto.
- Testes: dono da conversa/acesso e a regra de quando a solicitação é criada (helper puro), mais teste manual completo: duas conversas, recarregar e encaminhar.
- Registrar uma regra no AGENTS.md sobre o isolamento dos dados do suporte.
