# EC02 – Sistema de Gestão de Funcionários

Trabalho da disciplina **Tecnologia e Construção de Software**.  
Aplicação simples em **HTML + JavaScript** para gerenciar funcionários no navegador, com execução em **Docker** via Nginx.

---

## Objetivo
Permitir **cadastrar, listar, editar e excluir** funcionários e gerar **relatórios** usando métodos de array do JavaScript.

---

## Requisitos atendidos
- Classe `Funcionario` com **atributos**, **construtor**, **getters/setters** e `toString()`.
- **Cadastro** e **listagem** em tabela HTML.
- **Excluir** e **editar** com dados carregados no formulário.
- **Eventos** usando **funções anônimas** e **arrow functions**.
- Relatórios com **map**, **filter**, **reduce** e **Set**:
  - Salários maiores que R$ 5.000
  - Média salarial
  - Cargos únicos
  - Nomes em maiúsculo
- **Versionado no GitHub** e **container Docker** para execução.

---

## Estrutura
```
EC02-Produtos/
├── docs/
├── src/
│   └── script.js
├── tests/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── index.html
└── README.md
```

---

## Como executar

### Opção 1: Abrir localmente
1. Abra o arquivo `index.html` no seu navegador.
2. Use o formulário para cadastrar e os botões para editar, excluir e gerar relatórios.

### Opção 2: Docker
1. Build da imagem:
   ```bash
   docker build -t ec02-funcionarios .
   ```
2. Rodar o container:
   ```bash
   docker run --rm -p 8080:80 ec02-funcionarios
   ```
3. Acesse no navegador:
   ```
   http://localhost:8080
   ```

---

## Uso rápido
1. Preencha **Nome**, **Idade**, **Cargo**, **Salário** e clique em **Cadastrar**.
2. Para **editar**, clique em **Editar** na tabela, ajuste os campos e confirme em **Atualizar**.
3. Para **excluir**, clique em **Excluir**.
4. Use os botões de **Relatórios** para ver filtros e métricas.
