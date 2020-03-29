# 💾 VUTTR - (Very Useful Tools to Remember)

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
  
   + 🌩 Aplicação hospedada para consumo [aqui](https://github.com/Leon4rdoMonteiro)
        

 ### 🖊 Configurações:
 
 Alterar variáveis de ambiente para conectar o banco de dados SQL ao Sequelize.

```js
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
```

Alterar variáveis de ambiente para conectar a aplicação ao banco de dados Redis. 

```js
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```
 ### 🏁 Instalação:
  
   ##### 1.Instalar todas as dependências:
        yarn/npm i
   ##### 2. Criando e executando Docker Container:
        docker-compose up -d
   ##### 3. Executar migrations:
        yarn/npx sequelize db:migrate
   ##### 4. Executar testes da aplicação:
        yarn/npm run test
   ##### 5. Executar API em ambiente de desenvolvimento, porta padrão 3333:
        yarn/npm run dev*
   ##### 6. Renderizando e visualizando documentação da API, porta padrão 3000:
        yarn/npm run doc
        yarn/npm run doc --server
   
  ### 🔨 Comandos úteis:
   ##### Ambiente de produção:
        - yarn/npm run build: Realiza build da aplicação.
        - yarn/npm run start: Executa projeto em produção.

Autor: [Leonardo Monteiro](https://github.com/Leon4rdoMonteiro)
