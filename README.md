# HUB AI

HUB AI é um projeto baseado no open source [Open Web UI](https://github.com/open-web-ui/open-web-ui) para criação de interfaces de AI.

## Estrutura

* **Padrões de cores:** configurados via **TailwindCSS**.
* **Assets (logo e temas):**

  * Front-end: `src/static`
  * Back-end: `backend/open_webui/static`

## Instalação e execução

### Pré-requisitos

* Node.js **v24.5.0**
* Python **v3.11.0**
* Docker (se for rodar com Ollama)

### Passos

1. Instalar dependências Node.js:

```bash
npm i --save
```

&#9888; Caso tenha algum problema na instalação, remover dependencias da Lib @tiptap. Após a instalação rodar comando

```bash
npm install \
@tiptap/core@latest \
@tiptap/extension-bubble-menu@latest \
@tiptap/extension-code-block-lowlight@latest \
@tiptap/extension-drag-handle@latest \
@tiptap/extension-file-handler@latest \
@tiptap/extension-floating-menu@latest \
@tiptap/extension-highlight@latest \
@tiptap/extension-image@latest \
@tiptap/extension-link@latest \
@tiptap/extension-list@latest \
@tiptap/extension-mention@latest \
@tiptap/extension-table@latest \
@tiptap/extension-typography@latest \
@tiptap/extension-youtube@latest \
@tiptap/extensions@latest \
@tiptap/pm@latest \
@tiptap/starter-kit@latest

```

2. Instalar dependências Python:

```bash
pip install open-webui
```

3. Criar envs no seu local (A partir de env.example:

4. Rodar o servidor do Open Web UI:

```bash
open-webui serve
```

5. Rodar Ollama via Docker:

```bash
docker-compose up ollama
```

6. Rodar front-end em modo desenvolvimento:

```bash
npm run dev
```

## Observações

* O front-end e back-end podem ser customizados conforme necessário.
* As cores e temas podem ser alterados diretamente nos arquivos de TailwindCSS e na pasta `static`.





# Guia de Pastas & Módulos

> Documentação de arquitetura, estrutura de pastas e responsabilidades de cada módulo, com foco em onboarding rápido para colaboradores.

---

## 1) Visão geral

**Stack:** SvelteKit + TypeScript + TailwindCSS.
**Padrão de organização:**

* `lib/` concentra APIs, componentes, stores, tipos e utilidades.
* `routes/` define páginas e layouts SvelteKit.
* `workers/` e `pyodide/` isolam tarefas pesadas em Web Workers.

### Principais conceitos

* **APIs tipadas:** `lib/apis/*` expõe clientes HTTP/streaming por domínio (auth, chats, models, etc.).
* **Estado global:** `lib/stores` agrupa stores da aplicação (usuário, UI, sessão, etc.).
* **Componentização:** `lib/components` divide UI por áreas (chat, admin, workspace, comuns).
* **i18n:** `lib/i18n` carrega traduções e configura fallback.

---

## 2) Estrutura de pastas (mapa funcional)

```
├── app.css
├── app.d.ts
├── app.html
├── index.ts
├── constants.ts
├── dayjs.js
├── emoji-groups.json
├── emoji-shortcodes.json
├── pyodide/
├── workers/
├── lib/
└── routes/
```

### Raiz do projeto

* **app.css / tailwind.css** — Estilos globais; `tailwind.css` concentra diretivas/utilitários do Tailwind.
* **app.d.ts** — Tipagens globais e augmentations TS da app.
* **app.html** — HTML base utilizado pelo SvelteKit para injetar a aplicação.
* **index.ts** — Entrada client-side (bootstrap SvelteKit).
* **constants.ts** — Constantes compartilhadas (flags/urls/chaves de feature).
* **dayjs.js** — Configuração de datas (plugins/locale do Day.js).
* **emoji-\*.json** — Dicionários de grupos e shortcodes de emoji usados no chat/markdown.

### `pyodide/`

* **pyodideKernel.ts** — Orquestra execução Python (Pyodide) no navegador.
* **pyodideKernel.worker.ts** — Worker que isola execução Python para não travar a UI.

### `workers/`

* **kokoro.worker.ts / KokoroWorker.ts** — Pipeline de síntese de voz (TTS Kokoro) em worker.
* **pyodide.worker.ts** — Worker utilitário para tarefas Python gerais.

---

## 3) `lib/` – Núcleo de front-end

### 3.1) `lib/apis/` – Clientes de API por domínio

Cada pasta expõe um `index.ts` com funções tipadas (REST/streaming) para um domínio específico:

* **audio/** — Upload/captura/controle de áudio; endpoints de **TTS/STT**.
* **auths/** — Autenticação: login, sessão, update de senha (ex.: user/pass/LDAP/OAuth).
* **channels/** — Canais (estilo Slack): criar/listar, mensagens e threads.
* **chats/** — Histórico, compartilhamento, tags e gestão de chats 1:1 ou multiusuário.
* **configs/** — Configurações globais do servidor/app.
* **evaluations/** — Avaliações de respostas/modelos (A/B, arena, coleta de feedback).
* **files/** — Upload/download, metadados, parsing e preview de arquivos.
* **folders/** — Pastas e hierarquias para organização (chats/arquivos).
* **functions/** — Registro/execução de “server functions”/tools (schemas, inputs, exec).
* **groups/** — Grupos de usuários, permissões e escopos.
* **images/** — Geração/edição/gestão de imagens.
* **knowledge/** — Bases de conhecimento; ingesta e busca (RAG).
* **memories/** — Memórias do usuário (personalização de respostas).
* **models/** — Registro/gerência de modelos (OpenAI, Ollama etc.).
* **notes/** — CRUD de notas (rich text + IA assistiva).
* **ollama/** — Integração com **Ollama** (listar modelos, inferência).
* **openai/** — Integração com **OpenAI** (chat, imagens, TTS/STT).
* **prompts/** — Biblioteca de prompts, variáveis e versionamento.
* **retrieval/** — Pipelines de RAG (indexação, embeddings, consulta).
* **streaming/** — SSE/WebSocket para respostas em streaming.
* **tools/** — Toolkits externos (web-search, code-exec) e servidores de tools.
* **users/** — CRUD de usuários, perfis e dados administrativos.
* **utils/** — Cliente HTTP, interceptors, helpers e tipos compartilhados.
* **index.ts** — Barrel export central das APIs.

> **Boas práticas**: Cada `apis/*/index.ts` deve expor funções puras, tipadas e sem efeitos colaterais de UI. Erros devem ser normalizados (ex.: `ApiError`).

### 3.2) `lib/components/` – Biblioteca de componentes

Componentes Svelte, organizados por áreas de produto.

#### Admin (`lib/components/admin/`)

* **Evaluations/** — UI de avaliações: feedbacks, leaderboard, modais.
* **Functions/** — Editor/menus de “server functions” (schemas, inputs, permissões).
* **Settings/** — Painéis de configuração:

  * **Audio** (dispositivos/qualidade), **CodeExecution**, **Connections** (Ollama/OpenAI), **Database**, **Documents**, **Evaluations**, **Interface** (+ Banners), **Models** (gestão/pin/configuração), **Pipelines**, **Tools**, **WebSearch**.
* **Users/** — Gestão de usuários, grupos, permissões e chats do usuário.

#### Chat (`lib/components/chat/`)

* **Chat.svelte** — Container principal de chat.
* **ChatControls / Controls/** — Ajustes do modelo (temperatura/top‑p…); “valves”.
* **MessageInput/** — Input avançado com comandos (prompts/models/knowledge), upload, voz, variáveis.
* **Messages/** — Renderização completa: Markdown (com KaTeX/HTML), CodeBlock, Citations, MultiResponse, RateComment, ProfileImage, Skeleton, Error.
* **Artifacts.svelte** — Área para artefatos (código/arquivos) produzidos pelo chat.
* **ModelSelector/** — Seletor de modelos (pin/menus).
* **Overview/** — Visual do pipeline (nós/arestas) da execução.
* **Settings/** — Configurações dentro do chat (preferências por conversa).
* **Modais utilitárias** — ShareChatModal, TagChatModal, Suggestions, ChatPlaceholder.

#### Canais (`lib/components/channel/`)

* **Channel.svelte** e **Messages/Thread** — UI de canal (lista/threads), Navbar e MessageInput dedicados.

#### Notes (`lib/components/notes/`)

* **NoteEditor/** — Editor de notas (rich text + IA); **NotePanel/Notes/RecordMenu** para organização e gravação.

#### Playground (`lib/components/playground/`)

* **Chat / Completions** — Telas para testar chat/completions.

#### Layout (`lib/components/layout/`)

* **Navbar/Sidebar** — Cabeçalho e navegação geral (itens, pinned models).
* **Modals** — Busca, chats arquivados, pastas, etc.
* **Overlay/AccountPending** — Estados de conta/avisos.
* **UpdateInfoToast** — Avisos de versão/atualizações.

#### Workspace (`lib/components/workspace/`)

* **Knowledge/** — CRUD de bases de conhecimento e upload.
* **Models/** — Editor/menus de modelos (capacidades, filtros, tools, knowledge).
* **Prompts/** — Editor/menus de prompts (variáveis, organização).
* **Tools/** — Editor de toolkits (inputs, ações, permissões).
* **common/** — Acessos/manifest/valves em modais reutilizáveis.

#### Comuns (`lib/components/common/`)

* **UI primitives** — Botões, inputs, modal, dropdown, tooltip, drawer, pagination, loader, spinner, toggles, checkbox, textarea, banner, badge etc.
* **Arquivo/imagem** — FileItem, ImagePreview.
* **CodeEditor** — Editor com destaque de sintaxe e suporte a execução.
* **RichTextInput** — Campo rich-text com formatação e upload (plugins de imagem).
* **SVGPanZoom** — Visualização pan/zoom de SVG.
* **Valves / MapSelector** — Controles para ajuste fino de parâmetros de execução.

#### Ícones (`lib/components/icons/`)

* Conjunto de ícones como componentes Svelte (Heroicons‑like) para uso em toda a UI.

#### Outros utilitários visuais

* **AddConnectionModal / AddServerModal / ToolServersModal** — Configuração rápida de conexões/servidores.
* **AddFilesPlaceholder / ImportModal** — Fluxos de importação de arquivos.
* **NotificationToast / OnBoarding / ChangelogModal** — Mensagens sistêmicas e onboarding.
* **app/AppSidebar.svelte** — Sidebar principal do app (atalhos/navegação).

### 3.3) `lib/stores/`

* **index.ts** — Stores globais (usuário, sessão, chats, canais, configurações, tema, sockets e estados de UI). Centraliza reatividade cross‑feature.

### 3.4) `lib/types/`

* **index.ts** — Tipos/DTOs compartilhados (Chats, Messages, Models, Toolkits, Knowledge, Users, etc.).

### 3.5) `lib/utils/`

* **ai-models-utils.ts** — Normalização/configuração de provedores/modelos.
* **characters/** — Presets de “personas”/personagens (prompts base).
* **google-drive-picker.ts / onedrive-file-picker.ts** — Integração com pickers Drive/OneDrive.
* **marked/** — Extensões do Marked (markdown), incluindo **katex-extension** (LaTeX).
* **transitions/** — Transições/animações utilitárias para Svelte.
* **index.ts** — Funções utilitárias (formatação, ids, validações, etc.).
* **\_template\_old.ts** — Template legado para referência/histórico.

---

## 4) `routes/` – Páginas & layouts (SvelteKit)

> Regra: `+layout.svelte` define o layout da seção; `+page.svelte` define a página. Rotas dinâmicas usam colchetes (ex.: `[id]`).

### 4.1) Núcleo `(app)/`

* **(app)/+layout.svelte** — Layout principal (navbar/sidebar) da área logada.
* **(app)/+page.svelte** — Dashboard/Home da área logada.

#### Admin `(app)/admin/`

* `+layout.svelte` e `+page.svelte` — Casca e página principal do painel.
* **analytics/**, **evaluations/**, **functions/**, **settings/**, **users/** — Módulos administrativos com rotas por aba em `[tab]/+page.svelte`.

#### Outras rotas de app

* **c/\[id]/+page.svelte** — Visualização de chat específico por ID curto.
* **channels/\[id]/+page.svelte** — Página de um canal específico.
* **home/** — Home alternativa/minimalista.
* **notes/** — Listagem/edição de notas; `[id]` abre uma nota específica.
* **playground/** — Playground (chat e completions para testes).
* **workspace/** — “Estúdio” para **knowledge**, **models**, **prompts** e **tools** (listagem, `create`, `edit`, `[id]`).

### 4.2) Globais

* **+layout.svelte / +layout.js** — Layout raiz e bootstrap (ex.: i18n/tema).
* **+error.svelte** — Página de erro global.
* **auth/+page.svelte** — Tela de autenticação (login/signup/reset).
* **error/+page.svelte** — Página de erro dedicada.
* **s/\[id]/+page.svelte** — Compartilhamento público de chat/artefato por ID.
* **watch/+page.svelte** — Visualização estilo “watch” (replay/stream).

---

## 5) i18n

* **lib/i18n/index.ts** — Inicialização do mecanismo (carregamento, fallback).
* **lib/i18n/locales/** — Pacotes de tradução: `en-US`, `es-ES`, `pt-BR` e `languages.json` (metadados/lista).

**Boas práticas**

* Evite strings hardcoded em componentes.
* Centralize chaves e mantenha paridade entre idiomas.

---

## 6) Execução isolada (Workers & Pyodide)

* **workers/** — Processamento de TTS (Kokoro) e tarefas Python em segundo plano.
* **pyodide/** — Kernel e worker para execução de Python no navegador.

**Quando usar**

* Qualquer tarefa pesada/bloqueante (TTS/STT, parsing de arquivo, execução de código) deve rodar em worker para manter a UI responsiva.

---

## 7) Fluxo arquitetural (alto nível)

1. **UI/Rotas** (`routes/*` + `lib/components/*`) renderizam páginas e componentes.
2. **Estado global** (`lib/stores`) mantém usuário, sessão, chats, canais, tema e estados de UI.
3. **APIs** (`lib/apis/*`) abstraem chamadas HTTP/SSE/WS (OpenAI, Ollama, backend).
4. **Workers** (`workers/*`, `pyodide/*`) lidam com tarefas pesadas fora da thread da UI.
5. **Utils/Types** padronizam contratos entre camadas e reduzem acoplamento.

---

## 8) Convenções & diretrizes

* **Nomenclatura:** `PascalCase` para componentes; `camelCase` para funções/variáveis; `kebab-case` para arquivos Svelte.
* **Erros:** padronize estruturas de erro nas APIs (ex.: `{ code, message, details }`).
* **Acessibilidade:** valide foco/atalhos/aria‑labels em componentes comuns.
* **Performance:** prefira stores derivados/memoização; use workers para tarefas pesadas; evite recomputações em Markdown/CodeEditor.
* **Testabilidade:** isole lógica em helpers e APIs; mantenha componentes “finos”.

---

## 9) Como estender (exemplos práticos)

### 9.1) Nova API de domínio

1. Crie `lib/apis/<dominio>/index.ts` com funções tipadas (ex.: `list()`, `get(id)`, `create(dto)`).
2. Exporte no `lib/apis/index.ts` (barrel export).
3. Consuma a API em componentes via funções puras (sem side effects de UI).

### 9.2) Novo módulo de UI

1. Crie componentes em `lib/components/<area>/`.
2. Se necessário, defina stores específicos em `lib/stores` (ou derive dos existentes).
3. Conecte em uma rota nova em `routes/<area>/+page.svelte` (ou sub-rotas `create`, `edit`, `[id]`).

### 9.3) Nova view de administração

1. Adicione uma pasta em `(app)/admin/<modulo>/`.
2. Use `[tab]/+page.svelte` para subpáginas por aba.
3. Reutilize componentes de `lib/components/admin/*`.

---

## 10) Segurança & privacidade (resumo)

* **Isolamento:** execução de código e TTS/STT em workers.
* **Tratamento de dados:** normalize dados sensíveis nas camadas `apis/*`.
* **Permissões:** delegue verificação de escopo a `users/` e `groups/` quando aplicável.

---

## 11) Anexos úteis

* **AppSidebar / Navbar / Pinned Models:** pontos centrais de navegação (fixar modelos, alternar áreas).
* **Marked + KaTeX:** suporte a Markdown avançado com renderização LaTeX.
* **SVGPanZoom:** navegação e zoom para artefatos/gráficos complexos.

---


