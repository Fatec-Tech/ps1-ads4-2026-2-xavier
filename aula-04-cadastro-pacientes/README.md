# Cadastro de Pacientes — CRUD com Express e Fetch API

Este projeto é um sistema simples de cadastro de pacientes. Desenvolvi uma API REST com Node.js e Express e um frontend com HTML, CSS e JavaScript, que consome a API usando Fetch. O projeto está publicado no Render.

Fiz o projeto como atividade prática da disciplina Programação de Scripts I, do curso de Análise e Desenvolvimento de Sistemas da FATEC Lins. A atividade é sobre Express e operações CRUD.

> **Atenção:** a API é pública e não tem autenticação. Não cadastre dados pessoais ou reais. Os dados ficam em memória e voltam ao estado inicial quando o servidor reinicia.

## Links

| Item | URL |
|---|---|
| Repositório | `https://github.com/Fatec-Tech/ps1-ads4-2026-2-xavier/tree/main/aula-04-cadastro-pacientes` |
| Backend em produção | `https://api-clinica-eduardo-xavier.onrender.com/pacientes` |
| Frontend em produção | `https://app-clinica-eduardo-xavier.onrender.com/` |

O plano gratuito do Render pode suspender o serviço depois de um período sem acesso. Por isso, a primeira requisição pode demorar cerca de um minuto.

## Sobre a atividade

Nesta atividade, evoluí o cadastro de pacientes da aula anterior, que usava o módulo `http` do Node.js e permitia apenas consultar dados. O objetivo foi criar uma aplicação com operações CRUD:

- **Backend:** servidor Express com rotas para consultar, cadastrar, atualizar e excluir pacientes. Os dados são mantidos em memória.
- **Frontend:** formulário para cadastrar e editar pacientes, tabela com os dados da API e botões para editar e excluir.
- **Publicação:** backend como *Web Service* e frontend como *Static Site* no Render.

## Funcionalidades

- Listar pacientes e filtrar a lista pelo nome.
- Consultar um paciente pelo ID e consultar a quantidade de pacientes.
- Cadastrar pacientes, validando os campos obrigatórios e impedindo e-mails duplicados.
- Atualizar e excluir pacientes.
- Mostrar mensagens de sucesso e erro na interface e pedir confirmação antes de excluir.
- Usar o mesmo formulário para cadastro e edição.
- Inserir os dados da tabela com `textContent`.

## Tecnologias

**Backend:** Node.js, Express 5 e cors  
**Frontend:** HTML5, CSS3, JavaScript, Fetch API e Bootstrap 5  
**Publicação e versionamento:** Git, GitHub e Render

## Estrutura do projeto

```text
.
├── .gitignore
├── README.md
├── backend/
│   ├── package.json
│   └── server.js
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## Endpoints da API

Recurso principal: `/pacientes`

| Operação | Método | Endpoint | Sucesso | Erros |
|---|---|---|---|---|
| Listar ou filtrar por nome | `GET` | `/pacientes?nome=ana` | `200` + array | — |
| Contar pacientes | `GET` | `/pacientes/total` | `200` + total | — |
| Buscar um paciente | `GET` | `/pacientes/:id` | `200` + paciente | `404` |
| Cadastrar | `POST` | `/pacientes` | `201` + paciente criado | `400`, `409` |
| Atualizar | `PUT` | `/pacientes/:id` | `200` + paciente atualizado | `400`, `404` |
| Excluir | `DELETE` | `/pacientes/:id` | `204` sem corpo | `404` |

### Modelo do paciente

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria.silva@email.com",
  "nascimento": "1990-04-12"
}
```

Os campos `nome`, `email` e `nascimento` são obrigatórios no `POST` e no `PUT`. Os erros retornam um objeto como `{ "erro": "mensagem" }`. O cadastro retorna `409` quando o e-mail já está sendo usado. O filtro por nome não diferencia letras maiúsculas de minúsculas.

### Testando com curl

Os exemplos abaixo usam a sintaxe do Bash. No PowerShell, use `curl.exe` e informe cada comando em uma única linha.

```bash
# Listar
curl http://localhost:3000/pacientes

# Filtrar pelo nome
curl "http://localhost:3000/pacientes?nome=ana"

# Consultar a quantidade
curl http://localhost:3000/pacientes/total

# Buscar pelo ID
curl -i http://localhost:3000/pacientes/1

# Cadastrar
curl -i -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paciente Teste","email":"teste@email.com","nascimento":"1995-02-20"}'

# Tentar cadastrar novamente o mesmo e-mail (409)
curl -i -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Outro Paciente","email":"teste@email.com","nascimento":"1990-01-01"}'

# Atualizar o paciente criado acima
curl -i -X PUT http://localhost:3000/pacientes/4 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paciente Teste 2","email":"teste@email.com","nascimento":"1995-02-20"}'

# Excluir
curl -i -X DELETE http://localhost:3000/pacientes/4

# Casos de erro: paciente inexistente (404) e corpo vazio (400)
curl -i -X DELETE http://localhost:3000/pacientes/999
curl -i -X POST http://localhost:3000/pacientes
```

