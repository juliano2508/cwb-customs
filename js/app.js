/* ============================================================
   CWB Customs - Shell, componentes e regras de negócio simuladas
   ============================================================ */
(function () {
  const ETAPAS = ['Solicitação recebida', 'Diagnóstico concluído', 'Em manutenção', 'Vistoria final', 'Pronto para retirada'];
  const STATUS = {
    solicitado: ['Aguardando oficina', 'warn'],
    confirmado: ['Confirmado', 'accent'],
    em_andamento: ['Em andamento', 'warn'],
    pronto: ['Pronto p/ retirada', 'ok'],
    pago: ['Pago', 'ok'],
    recusado: ['Recusado', 'danger'],
    cancelado: ['Cancelado', 'danger'],
  };

  const TABS = {
    cliente: [['03-home-cliente.html', '🏠', 'Início', 'home'], ['04-mapa-oficinas.html', '📍', 'Oficinas', 'oficinas'], ['09-acompanhamento.html', '🔧', 'Serviços', 'servicos'], ['20-perfil.html', '👤', 'Perfil', 'perfil']],
    oficina: [['13-home-oficina.html', '🏠', 'Painel', 'home'], ['14-agenda-oficina.html', '📅', 'Agenda', 'agenda'], ['07-chat.html', '💬', 'Chat', 'chat'], ['20-perfil.html', '👤', 'Perfil', 'perfil']],
    mecanico: [['30-home-mecanico.html', '🔧', 'Minhas OS', 'home'], ['25-notificacoes.html', '🔔', 'Avisos', 'notif'], ['20-perfil.html', '👤', 'Perfil', 'perfil']],
    agente: [['31-gestao-oficinas.html', '🏢', 'Parceiras', 'home'], ['25-notificacoes.html', '🔔', 'Avisos', 'notif'], ['20-perfil.html', '👤', 'Perfil', 'perfil']],
  };

  /* ---------- utilitários ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const qs = () => Object.fromEntries(new URLSearchParams(location.search));
  const fmtData = (d) => { if (!d) return ''; const p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; };
  const fmtTs = (ts) => {
    const d = new Date(ts), n = new Date();
    const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    if (d.toDateString() === n.toDateString()) return 'Hoje, ' + hm;
    return fmtData(DB.iso(d)) + ' ' + hm;
  };
  const num = (v) => { const n = parseFloat(String(v).replace(/\./g, '').replace(',', '.')); return isNaN(n) ? NaN : n; };
  const badge = (txt, cls) => `<span class="badge badge-${cls || 'accent'}">${esc(txt)}</span>`;
  const statusBadge = (s) => { const x = STATUS[s] || [s, 'accent']; return badge(x[0], x[1]); };
  const stars = (n) => '⭐'.repeat(Math.round(n));
  const inicial = (nome) => String(nome).split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  const veiculoNome = (v) => (v ? `${v.modelo} ${v.ano}` : '—');

  /* ---------- toast e modal ---------- */
  function toast(msg, tipo) {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast toast-' + (tipo || 'ok');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3000);
  }

  function modal(opts) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><h2>${esc(opts.title)}</h2><div class="modal-body">${opts.body || ''}</div><div class="modal-actions"></div></div>`;
    const acts = ov.querySelector('.modal-actions');
    const close = () => ov.remove();
    (opts.actions || [{ label: 'Fechar' }]).forEach((a) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ' + (a.cls || 'btn-outline');
      b.textContent = a.label;
      b.addEventListener('click', () => { if (!a.fn || a.fn(ov) !== false) close(); });
      acts.appendChild(b);
    });
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    document.body.appendChild(ov);
    const first = ov.querySelector('input,select,textarea,button');
    if (first) first.focus();
    return ov;
  }

  function confirmar(msg, okLabel) {
    return new Promise((res) => {
      modal({ title: 'Confirmar', body: `<p>${esc(msg)}</p>`, actions: [
        { label: 'Cancelar', fn: () => res(false) },
        { label: okLabel || 'Confirmar', cls: 'btn-primary', fn: () => res(true) },
      ] });
    });
  }

  /* ---------- casca das páginas ---------- */
  function page(cfg) {
    DB.load();
    const user = Auth.user();
    if (!user) { location.replace('01-login.html'); return; }
    const roles = cfg.roles || ['cliente', 'oficina', 'mecanico', 'agente'];
    if (roles.indexOf(user.perfil) < 0) { location.replace(Auth.home(user.perfil)); return; }
    const q = qs();
    const val = (x) => (typeof x === 'function' ? x(user, q) : x);
    const back = val(cfg.back);
    const unread = DB.where('notificacoes', (n) => n.userId == user.id && !n.lida).length;
    const tabs = TABS[user.perfil];
    document.title = 'CWB Customs — ' + val(cfg.title);
    document.getElementById('root').innerHTML = `
      <div class="device">
        <div class="screen">
          <div class="topbar">
            ${back ? `<a class="back" href="${esc(back)}" aria-label="Voltar">←</a>` : '<span class="spacer"></span>'}
            <h1>${esc(val(cfg.title))}</h1>
            ${cfg.bell === false ? '<span class="spacer"></span>' : `<a class="back bell" href="25-notificacoes.html" aria-label="Notificações">🔔${unread ? `<span class="dot">${unread}</span>` : ''}</a>`}
          </div>
          <div id="view" class="content-x pad"></div>
        </div>
        <nav class="tabbar" aria-label="Navegação principal">
          ${tabs.map((t) => `<a href="${t[0]}" class="${t[3] === val(cfg.tab) ? 'active' : ''}"><span class="icon">${t[1]}</span>${t[2]}</a>`).join('')}
        </nav>
      </div>`;
    const view = document.getElementById('view');
    const run = () => { DB.load(); cfg.render(view, user, q); };
    run();
    if (cfg.live) {
      let last = localStorage.getItem(DB.KEY);
      const check = () => { const cur = localStorage.getItem(DB.KEY); if (cur !== last) { last = cur; DB.load(); cfg.live(view, user, q); } };
      window.addEventListener('storage', (e) => { if (e.key === DB.KEY) check(); });
      setInterval(check, 1500);
    }
    return { view, user, q };
  }

  function publico(cfg) {
    DB.load();
    document.title = 'CWB Customs — ' + cfg.title;
    document.getElementById('root').innerHTML = `<div class="device"><div class="screen" id="view"></div></div>`;
    cfg.render(document.getElementById('view'), qs());
  }

  /* ---------- CRUD genérico ---------- */
  function fieldHtml(f, val) {
    const v = val == null ? '' : val;
    const id = 'f_' + f.key;
    let input;
    if (f.type === 'select') {
      input = `<select id="${id}">${f.options.map((o) => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    } else {
      input = `<input id="${id}" type="${f.type === 'money' ? 'text' : (f.type || 'text')}" inputmode="${f.type === 'money' || f.type === 'number' ? 'decimal' : 'text'}" placeholder="${esc(f.placeholder || '')}" value="${esc(f.type === 'money' && v !== '' ? String(v).replace('.', ',') : v)}" ${f.min != null ? `min="${f.min}"` : ''}>`;
    }
    return `<div class="field"><label for="${id}">${esc(f.label)}</label>${input}<div class="err" id="e_${f.key}"></div></div>`;
  }

  function crud(el, cfg) {
    let editId = null;
    function draw() {
      DB.load();
      const items = DB.where(cfg.table, cfg.where);
      const cur = editId ? DB.get(cfg.table, editId) : null;
      el.innerHTML = `
        ${cfg.intro ? `<p>${cfg.intro}</p>` : ''}
        <div id="lista">${items.length ? items.map((it) => {
          const r = cfg.item(it);
          return `<div class="list-item">
            ${r.avatar ? `<div class="avatar">${esc(r.avatar)}</div>` : ''}
            <div style="flex:1;min-width:0"><strong style="font-size:14px">${esc(r.title)}</strong><p style="margin:2px 0 0;font-size:13px">${esc(r.sub || '')}</p></div>
            ${r.badge || ''}
            <button class="icon-btn" data-edit="${it.id}" aria-label="Editar ${esc(r.title)}">✎</button>
            <button class="icon-btn danger" data-del="${it.id}" aria-label="Excluir ${esc(r.title)}">🗑</button>
          </div>`;
        }).join('') : `<div class="empty"><strong>${esc(cfg.empty || 'Nada cadastrado ainda.')}</strong><p>Use o formulário abaixo para adicionar.</p></div>`}</div>
        <div class="card" style="margin-top:24px" id="form-card">
          <h3 style="color:var(--text);margin-bottom:16px">${cur ? 'Editar' : esc(cfg.addTitle || 'Adicionar')}</h3>
          <form id="crud-form" novalidate>
            ${cfg.fields.map((f) => fieldHtml(f, cur ? cur[f.key] : (f.default != null ? f.default : ''))).join('')}
            <button class="btn btn-primary" type="submit">${cur ? 'Salvar alterações' : 'Salvar'}</button>
            ${cur ? '<button class="btn btn-outline" type="button" id="cancel" style="margin-top:8px">Cancelar edição</button>' : ''}
          </form>
        </div>`;
      el.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => { editId = b.dataset.edit; draw(); document.getElementById('form-card').scrollIntoView({ behavior: 'smooth' }); }));
      el.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
        const it = DB.get(cfg.table, b.dataset.del);
        const bloq = cfg.canDelete && cfg.canDelete(it);
        if (bloq) { toast(bloq, 'err'); return; }
        if (await confirmar(`Excluir "${cfg.item(it).title}"?`, 'Excluir')) {
          DB.remove(cfg.table, it.id);
          if (cfg.afterDelete) cfg.afterDelete(it);
          if (editId == it.id) editId = null;
          toast('Registro excluído.');
          draw();
        }
      }));
      const cancel = document.getElementById('cancel');
      if (cancel) cancel.addEventListener('click', () => { editId = null; draw(); });
      document.getElementById('crud-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const out = {}; let ok = true;
        cfg.fields.forEach((f) => {
          const raw = document.getElementById('f_' + f.key).value.trim();
          const err = document.getElementById('e_' + f.key);
          err.textContent = '';
          let v = raw;
          if (f.required && !raw) { err.textContent = 'Preencha este campo.'; ok = false; return; }
          if ((f.type === 'number' || f.type === 'money') && raw !== '') {
            v = num(raw);
            if (isNaN(v) || v < 0) { err.textContent = 'Informe um valor válido.'; ok = false; return; }
          }
          if (f.pattern && raw && !f.pattern.test(raw)) { err.textContent = f.patternMsg || 'Formato inválido.'; ok = false; return; }
          out[f.key] = v;
        });
        if (!ok) return;
        if (cfg.validate) { const m = cfg.validate(out, editId); if (m) { toast(m, 'err'); return; } }
        if (editId) { DB.update(cfg.table, editId, out); toast('Alterações salvas.'); if (cfg.afterSave) cfg.afterSave(DB.get(cfg.table, editId), false); }
        else { const o = DB.insert(cfg.table, Object.assign({}, cfg.defaults ? cfg.defaults() : {}, out)); toast('Cadastro realizado.'); if (cfg.afterSave) cfg.afterSave(o, true); }
        editId = null; draw();
      });
    }
    draw();
  }

  /* ---------- regras de negócio (simulação do back-end) ---------- */
  const Svc = {
    ETAPAS, STATUS,
    criarAgendamento(d) {
      const ag = DB.insert('agendamentos', Object.assign({ status: 'solicitado', etapa: 0, mecanicoId: null, valor: 0, criadoEm: Date.now() }, d));
      const cli = DB.get('usuarios', d.clienteId);
      DB.notifyOficina(d.oficinaId, `Novo agendamento: ${cli.nome} — ${d.servico} (${fmtData(d.data)}, ${d.hora}).`, '14-agenda-oficina.html', 'agendamento');
      return ag;
    },
    confirmar(id, valor, mecanicoId) {
      const ag = DB.update('agendamentos', id, { status: 'confirmado', etapa: 0, valor, mecanicoId: mecanicoId || null });
      const of = DB.get('oficinas', ag.oficinaId);
      DB.notify(ag.clienteId, `${of.nome} confirmou seu agendamento de ${fmtData(ag.data)} às ${ag.hora}.`, '09-acompanhamento.html?id=' + id, 'agendamento');
      if (mecanicoId) {
        const m = DB.where('usuarios', (u) => u.funcionarioId == mecanicoId)[0];
        if (m) DB.notify(m.id, `Nova ordem de serviço atribuída: ${ag.servico}.`, '30-home-mecanico.html', 'os');
      }
      return ag;
    },
    recusar(id, motivo) {
      const ag = DB.update('agendamentos', id, { status: 'recusado', motivo: motivo || '' });
      const of = DB.get('oficinas', ag.oficinaId);
      DB.notify(ag.clienteId, `${of.nome} não pôde atender o agendamento de ${fmtData(ag.data)}${motivo ? ': ' + motivo : '.'}`, '09-acompanhamento.html?id=' + id, 'agendamento');
    },
    cancelar(id) {
      const ag = DB.update('agendamentos', id, { status: 'cancelado' });
      DB.notifyOficina(ag.oficinaId, `Agendamento de ${fmtData(ag.data)} (${ag.hora}) foi cancelado pelo cliente.`, '14-agenda-oficina.html', 'agendamento');
    },
    /* retorna mensagem de erro ou null */
    avancar(id) {
      DB.load();
      const ag = DB.get('agendamentos', id);
      const of = DB.get('oficinas', ag.oficinaId);
      if (ag.status === 'confirmado') {
        DB.update('agendamentos', id, { status: 'em_andamento', etapa: 1 });
      } else if (ag.status === 'em_andamento' && ag.etapa < 3) {
        DB.update('agendamentos', id, { etapa: ag.etapa + 1 });
      } else if (ag.status === 'em_andamento' && ag.etapa === 3) {
        if (!DB.where('vistorias', (v) => v.agendamentoId == id)[0]) return 'Registre a vistoria antes de concluir o serviço.';
        DB.update('agendamentos', id, { etapa: 4, status: 'pronto' });
        DB.notify(ag.clienteId, `Serviço concluído! Seu veículo está pronto para retirada na ${of.nome}.`, '09-acompanhamento.html?id=' + id, 'conclusao');
        return null;
      } else { return 'Este serviço não pode ser avançado.'; }
      const novo = DB.get('agendamentos', id);
      DB.notify(ag.clienteId, `${ETAPAS[novo.etapa]} — ${ag.servico} na ${of.nome}.`, '09-acompanhamento.html?id=' + id, 'acompanhamento');
      return null;
    },
    pagar(id, forma) {
      DB.load();
      const ag = DB.get('agendamentos', id);
      const n = 100 + DB.all('pagamentos').length + 1;
      const pg = DB.insert('pagamentos', { agendamentoId: +id, forma, total: ag.valor, recibo: 'CWB-' + String(n).padStart(6, '0'), data: DB.iso(new Date()), criadoEm: Date.now() });
      DB.update('agendamentos', id, { status: 'pago' });
      const cli = DB.get('usuarios', ag.clienteId);
      DB.notifyOficina(ag.oficinaId, `Pagamento recebido de ${cli.nome}: ${money(ag.valor)} (${forma}).`, '23-recibo.html?id=' + id, 'pagamento');
      return pg;
    },
    responderOrcamento(orcId, oficinaId, valor, prazo, descricao) {
      DB.load();
      const ja = DB.where('propostas', (p) => p.orcamentoId == orcId && p.oficinaId == oficinaId)[0];
      if (ja) DB.update('propostas', ja.id, { valor, prazo, descricao, criadoEm: Date.now() });
      else DB.insert('propostas', { orcamentoId: +orcId, oficinaId, valor, prazo, descricao, criadoEm: Date.now() });
      const orc = DB.get('orcamentos', orcId), of = DB.get('oficinas', oficinaId);
      DB.notify(orc.clienteId, `${of.nome} respondeu seu orçamento: ${money(valor)}.`, '21-comparar-orcamentos.html', 'orcamento');
    },
  };

  /* ---------- lista de status para selects ---------- */
  window.CWB = { page, publico, crud, modal, confirmar, toast, esc, money, qs, fmtData, fmtTs, num, badge, statusBadge, stars, inicial, veiculoNome, Svc, ETAPAS, STATUS };
})();
