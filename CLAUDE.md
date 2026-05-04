# CLAUDE.md — Naiara Colin Espaço de Beleza
## Contexto permanente para agente de desenvolvimento

> Leia este arquivo integralmente antes de qualquer tarefa de código.
> Todas as decisões aqui são definitivas — não pergunte, implemente.
> Para tokens de cor, tipografia e componentes detalhados → ver `design-system.md`

---

## 🎯 O Projeto

Site institucional premium one-page para salão de beleza de alto padrão em Balneário Camboriú, SC. Objetivo central: **converter visitas em agendamentos via WhatsApp** e comunicar posicionamento de luxo urbano.

---

## 🏗️ Stack — Sem Negociação

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Hospedagem | Vercel |
| Banco / Storage | Supabase |
| Estilização | Tailwind CSS + CSS custom properties |
| Animações | Framer Motion |
| Internacionalização | next-intl (PT-BR padrão, ES, EN) |
| E-mail | Gmail + roteamento @naiaracolin.com.br via Cloudflare |
| Analytics | Google Analytics 4 + Google Search Console |
| Métricas | Looker Studio conectado ao GA4 |
| Uptime | UptimeRobot |

---

## 📁 Arquitetura de Páginas

| Rota | Descrição |
|---|---|
| `/` | Home one-page: Splash → Hero → Sobre → Serviços → Diferenciais → Galeria → Depoimentos → Cursos → Mapa → Rodapé |
| `/cursos` | Hero fullscreen → Sobre cursos → Lista de cursos → Galeria alunas → CTA WhatsApp |
| `/blog` | Listagem de posts (SSG) |
| `/blog/[slug]` | Hero dark + corpo off-white `#f5f0eb` + Web Share API |
| `/admin` | Painel protegido por Supabase Auth Magic Link |
| `/privacidade` | Política de privacidade LGPD |

---

## 🎨 Temas — Dark e Light

O site tem **dois temas completos**. Implementados via `<html data-theme="dark|light">` com CSS custom properties. Zero impacto SEO — um único HTML, dois conjuntos de tokens.

**Detecção inicial:** `prefers-color-scheme` do sistema operacional.
**Persistência:** `localStorage` key `"nc_theme"`.
**Toggle:** ícone sol/lua no menu, fade 300ms em todos os custom properties.

### Elementos invariantes — não mudam entre temas
- **Splash screen:** sempre dark (fundo `#0a0a0a`, coroa `#C9A84C`) — identidade de marca
- **Rodapé:** sempre escuro (`#1a1a1a`) — bookend visual que ancora a página
- **Vídeos do hero:** overlay escuro mantido — preserva legibilidade da tagline branca
- **Blog corpo:** sempre off-white `#f5f0eb` com texto `#1a1a1a` — legibilidade em texto longo
- **Botão Agendar mobile:** sempre fundo dourado sólido `#C9A84C` — única exceção justificada

### Tokens essenciais (ver `design-system.md` para lista completa)
```css
/* Dark */
--color-bg: #0a0a0a | --color-text: #ffffff | --color-gold: #C9A84C

/* Light */
--color-bg: #faf7f4 | --color-text: #1a1a1a | --color-gold: #C9A84C
```

**O dourado `#C9A84C` é idêntico nos dois temas — âncora de identidade de marca.**

---

## 🎨 Regras Visuais Absolutas

### Dourado — Onde aparece (APENAS aqui)
- Linhas decorativas entre seções (1px, 60–120px, animação `scaleX`)
- Sublinhados de títulos via componente `SectionTitle`
- Estado `hover` de botões
- Ícones e elementos decorativos (coroas, monogramas)
- Separadores entre itens do toggle (idioma/tema)
- Scrollbar thumb (4px)
- Seleção de texto (translúcido)
- Cursor ponto em elementos interativos
- Foco de teclado (double-ring)
- Barra de progresso do carrossel de depoimentos
- Indicador de seção ativa no menu
- **Única exceção:** fundo sólido no botão "Agendar pelo WhatsApp" do mobile overlay

### Dourado — Nunca como fundo de seção