## Como executar localmente

É necessário ter o Node.js instalado. O comando `npm run dev` usa `node --watch`, disponível nas versões recentes do Node.js.

```bash
# Clonar o repositório
git clone https://github.com/Fatec-Tech/ps1-ads4-2026-2-xavier.git
cd ps1-ads4-2026-2-xavier/aula-04-cadastro-pacientes

# Instalar as dependências e iniciar o backend
cd backend
npm install
npm run dev
```

O backend fica disponível em `http://localhost:3000`. Para abrir o frontend, use outra janela de terminal e abra `frontend/index.html` no navegador ou inicie a extensão *Live Server* do VS Code.

Para fazer o frontend local conversar com o backend local, altere a constante no início de `frontend/js/app.js`:

```javascript
const URL_API = 'http://localhost:3000/pacientes';
```

Para usar o frontend publicado, a constante deve apontar para a URL do backend no Render.

## Publicação no Render

### Backend — Web Service

| Campo | Valor |
|---|---|
| Name | `api-clinica-eduardo-xavier` |
| Root Directory | `aula-04-cadastro-pacientes/backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

O servidor usa a porta de `process.env.PORT` ou, se ela não estiver definida, a porta `3000`.

### Frontend — Static Site

| Campo | Valor |
|---|---|
| Name | `app-clinica-eduardo-xavier` |
| Root Directory | `aula-04-cadastro-pacientes/frontend` |
| Build Command | deixar vazio |
| Publish Directory | `.` |

Com a integração do repositório configurada no Render, um `git push` na branch principal inicia um novo deploy.

## O que pratiquei

- CRUD e a relação entre operações e métodos HTTP.
- Rotas com parâmetros (`req.params`) e leitura de JSON enviado no corpo da requisição (`req.body`).
- Middlewares (`cors()` e `express.json()`) e a importância de declará-los antes das rotas.
- Códigos de status HTTP, como 200, 201, 204, 400, 404 e 409.
- Consumo de API com Fetch e `async/await`.
- Manipulação do DOM com `createElement` e `textContent`.
- Uso de variáveis de ambiente e diferenças entre os ambientes local e de produção.
- Versionamento com Git e configuração do `.gitignore`.

## Dificuldades que encontrei

Uma das partes que exigiu mais atenção foi a ordem das rotas. `GET /pacientes/total` precisa vir antes de `GET /pacientes/:id`; caso contrário, o Express interpreta `total` como se fosse um ID.

Também precisei converter `req.params.id` para número, porque o parâmetro chega como texto. Para tratar requisições sem os dados esperados, usei `req.body ?? {}` e validei os campos antes de cadastrar ou atualizar.

Outro cuidado foi usar `return` nas respostas de erro para a rota não continuar executando depois de enviar a resposta. Durante os testes, também conferi a URL da API, o CORS e o tempo de inicialização do serviço gratuito no Render.

Por fim, percebi que os dados guardados em memória voltam ao estado inicial quando o servidor reinicia.

## O que aprendi

- Testar cada rota separadamente com `curl`, Thunder Client ou pela aba *Network* ajuda a encontrar problemas antes de integrar com o frontend.
- O Express deixa a criação das rotas mais direta do que usar apenas o módulo `http`.
- Os status HTTP ajudam a identificar o resultado de cada operação.
- Depois de cadastrar, editar ou excluir, o frontend busca novamente os dados da API.
- Usei `textContent` para inserir os dados na tabela sem interpretá-los como HTML.
- Separar frontend e backend permite trocar a interface sem mudar a API, desde que o contrato entre eles continue o mesmo.
- A perda dos dados ao reiniciar o servidor mostrou por que precisamos armazená-los em um banco de dados.

## Limitações e próximos passos

- Os dados ficam somente em memória e não persistem quando o servidor reinicia.
- A API não tem autenticação e pode ser acessada por qualquer pessoa.
- Como próximo passo, pretendo estudar como salvar os dados em um banco PostgreSQL.
- Outras melhorias possíveis são validar melhor o formato do e-mail e a data de nascimento, além de adicionar atualização parcial com `PATCH`.

## Issues da atividade

- Exercícios e melhorias da API: [Issue #7](https://github.com/Fatec-Tech/ps1-ads4-2026-2-xavier/issues/7)
- Perguntas para discussão: [Issue #8](https://github.com/Fatec-Tech/ps1-ads4-2026-2-xavier/issues/8)

## Autor

**Eduardo Xavier dos Santos**  
Estudante de Análise e Desenvolvimento de Sistemas — FATEC Lins  
GitHub: [@eduduf](https://github.com/eduduf)
