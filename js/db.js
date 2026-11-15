/* ============================================================
   CWB Customs - Banco de dados simulado (localStorage)
   Tabelas: usuarios, oficinas, funcionarios, pecas, servicos,
   veiculos, orcamentos, propostas, agendamentos, vistorias,
   pagamentos, avaliacoes, mensagens, notificacoes, sinistros,
   fornecedores, pedidos
   ============================================================ */
(function () {
  const KEY = 'cwb_db_v2';
  const SKEY = 'cwb_session_v2';

  const z = (n) => String(n).padStart(2, '0');
  const iso = (d) => d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  const dia = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
  const agora = (minAtras = 0) => Date.now() - minAtras * 60000;

  const ESPECIALIDADES = ['Mecânica geral', 'Elétrica', 'Injeção eletrônica', 'Tuning', 'Estética', 'Funilaria', 'Diagnóstico', 'Lava-car'];

  function seed() {
    return {
      seq: 1000,
      usuarios: [
        { id: 1, perfil: 'cliente', nome: 'Juliano Marcos', email: 'cliente@cwb.com', senha: '123456', telefone: '(41) 99999-1111' },
        { id: 2, perfil: 'cliente', nome: 'Bruna Lima', email: 'bruna@cwb.com', senha: '123456', telefone: '(41) 99999-2222' },
        { id: 3, perfil: 'oficina', nome: 'Oficina do Bairro', email: 'oficina@cwb.com', senha: '123456', oficinaId: 1 },
        { id: 4, perfil: 'oficina', nome: 'Árvore Turma do Bairro', email: 'oficina2@cwb.com', senha: '123456', oficinaId: 2 },
        { id: 5, perfil: 'oficina', nome: 'Vini Nights Auto', email: 'oficina3@cwb.com', senha: '123456', oficinaId: 3 },
        { id: 6, perfil: 'mecanico', nome: 'Emanuel Ribeiro', email: 'mecanico@cwb.com', senha: '123456', oficinaId: 1, funcionarioId: 1 },
        { id: 7, perfil: 'agente', nome: 'Agente CWB', email: 'agente@cwb.com', senha: '123456' },
      ],
      oficinas: [
        { id: 1, nome: 'Oficina do Bairro', cnpj: '12.345.678/0001-90', endereco: 'Rua Brasílio Itiberê, 450', bairro: 'Água Verde', dist: 1.2, especialidades: ['Mecânica geral', 'Elétrica', 'Tuning'], sobre: 'Oficina de bairro há 8 anos, especializada em mecânica geral e diagnóstico eletrônico. Equipe certificada, orçamento sem compromisso.', status: 'ativa', aberta: true, horario: 'Seg a sáb, 8h às 18h', notaBase: 4.8, qtdBase: 132 },
        { id: 2, nome: 'Árvore Turma do Bairro', cnpj: '23.456.789/0001-01', endereco: 'Av. Sete de Setembro, 3100', bairro: 'Batel', dist: 2.4, especialidades: ['Tuning', 'Estética', 'Funilaria'], sobre: 'Especializada em customização e performance. Equipe apaixonada por carros clássicos e projetos de tuning sob medida.', status: 'ativa', aberta: true, horario: 'Seg a sex, 9h às 18h', notaBase: 4.6, qtdBase: 87 },
        { id: 3, nome: 'Vini Nights Auto', cnpj: '34.567.890/0001-12', endereco: 'Av. República Argentina, 1250', bairro: 'Portão', dist: 3.1, especialidades: ['Elétrica', 'Injeção eletrônica', 'Diagnóstico'], sobre: 'Referência em diagnóstico eletrônico e injeção na região. Atendimento até tarde da noite pra quem não pode parar durante o dia.', status: 'ativa', aberta: true, horario: 'Seg a sáb, 12h às 19h', notaBase: 4.9, qtdBase: 204 },
        { id: 4, nome: 'Garagem Central', cnpj: '45.678.901/0001-23', endereco: 'Rua XV de Novembro, 800', bairro: 'Centro', dist: 4.0, especialidades: ['Mecânica geral', 'Lava-car'], sobre: 'Nova parceira aguardando aprovação.', status: 'pendente', aberta: true, horario: 'Seg a sex, 8h às 17h', notaBase: 0, qtdBase: 0 },
      ],
      funcionarios: [
        { id: 1, oficinaId: 1, nome: 'Emanuel Ribeiro', especialidade: 'Mecânica geral', email: 'mecanico@cwb.com' },
        { id: 2, oficinaId: 1, nome: 'Juliano Memmo', especialidade: 'Elétrica / injeção', email: '' },
        { id: 3, oficinaId: 1, nome: 'Pedro Cavalli', especialidade: 'Estética / funilaria', email: '' },
        { id: 4, oficinaId: 1, nome: 'Vini Nights', especialidade: 'Tuning / performance', email: '' },
        { id: 5, oficinaId: 2, nome: 'Rafael Souza', especialidade: 'Tuning / performance', email: '' },
        { id: 6, oficinaId: 3, nome: 'Diego Ferreira', especialidade: 'Elétrica / injeção', email: '' },
      ],
      pecas: [
        { id: 1, oficinaId: 1, nome: 'Filtro de óleo', codigo: 'FO-2201', qtd: 18, preco: 35 },
        { id: 2, oficinaId: 1, nome: 'Pastilha de freio', codigo: 'PF-1187', qtd: 4, preco: 89 },
        { id: 3, oficinaId: 1, nome: 'Amortecedor dianteiro', codigo: 'AD-3390', qtd: 7, preco: 210 },
        { id: 4, oficinaId: 1, nome: 'Vela de ignição', codigo: 'VI-0552', qtd: 2, preco: 22 },
        { id: 5, oficinaId: 2, nome: 'Escapamento esportivo', codigo: 'ES-7001', qtd: 3, preco: 520 },
        { id: 6, oficinaId: 3, nome: 'Sensor de fluxo de ar', codigo: 'SF-4410', qtd: 5, preco: 160 },
      ],
      servicos: [
        { id: 1, oficinaId: 1, nome: 'Mecânica geral', preco: 90 },
        { id: 2, oficinaId: 1, nome: 'Elétrica / injeção', preco: 120 },
        { id: 3, oficinaId: 1, nome: 'Tuning / performance', preco: 250 },
        { id: 4, oficinaId: 1, nome: 'Estética / funilaria', preco: 150 },
        { id: 5, oficinaId: 1, nome: 'Lava-car', preco: 40 },
        { id: 6, oficinaId: 2, nome: 'Tuning — escapamento', preco: 300 },
        { id: 7, oficinaId: 2, nome: 'Estética automotiva', preco: 180 },
        { id: 8, oficinaId: 2, nome: 'Funilaria e pintura', preco: 220 },
        { id: 9, oficinaId: 3, nome: 'Diagnóstico eletrônico', preco: 90 },
        { id: 10, oficinaId: 3, nome: 'Injeção eletrônica', preco: 160 },
        { id: 11, oficinaId: 3, nome: 'Elétrica geral', preco: 130 },
      ],
      veiculos: [
        { id: 1, donoId: 1, modelo: 'Honda Civic', ano: 2018, placa: 'ABC-1D23', cor: 'Prata' },
        { id: 2, donoId: 1, modelo: 'Fiat Uno', ano: 2012, placa: 'XYZ-9F45', cor: 'Branco' },
        { id: 3, donoId: 2, modelo: 'Volkswagen Gol', ano: 2015, placa: 'QWE-4R56', cor: 'Preto' },
        { id: 4, oficinaId: 1, proprietario: 'Sr. Carlos (balcão)', modelo: 'Chevrolet Onix', ano: 2020, placa: 'KLM-2A34', cor: 'Vermelho' },
      ],
      orcamentos: [
        { id: 1, clienteId: 1, veiculoId: 1, categoria: 'Suspensão / freios', descricao: 'Barulho estranho na roda dianteira ao frear.', status: 'aberto', criadoEm: agora(120), fotos: [] },
      ],
      propostas: [
        { id: 1, orcamentoId: 1, oficinaId: 1, valor: 280, prazo: 1, descricao: 'Diagnóstico + troca de peça', criadoEm: agora(100) },
        { id: 2, orcamentoId: 1, oficinaId: 3, valor: 310, prazo: 0, descricao: 'Diagnóstico eletrônico completo (mesmo dia)', criadoEm: agora(90) },
        { id: 3, orcamentoId: 1, oficinaId: 2, valor: 265, prazo: 2, descricao: 'Diagnóstico + peça alternativa', criadoEm: agora(80) },
      ],
      agendamentos: [
        { id: 1, clienteId: 1, oficinaId: 1, veiculoId: 1, servico: 'Troca de óleo + revisão elétrica', data: dia(0), hora: '09:30', obs: '', status: 'em_andamento', etapa: 2, mecanicoId: 1, valor: 390, criadoEm: agora(300) },
        { id: 2, clienteId: 2, oficinaId: 1, veiculoId: 3, servico: 'Diagnóstico elétrico', data: dia(0), hora: '11:00', obs: 'Painel apagando sozinho.', status: 'solicitado', etapa: 0, mecanicoId: null, valor: 0, criadoEm: agora(40) },
        { id: 3, clienteId: 1, oficinaId: 2, veiculoId: 1, servico: 'Tuning — escapamento', data: dia(-20), hora: '14:00', obs: '', status: 'pago', etapa: 4, mecanicoId: 5, valor: 850, criadoEm: agora(30000) },
        { id: 4, clienteId: 2, oficinaId: 1, veiculoId: 3, servico: 'Mecânica geral', data: dia(1), hora: '08:00', obs: 'Revisão dos 30 mil.', status: 'confirmado', etapa: 0, mecanicoId: 1, valor: 150, criadoEm: agora(600) },
        { id: 5, clienteId: 1, oficinaId: 3, veiculoId: 2, servico: 'Diagnóstico de injeção', data: dia(-45), hora: '16:30', obs: '', status: 'pago', etapa: 4, mecanicoId: 6, valor: 310, criadoEm: agora(65000) },
      ],
      vistorias: [
        { id: 1, agendamentoId: 1, itens: [{ nome: 'Pastilhas de freio', status: 'ok' }, { nome: 'Amortecedores', status: 'atencao' }, { nome: 'Nível de óleo', status: 'ok' }, { nome: 'Bateria', status: 'ok' }, { nome: 'Pneus', status: 'ok' }, { nome: 'Luzes e faróis', status: 'ok' }], obs: 'Amortecedor dianteiro direito com sinal de desgaste. Recomendada troca nos próximos 5.000 km.', fotos: [], aprovada: false, criadoEm: agora(60) },
        { id: 2, agendamentoId: 3, itens: [{ nome: 'Pastilhas de freio', status: 'ok' }, { nome: 'Amortecedores', status: 'ok' }, { nome: 'Nível de óleo', status: 'ok' }, { nome: 'Bateria', status: 'ok' }, { nome: 'Pneus', status: 'ok' }, { nome: 'Luzes e faróis', status: 'ok' }], obs: 'Instalação concluída sem ressalvas.', fotos: [], aprovada: true, criadoEm: agora(29000) },
        { id: 3, agendamentoId: 5, itens: [{ nome: 'Pastilhas de freio', status: 'ok' }, { nome: 'Amortecedores', status: 'ok' }, { nome: 'Nível de óleo', status: 'ok' }, { nome: 'Bateria', status: 'atencao' }, { nome: 'Pneus', status: 'ok' }, { nome: 'Luzes e faróis', status: 'ok' }], obs: 'Sensor de fluxo trocado. Bateria no limite da vida útil.', fotos: [], aprovada: true, criadoEm: agora(64000) },
      ],
      pagamentos: [
        { id: 1, agendamentoId: 3, forma: 'Pix', total: 850, recibo: 'CWB-000101', data: dia(-20), criadoEm: agora(29000) },
        { id: 2, agendamentoId: 5, forma: 'Cartão de crédito', total: 310, recibo: 'CWB-000102', data: dia(-45), criadoEm: agora(64000) },
      ],
      avaliacoes: [
        { id: 1, oficinaId: 2, agendamentoId: 3, autor: 'Juliano M.', nota: 5, comentario: 'Trabalho impecável no escapamento do meu carro. Voltarei sempre.', criadoEm: agora(28000) },
        { id: 2, oficinaId: 3, agendamentoId: 5, autor: 'Juliano M.', nota: 5, comentario: 'Resolveram um problema elétrico que duas outras oficinas não conseguiram achar.', criadoEm: agora(63000) },
        { id: 3, oficinaId: 1, agendamentoId: null, autor: 'Marcos R.', nota: 5, comentario: 'Rápidos e honestos no orçamento. Recomendo.', criadoEm: agora(90000) },
      ],
      mensagens: [
        { id: 1, clienteId: 1, oficinaId: 1, de: 'oficina', texto: 'Olá! Recebemos sua solicitação de agendamento. Pode nos enviar fotos do problema?', ts: agora(500) },
        { id: 2, clienteId: 1, oficinaId: 1, de: 'cliente', texto: 'Claro, o carro tá fazendo um barulho estranho na roda dianteira', ts: agora(495) },
        { id: 3, clienteId: 1, oficinaId: 1, de: 'oficina', texto: 'Entendido. Já reservei um horário hoje às 09:30 pra diagnóstico. Confirma?', ts: agora(490) },
        { id: 4, clienteId: 1, oficinaId: 1, de: 'cliente', texto: 'Perfeito, confirmado 👍', ts: agora(485) },
        { id: 5, clienteId: 1, oficinaId: 2, de: 'oficina', texto: 'Fala! Vi que você quer dar uma repaginada no escapamento. Manda foto do carro?', ts: agora(40000) },
        { id: 6, clienteId: 1, oficinaId: 3, de: 'oficina', texto: 'Boa noite! Qual o sintoma que o carro tá dando?', ts: agora(70000) },
        { id: 7, clienteId: 1, oficinaId: 3, de: 'cliente', texto: 'A luz de injeção acendeu no painel e ele perdeu força', ts: agora(69990) },
      ],
      notificacoes: [
        { id: 1, userId: 1, tipo: 'acompanhamento', texto: 'Seu Civic entrou em manutenção na Oficina do Bairro.', link: '09-acompanhamento.html?id=1', lida: false, ts: agora(30) },
        { id: 2, userId: 1, tipo: 'orcamento', texto: '3 oficinas responderam ao seu pedido de orçamento.', link: '21-comparar-orcamentos.html', lida: false, ts: agora(80) },
        { id: 3, userId: 3, tipo: 'agendamento', texto: 'Novo agendamento: Bruna Lima — Diagnóstico elétrico (hoje, 11:00).', link: '14-agenda-oficina.html', lida: false, ts: agora(40) },
        { id: 4, userId: 3, tipo: 'orcamento', texto: 'Novo pedido de orçamento: Suspensão / freios — Honda Civic.', link: '26-orcamentos-oficina.html', lida: true, ts: agora(120) },
        { id: 5, userId: 6, tipo: 'os', texto: 'Nova ordem de serviço atribuída: Honda Civic 2018.', link: '30-home-mecanico.html', lida: false, ts: agora(300) },
        { id: 6, userId: 7, tipo: 'parceira', texto: 'Garagem Central solicitou cadastro como oficina parceira.', link: '31-gestao-oficinas.html', lida: false, ts: agora(200) },
      ],
      sinistros: [],
      fornecedores: [
        { id: 1, nome: 'AutoPeças Curitiba', prazo: '2 dias', itens: [
          { peca: 'Pastilha de freio dianteira', codigo: 'PF-1187', preco: 78, un: 4 },
          { peca: 'Amortecedor dianteiro', codigo: 'AD-3390', preco: 195, un: 2 },
          { peca: 'Filtro de óleo', codigo: 'FO-2201', preco: 28, un: 10 },
        ] },
        { id: 2, nome: 'Distribuidora PR', prazo: '1 dia', itens: [
          { peca: 'Vela de ignição (kit 4 un)', codigo: 'VI-0552', preco: 76, un: 4 },
          { peca: 'Sensor de fluxo de ar', codigo: 'SF-4410', preco: 140, un: 1 },
        ] },
      ],
      pedidos: [],
    };
  }

  const DB = {
    KEY, SKEY, ESPECIALIDADES, iso, dia,
    data: null,
    load() {
      try { this.data = JSON.parse(localStorage.getItem(KEY)); } catch (e) { this.data = null; }
      if (!this.data) { this.data = seed(); this.save(); }
      return this.data;
    },
    save() { localStorage.setItem(KEY, JSON.stringify(this.data)); },
    reset() { this.data = seed(); this.save(); },
    all(t) { return this.data[t]; },
    get(t, id) { return this.data[t].find((x) => x.id == id); },
    where(t, fn) { return this.data[t].filter(fn); },
    insert(t, o) { this.load(); o.id = ++this.data.seq; this.data[t].push(o); this.save(); return o; },
    update(t, id, patch) { this.load(); const o = this.get(t, id); if (o) { Object.assign(o, patch); this.save(); } return o; },
    remove(t, id) { this.load(); this.data[t] = this.data[t].filter((x) => x.id != id); this.save(); },
    notify(userId, texto, link, tipo) {
      this.load();
      this.data.notificacoes.push({ id: ++this.data.seq, userId, tipo: tipo || 'info', texto, link: link || '', lida: false, ts: Date.now() });
      this.save();
    },
    notifyOficina(oficinaId, texto, link, tipo) {
      this.where('usuarios', (u) => u.perfil === 'oficina' && u.oficinaId == oficinaId).forEach((u) => this.notify(u.id, texto, link, tipo));
    },
    notifyPerfil(perfil, texto, link, tipo) {
      this.where('usuarios', (u) => u.perfil === perfil).forEach((u) => this.notify(u.id, texto, link, tipo));
    },
    nota(oficinaId) {
      const o = this.get('oficinas', oficinaId);
      const av = this.where('avaliacoes', (a) => a.oficinaId == oficinaId && a.agendamentoId);
      const soma = av.reduce((s, a) => s + a.nota, 0);
      const qtd = (o.qtdBase || 0) + av.length;
      return { nota: qtd ? ((o.notaBase || 0) * (o.qtdBase || 0) + soma) / qtd : 0, qtd };
    },
  };

  const Auth = {
    user() { const id = localStorage.getItem(SKEY); return id ? DB.get('usuarios', id) : null; },
    set(id) { localStorage.setItem(SKEY, id); },
    login(email, senha) {
      DB.load();
      const u = DB.where('usuarios', (x) => x.email.toLowerCase() === String(email).trim().toLowerCase())[0];
      if (!u || u.senha !== senha) return null;
      this.set(u.id);
      return u;
    },
    logout() { localStorage.removeItem(SKEY); },
    home(perfil) {
      return { cliente: '03-home-cliente.html', oficina: '13-home-oficina.html', mecanico: '30-home-mecanico.html', agente: '31-gestao-oficinas.html' }[perfil] || '01-login.html';
    },
  };

  window.DB = DB;
  window.Auth = Auth;
  DB.load();
})();
