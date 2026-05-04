# NAIARA COLIN — Espaço de Beleza
## Documento de Alinhamento Estratégico Completo
### Site Institucional — Briefing para Desenvolvimento

> Documento gerado em: 03/05/2025
> Atualizado em: 03/05/2025 — Refinamento técnico e UI/UX concluídos
> Status: **Alinhamento 100% concluído — pronto para desenvolvimento**

---

## 📋 Dados do Projeto

| Campo | Informação |
|---|---|
| **Nome oficial** | Naiara Colin Espaço de Beleza |
| **Instagram** | @naiaracolin_salao |
| **WhatsApp** | +55 47 99792-3415 |
| **WhatsApp link** | wa.me/5547997923415 |
| **Endereço** | Rua 1500, 397 — Centro, Balneário Camboriú, SC |
| **Horário** | Terça a Sábado · 9h às 19h |
| **Domínio** | naiaracolin.com.br |
| **Objetivo principal** | Converter visitas em agendamentos via WhatsApp e reforçar identidade premium |

---

## ✅ Quadro 1 — Estratégia, Estrutura e Navegação

### Formato
**One-page premium** com scroll guiado. Toda a experiência acontece em uma única página com seções fluidas e âncoras de navegação. Exceção: página dedicada para Cursos.

### Ordem das Seções (one-page)
1. Hero
2. Sobre a Naiara
3. Serviços
4. Diferenciais ← inserido entre Serviços e Galeria
5. Galeria
6. Depoimentos
7. Cursos (seção de impacto com CTA → página dedicada)
8. Mapa (seção própria antes do rodapé)
9. Rodapé / Agendamento

### Hero
Dois vídeos lado a lado em **formato portrait (9:16)** com overlay escuro sutil. Split reveal: vídeos deslizam de fora para dentro (esq/dir) em 1.2s. Tagline sobreposta centralizada com fade após os vídeos:

> **"Beleza com experiência"**

Botão de agendamento posicionado abaixo da tagline.

**Mobile:** exibe apenas o Vídeo 1 (vídeo principal). No painel admin, o Vídeo 1 é destacado visualmente como "vídeo principal (aparece no mobile)".

### Sobre a Naiara
**Desktop:** vídeo portrait 40% à esquerda + texto à direita com scroll independente.
**Mobile:** vídeo ocupa 70% da altura da tela + texto com "Continuar lendo" expansível inline (3 linhas visíveis + fade-out + serif itálico dourado).

### Diferenciais
Posicionada entre Serviços e Galeria. 4 pilares com ícones SVG dourados:
① Experiência premium desde a entrada ② Produtos profissionais exclusivos ③ Ambiente pensado para você ④ Atendimento personalizado.

### Serviços
Três categorias com **cards visuais**: Hair Design & Styling (card de destaque hierárquico maior), Nail Design, Estética Avançada & Facial. Hover com CTA de agendamento direto por serviço.

### Galerias
Duas galerias distintas:
- **"O espaço"** — galeria do ambiente físico
- **"O trabalho"** — portfólio com slider drag reveal (divisória dourada arrastável) para antes/depois

**Mobile:** carrossel horizontal com snap scroll — 85% da largura, próxima foto parcialmente visível, indicador em pontos dourados.

### Depoimentos
Carrossel com auto-play 6s, pausa no hover/toque, fade entre cards. Barra de progresso em linha dourada fina (não pontos). Cards com aspas douradas, nome em serif, foto redonda quando disponível.

### Cursos (na one-page)
Fundo com noise grain dourado em baixíssima opacidade sobre preto. Título em serif maior que o padrão. Imagem/vídeo de bastidores com parallax leve. Apenas gera curiosidade — sem preço. CTA → `/cursos`.

### Navegação
Menu fixo no topo com logo à esquerda. Ao scrollar 80px: `background rgba(10,10,10,0.92)` + `backdrop-filter: blur(12px)` em 300ms, logo reduz `scale(0.85)`. Botão **"Agendar"** sempre visível. Toggle de tema (☀/◐) + idioma (`PT · ES · EN`) agrupados no canto direito.

