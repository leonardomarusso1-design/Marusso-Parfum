# Marusso Parfum — Extensão Chrome

## Como instalar

1. Abra o Chrome e vá em `chrome://extensions`
2. Ative **Modo do desenvolvedor** (toggle no canto superior direito)
3. Clique em **"Carregar sem compactação"**
4. Selecione a pasta `chrome-extension` do projeto

## Como configurar

1. Clique no ícone roxo 🌸 na barra do Chrome
2. Clique em ⚙️ (configurações)
3. Cole:
   - **URL da API:** `https://marusso-parfum.vercel.app`
   - **API Secret:** `12e8e7c07cd6672f42ceccc20580a8616ae7892726951d90`
4. Salvar

## Como usar

1. Abra qualquer produto da sua lista de afiliados no Mercado Livre
2. Um botão roxo **"🌸 Adicionar ao Marusso"** aparece no canto inferior direito
3. Clique no botão — ele captura: título, preço, fotos, avaliação, depoimentos
4. Na extensão (popup), cole seu **link de afiliado** (meli.la/...)
5. Escolha a categoria e clique **"Adicionar ao site"**
6. O produto aparece em segundos em marusso-parfum.vercel.app ✅

## Sync automático de estoque

A API verifica os links a cada 6h via Vercel Cron.
Se um produto esgotar no ML, ele some automaticamente do site.
