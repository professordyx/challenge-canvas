## Objetivo

Trocar o Gemini pela API da Anthropic (Claude Sonnet 5.5) nas funções "Melhorar com IA" e "Avaliar canvas com IA". O infográfico continua no Gemini (Nano Banana Pro).

## Passos

1. **Chave da Anthropic**
   - Usar a chave já salva como `anthropic_challenge_canvas` (só fica no servidor, nunca no navegador).

2. **Melhorar com IA (`improve-section`)**
   - Chamar a API de mensagens da Anthropic com streaming, usando o Claude Sonnet 5.5.
   - Converter o streaming do Claude para o formato que a tela já usa, assim o texto continua aparecendo aos poucos.
   - Manter o mesmo prompt (texto puro, sem Markdown, PT/ES), o login obrigatório e as validações.
   - Mensagens claras em PT/ES para falta de crédito, limite de uso e chave inválida.

3. **Avaliar canvas (`evaluate-canvas`)**
   - Mesma troca para o Claude Sonnet 5.5 (sem streaming), mantendo o formato JSON de nota, nível, seções e recomendações.
   - Erros retornados como mensagem amigável em vez de tela de erro.

4. **Memória do projeto**
   - Atualizar a regra "Gemini direto": texto e avaliação usam Anthropic via `anthropic_challenge_canvas`; o infográfico continua no Gemini via `Gemini_API_KEY`.

5. **Validação**
   - Publicar as duas funções e testar cada uma com um usuário logado e um canvas real.

## Detalhes técnicos

- Endpoint: `https://api.anthropic.com/v1/messages`, headers `x-api-key`, `anthropic-version: 2023-06-01`; prompt de sistema no campo `system`.
- Streaming: ler eventos `content_block_delta` (`delta.text`) e reemitir como `choices[0].delta.content` + `[DONE]`.
- O ID exato do modelo "Claude Sonnet 5.5" será conferido na documentação da Anthropic ao implementar; se não estiver disponível na conta, uso o Sonnet mais recente e aviso.
- Nenhuma mudança na tela é necessária.

## Observação

Os mesmos modelos Claude também já estão disponíveis embutidos no app, pagos pelos créditos do workspace, sem chave separada e com registro de uso e limites. Sigo com a sua chave da Anthropic, a menos que prefira essa opção.
