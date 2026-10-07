/* project-details.js — manage a single order (project-details.html?orderId=...) */
(function(){
  const $ = id => document.getElementById(id);
  let order = null, role = 'freelancer';

  const orderId = getQueryParam('orderId');
  order = orderId && OrdersStore.getOrder(orderId);

  if (!order){
    $('project-header').innerHTML = `<div class="empty-state"><h2>Order not found</h2>
      <p>Check the link or go back to your orders.</p>
      <a class="btn btn-primary" href="orders.html">Back to Orders</a></div>`;
    $('status-banner').hidden = true;
    document.querySelector('.details-grid').style.display = 'none';
    return;
  }

  document.title = order.id + ' — ' + order.title;
  const save = () => OrdersStore.updateOrder(order);

  /* ---------- render sections ---------- */

  function renderAll(){
    $('crumb-current').textContent = order.id + ' — ' + order.title;
    renderBanner(); renderHeader(); renderProgress();
    renderMilestones(); renderDelivery(); renderTimeline(); renderSide();
  }

  function renderBanner(){
    const b = $('status-banner');
    const map = {
      'pending':     { cls:'banner-amber',  icon:'⏳', text:'This order is confirmed and waiting to start. Kick-off is scheduled soon.' },
      'submitted':   { cls:'banner-purple', icon:'📤', text:'Final work has been submitted and is awaiting client approval.' },
      'completed':   { cls:'banner-green',  icon:'🎉', text:'This project is completed and approved. Great work everyone!' },
      'cancelled':   { cls:'banner-red',    icon:'✕',  text:'This order was cancelled.' }
    };
    const m = map[order.status];
    if (!m){ b.hidden = true; b.innerHTML = ''; return; }
    b.hidden = false;
    b.innerHTML = `<div class="status-banner ${m.cls}"><span class="banner-icon">${m.icon}</span>
      <div><strong>${ORDER_STATUSES[order.status].label}</strong><p>${m.text}</p></div></div>`;
  }

  function renderHeader(){
    $('project-header').innerHTML = `
      <div class="ph-top">
        <div>
          <div class="ph-id">${escapeHtml(order.id)} ${statusChipHtml(order.status)}</div>
          <h1>${escapeHtml(order.title)}</h1>
          <p class="muted">${escapeHtml(order.category)} · Started ${formatShortDate(order.startDate)} · Due ${formatShortDate(order.dueDate)}</p>
        </div>
        <div class="ph-budget"><span class="label">Order value</span><strong>$${Number(order.budget).toLocaleString()}</strong></div>
      </div>
      <div class="ph-actions" id="ph-actions"></div>`;
    renderActions();
  }

  function renderActions(){
    const btns = [];
    if (role === 'freelancer'){
      if (order.status === 'pending')     btns.push('<button class="btn btn-primary btn-sm" data-act="start">▶ Start working</button>');
      if (order.status === 'in-progress') btns.push('<button class="btn btn-primary btn-sm" data-act="submit">📤 Submit delivery</button>');
    } else {
      if (order.status === 'submitted'){
        btns.push('<button class="btn btn-primary btn-sm" data-act="approve">✓ Approve delivery</button>');
        btns.push('<button class="btn btn-secondary btn-sm" data-act="changes">↩ Request changes</button>');
      }
      if (order.status === 'pending') btns.push('<button class="btn btn-ghost btn-sm" data-act="cancel">Cancel order</button>');
    }
    $('ph-actions').innerHTML = btns.join('');
  }

  function renderProgress(){
    const pct = OrdersStore.progress(order);
    const doneMs = order.milestones.filter(m => milestoneStatus(m) === 'completed').length;
    $('progress-body').innerHTML = `
      <div class="big-progress">
        <div class="progress-bar lg"><span style="width:${pct}%"></span></div>
        <div class="big-progress-meta"><strong>${pct}% complete</strong><span>${doneMs} of ${order.milestones.length} milestones done</span></div>
      </div>
      <div class="mini-milestones">
        ${order.milestones.map(m => {
          const st = milestoneStatus(m);
          return `<div class="mini-ms">
            <span class="ms-dot ${st}"></span>
            <span class="ms-title">${escapeHtml(m.title)}</span>
            <span class="ms-state">${st.replace('-',' ')}</span>
          </div>`;
        }).join('')}
      </div>`;
  }

  function renderMilestones(){
    const all = order.milestones.flatMap(m => m.tasks);
    $('milestones-total').textContent = all.filter(t => t.done).length + '/' + all.length + ' tasks';
    const locked = order.status === 'completed' || order.status === 'cancelled' ||
                   order.status === 'submitted' || role === 'client';
    $('milestones-body').innerHTML = order.milestones.map((m, mi) => {
      const st = milestoneStatus(m);
      return `<div class="milestone">
        <div class="milestone-head">
          <h3>${escapeHtml(m.title)}</h3>
          <span class="chip ${st === 'completed' ? 'chip-green' : st === 'in-progress' ? 'chip-blue' : 'chip-gray'}">${st.replace('-',' ')}</span>
        </div>
        <ul class="task-list">
          ${m.tasks.map((t, ti) => `
            <li class="task ${t.done ? 'done' : ''}">
              <label>
                <input type="checkbox" data-m="${mi}" data-t="${ti}" ${t.done ? 'checked' : ''} ${locked ? 'disabled' : ''}>
                <span>${escapeHtml(t.text)}</span>
              </label>
            </li>`).join('')}
        </ul>
      </div>`;
    }).join('');
  }

  function renderDelivery(){
    const d = order.delivery;
    let inner = '';
    if (order.status === 'submitted' || order.status === 'completed'){
      inner = `
        <p class="delivery-package"><strong>Package:</strong> ${escapeHtml(d.package)}</p>
        ${d.files.length ? '<ul class="file-list">' + d.files.map(f => '<li>📎 ' + escapeHtml(f) + '</li>').join('') + '</ul>' : ''}
        <p class="muted">Submitted on ${formatShortDate(d.submittedOn || order.dueDate)} · ${escapeHtml(d.notes || 'No additional notes.')}</p>
        ${order.status === 'completed'
          ? '<div class="chip chip-green" style="margin-top:10px;">Approved by client</div>'
          : '<div class="chip chip-purple" style="margin-top:10px;">Awaiting client approval</div>'}`;
    } else if (order.status === 'cancelled'){
      inner = '<p class="muted">Delivery is not available — this order was cancelled.</p>';
    } else {
      inner = `<p class="muted">No delivery submitted yet. Final package, files and notes will appear here once the freelancer submits the work.</p>
        <p class="muted" style="margin-top:8px;">Planned package: ${escapeHtml(d.package)}</p>`;
    }
    $('delivery-body').innerHTML = inner;
    const dchip = { 'pending':'chip-gray', 'in-progress':'chip-gray', 'submitted':'chip-purple', 'completed':'chip-green', 'cancelled':'chip-gray' };
    const dlabel = { 'pending':'Not submitted', 'in-progress':'Not submitted', 'submitted':'Submitted', 'completed':'Approved', 'cancelled':'—' };
    $('delivery-chip').innerHTML = '<span class="chip ' + dchip[order.status] + '">' + dlabel[order.status] + '</span>';
  }

  function renderTimeline(){
    const steps = ['pending','in-progress','submitted','completed'];
    const labels = { 'pending':'Order Placed', 'in-progress':'In Progress', 'submitted':'Work Submitted', 'completed':'Completed & Approved' };
    const idx = order.status === 'cancelled' ? 1 : steps.indexOf(order.status);
    $('timeline-body').innerHTML = '<ol class="timeline">' + steps.map((s, i) => `
      <li class="tl-step ${i <= idx ? 'done' : ''} ${order.status === 'cancelled' && s === 'in-progress' ? 'cancelled' : ''}">
        <span class="tl-dot">${i <= idx ? '✓' : i + 1}</span>
        <div><strong>${labels[s]}</strong><span>${i <= idx ? (i === 0 ? formatShortDate(order.startDate) : 'Done') : 'Pending'}</span></div>
      </li>`).join('') + '</ol>' +
      (order.status === 'cancelled' ? '<div class="chip chip-red" style="margin-top:10px;">Order cancelled — timeline frozen</div>' : '');
  }

  function renderSide(){
    $('client-card').innerHTML = `
      <div class="card side-card">
        <h3>Client</h3>
        <div class="person">
          <span class="avatar">${getInitials(order.client.name)}</span>
          <div><strong>${escapeHtml(order.client.name)}</strong><span>${escapeHtml(order.client.company || '')}</span><span>${escapeHtml(order.client.location || '')}</span></div>
        </div>
        <p class="rating">⭐ ${order.client.rating} client rating</p>
      </div>`;
    $('freelancer-card').innerHTML = `
      <div class="card side-card">
        <h3>Freelancer</h3>
        <div class="person">
          <span class="avatar au">AU</span>
          <div><strong>Ahmad Ullah</strong><span>Full-Stack Developer</span><span>Guildwork · Top Rated</span></div>
        </div>
      </div>`;
    $('facts-card').innerHTML = `
      <div class="card side-card">
        <h3>Order facts</h3>
        <ul class="facts">
          <li><span>Order ID</span><strong>${escapeHtml(order.id)}</strong></li>
          <li><span>Budget</span><strong>$${Number(order.budget).toLocaleString()}</strong></li>
          <li><span>Category</span><strong>${escapeHtml(order.category)}</strong></li>
          <li><span>Started</span><strong>${formatShortDate(order.startDate)}</strong></li>
          <li><span>Due</span><strong>${formatShortDate(order.dueDate)}</strong></li>
          <li><span>Status</span><strong>${ORDER_STATUSES[order.status].label}</strong></li>
        </ul>
      </div>`;
  }

  /* ---------- modal ---------- */
  const overlay = $('modal-overlay');
  let onConfirm = null;
  function openModal(opt, cb){
    $('modal-title').textContent = opt.title;
    $('modal-body').innerHTML = opt.body;
    const c = $('modal-confirm');
    c.textContent = opt.confirm || 'Confirm';
    c.classList.toggle('btn-danger', !!opt.danger);
    c.classList.toggle('btn-primary', !opt.danger);
    onConfirm = cb;
    overlay.classList.add('open');
  }
  function closeModal(){ overlay.classList.remove('open'); onConfirm = null; }
  $('modal-close').addEventListener('click', closeModal);
  $('modal-cancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });
  $('modal-confirm').addEventListener('click', () => { const cb = onConfirm; closeModal(); if (cb) cb(); });

  /* ---------- actions ---------- */
  $('project-header').addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;

    if (act === 'start') openModal({ title:'Start this order?',
      body:'Confirm that you are beginning work on <strong>' + escapeHtml(order.title) + '</strong>.', confirm:'Start working' },
      () => { order.status = 'in-progress'; save(); renderAll(); showToast('Order started — good luck!'); });

    if (act === 'submit') openModal({ title:'Submit final delivery?',
      body:'All tasks will be marked complete and the client will be asked to review your submission.', confirm:'Submit delivery' },
      () => {
        order.delivery.submittedOn = new Date().toISOString();
        order.delivery.notes = order.delivery.notes || 'Final package delivered.';
        order.milestones.forEach(m => m.tasks.forEach(t => t.done = true));
        order.status = 'submitted'; save(); renderAll(); showToast('Delivery submitted for approval');
      });

    if (act === 'approve') openModal({ title:'Approve & complete order?',
      body:'Approving will mark the project as <strong>Completed</strong> and release the payment of <strong>$' + Number(order.budget).toLocaleString() + '</strong>.', confirm:'Approve & complete' },
      () => { order.status = 'completed'; save(); renderAll(); showToast('🎉 Project completed!'); });

    if (act === 'changes') openModal({ title:'Request changes?',
      body:'The order will move back to <strong>In Progress</strong> so the freelancer can revise the work.', confirm:'Request changes' },
      () => { order.status = 'in-progress'; save(); renderAll(); showToast('Changes requested', 'info'); });

    if (act === 'cancel') openModal({ title:'Cancel this order?',
      body:'This will cancel the order permanently. This action cannot be undone.', confirm:'Yes, cancel order', danger:true },
      () => { order.status = 'cancelled'; save(); renderAll(); showToast('Order cancelled', 'error'); });
  });

  /* ---------- milestones checkbox ---------- */
  $('milestones-body').addEventListener('change', e => {
    const cb = e.target.closest('input[type="checkbox"]');
    if (!cb) return;
    const m = Number(cb.dataset.m), t = Number(cb.dataset.t);
    order.milestones[m].tasks[t].done = cb.checked;
    if (order.status === 'pending' && cb.checked){
      order.status = 'in-progress';
      showToast('Order started');
    }
    save(); renderAll();
  });

  /* ---------- role switch ---------- */
  $('role-seg').addEventListener('click', e => {
    const b = e.target.closest('.seg-btn');
    if (!b) return;
    role = b.dataset.role;
    document.querySelectorAll('#role-seg .seg-btn').forEach(x => {
      const on = x === b;
      x.classList.toggle('is-active', on);
      x.setAttribute('aria-pressed', String(on));
    });
    $('milestones-note').textContent = role === 'freelancer'
      ? 'Check off tasks to update project progress.'
      : 'Progress updates as the freelancer completes tasks.';
    renderActions(); renderMilestones();
  });

  renderAll();
})();