**Mobile:** hambúrguer com 3 linhas douradas de larguras diferentes (100%/75%/50%), morphing para X em 300ms. Overlay escuro com links centralizados em tipografia grande. Botão "Agendar pelo WhatsApp" com **fundo dourado sólido** (única exceção justificada). Toggles de tema e idioma no rodapé do overlay.

---

## ✅ Quadro 2 — Identidade Visual Digital e Estética

### Temas
O site oferece **Dark Theme** (padrão) e **Light Theme** completo. Toggle no menu persiste via `localStorage`. Detecta `prefers-color-scheme` na primeira visita.

### Dark Theme — Atmosfera
Dark luxury. Fundo preto é protagonista. Seções alternadas em nude/off-white criam respiro.

### Light Theme — Atmosfera
Warm white elegante — nunca branco puro. Premium claro com dourado como âncora visual constante.

### Elementos invariantes entre temas
- Splash screen: **sempre dark** (fundo preto, coroa dourada) — decisão de identidade de marca
- Rodapé: **sempre escuro** (`#1a1a1a`) — bookend visual que ancora a página
- Vídeos do hero: overlay escuro mantido em ambos os temas — preserva legibilidade da tagline
- Blog — corpo do post: **sempre em fundo off-white** — inversão intencional para legibilidade

### Paleta Dark
| Elemento | Cor |
|---|---|
| Fundo principal | `#0a0a0a` |
| Seções alternadas | `#f5f0eb` |
| Cards | `#111111` |
| Destaque | `#C9A84C` (dourado) |
| Texto principal | `#ffffff` |
| Texto secundário | `#d4c5b2` |

### Paleta Light
| Elemento | Cor |
|---|---|
| Fundo principal | `#faf7f4` (warm white) |
| Seções alternadas | `#f0ebe4` |
| Cards | `#ffffff` |
| Destaque | `#C9A84C` (dourado — inalterado) |
| Texto principal | `#1a1a1a` |
| Texto secundário | `#6b5f52` |

> Ver tokens completos em `design-system.md`

### Tipografia
- **Títulos e taglines:** Cormorant Garamond ou Playfair Display (serif editorial)
- **Corpo e navegação:** DM Sans ou Jost (sans-serif clean)
- Escala fluida com `clamp()` — adapta ao viewport. Testada nos três idiomas com títulos mais longos.

### Uso do Dourado
Tratamento **cirúrgico**. Aparece em:
- Linhas decorativas (60–120px, 1px, `scaleX` animado, `opacity 0.7` dark / `1.0` light)
- Sublinhados de títulos (via `SectionTitle`)
- Estado hover de botões
- Ícones e elementos decorativos pontuais
- Separadores entre itens de toggle
- **Única exceção:** fundo sólido no botão "Agendar pelo WhatsApp" no mobile overlay

**Nunca como fundo de seção.** O preto (ou nude no light) é o protagonista.

### Animações
- **Scroll reveal:** slide up + fade in em todas as seções (Framer Motion, `once: true`)
- **Ícones de serviço:** micro-rotate 0→5→0deg em 600ms ao entrar no viewport, uma vez. Hover: `scale(1.1)`
- **Splash:** coroa dourada fade in → pausa → fade out. `aria-hidden="true"`
- **FLIP:** coroa migra da splash para o logo no menu em transição contínua de posição

### Elementos Decorativos
- Linhas douradas entre seções de mesmo fundo (corte limpo entre fundos diferentes — sem gradiente)
- Coroas ou monogramas em pontos estratégicos
- Noise grain dourado em baixíssima opacidade na seção de Cursos

### Detalhes de Refinamento Global
- **Cursor:** ponto dourado customizado em elementos interativos
- **Scrollbar:** thumb dourado 4px, track transparente
- **Seleção de texto:** highlight dourado translúcido
- **Transição entre páginas:** fade preto 300ms
- **Foco de teclado:** double-ring dourado via `:focus-visible`
- **Indicador de seção ativa:** sublinhado dourado deslizante no menu (desktop) + barra de progresso 2px no topo (mobile)

---

## ✅ Quadro 3 — Conteúdo, Copywriting e Serviços

### Tagline Principal
> **"Beleza com experiência"**

### Título da Seção de Serviços
> *"Cada serviço, uma experiência pensada para você"*

