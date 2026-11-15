/* Campo de fotos: lê imagens, reduz para miniaturas (couber no localStorage) */
(function () {
  function reduzir(file, max) {
    return new Promise((res) => {
      const r = new FileReader();
      r.onload = () => {
        const img = new Image();
        img.onload = () => {
          const s = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = () => res(null);
        img.src = r.result;
      };
      r.onerror = () => res(null);
      r.readAsDataURL(file);
    });
  }
  const Fotos = {
    campo(el, limite, iniciais, onChange) {
      let lista = (iniciais || []).slice();
      function pintar() {
        el.innerHTML = `<div class="thumbs">${lista.map((f, i) => `<span style="position:relative"><img src="${f}" alt="Foto ${i + 1}"><button type="button" class="icon-btn danger" data-rm="${i}" style="position:absolute;top:-8px;right:-8px;width:24px;height:24px;font-size:12px;background:var(--bg-card);border:1px solid var(--line)" aria-label="Remover foto ${i + 1}">✕</button></span>`).join('')}
          ${lista.length < limite ? '<label class="addphoto" title="Adicionar foto">＋<input type="file" accept="image/*" hidden></label>' : ''}</div>`;
        const inp = el.querySelector('input[type=file]');
        if (inp) inp.addEventListener('change', async () => {
          const f = inp.files[0]; if (!f) return;
          const d = await reduzir(f, 480);
          if (!d) { CWB.toast('Não foi possível ler essa imagem.', 'err'); return; }
          lista.push(d); pintar(); if (onChange) onChange(lista);
        });
        el.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => { lista.splice(+b.dataset.rm, 1); pintar(); if (onChange) onChange(lista); }));
      }
      pintar();
      return { lista: () => lista.slice() };
    },
    mostrar(fotos) {
      return fotos && fotos.length ? `<div class="thumbs">${fotos.map((f, i) => `<img src="${f}" alt="Foto ${i + 1}">`).join('')}</div>` : '';
    },
  };
  window.Fotos = Fotos;
})();
