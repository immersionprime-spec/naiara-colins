# Design System — Naiara Colin Espaço de Beleza
## Tokens, Componentes e Regras Visuais

> Documento vivo — atualizar sempre que um novo componente for criado.
> Este arquivo é o contrato entre design e código. Nenhum valor visual é hardcoded sem passar por aqui.

---

## 🎨 Tokens de Cor

### Dark Theme (padrão)
```css
:root[data-theme="dark"] {
  /* Fundos */
  --color-bg:           #0a0a0a;   /* fundo principal */
  --color-bg-alt:       #f5f0eb;   /* seções alternadas (nude) */
  --color-bg-card:      #111111;   /* fundo de cards */
  --color-bg-overlay:   rgba(10, 10, 10, 0.92); /* menu ao scroll */
  --color-bg-footer:    #0a0a0a;   /* rodapé superior */
  --color-bg-footer-sub:#050505;   /* rodapé inferior */

  /* Texto */
  --color-text:         #ffffff;   /* texto principal */
  --color-text-muted:   #d4c5b2;   /* texto secundário / nude claro */
  --color-text-inverse: #1a1a1a;   /* texto sobre fundos claros */

  /* Marca */
  --color-gold:         #C9A84C;   /* dourado — âncora de identidade */
  --color-gold-hover:   #d4b45a;   /* dourado hover (5% mais claro) */
  --color-gold-subtle:  rgba(201, 168, 76, 0.12); /* halo dourado */
  --color-gold-opacity: 0.7;       /* opacidade da linha decorativa */

  /* Bordas */
  --color-border:       #222222;   /* borda padrão */
  --color-border-gold:  #C9A84C;   /* borda dourada */

  /* Estados */
  --color-error:        #e55555;   /* erro — toast admin */
  --color-success:      #4caf7d;   /* sucesso — toast admin */

  /* Seleção de texto */
  --color-selection-bg: rgba(201, 168, 76, 0.20);
  --color-selection-text: #C9A84C;

  /* Foco de teclado */
  --color-focus-inner:  #0a0a0a;
  --color-focus-outer:  #C9A84C;
}
```

### Light Theme
```css
:root[data-theme="light"] {
  /* Fundos */
  --color-bg:           #faf7f4;   /* warm white — nunca branco puro */
  --color-bg-alt:       #f0ebe4;   /* nude mais escuro para seções alt */
  --color-bg-card:      #ffffff;   /* fundo de cards */
  --color-bg-overlay:   rgba(250, 247, 244, 0.92); /* menu ao scroll */
  --color-bg-footer:    #1a1a1a;   /* rodapé sempre escuro — bookend */
  --color-bg-footer-sub:#111111;   /* rodapé inferior */

  /* Texto */
  --color-text:         #1a1a1a;   /* texto principal */
  --color-text-muted:   #6b5f52;   /* texto secundário */
  --color-text-inverse: #ffffff;   /* texto sobre fundos escuros */

  /* Marca */
  --color-gold:         #C9A84C;   /* dourado — idêntico ao dark */
  --color-gold-hover:   #d4b45a;
  --color-gold-subtle:  rgba(201, 168, 76, 0.12);
  --color-gold-opacity: 1;         /* opacity 1 no light para compensar fundo claro */

  /* Bordas */
  --color-border:       #e8e0d5;   /* borda nude acinzentada */
  --color-border-gold:  #C9A84C;

  /* Estados */
  --color-error:        #c0392b;
  --color-success:      #27ae60;

  /* Seleção de texto */
  --color-selection-bg: rgba(201, 168, 76, 0.20);
  --color-selection-text: #a07830;  /* dourado mais escuro para contraste no claro */

  /* Foco de teclado */
  --color-focus-inner:  #faf7f4;
  --color-focus-outer:  #C9A84C;
}
```

### Tokens Invariantes (não mudam entre temas)
```css
:root {
  /* Splash screen — sempre dark */
  --color-splash-bg:    #0a0a0a;
  --color-splash-gold:  #C9A84C;

  /* Vídeos do hero — overlay sempre escuro */
  --color-video-overlay: rgba(10, 10, 10, 0.45);

  /* Botão Agendar mobile — única exceção do dourado como fundo */
  --color-cta-mobile-bg:   #C9A84C;
  --color-cta-mobile-text: #1a1a1a;

  /* Blog — corpo do post sempre em claro */
  --color-blog-body-bg:   #f5f0eb;
  --color-blog-body-text: #1a1a1a;
}
```

