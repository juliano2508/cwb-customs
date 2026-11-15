# CWB Customs — Protótipo (Programadores do Bairro)

Plataforma que intermedia **clientes** e **oficinas** de Curitiba. Protótipo em HTML, CSS e JavaScript puro, **sem back-end**: o "banco de dados" é simulado no `localStorage` do navegador (dados de demonstração já carregados).

## Como abrir
Abra a pasta no VS Code, clique com o botão direito em `index.html` → **Open with Live Server**. (Ou abra `index.html` direto no navegador.)

## Contas de demonstração (senha `123456`)
| Perfil | E-mail |
|---|---|
| Cliente | cliente@cwb.com · bruna@cwb.com |
| Oficina | oficina@cwb.com · oficina2@cwb.com · oficina3@cwb.com |
| Mecânico | mecanico@cwb.com |
| Agente | agente@cwb.com |

Para testar o "tempo real", abra duas abas (ex.: cliente e oficina) e avance o serviço na oficina: o acompanhamento do cliente atualiza sozinho.
Para voltar aos dados iniciais: **Perfil → Restaurar dados de demonstração**.

## Telas (30 em `telas/` + `index.html`)
| Perfil | Telas |
|---|---|
| Todos | 01 Login · 02 Cadastro (cliente/oficina) · 20 Perfil · 25 Notificações |
| Cliente | 03 Início · 04 Oficinas · 05 Perfil da oficina · 06 Agendamento · 07 Chat · 08 Pedir orçamento · 21 Comparar orçamentos · 09 Acompanhamento · 10 Laudo de vistoria · 11 Pagamento · 23 Recibo · 12 Avaliação · 24 Histórico · 22 Meus veículos · 19 Sinistro |
| Oficina | 13 Painel · 14 Agenda (confirmar/recusar/avançar) · 26 Orçamentos · 15 Funcionários · 17 Serviços · 16 Peças · 18 Compra de peças · 27 Veículos · 28 Relatórios · 07 Chat · 10 Vistoria |
| Mecânico | 30 Minhas OS · 10 Registro de vistoria |
| Agente | 31 Gestão de oficinas (aprovar/suspender) e sinistros · 28 Relatórios da plataforma |

## Navegação por perfil
Cada tela declara quais perfis podem acessá-la; quem tenta entrar em tela de outro perfil é levado à própria home. O botão voltar (←) é definido por perfil, então a oficina nunca volta para a área do cliente.

## Estrutura
- `js/db.js` — banco simulado (tabelas, dados iniciais, login)
- `js/app.js` — layout, controle de acesso, CRUD genérico e regras de negócio
- `js/fotos.js` — upload de fotos (vistoria, orçamento, sinistro)
- `css/style.css` — design system (grafite + ferrugem, Oswald/Inter)
