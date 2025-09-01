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