### Menu de Serviços

#### 💇‍♀️ Hair Design & Styling (card de destaque)
*Transformação, cuidado e finalização com excelência.*

| Serviço | Descrição |
|---|---|
| Noiva & Ocasiões Especiais | Maquiagem e penteado exclusivos para momentos inesquecíveis |
| Color Experience | Mechas personalizadas e coloração de alto padrão |
| Styling & Finalização | Babyliss, escova e acabamento profissional |
| Corte & Escova Premium | Design personalizado com finalização impecável |
| Hair Extension (Mega Hair) | Alongamento com naturalidade e sofisticação |
| Escova Lisa Perfeita | Alinhamento e polimento dos fios |
| Alinhamento Capilar Avançado | Redução de volume e disciplina dos fios |
| Tratamentos Capilares Intensivos | Hidratação, reconstrução e nutrição profunda |
| Botox Capilar Renewal | Rejuvenescimento e selagem dos fios |

#### 💅 Nail Design
*Beleza e elegância em cada detalhe.*

| Serviço | Descrição |
|---|---|
| Unhas em Gel Premium | — |
| Alongamento de Unhas | — |
| Manicure Tradicional | — |

> **Nota:** Descrições do Nail Design a completar com a cliente.

#### ✨ Estética Avançada & Facial
*Tecnologia, cuidado e realce da sua beleza natural.*

| Serviço | Descrição |
|---|---|
| Brow Lamination | Sobrancelhas alinhadas e volumosas |
| Design de Sobrancelhas | Harmonização perfeita do olhar |
| Lash Lifting | Curvatura e destaque natural dos cílios |
| Preenchimento Labial | Volume e contorno sofisticado |
| Micropigmentação Labial | Cor e definição duradoura |
| Preenchimento de Olheiras | Revitalização do olhar |
| Peeling do Mar Morto | Renovação profunda da pele |
| Peeling Químico | Tratamento avançado para textura e luminosidade |
| Limpeza de Pele Premium | Purificação e revitalização completa |
| Drenagem Linfática | Redução de inchaço e melhora da circulação |

### CTAs por Contexto
| Posição | Texto |
|---|---|
| Hero | *"Agende sua experiência"* |
| Hover de card de serviço | *"Agendar [Nome do Serviço]"* |
| Final da página | *"Pronta para se transformar? Fale com a gente."* |
| Botão flutuante WhatsApp | Ativo em todas as seções |
| Menu mobile | *"Agendar pelo WhatsApp"* |

---

## 📝 Texto — Sobre a Naiara

**Eu sou a Nay.**

Gaúcha de alma, catarinense de escolha. Vim para Balneário Camboriú para ficar alguns dias — e fiquei seis anos. Como acontece com quem realmente pertence a um lugar.

*Mas antes de estar aqui, do jeito que estou hoje, existiu uma versão de mim que duvidou. Que trabalhou longe do que amava, que adiou o sonho por medo de não ser boa o suficiente. Que olhava para a arte da beleza e pensava: isso exige muito, exige estudo, exige coragem — será que sou capaz?*

Era capaz. Só ainda não sabia.

────────────────────

O ponto de virada não veio com um plano perfeito. Veio com uma oração. Fui a uma igreja aqui em Balneário, joelhei, chorei e entreguei: *"Deus, seja feita a sua vontade."* No dia seguinte, recebi a proposta que mudou minha vida — a oportunidade de assumir um salão e, com ele, o sonho que eu havia guardado fundo demais por tempo demais.

Aprendi naquele dia que quando a gente larga o controle e confia, as coisas acontecem do jeito que têm que acontecer.

────────────────────

Hoje, com 27 anos, eu acordo todos os dias para fazer o que sempre amei: trabalhar com a autoestima de mulheres. Cada cliente que se levanta da cadeira diferente de como entrou é o meu maior resultado. Não tem prêmio maior do que isso.

O **Naiara Colin Espaço de Beleza** não nasceu do dia para a noite. Nasceu de coragem, de fé, de muito trabalho — e da certeza de que sonho entregue nas mãos certas, acontece.

**Se você ainda não veio, eu te convido. Aqui é o seu lugar.**

---

## ✅ Quadro 4 — Conversão, Agendamento e Funcionalidades

