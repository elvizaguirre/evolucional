# Evolucional Front-End Challenge

Este projeto é a resolução do desafio técnico descrito em Instruções.txt, utilizando ReactJS, TypeScript, styled-components e PrimeReact.

## ✨ Funcionalidades

- Listagem de alunos com filtros por série e classe
- Edição e remoção de alunos com modais
- Geração automática de alunos fictícios
- Visualização e gerenciamento de relacionamentos entre professores, matérias, séries e classes
- Componentes reutilizáveis e layout responsivo

## 🛠️ Tecnologias utilizadas

- [ReactJS](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PrimeReact](https://primereact.org/) para componentes de UI
- [Styled-components](https://styled-components.com/) para estilização
- [ApexCharts](https://apexcharts.com/) para gráficos
- [Jest](https://jestjs.io/) e [React Testing Library](https://testing-library.com/) para testes unitários
- [Webpack](https://webpack.js.org/) para bundling

## 📁 Estrutura de pastas

```
src/
├── components/          # Componentes reutilizáveis
├── context/             # DataContext global
├── data/                # Arquivos JSON mockados
├── pages/               # Páginas principais (Alunos, Professores)
├── __tests__/           # Arquivos de testes
├── types/               # Tipagens TypeScript
```

## ▶️ Como executar o projeto

1. **Clone o repositório**

```bash
git clone https://github.com/elvizaguirre/evolucional-front-test.git
cd evolucional-front-test
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute o servidor de desenvolvimento**

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

---

## 🧪 Executar os testes

```bash
npm run test
```

Os testes foram escritos com Jest + Testing Library e cobrem os principais componentes, páginas (`Alunos`, `Professores`) e o `DataContext`.

Para visualizar a cobertura de testes:

```bash
npm run test -- --coverage
```

---

## ✅ Checklist do desafio

- ✅ Tela 1 com listagem, filtros, edição, remoção e geração de alunos
- ✅ Tela 2 com relacionamentos entre professores, matérias, séries e classes
- ✅ Utilização de componentes visuais do PrimeReact
- ✅ Testes completos dos principais fluxos
- ✅ Código limpo, responsivo e com boas práticas

---

## 📈 Recomendações de Melhoria

1. **Integração com API remota**
- Em vez de consumir arquivos JSON estáticos, criar um serviço HTTP (usando Axios ou Fetch) que aponte para endpoints reais.
- Centralizar chamadas em um módulo de api ou service e usar variáveis de ambiente (.env) para configurar a URL base.

2. **Manejo de estados de carregamento e erros**
- Adicionar indicadores de “loading” sempre que iniciar uma requisição (por exemplo, spinners do PrimeReact ou componentes próprios), desabilitando botões enquanto a operação está em curso.
- Exibir notificações de sucesso ou falha (usando o <Toast> do PrimeReact ou equivalente) após criar, atualizar ou excluir registros.
- Manter, no contexto, flags como loading, error e success para cada entidade (students, relationships, etc.), permitindo mostrar banners ou mensagens específicas em toda a aplicação.

3. **Tratamento de erros em requisições**
- Configurar interceptores (caso use Axios) para capturar códigos de status 4xx/5xx e exibir mensagens padronizadas de erro.
- Fornecer botões de “Recarregar” ou “Tentar novamente” sempre que uma chamada falhar, em vez de deixar o usuário preso em uma tela sem resposta.

## 📄 Licença

Este projeto é de uso exclusivo para fins de avaliação técnica e não deve ser utilizado para outros propósitos comerciais sem autorização.
