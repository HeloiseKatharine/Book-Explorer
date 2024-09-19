# Projeto Book-Explorer

Este projeto é uma aplicação web que utiliza a Google Books API para listar e pesquisar livro. A aplicação é construída com Angular no frontend e Flask no backend. Abaixo, você encontrará instruções sobre como configurar e executar o projeto, bem como realizar contribuição.

## Visão Geral

- **Frontend**: Angular
- **Backend**: Flask
- **Banco de Dados**: MongoDB Atlas
- **API de Livros**: Google Books API

## Funcionalidades

- Pesquisar livros.
- Listar livros com informações.
- Adicionar livros aos favoritos.
- Avaliar livros usando um sistema de estrelas.
- Adicionar, editar e excluir notas para livros favoritos.

## Requisitos

Antes de começar, certifique-se de que você tenha os seguintes requisitos instalados:

- Node.js e npm (para o Angular)
- Python 3.x e pip (para o Flask)
- MongoDB (para o banco de dados)
- Conta no MongoDB Atlas (para o banco de dados)

## Configuração do Projeto

### Configuração do Backend (Flask)

1. Clone o repositório:

    ```bash
    https://github.com/HeloiseKatharine/Book-Explorer.git
    ```

2. Navegue para o diretório do backend:

    ```bash
    cd book_explorer_backend
    ```

3. Crie um ambiente virtual e ative-o:

    ```bash
    python -m venv venv
    source venv/bin/activate  # No Windows, use: venv\Scripts\activate
    ```

4. Instale as dependências do backend:

    ```bash
   python -m pip install -r requirements.txt
    ```

5. Configure as variáveis de ambiente:

    Crie um arquivo `.env` na raiz do diretório `book_explorer_backend` com as seguintes variáveis:

    ```env
    MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome-do-banco>?retryWrites=true&w=majority
    DB_NAME=nome-do-banco

    ```

6. Inicie o servidor Flask:

    ```bash
    flask run
    ```
    ou
    ```bash
    python app.py 
    ```


### Configuração do Frontend (Angular)

1. Navegue para o diretório do frontend:

    ```bash
    cd BookExplorer
    ```

2. Instale as dependências do frontend:

    ```bash
    npm install
    ```

3. Configure a URL da API:

    Abra o arquivo `src/environments/environment.ts` e defina a URL da API Flask:

    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:5000'
    };
    ```

4. Inicie o servidor de desenvolvimento Angular:

    ```bash
    ng serve
    ```

5. Acesse a aplicação no navegador:

    Navegue até `http://localhost:4200` para visualizar a aplicação em funcionamento.

## Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir para o projeto, siga estas etapas:

1. **Faça um fork do repositório**: Clique no botão "Fork" no canto superior direito do repositório no GitHub.

2. **Clone seu fork**: 

    ```bash
    git clone https://github.com/usuario/seu-fork.git
    cd seu-fork
    ```

3. **Crie uma nova branch**:

    ```bash
    git checkout -b minha-feature
    ```

4. **Faça suas alterações** e commit:

    ```bash
    git add .
    git commit -m "feat: adicionar nova funcionalidade X"
    ```

5. **Faça o push suas alterações** para o seu fork:

    ```bash
    git push origin minha-feature
    ```

6. **Abra um Pull Request**: No GitHub, vá para a página do seu fork e abra um pull request para o repositório original.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para dúvidas ou problemas, entre em contato com [katharineheloise@gmail.com
](mailto:seu-email@exemplo.com).

---

Obrigado por contribuir para o projeto! 🎉