### Canal de Agendamento
**WhatsApp exclusivo** na versão 1. Arquitetura preparada para Trinks/AgendaOnline sem retrabalho.

### Botão WhatsApp Flutuante
- Fixed canto inferior direito, 56px, delay 3s
- Entrada: `scale(0→1.1→1)` em 400ms
- Pulso contínuo de batimento a cada 3s (box-shadow dourado)
- Hover: para o pulso + `scale(1.05)` | Click: `scale(0.95)` antes de abrir

### Mensagens WhatsApp Pré-preenchidas
| Origem | Mensagem |
|---|---|
| Flutuante geral | *"Olá, Nay! Vi o site e gostaria de agendar."* |
| Hover de serviço específico | *"Olá! Tenho interesse em [nome do serviço]."* |
| Cursos | *"Olá! Tenho interesse em saber mais sobre os cursos."* |

### Pop-ups
**Nenhum.**

### Google Maps
Seção própria **antes do rodapé** — não dentro dele. Embed integrado.

### Feed do Instagram
Grid 3×3 desktop / carrossel mobile. Cache 24h no Supabase via cron job. Curadoria manual no admin (ocultar posts específicos). Lightbox no site ao clicar — não redireciona para Instagram. Apenas fotos e reels.

### Rodapé
**Duas partes:**
- Superior: logo centralizada + linha dourada + endereço e horário em serif
- Inferior: fundo ligeiramente mais escuro, ícones sociais, WhatsApp, LGPD, copyright

Endereço clicável: copia para clipboard + tooltip "Endereço copiado" 2s. Telefone: `tel:` em mobile, clipboard em desktop.

### Banner LGPD
Primeira visita: banner fixo no rodapé. Fundo escuro, texto nude, botão "Entendi" dourado. Link para `/privacidade`.

---

## ✅ Quadro 5 — Performance, SEO, Stack e Evolução

### Stack de Desenvolvimento
| Camada | Tecnologia |
|---|---|
| Framework | Next.js (App Router) |
| Hospedagem | Vercel |
| Banco de dados / mídia | Supabase |
| Estilização | Tailwind CSS |
| Animações | Framer Motion |
| Internacionalização | next-intl (PT-BR padrão, ES, EN) |
| Domínio | naiaracolin.com.br |

### Vídeos do Hero — Carregamento
Streaming via CDN (Cloudflare). **Não aguardam carregamento completo.**
- `preload="metadata"` — carrega metadados e poster frame imediatamente
- Poster frame (WebP) exibido em < 1 segundo
- Splash desaparece quando poster frame estiver pronto (não o vídeo completo)
- Vídeo inicia reprodução após ~2s de buffer via streaming
- Se usuário já scrollou: vídeo continua carregando em background sem impacto visual
- Se após 4s o vídeo ainda não iniciou: mantém poster com indicador dourado sutil

### Painel Administrativo
- Upload de mídias por seção (Vídeo 1 destacado como "principal/mobile", Vídeo 2 como "desktop")
- Edição de textos, depoimentos, contato
- Gerenciamento de depoimentos: adicionar, reordenar, ocultar (nunca deletar)
- Gerenciamento do blog: criar, editar, publicar, despublicar
- Curadoria do feed do Instagram: ocultar posts específicos do site
- Aba Agendamentos: criada e **desabilitada** (badge "Em breve")
- Mensagens de erro em linguagem humana (sem código técnico)

### SEO Local
Palavras-chave: salão de beleza Balneário Camboriú, mechas BC, nail design BC, maquiagem profissional BC, cílios BC, lash lifting BC, estética avançada BC.

Schema: `LocalBusiness > BeautySalon` com horários, geo, aggregateRating e hasMap.

### Performance
- Score 90+ PageSpeed (mobile e desktop) — requisito
- Imagens WebP, lazy load, blur-up progressivo (Next.js `placeholder="blur"`)
- Vídeos via CDN com streaming (não aguarda carregamento completo)
- `font-display: swap`

### Blog
- SSG (Static Site Generation)
- 5 posts produzidos antes do lançamento, 1 publicado como exemplo
- Calendário editorial 3 meses (2 posts/mês) definido antes do lançamento
- Corpo do post em fundo off-white `#f5f0eb` — inversão do tema para legibilidade
- Botão de compartilhamento via Web Share API

