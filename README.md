<br />
<p align="center">
  <a href="https://github.com/Leon4rdoMonteiro">
    <img src="https://i.ibb.co/xH15P8V/VUTTR.png" width=300 height=300 alt="Logo">
  </a>
<h1 align="center"> <b>📦 VUTTR-BOSSABOX </b></h1>
</p>

Autor: [Leonardo Monteiro](https://github.com/Leon4rdoMonteiro)

#### 🚀 API desenvolvida em Node.js para teste na plataforma BossaBox.

   + 🌠 Foram utilizadas as tecnologias:
        - Node.js, Express, JWT, Bancos de Dados PostgreSQL e Redis.
      
   + 📝 Padronização de código: </br>
        - Eslint e Prettier. 
      
   + 🛠 Ferramentas/Frameworks:
        - Docker, Sequelize ORM, Jest(TDD), API Blueprint
    
   + 🔏 Segurança: 
        - bcryptjs: Gerador de hashs de senhas padrão.
        - express-brute: Para proteção contra ataques de força bruta. 
        - express-rate-limit: Proteção contra requisições maliciosas na rota da aplicação. 
        - helmet: Configura cabeçalhos HTTP e protege contra vários ataques como XSS e Sniffing. 
    
   + 🖥 Deploy:
        - Digital Ocean
        - CI/CD: Buddy Works
  
   + 🌩 Aplicação hospedada para consumo [aqui](http://vuttr.deepcrypto.com.br/v1)
        - Obs: Todas as rotas iniciam com o prefixo /v1
        
   + 📜 Para visualizar a documentação clique [aqui](http://vuttr.deepcrypto.com.br/docs)
        

 ### 🖊 Configurações:
 

  - Criar arquivos de configuração: ```.env e .env.test``` com base nos arquivos: ```.env.example e .env.test.example```
 
 
  + Criar um APP_SECRET para geração dos tokens e armazenar nas variáveis de ambiente.
  
```js
APP_SECRET=
```
 
 + Alterar variáveis de ambiente para conectar o banco de dados SQL ao Sequelize.
  
```js
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
```
    Obs: Criar uma nova base de dados no container para o realizar os testes ou utilizar a base principal. 

+ Alterar variáveis de ambiente para conectar a aplicação ao banco de dados Redis. 

```js
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

```
Usuário de teste para autenticar-se na API: 

```js
{
  "email": "jhon@email.com",
  "password: "12345678"
}
```
    
    Obs: Criar diretório tmp/uploads/ dentro da pasta backend.

 ### 🏁 Instalação:
  
   ##### 1.Instalar todas as dependências:
        yarn | npm i
   ##### 2. Criando e executando Docker Container:
        docker-compose up -d
   ##### 3. Executar testes da aplicação:
        yarn test | npm run test
   ##### 4. Executar migrations:
        yarn sequelize db:migrate |npx sequelize db:migrate
   ##### 5. Executar seeds:
        yarn sequelize db:seed:all | npx sequelize db:seed:all
   ##### 6. Executar API em ambiente de desenvolvimento, porta padrão 3333:
        yarn dev |npm run dev
   ##### 7. Renderizando e visualizando documentação da API, porta padrão 3000:
        yarn doc | npm run doc
        yarn doc --server | npm run doc --server
   
  ### 🔨 Comandos úteis:
   ##### Ambiente de produção:
        - yarn build | npm run build: Realiza build da aplicação.
        - yarn start | npm run start: Executa projeto em produção.

