# Tarefa Telepesquisa: Busca por IA

Esse projeto foi criado com o intuito de satisfazer as necessidades técnicas
do processo seletivo para desenvolvedor júnior da [Telepesquisa][]

---

### Tabela de conteúdos
1. [Descrição][desc]
2. [Requerimentos][reqs]
3. [Rodar o projeto][run]
4. [Motivação para tomada de decisções][motivation]

---

### Descrição
_[Tabela de conteúdos][home]_

Integração entre LLMs e bancos de dados vetoriais para pesquisa de empresas utilizando
embeddings e buscas vetoriais.

### Pré-requisitos
_[Tabela de conteúdos][home]_

- [Docker]: Instale o docker engine ou docker desktop na sua máquina.

### Rodar projeto
_[Tabela de conteúdos][home]_

1. Com o docker instalado, abra o terminal e rode os seguintes comandos para clonar
o repositório em sua máquina:

``` bash
    git clone https://github.com/PedroAug91/telepesquisa-ia.git
    cd telepesquisa-ia
```

2. Copie e em seguida popule as variáveis de ambiente do .env:

``` bash
    cp .env.example .env
```

_Obs_: A única variável que é __obrigatória__ é a API_KEY. Nela você vai colocar
sua chave de API da [OpenAI].

3. Instale as dependências dos containeres:

``` bash
    cd app && npm install
    cd ..
```

``` bash
    cd react && npm install
    cd ..
```

4. Após preencher suas variáveis de ambiente, resta só criar os containeres
docker:

``` bash
    docker compose up -d --build
```

_Obs_: A inserção dos dados no banco de dados vetorial leva um certo tempo, dado
o volume de entidades sendo convertidas para embeddings e sendo inseridas nele.
_Obs2_: A conversação com o chatbot só vai funcionar quando os dados forem inseridos
no banco.

5. Utilize os logs do docker para saber exatamente onde a página do chatbot
está sendo hospedada:

``` bash
    docker logs tpia_react -f
```

### Motivação decisões
_[Tabela de conteúdos][home]_

1. Escolha de tecnologias

- LangChain JavaScript:

Escolhi Langchain pela familiaridade que tenho com a tecnologia, acredito ser uma
das melhores no mercado de desenvolvimento de sistemas com LLMs pela sua simplicidade, 
ampla quantidade de ferramentas imbutidas e principalmente a variedade de modelos
de LLM disponíveis para integração.

- ChromaDB:

O ChromaDB me chamou atenção por motivos similares ao Langchain, apesar de ter
sido o meu primeiro contato com RAG, Embeddings e Vector Search. O ChromaDB é
um banco de dados vetorial relativamente simples de se utilizar, sua documentação
ainda há muito o que melhorar, mas, apesar disso, há informações o suficiente
para se desenvolver aplicações neste formato. Ele disponibiliza uma função de
embeddings padrão, mas também permite o uso de funções e modelos de embedding
costumizados.

2. Mudanças para sistema em produção

- Escolha de LLMS:
    - Embeddings:
        - OpenAI (`text-embedding-ada-002`): 1k tokens -> $0.0004
        - Google (`text-bison`): 1k tokens -> $0.002
    - Chat:
        - OpenAI (`gpt-4` ou `gpt-4 turbo`): 1k tokens -> $0.0004
        - Google (`gemini-2.5-flash` ou `gemini-2.5-pro`): 1k tokens -> $0.003


- Cálculo estimado dos diálogos:

Supondo que a média de cada resposta (saída) é de __150 tokens__ e para entrada
tenha __100 tokens__ para chats e __300__ tokens para embeddings.

- Embeddings:
    - OpenAI:
        - 300 tokens de entrada por diálogo -> 300 tokens / 1.000 tokens = 0.3 unidades de 1K tokens.
        - Para 1000 diálogos: 0.3 * 1000 = 300 unidades de 1K tokens.
        - Custo de 300 tokens: 300 * $0.0004 = $0.12.
    - Google:
        - 300 tokens de entrada por diálogo -> 300 tokens / 1.000 tokens = 0.3 unidades de 1K tokens.
        - Para 1000 diálogos: 0.3 * 1000 = 300 unidades de 1K tokens.
        - Custo de 300 tokens: 300 * $0.002 = $0.60.
- Chat:
    - OpenAI:
        - Entrada: 100 tokens → 0.1 unidades de 1K tokens.
        - Saída: 150 tokens → 0.15 unidades de 1K tokens.
        - Custo de entrada: 0.1 * $0.03 = $0.003.
        - Custo de saída: 0.15 * $0.06 = $0.009.
        - Custo total por diálogo: $0.003 + $0.009 = $0.012.
        - Custo por 1000 diálogos: $0.012 * 1000 = $12.
    - Google:
        - Entrada: 100 tokens → 0.1 unidades de 1K tokens.
        - Saída: 150 tokens → 0.15 unidades de 1K tokens.
        - Custo de entrada: 0.1 * $0.03 = $0.003.
        - Custo de saída: 0.15 * $0.06 = $0.009.
        - Custo total por diálogo: $0.003 + $0.009 = $0.012.
        - Custo por 1000 diálogos: $0.012 * 1000 = $12.

- Tabela de custos:

| **Provedor**      | **Embeddings (1000 diálogos)** | **Chat (1000 diálogos)** | **Custo Total (1000 diálogos)** |
| ----------------- | ------------------------------ | ------------------------ | ------------------------------- |
| **OpenAI**        | \$0.12                         | \$12                     | **\$12.12**                     |
| **Google Gemini** | \$0.60                         | \$12                     | **\$12.60**                     |

Escolhi os modelos de LLM da Google e da OpenAI pela sua maturidade no mercado, 
garantindo uma maior qualidade tanto nos embeddings quanto no tratamento das mensagens 
enviadas pelo usuário.

### Autor
_[Tabela de conteúdos][home]_

- [João Pedro Augusto da Silva][author]

[desc]: #descrição
[reqs]: #pré-requisitos
[run]: #rodar-projeto
[motivation]: #motivação-decisões
[home]: #tabela-de-conteúdos
[author]: https://github.com/PedroAug91
[Telepesquisa]: https://telepesquisa.com
[Docker]: https://docs.docker.com/engine/install/
[OpenAI]: https://platform.openai.com/docs/overview