---

## 📐 Escala Tipográfica

### Fontes
```css
:root {
  --font-serif: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --font-sans:  'DM Sans', 'Jost', system-ui, sans-serif;
  font-display: swap; /* obrigatório em ambas */
}
```

### Tamanhos — Escala Fluida com clamp()
```css
:root {
  /* Display / Hero */
  --text-display:    clamp(3rem,    8vw,  7rem);    /* tagline do hero */
  --text-hero-sub:   clamp(1rem,    2vw,  1.5rem);  /* subtítulo do hero */

  /* Títulos de seção */
  --text-h1:         clamp(2.5rem,  6vw,  5rem);    /* título principal */
  --text-h2:         clamp(1.75rem, 4vw,  3rem);    /* subtítulo de seção */
  --text-h3:         clamp(1.25rem, 2.5vw, 2rem);   /* título de card */

  /* Corpo */
  --text-body-lg:    clamp(1.0625rem, 1.5vw, 1.25rem); /* texto sobre */
  --text-body:       clamp(0.9375rem, 1.2vw, 1.0625rem); /* corpo padrão */
  --text-body-sm:    clamp(0.8125rem, 1vw,  0.9375rem);  /* descrições */

  /* UI */
  --text-menu:       clamp(0.8125rem, 1vw,  0.9375rem);  /* itens de menu */
  --text-toggle:     0.625rem;  /* PT · ES · EN e toggle de tema — fixo 10px */
  --text-caption:    0.75rem;   /* legendas, copyright */
  --text-label:      0.6875rem; /* labels de formulário no admin */
}
```

### Pesos
```css
:root {
  --weight-light:   300;
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-bold:    700;
}
```

### Line-height
```css
:root {
  --leading-tight:  1.1;  /* títulos display */
  --leading-snug:   1.3;  /* h1, h2 */
  --leading-normal: 1.5;  /* h3, UI */
  --leading-relaxed:1.7;  /* corpo de texto */
  --leading-loose:  1.9;  /* blog — máxima legibilidade */
}
```

---

## 📏 Espaçamento

```css
:root {
  /* Espaçamento entre seções */
  --section-gap:         120px;  /* desktop padrão */
  --section-gap-mobile:   80px;  /* mobile padrão */
  --section-gap-hero:    160px;  /* antes e depois do hero */
  --section-gap-testimonials: 160px; /* antes e depois dos depoimentos */

  /* Padding interno de seções */
  --section-padding-x:    clamp(1.5rem, 5vw, 6rem);

  /* Max-width global */
  --max-width:           1280px;

  /* Cards */
  --card-padding:        clamp(1.5rem, 3vw, 2.5rem);
  --card-radius:         8px;    /* bordas levemente arredondadas */
  --card-gap:            24px;   /* gap entre cards no grid */

  /* Linha dourada decorativa */
  --divider-height:      1px;
  --divider-width-min:   60px;
  --divider-width-max:   120px;
  --divider-opacity-dark: 0.7;
  --divider-opacity-light: 1;

  /* Menu */
  --menu-height:         72px;
  --menu-scroll-offset:  90px;  /* scroll-margin-top das seções */

  /* Botão WhatsApp flutuante */
  --whatsapp-btn-size:   56px;
  --whatsapp-btn-offset: 24px;  /* distância das bordas */
  --whatsapp-btn-delay:  3000ms;

  /* Scrollbar */
  --scrollbar-width:     4px;
  --scrollbar-thumb:     #C9A84C;
  --scrollbar-track:     transparent;
}
```

---

## ⏱️ Animações

```css
:root {
  /* Durações */
  --duration-instant:   100ms;
  --duration-fast:      200ms;
  --duration-normal:    300ms;
  --duration-smooth:    400ms;
  --duration-reveal:    600ms;
  --duration-hero:     1200ms;
  --duration-flip:      500ms;  /* FLIP animation splash→logo */
  --duration-page:      300ms;  /* transição entre páginas */

  /* Easings */
  --ease-out:      cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in-out:   cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1); /* scale do botão WA */
  --ease-hero:     cubic-bezier(0.16, 1, 0.3, 1);    /* split reveal */
}
```

