/* jobs.js — Find Jobs page: search, filters, sort, render */
(function(){
  const grid = document.getElementById('job-grid');
  const form = document.getElementById('filter-form');
  const els = {
    search:     document.getElementById('search-input'),
    sort:       document.getElementById('sort-select'),
    category:   document.getElementById('category-select'),
    budget:     document.getElementById('budget-select'),
    skill:      document.getElementById('skill-select'),
    experience: document.getElementById('experience-select'),
    jobtype:    document.getElementById('jobtype-select'),
    posted:     document.getElementById('posted-select'),
    count:      document.getElementById('result-count'),
    chips:      document.getElementById('active-filters'),
    clear:      document.getElementById('clear-filters')
  };
  let errorMode = false;

  /* prefill from index.html category cards: jobs.html?category=... */
  const urlCategory = getQueryParam('category');
  if (urlCategory && CATEGORY_COLORS[urlCategory]) els.category.value = urlCategory;

  /* populate category + skill selects */
  Object.keys(CATEGORY_COLORS).forEach(c =>
    els.category.insertAdjacentHTML('beforeend', '<option>' + c + '</option>'));
  [...new Set(DataStore.getAllJobs().flatMap(j => j.skills))].sort().forEach(s =>
    els.skill.insertAdjacentHTML('beforeend', '<option>' + escapeHtml(s) + '</option>'));

  function readFilters(){
    return {
      q: els.search.value.trim().toLowerCase(),
      sort: els.sort.value,
      category: els.category.value,
      budget: els.budget.value,
      skill: els.skill.value,
      experience: els.experience.value,
      jobtype: els.jobtype.value,
      posted: els.posted.value
    };
  }

  function applyFilters(){
    const f = readFilters();
    let jobs = DataStore.getAllJobs();

    if (f.q)         jobs = jobs.filter(j => (j.title + ' ' + j.description + ' ' + j.skills.join(' ')).toLowerCase().includes(f.q));
    if (f.category)  jobs = jobs.filter(j => j.category === f.category);
    if (f.skill)     jobs = jobs.filter(j => j.skills.includes(f.skill));
    if (f.experience)jobs = jobs.filter(j => j.experience === f.experience);
    if (f.jobtype)   jobs = jobs.filter(j => j.budgetType === f.jobtype);
    if (f.budget){
      const [lo, hi] = f.budget.split('-').map(Number);
      jobs = jobs.filter(j => j.max >= lo && j.max <= hi);
    }
    if (f.posted){
      const cutoff = Date.now() - Number(f.posted) * 86400000;
      jobs = jobs.filter(j => new Date(j.postedDate).getTime() >= cutoff);
    }

    const sorters = {
      'newest':           (a,b) => new Date(b.postedDate) - new Date(a.postedDate),
      'oldest':           (a,b) => new Date(a.postedDate) - new Date(b.postedDate),
      'budget-high':      (a,b) => b.max - a.max,
      'budget-low':       (a,b) => a.min - b.min,
      'most-proposals':   (a,b) => b.proposals - a.proposals,
      'fewest-proposals': (a,b) => a.proposals - b.proposals
    };
    jobs.sort(sorters[f.sort] || sorters.newest);

    renderChips(f);
    renderJobs(jobs);
  }

  function jobCard(j){
    const snippet = j.description.length > 130 ? j.description.slice(0, 130) + '…' : j.description;
    const proposed = DataStore.hasProposed(j.id);
    const col = categoryColor(j.category);
    return `
    <article class="job-card">
      <div class="job-card-top">
        <span class="category-pill" style="background:${col}1a;color:${col}">${escapeHtml(j.category)}</span>
        <span class="job-time">${formatRelativeDate(j.postedDate)}</span>
      </div>
      <h3 class="job-title"><a href="job-details.html?id=${encodeURIComponent(j.id)}">${escapeHtml(j.title)}</a></h3>
      <p class="job-desc">${escapeHtml(snippet)}</p>
      <div class="skill-chips">${j.skills.slice(0,4).map(s => '<span class="skill-chip">' + escapeHtml(s) + '</span>').join('')}</div>
      <div class="job-card-footer">
        <div>
          <span class="job-budget">${formatBudget(j)}</span>
          <span class="job-meta">${escapeHtml(j.experience)} · ${escapeHtml(j.budgetType)} · ${j.proposals} proposals</span>
        </div>
        <div class="job-card-actions">
          <a class="btn btn-ghost btn-sm" href="job-details.html?id=${encodeURIComponent(j.id)}">Details</a>
          <a class="btn btn-primary btn-sm" href="proposal.html?jobId=${encodeURIComponent(j.id)}">${proposed ? 'View proposal' : 'Submit a Proposal'}</a>
        </div>
      </div>
    </article>`;
  }

  function renderJobs(jobs){
    if (errorMode){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <h2>Couldn't load jobs</h2>
        <p>Something went wrong while fetching the job feed.</p>
        <button class="btn btn-primary btn-sm" id="retry-load">Retry</button></div>`;
      document.getElementById('retry-load').addEventListener('click', () => { errorMode = false; applyFilters(); });
      els.count.textContent = '0 jobs found';
      return;
    }
    els.count.textContent = jobs.length + (jobs.length === 1 ? ' job found' : ' jobs found');
    if (!jobs.length){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <h2>No jobs match your filters</h2>
        <p>Try removing a filter or searching a different keyword.</p>
        <button class="btn btn-secondary btn-sm" id="empty-clear">Clear all filters</button></div>`;
      document.getElementById('empty-clear').addEventListener('click', clearAll);
      return;
    }
    grid.innerHTML = jobs.map(jobCard).join('');
  }

  function renderChips(f){
    const chips = [];
    if (f.q)          chips.push({ key:'q',          label:'Search: "' + f.q + '"' });
    if (f.category)   chips.push({ key:'category',   label:f.category });
    if (f.budget)     chips.push({ key:'budget',     label:els.budget.options[els.budget.selectedIndex].text });
    if (f.skill)      chips.push({ key:'skill',      label:f.skill });
    if (f.experience) chips.push({ key:'experience', label:f.experience });
    if (f.jobtype)    chips.push({ key:'jobtype',    label:f.jobtype });
    if (f.posted)     chips.push({ key:'posted',     label:els.posted.options[els.posted.selectedIndex].text });
    els.chips.innerHTML = chips.map(c =>
      '<button type="button" class="filter-chip" data-key="' + c.key + '">' + escapeHtml(c.label) + ' <span aria-hidden="true">×</span></button>'
    ).join('');
  }

  function clearAll(){
    form.reset();
    applyFilters();
    history.replaceState(null, '', location.pathname); /* remove ?category= from URL */
  }

  els.clear.addEventListener('click', clearAll);

  els.chips.addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    const map = { q:els.search, category:els.category, budget:els.budget, skill:els.skill,
                  experience:els.experience, jobtype:els.jobtype, posted:els.posted };
    const el = map[btn.dataset.key];
    if (el){ el.value = ''; applyFilters(); }
  });

  document.getElementById('simulate-error-btn').addEventListener('click', () => {
    grid.innerHTML = Array(4).fill('<div class="skeleton-card"><div class="sk w60"></div><div class="sk w90"></div><div class="sk w40"></div></div>').join('');
    setTimeout(() => { errorMode = true; applyFilters(); }, 1200);
  });

  form.addEventListener('submit', e => { e.preventDefault(); applyFilters(); });
  [els.category, els.budget, els.skill, els.experience, els.jobtype, els.posted, els.sort]
    .forEach(el => el.addEventListener('change', applyFilters));
  let t;
  els.search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(applyFilters, 250); });

  applyFilters();
})();