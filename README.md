# 🛠 VUTTR - (Very Useful Tools to Remember) Application 🔥

#### 🚀 API desenvolvida em Node.js para teste na plataforma BossaBox.

   + 🌠 Foram utilizadas as tecnologias:
        - Node.js, Express, JWT, Bancos de Dados PostgreSQL e Redis.
      
   + 📝 Padronização de código: </br>
        - Eslint e Prettier. 
      
   + 🔧 Ferramentas/Frameworks:
        - Docker, Sequelize ORM, Jest(TDD), API Blueprint
    
   + 🔏 Segurança: 
        - bcryptjs: Gerador de hashs de senhas padrão.
        - express-brute: Para proteção contra ataques de força bruta. 
        - express-rate-limit: Proteção contra requisições maliciosas na rota da aplicação. 
        - helmet: Configura cabeçalhos HTTP e protege contra vários ataques como XSS e Sniffing. 
    
   +  Deploy:
        - Digital Ocean
        - CI/CD: Buddy Works

 ### 🏁 Instalação
    
   ##### 1.Instalar todas as dependências:
        yarn/npm i
   ##### 2. Executar migrations:
        yarn/npx sequelize db:migrate
   ##### 3. Executar testes da aplicação
        yarn/npm run test
   ##### 4. Executar API em ambiente de desenvolvimento, porta padrão 3333
        yarn/npm run dev*
   ##### 5. Renderizando e visualizando documentação da API, porta padrão 3000
        yarn/npm run doc
        yarn/npm run doc --server
   
  ### 🔨 Comandos úteis:
   ##### Ambiente de produção:
        - yarn/npm run build: Realiza build da aplicação.
        - yarn/npm run start: Executa projeto em produção.