### Analytics
- Google Analytics 4 com eventos customizados `whatsapp_click` por origem
- Google Search Console
- Dashboard Looker Studio com relatório mensal automático

### Condição de Lançamento
- [ ] Dois vídeos hero portrait 9:16 (com poster frames WebP)
- [ ] Vídeo portrait da Naiara
- [ ] Mínimo 8 fotos profissionais do espaço (WebP)
- [ ] Portfólio antes/depois (pares com enquadramento uniforme)
- [ ] Imagem/vídeo bastidores dos cursos
- [ ] 3+ depoimentos reais do Google (com foto quando disponível)
- [ ] Textos aprovados pela cliente (incluindo tradução ES e EN)
- [ ] Domínio naiaracolin.com.br registrado
- [ ] Google Meu Negócio verificado
- [ ] SVG da coroa disponível para favicon e splash

---

## 🏗️ Arquitetura de Páginas

| Página | Rota | Descrição |
|---|---|---|
| Home (one-page) | `/` | Hero → Sobre → Serviços → Diferenciais → Galeria → Depoimentos → Cursos → Mapa → Rodapé |
| Cursos | `/cursos` | Hero fullscreen → Sobre cursos → Lista de cursos → Galeria alunas → CTA WhatsApp |
| Blog | `/blog` | Listagem de posts (SSG) |
| Post individual | `/blog/[slug]` | Hero dark + corpo off-white + Web Share API |
| Admin | `/admin` | Painel protegido por Magic Link |
| Privacidade | `/privacidade` | Política de privacidade LGPD |

---

## 🔗 Integrações e Serviços Externos