### Padrões Framer Motion reutilizáveis
```javascript
// Scroll reveal padrão — aplicar em todas as seções
export const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }
  }
}

// Ícone de serviço — micro-rotate de entrada (acontece uma vez)
export const iconEntryVariants = {
  hidden: { opacity: 0, rotate: 0 },
  visible: {
    opacity: 1,
    rotate: [0, 5, 0],
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
}

// Linha dourada — scaleX de 0 para 1
export const dividerVariants = {
  hidden: { scaleX: 0, transformOrigin: 'left' },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.0, 0.0, 0.2, 1] }
  }
}

// Split reveal do hero — vídeo esquerdo
export const heroLeftVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
}

// Split reveal do hero — vídeo direito
export const heroRightVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
}
```

---

## 🧩 Componentes — Especificações

### Button
```
Variantes: primary | outline | ghost | cta-mobile

primary:
  bg: transparent | border: 1px solid var(--color-gold)
  text: var(--color-gold) | font: --font-sans --weight-medium
  padding: 14px 32px | border-radius: 0 (sem arredondamento — premium)
  hover: bg var(--color-gold) | text var(--color-text-inverse)
  transition: all var(--duration-fast)

outline: igual ao primary (são o mesmo neste projeto)

ghost:
  sem borda | text: var(--color-text-muted)
  hover: text var(--color-gold)

cta-mobile (única exceção — fundo dourado sólido):
  bg: var(--color-gold) | text: var(--color-text-inverse)
  width: 100% | padding: 18px 32px | font: --weight-bold
  pulso uma vez ao abrir o menu mobile

focus: box-shadow 0 0 0 2px var(--color-focus-inner), 0 0 0 4px var(--color-focus-outer)
```

### Card (Serviço)
```
dark theme:
  bg: var(--color-bg-card) | border: 1px solid var(--color-border)
  border-radius: var(--card-radius)
  padding: var(--card-padding)

hover (desktop):
  transform: translateY(-4px)
  border-color: var(--color-gold)
  transition: all 200ms ease

  CTA aparece com fade: "Agendar [nome do serviço]"
  → link WhatsApp com mensagem pré-preenchida

light theme:
  bg: #ffffff | border: 1px solid var(--color-border)
  hover: box-shadow 0 8px 30px var(--color-gold-subtle)
         border-color: var(--color-gold)

mobile (sem hover):
  CTA de agendamento visível diretamente no card
```

### SectionTitle
```
Estrutura:
  [linha dourada animada] ← dividerVariants
  [título em --font-serif --text-h1]
  [subtítulo em --font-sans --text-body-lg --color-text-muted] (opcional)

Linha dourada:
  width: var(--divider-width-min) a var(--divider-width-max)
  height: var(--divider-height)
  bg: var(--color-gold)
  opacity: var(--divider-opacity-dark) ou var(--divider-opacity-light)
  position: acima do título (default) ou como sublinhado

Posição: centralizado por padrão, alinhado à esquerda quando em grid
```

### Divider (separador entre seções)
```
Horizontal full-width:
  height: 1px | bg: var(--color-gold)
  opacity: var(--divider-opacity-dark|light)
  usar APENAS entre seções de mesmo fundo

Sem gradiente de transição entre seções de fundo diferente.
O corte é sempre limpo e direto.
```

### WhatsAppCTA
```
Flutuante:
  posição: fixed bottom-right | right: var(--whatsapp-btn-offset) | bottom: var(--whatsapp-btn-offset)
  size: var(--whatsapp-btn-size)
  border-radius: 50%
  bg: #25D366 | icon: branco
  border: 2px solid var(--color-gold)
  delay: var(--whatsapp-btn-delay) para aparecer
  z-index: 9999

  Animação de entrada:
    scale(0) → scale(1.1) → scale(1) em 400ms var(--ease-bounce)

  Pulso contínuo:
    box-shadow: 0 0 0 0 rgba(201,168,76,0.4) → 0 0 0 12px rgba(201,168,76,0)
    a cada 3s — simula batimento

  Hover:
    pulso para | scale(1.05)

  Click:
    scale(0.95) por 100ms antes de abrir

Inline (por serviço):
  Texto: "Agendar [nome do serviço]"
  URL: https://wa.me/5547997923415?text=Olá!+Tenho+interesse+em+[nome].
  Estilo: Button variante ghost ou outline dependendo do contexto
```

