# Guia de Integração - Google Analytics e Facebook Pixel

## 📊 Visão Geral

Este site está pronto para integração com **Google Analytics** e **Facebook Pixel** para rastreamento de conversões e otimização de campanhas.

---

## 🔧 Configuração do Google Analytics

### Passo 1: Criar uma Propriedade no Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Clique em **"Criar"** → **"Propriedade"**
3. Preencha os dados:
   - **Nome da Propriedade:** Perfumes Árabes Originais
   - **Fuso Horário:** (Seu país)
   - **Moeda:** BRL (Real Brasileiro)
4. Clique em **"Criar"**

### Passo 2: Obter o ID de Rastreamento

1. Na propriedade criada, vá para **"Admin"** (engrenagem)
2. Clique em **"Detalhes da Propriedade"**
3. Copie o **ID de Propriedade** (formato: `G-XXXXXXXXXX`)

### Passo 3: Configurar no Projeto

1. Acesse o painel de controle do seu projeto Manus
2. Vá para **Settings** → **Secrets**
3. Adicione uma nova variável:
   - **Nome:** `VITE_GOOGLE_ANALYTICS_ID`
   - **Valor:** Cole o ID que você copiou (ex: `G-XXXXXXXXXX`)
4. Clique em **Save**

---

## 📱 Configuração do Facebook Pixel

### Passo 1: Criar um Pixel

1. Acesse [Facebook Business Manager](https://business.facebook.com/)
2. Vá para **Eventos** → **Pixels**
3. Clique em **"Criar"**
4. Preencha:
   - **Nome do Pixel:** Perfumes Árabes
   - **URL do Site:** Seu domínio
5. Clique em **"Criar"**

### Passo 2: Obter o ID do Pixel

1. Após criar, você verá o **ID do Pixel** (números)
2. Copie este ID

### Passo 3: Configurar no Projeto

1. Acesse o painel de controle do seu projeto Manus
2. Vá para **Settings** → **Secrets**
3. Adicione uma nova variável:
   - **Nome:** `VITE_FACEBOOK_PIXEL_ID`
   - **Valor:** Cole o ID do Pixel (ex: `123456789`)
4. Clique em **Save**

---

## 📈 Eventos Rastreados Automaticamente

O site rastreia automaticamente os seguintes eventos:

### Google Analytics & Facebook Pixel

| Evento | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| `page_view` | Visualização de página | Ao carregar qualquer página |
| `view_item` | Visualização de produto | Ao clicar em um produto |
| `add_to_cart` | Adicionar ao carrinho | Ao clicar em "Comprar" |
| `click` | Clique em elemento | Ao clicar em botões principais |

---

## 🔗 Eventos Customizados

### Rastrear Cliques em Produtos

```typescript
import { trackProductView } from "@/lib/analytics";

// Ao visualizar um produto
trackProductView("sabah-100ml", "Perfume Sabah 100ml", 109.60);
```

### Rastrear Compras

```typescript
import { trackPurchase } from "@/lib/analytics";

// Após uma compra
trackPurchase("ORDER-12345", 500.00, [
  {
    item_id: "sabah-100ml",
    item_name: "Perfume Sabah 100ml",
    price: 109.60,
  },
]);
```

---

## 📊 Verificar se está Funcionando

### Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Vá para **Relatórios** → **Tempo Real**
3. Visite seu site
4. Você deve ver uma sessão ativa em tempo real

### Facebook Pixel

1. Acesse [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Selecione seu Pixel
3. Clique em **"Testar Eventos"**
4. Visite seu site
5. Você deve ver eventos sendo rastreados

---

## 🎯 Configuração de Conversões

### Google Analytics - Objetivo de Conversão

1. Vá para **Admin** → **Conversões**
2. Clique em **"Novo Objetivo"**
3. Configure:
   - **Nome:** Clique em Link de Afiliado
   - **Tipo:** Evento
   - **Categoria:** click
   - **Ação:** affiliate_link_click
4. Salve

### Facebook Pixel - Evento de Conversão

1. Acesse [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Clique em **"Conversões"**
3. Selecione seu Pixel
4. Clique em **"Configurar Eventos de Conversão"**
5. Escolha **"Compra"** ou **"Clique no Link"**

---

## 💡 Dicas de Otimização

### Segmentação de Público

No Google Analytics, você pode segmentar por:
- **Localização geográfica**
- **Dispositivo** (mobile, desktop, tablet)
- **Fonte de tráfego** (organic, paid, direct)
- **Comportamento** (páginas visitadas, tempo de permanência)

### Remarketing com Facebook

Após configurar o Pixel:
1. Vá para **Públicos** → **Criar Público Personalizado**
2. Selecione **"Visitantes do Site"**
3. Configure o período (ex: últimos 30 dias)
4. Crie anúncios para este público

---

## 🚀 Próximos Passos

1. ✅ Configurar Google Analytics
2. ✅ Configurar Facebook Pixel
3. ✅ Testar rastreamento
4. ✅ Criar objetivos de conversão
5. ✅ Configurar campanhas de remarketing
6. ✅ Monitorar performance diária

---

## ❓ Dúvidas Frequentes

**P: Quanto tempo leva para os dados aparecerem?**  
R: Google Analytics leva 24-48 horas para processar dados. Facebook Pixel mostra dados em tempo real.

**P: Posso usar ambos simultaneamente?**  
R: Sim! Recomendamos usar ambos para máxima cobertura de rastreamento.

**P: Como rastrear compras no Mercado Livre?**  
R: Use o parâmetro `utm_source=perfumes_arabes` nos links de afiliado para rastrear no Google Analytics.

---

**Última atualização:** 28 de junho de 2026  
**Versão:** 1.0