| Serviço | Uso |
|---|---|
| Supabase | Banco, storage privado, auth Magic Link, Edge Function (marca d'água), cron cache Instagram |
| Vercel | Hospedagem, deploy, OG Image dinâmica, cron jobs |
| Google Analytics 4 | Eventos customizados por origem de clique |
| Google Search Console | SEO e indexação |
| Google Meu Negócio | Presença local |
| Google Maps Embed | Seção própria antes do rodapé |
| Instagram Graph API | Feed curado com cache 24h no Supabase |
| WhatsApp | Links com mensagens pré-preenchidas por contexto |
| Cloudflare | CDN para vídeos + roteamento de e-mail @naiaracolin.com.br |
| Looker Studio | Dashboard GA4 com relatório mensal automático |
| UptimeRobot | Monitoramento de uptime gratuito |
| next-intl | Internacionalização PT-BR / ES / EN |

---

## 🔐 Quadro 6 — Decisões de Refinamento: Gaps, Segurança e Infraestrutura

| Decisão | Definição |
|---|---|
| **Autenticação do admin** | Supabase Auth com Magic Link — acesso por e-mail, sem senha |
| **Ambiente de desenvolvimento** | Local para testes → deploy direto em produção quando aprovado |
| **Backup de mídias** | Manual mensal — Google Drive |
| **E-mail** | Gmail + roteamento `@naiaracolin.com.br` via Cloudflare |
| **Política de Privacidade** | Página `/privacidade` com template jurídico adaptado |
| **Rate limiting** | Nativo da Vercel + Supabase Auth para v1 |
| **Fallback de downtime** | Página de contingência dark luxury com mensagem + botão WhatsApp flutuante ativo |
| **Segurança do bucket** | Bucket privado com signed URLs geradas server-side |
| **Variáveis de ambiente** | Vercel Environment Variables + `.env.example` + repo privado + secret scanning |
| **Instagram API** | Cache 24h no Supabase via cron job. Token de 60 dias documentado no guia de operação |

---

## 🎨 Quadro 7 — Decisões de Refinamento: Experiência, Tecnologia e Diferencial

| Decisão | Definição |
|---|---|
| **Open Graph** | OG Image dinâmica via Vercel OG por página e por post do blog |
| **Schema Markup** | `LocalBusiness > BeautySalon` completo. Faixa de preço omitida |
| **Internacionalização** | PT-BR padrão + ES + EN. Toggle visível. Detecção automática + hreflang |
| **Acessibilidade** | WCAG 2.1 AA — contraste, aria-labels, alt descritivo, foco de teclado |
| **Loading Experience** | Splash screen com coroa dourada animada. Sempre dark |
| **Rastreamento de conversão** | GA4 eventos `whatsapp_click` com parâmetro de origem por serviço/seção |
| **Fallback de mídia** | Placeholder `#1a1a1a` + coroa dourada + "Em breve" em serif |
| **PWA** | `manifest.json` — ícone, tema preto, nome curto "Naiara Colin" |
| **Animação do hero** | Split reveal 1.2s + tagline em fade |
| **Página 404** | Dark luxury — copy temático em serif dourado + CTA home + WhatsApp |

---

## 🚀 Quadro 8 — Decisões de Refinamento: Operação, Crescimento e Futuro

| Decisão | Definição |
|---|---|
| **Guia do admin** | Vídeo 2–3 min gravado pelo desenvolvedor e entregue com o site |
| **Blog** | 5 posts prontos antes do lançamento, 1 publicado. Calendário 3 meses (2/mês) |
| **Métricas** | Dashboard Looker Studio + relatório mensal automático por e-mail |
| **Google Ads** | **A confirmar com a Naiara** |
| **Agendamento futuro** | Tabela `appointments` no Supabase com RLS. Aba admin desabilitada (badge "Em breve") |
| **Notificações** | Sem notificações automáticas — monitoramento manual via GA4 |
| **Depoimentos no admin** | Interface visual: adicionar, reordenar, ocultar |
| **Cursos online** | Bloco "Em breve" reservado na `/cursos` |
| **Proteção do portfólio** | Marca d'água automática via Supabase Edge Function no upload (15% opacidade) |
| **Suporte pós-lançamento** | Sob demanda — modelo a combinar com a Naiara antes da entrega |

---

## ✨ Quadro 9 — Decisões de Refinamento UI/UX: Tipografia, Espaçamento e Ritmo

| Decisão | Definição |
|---|---|
| **Tipografia fluida** | `clamp()` em todos os títulos. Testada nos três idiomas |
| **Hierarquia de serviços** | Hair Design com card de destaque maior + lista expansível. Nail e Estética em cards iguais |
| **Galeria mobile** | Carrossel snap scroll — 85% largura, próxima foto parcialmente visível, pontos dourados |
| **Seção Sobre** | Desktop: vídeo 40% + texto. Mobile: vídeo 70% + "Continuar lendo" expansível inline |
| **Hover nos cards** | `translateY(-4px)` + borda dourada + CTA "Agendar [Serviço]" em fade. 200ms |
| **Carrossel depoimentos** | Auto-play 6s, pausa hover/toque, fade, barra de progresso dourada fina |
| **Espaçamento** | 120px desktop / 80px mobile. 160px no hero e depoimentos |
| **Rodapé** | Duas partes. Google Maps em seção própria antes do rodapé |
| **Linha dourada** | 1px, 60–120px, `scaleX` animado com `transform-origin: left` |
| **Favicon e título** | Coroa dourada SVG + título dinâmico por seção via IntersectionObserver |

---

## ✨ Quadro 10 — Decisões de Refinamento UI/UX: Interação e Navegação

| Decisão | Definição |
|---|---|
| **Menu ao scroll** | Transparente → glassmorphism dark `blur(12px)` em 300ms. Logo `scale(0.85)` |
| **Âncoras** | `scroll-margin-top: 90px` + offset dinâmico via JS. `scroll-behavior: smooth` |
| **Transição entre seções** | Corte limpo direto — sem gradiente. Linha dourada como separador |
| **Loading das imagens** | Blur-up progressivo via Next.js `placeholder="blur"` |
| **Toggle de idioma** | `PT · ES · EN` 10px sans-serif, separados por pontos dourados. Presente no mobile |
| **Hero mobile** | Apenas Vídeo 1. Admin destaca visualmente o vídeo principal |
| **Ícones de serviço** | Entrada: micro-rotate 0→5→0deg, uma vez. Hover: `scale(1.1)`. SVGs dourados |
| **Seção Cursos home** | Noise grain dourado + título maior + imagem/vídeo com parallax |
| **Página `/cursos`** | Hero fullscreen → Sobre → Cards (badge "Em breve" online) → Galeria → CTA |
| **Design system** | Tokens + componentes definidos em `design-system.md` antes de codar. Blog tema escuro |

---

## ✨ Quadro 11 — Decisões de Refinamento UI/UX: Light Theme e Sistema de Design

| Decisão | Definição |
|---|---|
| **Paleta light** | `#faf7f4` warm white, texto `#1a1a1a`, alt `#f0ebe4`, cards `#ffffff`. Dourado inalterado |
| **Toggle de tema** | ☀/◐ + `PT · ES · EN` agrupados no canto direito do menu. Mobile: rodapé do overlay |
| **Imagens no light** | Vídeos mantêm overlay escuro. Fotos sem alteração |
| **Linha dourada no light** | Mesma cor, `opacity: 1` |
| **Cards no light** | `#ffffff`, borda `#e8e0d5`. Hover: borda dourada + halo `rgba(201,168,76,0.12)` |
| **Splash** | Sempre dark — decisão de identidade de marca |
| **Rodapé** | Sempre escuro (`#1a1a1a`) — bookend visual em ambos os temas |
| **Animações** | Idênticas nos dois temas. Hover cards no light: sombra dourada ao invés de brilho de borda |
| **Implementação** | `<html data-theme="dark\|light">` com CSS custom properties. Zero impacto SEO |
| **Design system** | `design-system.md` com tokens completos, tipografia, espaçamentos e componentes |

---

## ✨ Quadro 12 — Decisões de Refinamento UI/UX: Estados e Experiência Final

| Decisão | Definição |
|---|---|
| **Foco de teclado** | `:focus-visible` double-ring dourado. Inner shadow adapta por tema |
| **Max-width** | `1280px` global. Cards de depoimento: `480px` |
| **Contato clicável** | Endereço: clipboard + tooltip dourado 2s. Telefone: `tel:` mobile / clipboard desktop |
| **Vídeos hero** | Streaming CDN. Poster WebP imediato. Splash desaparece com poster pronto. Vídeo inicia em ~2s de buffer. Sem espera de carregamento completo |
| **Erros no admin** | Toasts em linguagem humana. Borda vermelha, fundo escuro, ação clara |
| **Compartilhamento** | Web Share API em posts e cursos. Mobile: sheet nativo. Desktop: clipboard + tooltip |
| **Galeria de alunas** | Masonry com gaps pretos. Hover: overlay + nome + curso em serif dourado. Lightbox |
| **Botão WA flutuante** | Entrada `scale(0→1.1→1)`. Pulso de batimento 3s. Hover: para pulso. Click: `scale(0.95)` |
| **Hambúrguer** | Linhas douradas 100%/75%/50%. Morphing para X 300ms. Mobile + tablet ≤1024px |
| **Detalhes finais** | Scrollbar thumb dourado 4px. Seleção de texto dourada translúcida. Fade preto 300ms entre páginas. Cursor com ponto dourado em elementos interativos |

---

## ⚠️ Decisões Pendentes

| Item | Status |
|---|---|
| **Google Ads no lançamento** | A confirmar com a Naiara — verba e campanha |
| **Modelo de suporte pós-lançamento** | A combinar com a Naiara antes da entrega |
| **Descrições do Nail Design** | A completar com a cliente |
| **Linha de apoio à tagline** | A definir com a cliente |
| **Tradução da tagline** | Versão em ES e EN a aprovar |
| **Cursos presenciais ativos** | Confirmar lista completa com a Naiara |

---

## 📁 Arquivos do Projeto

| Arquivo | Conteúdo |
|---|---|
| `CLAUDE.md` | Contexto permanente para agente de desenvolvimento |
| `design-system.md` | Tokens, componentes, animações e regras visuais completas |
| `naiara-colin-alinhamento.md` | Este documento — alinhamento estratégico completo |
| `briefing.md` | Briefing inicial de descoberta |

---

*Documento atualizado em 03/05/2025*
*Quadros 1–12 concluídos — alinhamento estratégico, técnico e UI/UX completo*
*Próximo passo: iniciar desenvolvimento com base no CLAUDE.md e design-system.md*
