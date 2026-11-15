# CWB Customs (Curitiba Customs)

Protótipo não funcional de alta fidelidade, desenvolvido em HTML/CSS puro, para a plataforma de intermediação entre clientes e oficinas mecânicas **CWB Customs**.

Projeto disciplinar da PUCPR — Fundamentos de Engenharia de Software / Gestão de Projetos e Métodos Ágeis.

**Equipe:** Programadores do Bairro
- Juliano Cesar Enns Miranda Marcos
- Emmanuel Antonietti Ribeiro dos Santos
- Enzo Wasko Amorim
- Pedro Joslin Cavalli
- Vinícius Paraíso Dias

## Como visualizar

Abra `telas/00-splash.html` no navegador (ou use a extensão **Live Server** do VS Code, clicando com o botão direito no arquivo e escolhendo "Open with Live Server").

Todas as 28 telas estão navegáveis entre si via links HTML comuns — não há backend, banco de dados ou lógica real por trás dos formulários.

## Estrutura

```
├── index.html          # redireciona para a tela inicial
├── css/
│   └── style.css       # design system (cores, tipografia, componentes)
└── telas/
    ├── 00-splash.html
    ├── 01-login.html
    ├── 02-cadastro.html
    ├── ...
    └── 23-comprovante-pagamento.html
```

## Fluxos principais

- **Cliente:** login → cadastro → home → mapa de oficinas → perfil da oficina → agendamento → chat → orçamento → comparação de orçamentos → acompanhamento → vistoria → pagamento → comprovante → avaliação
- **Oficina:** home/dashboard → agenda → funcionários (CRUD) → peças/estoque (CRUD) → serviços oferecidos (CRUD) → compra de peças