### Transição entre seções
- **Corte limpo e direto** entre seções de fundos diferentes — sem gradiente
- Linha dourada decorativa entre seções de **mesmo** fundo

### Espaçamento entre seções
- Desktop padrão: `120px` | Mobile: `80px`
- Hero e Depoimentos: `160px` (mais respiro)

---

## 🖥️ Componentes Principais — Comportamento

### Splash Screen
```
Fundo: sempre #0a0a0a
Coroa dourada: fade in → pausa → fade out
Desaparece quando: poster frame dos vídeos do hero estiver pronto (não o vídeo completo)
FLIP animation: coroa migra da splash para o logo no menu (transição contínua de posição)
aria-hidden="true" role="presentation"
```

### Hero
```
Desktop: dois vídeos portrait 9:16 lado a lado
  Split reveal: esquerdo desliza de -100%, direito de +100%, simultaneamente em 1.2s
  Tagline: fade in após os vídeos
  Overlay escuro sobre os vídeos: rgba(10,10,10,0.45) — mantido em ambos os temas

Mobile: apenas Vídeo 1 (vídeo principal)
  No admin: Vídeo 1 destacado visualmente como "principal (aparece no mobile)"

Vídeos — carregamento:
  preload="metadata" — poster frame imediato (<1s)
  Streaming via CDN — reproduz após ~2s de buffer (não aguarda carregamento completo)
  Poster frame (WebP) visível enquanto vídeo bufferiza
  Se após 4s não iniciou: poster + indicador dourado sutil
  Splash desaparece quando poster estiver pronto — não quando o vídeo estiver pronto
```

### Menu
```
Inicial: background transparent
Após 80px de scroll:
  background: rgba(10,10,10,0.92) — dark
  background: rgba(250,247,244,0.92) — light
  backdrop-filter: blur(12px)
  transição: 300ms ease
  logo: scale(0.85) simultaneamente

Canto direito: [☀/◐] | [PT · ES · EN] em 10px sans-serif
  · separadores em dourado
  Ativo: --color-text | Inativo: --color-text-muted

Indicador de seção ativa (desktop):
  Sublinhado dourado animado que desliza entre itens conforme o scroll

Mobile (≤1024px):
  Hambúrguer: 3 linhas douradas larguras 100%/75%/50%
  Morphing para X: linha 1 rotate(45deg), linha 2 opacity(0), linha 3 rotate(-45deg) — 300ms
  Overlay escuro, links centralizados em tipografia grande
  Botão "Agendar pelo WhatsApp": fundo #C9A84C, texto #1a1a1a bold, largura total, pulsa uma vez
  Toggles tema + idioma: rodapé do overlay

Barra de progresso mobile:
  2px dourada no topo da tela — indica progresso de scroll pelo site
```

### Cards de Serviço
```
Hover desktop (200ms):
  translateY(-4px)
  borda: 1px solid #C9A84C
  CTA aparece com fade: "Agendar [nome do serviço]" → link WhatsApp

Light theme hover:
  box-shadow: 0 8px 30px rgba(201,168,76,0.12)

Mobile (sem hover):
  CTA de agendamento visível diretamente no card

Hierarquia:
  Hair Design: card de destaque maior com lista expansível
  Nail e Estética: cards iguais abaixo
```

### Galeria
```
"O espaço": fotos do ambiente
"O trabalho": slider drag reveal (divisória dourada arrastável)
  Mobile tap: alterna entre antes/depois com fade

Mobile ambas as galerias:
  Carrossel snap scroll horizontal
  85% largura por item (próxima foto parcialmente visível)
  Indicador: pontos dourados

Loading: blur-up progressivo via Next.js placeholder="blur"
Placeholder de falha: gradiente #1a1a1a + coroa dourada centralizada
```

### Depoimentos
```
Auto-play: 6s
Transição: fade entre cards
Pausa: hover (desktop) | toque (mobile)
Progresso: barra dourada fina abaixo dos cards (não pontos)
Navegação: setas disponíveis
Cards: max-width 480px
```

