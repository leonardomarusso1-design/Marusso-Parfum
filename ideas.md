# Estratégia de Design - Perfumes Árabes Originais

## Conceito Escolhido: **Luxo Árabe Contemporâneo**

### Design Movement
**Orientalismo Moderno** — Fusão de elementos tradicionais árabes (padrões geométricos, caligrafias, ouro) com minimalismo contemporâneo e tipografia sofisticada.

### Core Principles
1. **Sofisticação através da Restrição** — Menos é mais. Espaços em branco generosos, paleta limitada, tipografia intencional.
2. **Ouro como Protagonista** — Ouro não é apenas acento, é linguagem visual. Aparece em bordas, tipografia, ícones e divisores.
3. **Contraste Dramático** — Fundo escuro (preto/charcoal) cria teatro para produtos brilharem. Texto claro garante legibilidade absoluta.
4. **Exclusividade Percebida** — Cada elemento comunica raridade e autenticidade. Nenhum detalhe é acidental.

### Color Philosophy
- **Preto Profundo** (`#0a0a0a`): Fundo principal, elegância absoluta, luxo inegociável
- **Ouro Quente** (`#d4af37`): Acentos, tipografia de destaque, bordas, ícones — cor assinatura
- **Branco Leitoso** (`#f5f5f0`): Texto principal, contraste perfeito contra preto
- **Cinza Quente** (`#3a3a36`): Divisores, cards secundários, subtileza
- **Ouro Claro** (`#e8d5b7`): Gradientes suaves, efeitos de profundidade

**Intenção Emocional:** Luxo acessível, confiança, exclusividade, sofisticação oriental.

### Layout Paradigm
- **Assimétrico com Eixo Vertical** — Não é grid centrado. Produtos em cascata, não em linha.
- **Seções com Respiração** — Cada seção tem espaço próprio, separada por divisores decorativos ou espaço puro.
- **Hero Imersivo** — Primeira seção ocupa viewport inteiro com imagem de fundo + overlay.
- **Carrossel de Produtos** — Não é grade estática; produtos deslizam suavemente, revelando um por vez.

### Signature Elements
1. **Divisor Geométrico em Ouro** — Padrão islâmico simplificado (linhas e pontos) que separa seções.
2. **Ícone de Selo de Autenticidade** — Símbolo circular com "100% ORIGINAL" em ouro, aparece em cards.
3. **Tipografia em Ouro para CTAs** — Botões e chamadas-à-ação em ouro com fundo transparente/preto.

### Interaction Philosophy
- **Hover Luxuoso** — Cards crescem levemente, ouro brilha mais (glow sutil).
- **Scroll Revelador** — Elementos aparecem conforme scroll, não tudo de uma vez.
- **Transições Suaves** — Nada é abrupto. Tudo flui em 300-500ms.
- **Feedback Tátil** — Cliques em botões têm scale-down visual (0.97) para confirmar ação.

### Animation Guidelines
- **Entrance:** Fade + slide-up de 200ms (ease-out) para cards e seções.
- **Hover:** Scale 1.02 em 150ms, glow de ouro sutil (box-shadow).
- **Scroll Trigger:** Elementos aparecem quando entram no viewport (Intersection Observer).
- **CTA Buttons:** Scale 0.97 em 160ms ao clicar, volta em 200ms.
- **Carrossel:** Transição suave entre slides (300ms cubic-bezier).

### Typography System
- **Display Font:** `Playfair Display` (serif elegante) — Títulos, seções principais, luxo visual.
- **Body Font:** `Lato` (sans-serif legível) — Descrições, preços, corpo de texto.
- **Hierarchy:**
  - H1: Playfair Display 48px bold, ouro
  - H2: Playfair Display 36px bold, ouro
  - H3: Playfair Display 24px, branco
  - Body: Lato 16px, branco leitoso
  - Small: Lato 14px, cinza quente

### Brand Essence
**Posicionamento:** Perfumes árabes autênticos e luxuosos para quem busca exclusividade, qualidade e presença marcante.

**Personalidade:** Sofisticado, confiável, exclusivo, aspiracional.

### Brand Voice
- **Headlines:** Imperativas, luxuosas, sem clichês. Exemplos:
  - "Descubra o Poder dos Perfumes Árabes" (não "Bem-vindo")
  - "Fixação que Conquista" (não "Compre Agora")
- **CTAs:** Ação clara, luxo implícito. Exemplos:
  - "Explorar Coleção"
  - "Comprar com Segurança"
  - "Ver Oferta"
- **Microcopy:** Confiança e exclusividade. Exemplos:
  - "Produtos 100% Originais"
  - "Frete Rápido Garantido"
  - "Compra Segura no Mercado Livre"

### Logo & Wordmark
**Conceito:** Símbolo circular com padrão geométrico islâmico simplificado (8 pontos radiantes) em ouro, com "PERFUMES ÁRABES" em Playfair Display abaixo.

**Execução:** Logo PNG com fundo transparente, 200x200px mínimo, escalável para favicon (32x32).

### Signature Brand Color
**Ouro Quente** (`#d4af37`) — Inconfundível, luxuoso, árabe, memorável.

---

## Produtos (6 Perfumes)

1. **Perfume Sedutor Árabe Sabah 100ml** - Al Wataniah | R$ 109,60
2. **Perfume Árabe Al Wataniah Bareeq Al Dhahab 100ml** - Al Wataniah | R$ 189
3. **Perfume Masculino Maison Alhambra Salvo Intense 100ml** - Maison Alhambra | R$ 215
4. **Lattafe Fekhar Black Edp 100ml** - Lattafa | R$ 259
5. **Lattafa Perfume Yara Tous Eau de Parfum 100ml** - Lattafa | R$ 239
6. **Perfume Lattafa Asad 100ml Eau De Parfum** - Lattafa | R$ 156

---

## Estrutura de Páginas

### Home
1. **Hero Section** — Imagem de fundo luxuosa (perfumes em ambiente elegante), overlay preto 60%, CTA principal
2. **Seção "Por Que Escolher"** — 4 cards com ícones (Autenticidade, Fixação, Aromas Exclusivos, Compra Segura)
3. **Carrossel de Produtos** — 6 produtos em destaque com imagens, preços, botões "Comprar"
4. **Seção "Mais Desejados"** — Grid de 3 produtos top com descrições curtas
5. **Testimonial/Social Proof** — Avaliações fictícias (NUNCA) ou apenas badges de confiança
6. **Footer** — Links, redes sociais, copyright

---

## Próximas Etapas
1. Gerar imagens de alta qualidade para hero e produtos
2. Implementar layout em React + Tailwind
3. Integrar links de afiliado do Mercado Livre
4. Criar criativos para tráfego pago (Facebook, Instagram, Google Ads)