### Toast (admin)
```
posição: fixed top-right | padding: 16px 20px
border-radius: 6px
bg: #1a1a1a (dark) ou #ffffff (light)
border-left: 3px solid (--color-error ou --color-success)
text: --font-sans --text-body-sm
duration: 4 segundos antes de desaparecer
sem código técnico — sempre mensagem em português claro
```

### Lightbox
```
bg: rgba(0,0,0,0.95)
imagem centralizada com max-height: 90vh | max-width: 90vw
fechar: tecla ESC | clique fora | botão X
botão X: 40x40px | ícone branco | canto superior direito
navegação: setas laterais em dourado
animação: fade in 200ms
```

### Toggle Idioma + Tema
```
posição: canto direito do menu, mesma linha
font: --font-sans --text-toggle --weight-medium

Idioma: "PT · ES · EN"
  separadores · em --color-gold
  ativo: --color-text | inativo: --color-text-muted
  troca: fade 200ms no conteúdo sem reload

Tema: ícone sol (☀) para mudar para light | ícone lua (◐) para mudar para dark
  separados do idioma por | vertical em --color-gold
  transição: 300ms em todos os custom properties

Mobile: ambos no rodapé do overlay do menu hambúrguer
Persistência: localStorage | fallback: prefers-color-scheme
```

### Hambúrguer
```
3 linhas em --color-gold
larguras: 100% | 75% | 50% (hierarquia de refinamento)
height: 1.5px | gap: 5px
border-radius: 1px

Animação para X (300ms ease-in-out):
  linha 1: rotate(45deg) translateY(6.5px)
  linha 2: opacity(0) scaleX(0)
  linha 3: rotate(-45deg) translateY(-6.5px)

Visível em: mobile e tablet (≤ 1024px)
```

---

## 🖼️ Imagens e Mídia

```
Formato obrigatório: WebP (convertido no upload via Supabase Edge Function)
Lazy loading: em todos os elementos fora do viewport inicial
Placeholder: blur-up via Next.js placeholder="blur"

Dimensões recomendadas:
  Hero poster (thumbnail): 1080×1920px (portrait 9:16)
  Galeria espaço: 1200×800px (landscape) ou 800×1200px (portrait)
  Portfólio antes/depois: 800×1000px cada (portrait uniforme)
  Depoimentos avatar: 200×200px (quadrado, será exibido circular)
  Blog cover: 1200×630px (proporção OG)
  Cursos — galeria de alunas: variada (masonry acomoda)

Marca d'água (portfólio):
  Supabase Edge Function no upload
  Logo da Naiara | opacity: 0.15 | canto inferior direito | padding: 16px
  Testar em portrait, landscape e quadrado
```

---

## ♿ Acessibilidade

```
Nível alvo: WCAG 2.1 AA

Contraste mínimo:
  Texto normal: 4.5:1 — verificar dourado sobre preto E sobre nude
  Texto grande (18px+): 3:1
  Se #C9A84C não passar, ajustar 5-10% de luminosidade

Foco de teclado:
  :focus-visible { box-shadow: 0 0 0 2px var(--color-focus-inner), 0 0 0 4px var(--color-focus-outer) }
  Nunca usar :focus (dispara em cliques com mouse)

ARIA obrigatório:
  Botão WhatsApp flutuante: aria-label="Agendar pelo WhatsApp"
  Hambúrguer: aria-label="Abrir menu" / "Fechar menu" | aria-expanded
  Carrosséis: aria-live="polite" | aria-label nas setas
  Splash screen: aria-hidden="true" role="presentation"
  Slider antes/depois: aria-label descritivo

Alt text:
  Fotos do portfólio: "[nome do serviço] realizado na Naiara Colin Espaço de Beleza em Balneário Camboriú"
  Fotos do espaço: "Interior do Naiara Colin Espaço de Beleza — [descrição da área]"
  Logo: "Naiara Colin Espaço de Beleza"
  Fotos decorativas sem conteúdo informativo: alt=""
```

---

## 🌍 Internacionalização

```
Biblioteca: next-intl
Idiomas: pt (padrão) | es | en
Arquivos: /messages/pt.json | /messages/es.json | /messages/en.json

Regra absoluta: zero texto em português hardcoded no JSX
Todos os strings via useTranslations() do next-intl

hreflang no <head>:
  <link rel="alternate" hreflang="pt-BR" href="https://naiaracolin.com.br/" />
  <link rel="alternate" hreflang="es" href="https://naiaracolin.com.br/es" />
  <link rel="alternate" hreflang="en" href="https://naiaracolin.com.br/en" />

Detecção: prefers idioma do browser na primeira visita
Persistência: localStorage key "nc_locale"
Toggle: fade 200ms sem reload de página
```