### WhatsApp Flutuante
```
Posição: fixed bottom-right, 24px de margem
Delay: 3000ms após carregamento
Tamanho: 56px, border-radius 50%
Borda: 2px solid #C9A84C

Entrada: scale(0) → scale(1.1) → scale(1) em 400ms ease-bounce
Pulso: box-shadow dourado expande e some a cada 3s (simula batimento)
Hover: pulso para + scale(1.05)
Click: scale(0.95) por 100ms → abre WhatsApp

Mensagem geral: "Olá, Nay! Vi o site e gostaria de agendar."
```

### Seção Sobre a Naiara
```
Desktop: vídeo portrait à esquerda (40%) + texto à direita
Mobile:
  Vídeo ocupa 70% da altura da tela
  Texto: 3 linhas visíveis + fade-out + "Continuar lendo" em serif itálico dourado
  Ao clicar: texto expande inline com max-height transition (sem redirect, sem modal)
```

### Seção de Cursos (home)
```
Fundo: noise grain dourado em baixíssima opacidade sobre preto
Título: maior que o padrão da seção
Imagem/vídeo: parallax leve ao scroll
Sem preço — apenas gera curiosidade
CTA: "Conheça os cursos" → /cursos
```

### Página /cursos
```
Enquanto não há conteúdo real: placeholders temáticos com identidade visual
  (coroa dourada + texto descritivo do que vai aparecer)
  Painl admin permite substituição completa sem tocar no código

Estrutura:
  Hero: fullscreen com imagem/vídeo de bastidores
  Sobre os cursos: para quem é, o que vai aprender
  Lista de cursos: cards com nome + duração + formato
    Badge "Em breve" para cursos online
    Bloco "Em breve" reservado visualmente para expansão futura
  Galeria de alunas: masonry, gaps pretos, hover overlay dourado, lightbox
  CTA WhatsApp: fixo no rodapé da página
```

### Rodapé
```
Seção Maps: Google Maps embed em seção própria ANTES do rodapé

Rodapé — sempre escuro (#1a1a1a) em ambos os temas:
  Superior: logo centralizada + linha dourada + endereço e horário em serif
  Inferior (fundo #111111): ícones sociais + WhatsApp + LGPD + copyright

Endereço: clicável → copia clipboard + tooltip "Endereço copiado" 2s
Telefone: tel: em mobile | clipboard em desktop
```

### Blog
```
Listagem (/blog):
  Tema escuro — consistência com a home
  Grid de cards com cover, título, excerpt, data

Post individual (/blog/[slug]):
  Hero: dark luxury — cover fullwidth + título serif dourado
  Corpo: fundo #f5f0eb, texto #1a1a1a — inversão intencional
  Compartilhamento: Web Share API (mobile: sheet nativo | desktop: clipboard)
  CTA WhatsApp ao final do post

Geração: SSG com generateStaticParams
```

---

## 🔐 Segurança — Regras Invioláveis

### Supabase
- **Bucket PRIVADO** — nunca bucket público
- **Signed URLs** geradas exclusivamente server-side
- **Nunca** expor `SUPABASE_SERVICE_ROLE_KEY` no client
- **RLS ativado** em todas as tabelas (incluindo `appointments`)

### Autenticação Admin
- Supabase Auth com **Magic Link** — sem senha
- Proteção via Next.js middleware em `/admin/*`

### Variáveis de Ambiente
- Todas em Vercel Environment Variables
- `.env.example` documentado (sem valores)
- `.env` no `.gitignore`
- Repositório **privado** + secret scanning ativado no GitHub

---

## 📦 Supabase — Estrutura de Dados

```sql
-- Mídias por seção
media (id, section, url, type, order, is_primary, created_at)
  -- is_primary: indica o vídeo principal (aparece no mobile)

-- Textos editáveis (internacionalizados)
content (id, key, value, language, updated_at)

-- Serviços
services (id, category, name, description, icon, order, active)

-- Depoimentos
testimonials (id, name, photo_url, text, stars, visible, order)

-- Posts do blog
posts (id, slug, title, excerpt, cover_url, body, language, published, published_at)

-- Cache do Instagram
instagram_cache (id, post_id, media_url, thumbnail_url, caption, visible, cached_at)

-- Agendamentos (RLS ativo, aba admin desabilitada — v2)
appointments (id, client_name, service_id, date, status, created_at)
```

