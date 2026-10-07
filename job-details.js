/* job-details.js — renders one job (job-details.html?id=...) */
(function(){
  const region = document.getElementById('details-region');
  const id = getQueryParam('id');
  const job = id && DataStore.getJobById(id);

  if (!job){
    region.innerHTML = `<div class="empty-state"><h2>Job not found</h2>
      <p>This job may have been removed or the link is incorrect.</p>
      <a class="btn btn-primary" href="jobs.html">Browse all jobs</a></div>`;
    return;
  }

  document.title = job.title + ' — AhmadUllah';
  const c = job.client;
  const col = categoryColor(job.category);
  const proposed = DataStore.hasProposed(job.id);
  const similar = DataStore.getAllJobs().filter(j => j.category === job.category && j.id !== job.id).slice(0, 3);

  region.innerHTML = `
  <div class="details-layout">
    <div class="details-content">
      <div class="job-card-top">
        <span class="category-pill" style="background:${col}1a;color:${col}">${escapeHtml(job.category)}</span>
        <span class="job-time">Posted ${formatRelativeDate(job.postedDate)}</span>
      </div>
      <h1>${escapeHtml(job.title)}</h1>
      <div class="meta-chips">
        <span class="meta-chip">💼 ${escapeHtml(job.budgetType)}</span>
        <span class="meta-chip">📈 ${escapeHtml(job.experience)}</span>
        <span class="meta-chip">⏱ ${escapeHtml(job.duration)}</span>
        <span class="meta-chip">📝 ${job.proposals} proposals</span>
      </div>

      <section class="card block">
        <h2>Project description</h2>
        <p class="prewrap">${escapeHtml(job.description)}</p>
      </section>

      <section class="card block">
        <h2>Skills required</h2>
        <div class="skill-chips">${job.skills.map(s => '<span class="skill-chip">' + escapeHtml(s) + '</span>').join('')}</div>
      </section>

      ${similar.length ? `
      <section class="card block">
        <h2>Similar jobs in ${escapeHtml(job.category)}</h2>
        <div class="similar-list">
          ${similar.map(s => `
            <div class="similar-item">
              <a href="job-details.html?id=${encodeURIComponent(s.id)}">${escapeHtml(s.title)}</a>
              <div style="text-align:right">
                <strong class="sim-budget">${formatBudget(s)}</strong>
                <span class="job-meta" style="display:block">${s.proposals} proposals</span>
              </div>
            </div>`).join('')}
        </div>
      </section>` : ''}
    </div>

    <aside class="details-side">
      <div class="card budget-card">
        <span class="label">Budget</span>
        <div class="budget-value">${formatBudget(job)}</div>
        <span class="sub">${job.budgetType === 'Hourly' ? 'Hourly rate' : 'Fixed price'}</span>
        ${proposed
          ? '<div class="proposed-note">✓ Proposal submitted — <a href="my-proposals.html">view it here</a></div>'
          : `<a class="btn btn-primary btn-block" href="proposal.html?jobId=${encodeURIComponent(job.id)}">Submit a Proposal</a>`}
        <button class="btn btn-secondary btn-block" id="save-job-btn" type="button">♡ Save job</button>
      </div>

      <div class="card client-card">
        <h3>About the client</h3>
        <div class="client-row">
          <span class="avatar">${getInitials(c.name)}</span>
          <div><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.location)}</span></div>
        </div>
        <ul class="client-facts">
          <li>⭐ ${c.rating} average rating</li>
          <li>🧾 ${c.hires} previous hires</li>
          <li>${c.verified ? '✅ Payment verified' : '⏳ Payment unverified'}</li>
        </ul>
      </div>
    </aside>
  </div>`;

  const saveBtn = document.getElementById('save-job-btn');
  function syncSaveBtn(){
    const fav = DataStore.isFavorite(job.id);
    saveBtn.textContent = fav ? '❤️ Saved' : '♡ Save job';
  }
  syncSaveBtn();
  saveBtn.addEventListener('click', () => {
    const nowFav = DataStore.toggleFavorite(job.id);
    syncSaveBtn();
    showToast(nowFav ? 'Job saved to favorites' : 'Removed from favorites');
  });
})();