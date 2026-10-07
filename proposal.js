/* proposal.js — Submit a Proposal page (proposal.html?jobId=...) */
(function(){
  const region = document.getElementById('proposal-region');
  const jobId = getQueryParam('jobId');
  const job = jobId && DataStore.getJobById(jobId);

  if (!job){
    region.innerHTML = `<div class="empty-state"><h2>Job not found</h2>
      <p>The job you are trying to propose on does not exist.</p>
      <a class="btn btn-primary" href="jobs.html">Browse jobs</a></div>`;
    return;
  }

  if (DataStore.hasProposed(jobId)){
    region.innerHTML = `<div class="empty-state"><h2>✓ You already proposed on this job</h2>
      <p>You can track its status from your proposals page.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
        <a class="btn btn-primary" href="my-proposals.html">View My Proposals</a>
        <a class="btn btn-secondary" href="jobs.html">Find more jobs</a>
      </div></div>`;
    return;
  }

  document.title = 'Proposal: ' + job.title + ' — AhmadUllah';
  const col = categoryColor(job.category);
  const bidLabel = job.budgetType === 'Hourly' ? 'Your hourly rate ($)' : 'Your bid ($)';

  region.innerHTML = `
    <p><a href="job-details.html?id=${encodeURIComponent(job.id)}" class="back-link">← Back to job details</a></p>
    <h1 style="margin:12px 0 4px;">Submit a Proposal</h1>
    <p class="muted">Send your offer for the job below.</p>

    <div class="proposal-layout">
      <form class="form-card" id="proposal-form" novalidate>
        <div class="form-row">
          <label class="field-label" for="cover-letter">Cover letter <span class="req">*</span></label>
          <textarea id="cover-letter" placeholder="Introduce yourself, explain why you're a great fit, and outline your approach…" maxlength="2000" style="min-height:180px;"></textarea>
          <div class="char-counter" id="cover-counter">0 / 2000</div>
          <p class="field-hint">Minimum 50 characters. Tailored proposals win more jobs.</p>
          <p class="field-error" id="cover-error" hidden></p>
        </div>

        <div class="form-row form-row-split">
          <div>
            <label class="field-label" for="bid">${bidLabel} <span class="req">*</span></label>
            <input type="number" id="bid" class="text-input" min="1" placeholder="${job.min} – ${job.max}">
            <p class="field-error" id="bid-error" hidden></p>
          </div>
          <div>
            <label class="field-label" for="days">Delivery time (days) <span class="req">*</span></label>
            <input type="number" id="days" class="text-input" min="1" placeholder="e.g. 14">
            <p class="field-error" id="days-error" hidden></p>
          </div>
        </div>

        <div class="form-actions">
          <a href="job-details.html?id=${encodeURIComponent(job.id)}" class="btn btn-secondary">Cancel</a>
          <button type="submit" class="btn btn-primary btn-block">Submit Proposal</button>
        </div>
      </form>

      <aside class="card job-summary">
        <h3>Job summary</h3>
        <div style="margin-bottom:10px;"><span class="category-pill" style="background:${col}1a;color:${col}">${escapeHtml(job.category)}</span></div>
        <div class="row"><span>Job</span><strong>${escapeHtml(job.title)}</strong></div>
        <div class="row"><span>Client budget</span><strong>${formatBudget(job)}</strong></div>
        <div class="row"><span>Experience</span><strong>${escapeHtml(job.experience)}</strong></div>
        <div class="row"><span>Duration</span><strong>${escapeHtml(job.duration)}</strong></div>
        <div class="row"><span>Proposals so far</span><strong>${job.proposals}</strong></div>
      </aside>
    </div>`;

  const cover = document.getElementById('cover-letter');
  const counter = document.getElementById('cover-counter');
  cover.addEventListener('input', () => counter.textContent = cover.value.length + ' / 2000');

  document.getElementById('proposal-form').addEventListener('submit', e => {
    e.preventDefault();
    const bid = document.getElementById('bid').value;
    const days = document.getElementById('days').value;
    let ok = true;

    if (!V.minLen(cover.value, 50)){ showFieldError('cover-error', 'Please write at least 50 characters.'); ok = false; } else clearFieldError('cover-error');
    if (!V.isNumber(bid)){ showFieldError('bid-error', 'Enter a valid amount.'); ok = false; } else clearFieldError('bid-error');
    if (!V.isNumber(days)){ showFieldError('days-error', 'Enter a valid number of days.'); ok = false; } else clearFieldError('days-error');
    if (!ok) return;

    DataStore.addProposal({
      jobId: job.id,
      jobTitle: job.title,
      bid: Number(bid),
      days: Number(days),
      coverLetter: cover.value.trim()
    });
    showToast('Proposal submitted successfully!');
    setTimeout(() => window.location.href = 'my-proposals.html', 1000);
  });
})();