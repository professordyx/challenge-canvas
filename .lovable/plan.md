# Email do usuário e custo estimado no painel de Administração

## O que muda para você
- Cada linha do histórico mostra o **email** de quem usou a IA (hoje só existe um código interno do usuário).
- Novo filtro/busca por email.
- Nova tabela "Uso por usuário": email, nº de chamadas, erros, tokens e **custo estimado em US$**.
- Cartão de total com **custo estimado** do período, separado por Anthropic e Gemini.
- Aviso no painel: valores são estimativas pela tabela de preços configurada; a fatura real vem das contas Anthropic/Google.

## Como o custo é estimado
- Custo = tokens de entrada x preço de entrada + tokens de saída x preço de saída, por modelo.
- Infográfico (Gemini imagem): preço por imagem gerada com sucesso.
- Tabela de preços editável pelo administrador no próprio painel (por modelo, em US$ por 1 milhão de tokens / por imagem), preenchida inicialmente com os preços públicos atuais de cada modelo — você confere e ajusta.
- Chamadas sem contagem de tokens (erros) contam custo zero.

## Detalhes técnicos
- Nova tabela `api_model_prices` (model, input_per_mtok, output_per_mtok, per_image, updated_at), RLS: só admin lê/edita via `has_role`.
- Atualizar a função agregadora do painel (security definer, checa admin) para juntar `api_usage_logs` com `auth.users.email` e `api_model_prices`, retornando totais, custo por provedor e agregados por usuário.
- Histórico paginado passa a vir de função security definer que inclui o email (emails nunca expostos a não-admins).
- `src/pages/Admin.tsx`: coluna email, filtro por email, tabela por usuário, cartões de custo, editor de preços; textos PT/ES.
- Testes: cálculo de custo (tokens x preço, imagem, erro = 0).