---

## 🖨️ Print CSS

```css
@media print {
  * {
    background: #ffffff !important;
    color: #1a1a1a !important;
    box-shadow: none !important;
  }

  /* Manter dourado nos títulos impressos */
  h1, h2, h3 {
    color: #a07830 !important; /* dourado mais escuro para impressão */
  }

  /* Ocultar elementos de UI */
  header, nav, .whatsapp-float, .lgpd-banner,
  video, .splash-screen, footer { display: none !important; }

  /* Mostrar URLs dos links */
  a[href]::after { content: " (" attr(href) ")"; font-size: 10px; }
}
```

---

## 🌐 Scrollbar Global

```css
/* Desktop — webkit */
::-webkit-scrollbar { width: var(--scrollbar-width); }
::-webkit-scrollbar-track { background: var(--scrollbar-track); }
::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 2px;
}

/* Firefox */
* { scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) transparent; }
```

---

## 🖱️ Seleção de Texto e Cursor

```css
/* Seleção de texto */
::selection {
  background: var(--color-selection-bg);
  color: var(--color-selection-text);
}

/* Cursor — ponto dourado em elementos interativos */
a, button, [role="button"], input, label, select, textarea {
  cursor: url('/cursors/dot-gold.svg') 8 8, pointer;
}

/* cursor dot-gold.svg: círculo sólido de 8px em #C9A84C */
```

---

## 📑 Páginas — Estrutura de Componentes

```
/ (home)
  <Splash />
  <Header />            ← menu fixo com toggles
  <Hero />              ← 2 vídeos + split reveal + tagline + CTA
  <Sobre />             ← vídeo portrait + texto expansível
  <Diferenciais />      ← 4 pilares com ícones dourados
  <Servicos />          ← 3 categorias com cards hierárquicos
  <Galeria />           ← "O espaço" + "O trabalho" com slider antes/depois
  <Depoimentos />       ← carrossel auto-play 6s com progress bar dourada
  <Cursos />            ← seção de impacto com noise grain + CTA /cursos
  <MapaSection />       ← Google Maps embed (fora do rodapé)
  <Footer />            ← duas partes: superior + inferior
  <WhatsAppFloat />     ← fixo, delay 3s
  <LgpdBanner />        ← primeira visita

/cursos
  <Header />
  <CursosHero />        ← fullscreen com imagem/vídeo de bastidores
  <SobreCursos />       ← para quem é, o que vai aprender
  <ListaCursos />       ← cards: nome + duração + formato + badge "Em breve" para online
  <GaleriaAlunas />     ← masonry com hover overlay dourado
  <CursosWhatsAppCTA /> ← fixo no rodapé da página
  <Footer />
  <WhatsAppFloat />

/blog
  <Header />
  <BlogHero />          ← dark — título da listagem
  <PostGrid />          ← grid de cards com cover, título, excerpt, data
  <Footer />
  <WhatsAppFloat />

/blog/[slug]
  <Header />
  <PostHero />          ← dark — cover fullwidth + título em serif dourado
  <PostBody />          ← fundo off-white #f5f0eb — inversão intencional
  <ShareButton />       ← Web Share API
  <PostCTA />           ← CTA WhatsApp ao final do post
  <Footer />
  <WhatsAppFloat />

/admin
  <AdminLayout />       ← protegido por Magic Link Supabase Auth
  <UploadMidias />      ← hero (V1 = mobile, V2 = desktop), sobre, galerias, cursos
  <EditarTextos />      ← serviços, depoimentos, contato
  <GerenciarDepoimentos /> ← adicionar, reordenar, ocultar
  <GerenciarBlog />     ← criar, editar, publicar, despublicar
  <AgendamentosTab />   ← DESABILITADO — badge "Em breve"

/privacidade
  <Header />
  <PrivacidadeContent /> ← texto estático em off-white, dark hero
  <Footer />
```

---

*design-system.md — gerado em 03/05/2025*
*Baseado nos Quadros de Alinhamento 1–13 e sessão de refinamento UI/UX*
*Atualizar este documento antes de criar qualquer novo componente*
