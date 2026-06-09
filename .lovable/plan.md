## Diagnóstico

- A tela branca acontece no navegador/domínio publicado porque o bundle publicado está inicializando o cliente do backend sem `VITE_SUPABASE_URL`, gerando: `supabaseUrl is required`.
- O preview local está ok porque nele as variáveis existem.
- O erro de IA não é sobrecarga temporária: os logs da função mostram `RESOURCE_EXHAUSTED` e `Your prepayment credits are depleted`, ou seja, os créditos da chave `Gemini_API_KEY` acabaram.

## Plano de correção

1. **Tela branca no navegador publicado**
   - Ajustar a inicialização do cliente do backend para ter fallback seguro com a URL e chave pública do projeto quando as variáveis `VITE_` não forem injetadas no ambiente publicado.
   - Aplicar o mesmo fallback no botão “melhorar seção”, que hoje chama a função usando `import.meta.env.VITE_SUPABASE_URL` diretamente.
   - Manter a chave pública apenas no frontend; nenhuma chave privada será exposta.

2. **Erro de IA “sobrecarregada”**
   - Alterar a função `improve-section` para identificar quando o Gemini retorna crédito/quota esgotada (`RESOURCE_EXHAUSTED`, `prepayment credits are depleted`, 429).
   - Trocar a mensagem genérica por uma mensagem clara em PT/ES: créditos da IA esgotados e necessidade de recarregar/atualizar a chave Gemini.
   - Opcionalmente, se você aprovar, posso também migrar essa função de texto para Lovable AI como fallback, mas isso contraria a memória atual do projeto que diz para usar Gemini direto via `Gemini_API_KEY`; por isso a correção padrão será explicitar o erro real.

3. **Publicação/validação**
   - Depois das alterações, testar `/`, `/auth` e `/canvas/...` no preview.
   - Implantar a função `improve-section` atualizada.
   - Você precisará publicar o app novamente para o domínio `challengecanvas.com` receber a correção do bundle frontend.