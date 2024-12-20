# Projeto de Gestão de Vouchers e Clientes

Este projeto consiste em dois microserviços: **Voucher Service** e **Client Service**, ambos implementados com o framework NestJS. O projeto oferece funcionalidades de **CRUD** para vouchers e clientes, com rotas protegidas por JWT.

### Funcionalidades

- **Voucher Service**: Permite realizar operações de criação, leitura, atualização e exclusão de vouchers.
- **Client Service**: Permite realizar operações de criação, leitura, atualização e exclusão de clientes.
- **Autenticação JWT**: As rotas de criação e operações sensíveis em ambos os serviços são protegidas por autenticação via JWT.

### Como rodar o projeto

#### Pré-requisitos

- Docker (recomendado para rodar os containers)
- Docker Compose (para orquestrar os containers)
- Node.js e npm (caso deseje rodar sem Docker)

#### Passo a Passo

1. **Clone o repositório**

   Clone este repositório em sua máquina local:

   ```bash
   git clone <URL_do_repositório>
   cd <diretório_do_repositório>
   ```

2. **Configuração das variáveis de ambiente**

Entre nas pastas de cada serviço (client_service e voucher_service) e copie o arquivo .env.example para um arquivo .env.

```bash
cd client_service
cp .env.example .env
cd ../voucher_service
cp .env.example .env
```
3. **Subir os containers com Docker Compose**

Após configurar os arquivos .env, volte à raiz do projeto e execute o comando abaixo para subir todos os containers:

```bash
docker-compose up --build
```
O comando irá construir as imagens dos serviços e iniciar os containers, incluindo os bancos de dados necessários.

4. **Acessando as APIs**

Após o Docker Compose iniciar os serviços, você pode acessar os Swagger das duas APIs nas seguintes URLs:

* Client Service Swagger: http://localhost:3002/api
* Voucher Service Swagger: http://localhost:3001/api

Esses endpoints permitem explorar e testar as rotas das respectivas aplicações.

5 **Exemplo de Interação entre os Serviços**

Um bom exemplo de interação entre os dois serviços é a consulta de um único cliente, que traz junto os vouchers daquele cliente. Para isso, você pode fazer uma requisição GET na rota de clientes e, por meio do relacionamento entre os dados, obter também os vouchers relacionados ao cliente.

Exemplo de chamada para obter um cliente e seus vouchers:

```http
GET http://localhost:3002/api/clients/{clientId}
Authorization: Bearer {JWT_Token}

```
Resposta esperada:

```json
{
  "id": 1,
  "name": "Client Name",
  "email": "client@example.com",
  "vouchers": [
    {
      "id": 1,
      "voucherCode": "VOUCHER123",
      "amount": 100
    },
    {
      "id": 2,
      "voucherCode": "VOUCHER456",
      "amount": 50
    }
  ]
}
```

6. **Fechar os containers**

Para parar os containers, basta executar:

```bash
docker-compose down
```
