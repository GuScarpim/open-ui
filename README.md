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
* Python
* Docker (se for rodar com Ollama)

### Passos

1. Instalar dependências Node.js:

```bash
npm i --save
```

2. Instalar dependências Python:

```bash
pip install open-webui
```

3. Rodar o servidor do Open Web UI:

```bash
open-webui serve
```

4. Rodar Ollama via Docker:

```bash
docker-compose up ollama
```

5. Rodar front-end em modo desenvolvimento:

```bash
npm run dev
```

## Observações

* O front-end e back-end podem ser customizados conforme necessário.
* As cores e temas podem ser alterados diretamente nos arquivos de TailwindCSS e na pasta `static`.