### Buckets
- `media` — privado, signed URLs
- `blog-covers` — privado, signed URLs

### Edge Functions
- `process-upload`: aplica marca d'água (logo 15% opacidade, canto inferior direito) em fotos do portfólio no upload. Testar em portrait, landscape e quadrado.
- Converter imagens para WebP no upload

### Cron Jobs (Vercel)
- Cache Instagram: atualiza `instagram_cache` a cada **24h**
- Renovação do token Instagram: documentada no guia de operação (expira a cada 60 dias)

---

## 🌍 Internacionalização (next-intl)

```
PT-BR — padrão | ES | EN
Toggle: fade 200ms sem reload
Persistência: localStorage "nc_locale"
Detecção: prefers idioma do browser na primeira visita
hreflang configurado no <head>

REGRA ABSOLUTA: zero texto em português hardcoded no JSX
Tudo via useTranslations() + arquivos /messages/pt.json, /messages/es.json, /messages/en.json
Isso inclui: textos de serviços, depoimentos, CTAs, erros, tooltips, aria-labels
```

---

## ⚡ Performance

- **PageSpeed 90+** mobile e desktop — requisito mínimo
- Imagens: WebP, lazy load, `placeholder="blur"` (blur-up progressivo)
- Vídeos: CDN streaming (não aguarda carregamento completo), `poster` WebP obrigatório
- Blog: SSG com `generateStaticParams`
- Fontes: `font-display: swap`
- Max-width: `1280px` centralizado em todas as seções

---

## 📊 Analytics — Eventos Obrigatórios

```javascript
// Todo clique no WhatsApp — em qualquer botão do site
gtag('event', 'whatsapp_click', {
  source: 'hero' | 'flutuante' | 'serviço: [nome exato]' | 'cursos' | 'rodapé' | 'post-blog'
})
```

---

## ♿ Acessibilidade

```css
/* Foco de teclado — aplicar globalmente */
:focus-visible {
  box-shadow: 0 0 0 2px var(--color-focus-inner), 0 0 0 4px var(--color-focus-outer);
  outline: none;
}
/* Nunca usar :focus — dispara em cliques com mouse */
```

ARIA obrigatório:
- WhatsApp flutuante: `aria-label="Agendar pelo WhatsApp"`
- Hambúrguer: `aria-label` dinâmico + `aria-expanded`
- Carrosséis: `aria-live="polite"` + `aria-label` nas setas
- Slider antes/depois: `aria-label` descritivo
- Splash: `aria-hidden="true" role="presentation"`

---

## 🎬 Animações — Padrões Obrigatórios

```javascript
// Scroll reveal padrão — todas as seções
{ initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }, viewport: { once: true } }

// Linha dourada — scaleX
{ initial: { scaleX: 0 }, whileInView: { scaleX: 1 },
  style: { transformOrigin: 'left' }, transition: { duration: 0.8 } }

// Hero split reveal — esquerdo
{ initial: { x: '-100%', opacity: 0 }, animate: { x: 0, opacity: 1 },
  transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }

// Ícone de serviço — rotate de entrada (uma vez)
{ initial: { opacity: 0, rotate: 0 }, whileInView: { opacity: 1, rotate: [0, 5, 0] },
  transition: { duration: 0.6 }, viewport: { once: true } }
```

---

## 🖱️ Detalhes de Refinamento Global

```css
/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 2px; }
* { scrollbar-width: thin; scrollbar-color: #C9A84C transparent; }

/* Seleção de texto */
::selection { background: rgba(201,168,76,0.20); color: var(--color-selection-text); }

/* Cursor — ponto dourado */
a, button, [role="button"] {
  cursor: url('/cursors/dot-gold.svg') 8 8, pointer;
}
```

Transição entre páginas: fade preto 300ms (implementar via Framer Motion `AnimatePresence`).

---

## 📱 PWA

```json
{
  "name": "Naiara Colin Espaço de Beleza",
  "short_name": "Naiara Colin",
  "theme_color": "#0a0a0a",
  "background_color": "#0a0a0a",
  "display": "standalone"
}
```

