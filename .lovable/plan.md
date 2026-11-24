# Gravar entrevista e preencher o canvas automaticamente

## O que o usuário vai ver
1. No editor do canvas, um botão novo **"Gravar entrevista"** no topo, também oferecido quando o canvas é aberto vazio.
2. Uma janela de gravação com cronômetro, botões Pausar, Retomar e Finalizar. Também dá para **enviar um arquivo de áudio** já gravado (mp3, m4a, wav, webm).
3. Ao finalizar, o app mostra "Transcrevendo..." e depois a **transcrição completa**, que pode ser corrigida à mão.
4. Botão **"Preencher canvas"**: a IA lê a transcrição e propõe o texto dos 12 campos.
5. Uma tela de revisão mostra, campo a campo, o texto atual e o proposto. O usuário escolhe **Substituir**, **Acrescentar** ou **Ignorar** para cada campo (ou para todos), e só então aplica.
6. A transcrição fica salva no canvas, para consulta e para preencher de novo depois.
7. Tudo em português, espanhol e inglês. Quem só pode visualizar o canvas não vê o botão.

## Como funciona
- **Transcrição:** Gemini, com a chave Gemini já usada no infográfico (o Claude não transcreve áudio). O idioma da tela orienta a transcrição.
- **Preenchimento dos campos:** Claude Sonnet 5.5, com a chave anthropic_challenge_canvas, igual ao "Melhorar com IA". Texto simples, sem Markdown. Campos sem informação na entrevista ficam vazios em vez de inventados.
- **Painel de administração:** as duas novas chamadas aparecem com uso, erros, tokens e custo, como as demais.
- Limite inicial: entrevistas de até 60 minutos / 20 MB por arquivo; acima disso o app avisa.

## Atenção
- Na última verificação, os créditos da conta Gemini estavam esgotados. Sem créditos, a transcrição mostra um aviso claro e não funciona até recarregar.
- O áudio não é guardado depois da transcrição; só o texto fica salvo.

## Detalhes técnicos
- Gravação com MediaRecorder (webm/opus) no navegador; upload por arquivo também.
- Nova função de backend `transcribe-interview`: valida login e acesso (dono ou editor), limite de tamanho, envia o áudio ao Gemini (`gemini-2.5-flash`, inline base64 ou File API para arquivos grandes) e registra telemetria via `monitoredFetch` (operation `transcribe-interview`).
- Nova função `fill-canvas`: recebe transcrição + idioma, chama `callClaude` pedindo JSON com as 12 chaves de `CanvasFields`, valida o JSON e devolve; operation `fill-canvas` na telemetria.
- Migração: coluna `interview_transcript text` em `challenges` (RLS existente já cobre dono/editor).
- Componente `InterviewDialog.tsx` (gravar/enviar → transcrição editável → revisão por campo), integrado ao `CanvasEditor.tsx`; tipos e `useChallenges` atualizados; traduções PT/ES/EN; preço do modelo Gemini de transcrição na tabela de preços.
- Teste: regra de mesclagem Substituir/Acrescentar/Ignorar.
