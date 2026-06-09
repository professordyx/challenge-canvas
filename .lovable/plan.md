Diagnóstico atual:
- O preview carregou corretamente no teste automatizado da rota `/`.
- Não há erros de runtime registrados.
- O servidor Vite está ativo.
- O único erro no console é um 502 do endpoint interno de telemetria do preview (`/__l5e/trackevents`), que não bloqueia o app.
- Há um aviso de CSS: `@import must precede all other statements`, vindo de `src/index.css`. Isso não explica a tela branca sozinho, mas deve ser corrigido para evitar comportamento inconsistente.

Plano de correção:
1. Ajustar `src/index.css` para mover o `@import` do Google Fonts para antes das diretivas `@tailwind`, eliminando o aviso do Vite.
2. Revisar rapidamente o ponto de entrada (`src/main.tsx`) e a árvore de providers (`src/App.tsx`) para garantir que `LanguageProvider`, `HelmetProvider`, `BrowserRouter` e os providers de auth/desafios estejam em ordem segura.
3. Reiniciar o preview/dev server após a alteração para limpar qualquer estado HMR/cache antigo.
4. Validar no preview as rotas principais:
   - `/`
   - `/auth`
   - `/guides/problem-statement-template`
5. Se o preview carregar, confirmar que a tela branca era causada por estado antigo do preview/cache e pelo aviso de CSS pendente; se ainda falhar, capturar os novos logs do console e rede para identificar o erro real.