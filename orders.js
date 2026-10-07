/* orders.js — My Orders & Projects page */
(function(){
  const grid = document.getElementById('projects-grid');
  const empty = document.getElementById('empty-state');
  const search = document.getElementById('project-search');
  const seg = document.getElementById('lifecycle-seg');
  const statusSel = document.getElementById('status-filter');
  const countEl = document.getElementById('result-count');
  let lifecycle = 'all';

  function renderStats(){
    const s = OrdersStore.stats();
    document.getElementById('stat-total').textContent = s.total;
    document.getElementById('stat-active').textContent = s.active;
    document.getElementById('stat-completed').textContent = s.completed;
    document.getElementById('stat-pending').textContent = s.pending;
  }

  function card(o){
    const pct = OrdersStore.progress(o);
    const msDone = o.milestones.filter(m => milestoneStatus(m) === 'completed').length;
    return `
    <article class="project-card">
      <div class="project-card-top">
        <span class="order-id">${escapeHtml(o.id)}</span>
        ${statusChipHtml(o.status)}
      </div>
      <h3 class="project-title">${escapeHtml(o.title)}</h3>
      <p class="project-client">👤 ${escapeHtml(o.client.name)} · ${escapeHtml(o.client.company || '')}</p>
      <div class="progress-line">
        <div class="progress-bar"><span style="width:${pct}%"></span></div>
        <span class="progress-num">${pct}%</span>
      </div>
      <div class="project-facts">
        <span>📁 ${msDone}/${o.milestones.length} milestones</span>
        <span>💰 $${Number(o.budget).toLocaleString()}</span>
        <span>📅 Due ${formatShortDate(o.dueDate)}</span>
      </div>
      <a class="btn btn-secondary btn-sm btn-block" href="project-details.html?orderId=${encodeURIComponent(o.id)}">View project →</a>
    </article>`;
  }

  function render(){
    const q = search.value.trim().toLowerCase();
    const st = statusSel.value;
    let list = OrdersStore.getOrders();

    if (lifecycle === 'active')    list = list.filter(o => ['in-progress','submitted'].includes(o.status));
    if (lifecycle === 'completed') list = list.filter(o => o.status === 'completed');
    if (st !== 'all')              list = list.filter(o => o.status === st);
    if (q) list = list.filter(o => (o.title + ' ' + o.client.name + ' ' + o.id).toLowerCase().includes(q));

    grid.innerHTML = list.map(card).join('');
    const isEmpty = list.length === 0;
    empty.hidden = !isEmpty;
    grid.style.display = isEmpty ? 'none' : '';
    countEl.textContent = list.length + (list.length === 1 ? ' project found' : ' projects found');
  }

  function resetFilters(){
    search.value = '';
    statusSel.value = 'all';
    lifecycle = 'all';
    seg.querySelectorAll('.seg-btn').forEach(x => {
      const on = x.dataset.lifecycle === 'all';
      x.classList.toggle('is-active', on);
      x.setAttribute('aria-pressed', String(on));
    });
    render();
  }

  seg.addEventListener('click', e => {
    const b = e.target.closest('.seg-btn');
    if (!b) return;
    seg.querySelectorAll('.seg-btn').forEach(x => {
      const on = x === b;
      x.classList.toggle('is-active', on);
      x.setAttribute('aria-pressed', String(on));
    });
    lifecycle = b.dataset.lifecycle;
    render();
  });

  statusSel.addEventListener('change', render);
  let t;
  search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 200); });
  document.getElementById('clear-filters').addEventListener('click', resetFilters);
  document.getElementById('empty-clear').addEventListener('click', resetFilters);
  document.getElementById('reset-demo').addEventListener('click', () => {
    OrdersStore.reset();
    renderStats();
    render();
    showToast('Demo data reset');
  });

  renderStats();
  render();
})();