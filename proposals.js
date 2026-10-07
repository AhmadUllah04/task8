/* proposals.js — My Proposals page with status tabs */
(function(){
  const region = document.getElementById('proposals-region');
  const tabs = document.getElementById('status-tabs');
  let active = 'all';

  function statusChip(s){
    const cls = { 'Submitted':'chip-blue', 'Under Review':'chip-amber', 'Shortlisted':'chip-purple',
                  'Accepted':'chip-green', 'Rejected':'chip-red', 'Withdrawn':'chip-gray' }[s] || 'chip-gray';
    return '<span class="chip ' + cls + '">' + escapeHtml(s) + '</span>';
  }

  function render(){
    const all = DataStore.getProposals();
    const list = active === 'all' ? all : all.filter(p => p.status === active);

    if (!list.length){
      region.innerHTML = `<div class="empty-state">
        <h2>No ${active === 'all' ? '' : escapeHtml(active.toLowerCase() + ' ')}proposals yet</h2>
        <p>Find a job and submit your first proposal.</p>
        <a class="btn btn-primary" href="jobs.html">Find Jobs</a></div>`;
      return;
    }

    region.innerHTML = '<div class="proposal-list">' + list.map(p => `
      <article class="proposal-card">
        <div class="proposal-main">
          <h3><a href="job-details.html?id=${encodeURIComponent(p.jobId)}">${escapeHtml(p.jobTitle)}</a></h3>
          <p class="muted">Submitted ${formatRelativeDate(p.submittedDate)} ·
            ${p.status === 'Withdrawn' ? '—' : '$' + Number(p.bid).toLocaleString()}${p.days ? ' · ' + p.days + ' days delivery' : ''}</p>
          <p class="cover-excerpt">${escapeHtml(p.coverLetter.slice(0, 140))}${p.coverLetter.length > 140 ? '…' : ''}</p>
        </div>
        <div class="proposal-side">
          ${statusChip(p.status)}
          <div class="proposal-actions">
            ${['Submitted','Under Review'].includes(p.status)
              ? '<button class="btn btn-ghost btn-sm" data-withdraw="' + p.id + '">Withdraw</button>' : ''}
            <a class="btn btn-secondary btn-sm" href="job-details.html?id=${encodeURIComponent(p.jobId)}">View job</a>
          </div>
        </div>
      </article>`).join('') + '</div>';
  }

  tabs.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('is-active', b === btn));
    active = btn.dataset.status;
    render();
  });

  region.addEventListener('click', e => {
    const btn = e.target.closest('[data-withdraw]');
    if (!btn) return;
    DataStore.setProposalStatus(btn.dataset.withdraw, 'Withdrawn');
    showToast('Proposal withdrawn', 'info');
    render();
  });

  render();
})();