---

## 🛠️ Painel Admin — MVP Obrigatório

1. Upload de mídias por seção
   - Vídeo 1 destacado como **"Vídeo Principal (aparece no mobile)"**
   - Vídeo 2 como **"Vídeo Desktop"**
2. Edição de textos: serviços, depoimentos, contato (via tabela `content`)
3. Depoimentos: adicionar, reordenar, ocultar (nunca deletar)
4. Blog: criar, editar, publicar, despublicar
5. Feed Instagram: ocultar posts específicos do site
6. Aba Agendamentos: **visualmente desabilitada** (badge "Em breve")
7. Mensagens de erro em linguagem humana — sem código técnico
8. Limite de upload sugerido: 10MB para imagens, 500MB para vídeos (definir com base no plano Supabase)

---

## 🚫 Nunca Faça

- Hardcode de texto editorial em JSX — tudo via `next-intl` + Supabase
- Bucket público no Supabase Storage
- `SUPABASE_SERVICE_ROLE_KEY` exposta no client
- `.env` real commitado no git
- Widget padrão do Instagram — feed sempre customizado
- Lançar com placeholders visuais — somente com material 100% aprovado
- Dourado como fundo de seção (exceto botão Agendar mobile)
- Gradiente de transição entre seções de fundo diferente — sempre corte limpo
- Splash screen em light mode — sempre dark

---

## 📋 Checklist Pré-Lançamento

- [ ] PageSpeed 90+ confirmado (mobile e desktop)
- [ ] Eventos GA4 disparando corretamente por origem
- [ ] Token Instagram válido e cache 24h funcionando
- [ ] Magic Link testado com e-mail da Naiara
- [ ] Bucket privado e signed URLs validados em produção
- [ ] PWA manifest testado em Android e iOS
- [ ] hreflang configurado e validado
- [ ] Schema markup validado no Rich Results Test
- [ ] LGPD banner linkando para `/privacidade`
- [ ] Página 404 customizada
- [ ] Splash → FLIP → menu testado em mobile e desktop
- [ ] Split reveal do hero testado em mobile (apenas Vídeo 1)
- [ ] Poster frame WebP definido nos dois vídeos
- [ ] Streaming CDN validado: vídeo inicia em < 3s em 4G
- [ ] Marca d'água testada em portrait, landscape e quadrado
- [ ] Blur-up progressivo funcionando nas galerias
- [ ] Slider antes/depois testado em touch (mobile)
- [ ] Toggle de tema persistindo via localStorage
- [ ] Toggle de idioma com fade sem reload
- [ ] Cursor dourado funcionando em Chrome, Safari e Firefox
- [ ] Scrollbar dourada em Chrome e Edge
- [ ] Seleção de texto dourada
- [ ] Transição de página fade preto entre rotas
- [ ] Foco de teclado double-ring dourado em todos os interativos
- [ ] WCAG AA contraste validado no dourado sobre preto E sobre nude
- [ ] Web Share API testada em iOS Safari e Android Chrome
- [ ] Masonry da galeria de alunas testado em diferentes proporções
- [ ] Print CSS: fundo branco, texto preto, URLs dos links
- [ ] Dashboard Looker Studio configurado
- [ ] UptimeRobot monitorando produção
- [ ] Google Meu Negócio verificado
- [ ] Domínio naiaracolin.com.br apontando para Vercel
- [ ] Vídeo guia do admin gravado e entregue

---

## ⚠️ Pendentes — Não Implementar Sem Confirmação

| Item | Status |
|---|---|
| Google Ads no lançamento | A confirmar com a Naiara |
| Modelo de suporte pós-lançamento | A combinar com a Naiara |
| Descrições do Nail Design | A completar com a cliente |
| Linha de apoio à tagline | A definir com a cliente |
| Tradução da tagline em ES e EN | A aprovar com a Naiara |
| Lista completa de cursos presenciais | A confirmar com a Naiara |

---

*CLAUDE.md — atualizado em 03/05/2025*
*Baseado no documento de alinhamento completo — Quadros 1 a 12*
*Para tokens e componentes detalhados → `design-system.md`*
