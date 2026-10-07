/* post-job.js — Post a Job form: counters, skill tags, validation, save */
(function(){
  const form = document.getElementById('post-job-form');
  const title = document.getElementById('title');
  const desc = document.getElementById('description');
  const category = document.getElementById('category');
  const skillsWrap = document.getElementById('skills-wrap');
  const skillsInput = document.getElementById('skills-input');
  const budgetMin = document.getElementById('budget-min');
  const budgetMax = document.getElementById('budget-max');
  const experience = document.getElementById('experience');
  const duration = document.getElementById('duration');
  const jobtype = document.getElementById('jobtype');

  /* char counters */
  [[title, 'title-counter'], [desc, 'description-counter']].forEach(([input, counterId]) => {
    const c = document.getElementById(counterId);
    const update = () => c.textContent = input.value.length + ' / ' + input.maxLength;
    input.addEventListener('input', update);
    update();
  });

  /* skills tag input */
  let skills = [];
  function renderSkills(){
    skillsWrap.querySelectorAll('.skill-tag').forEach(t => t.remove());
    skills.forEach((s, i) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.innerHTML = escapeHtml(s) + ' <button type="button" aria-label="Remove ' + escapeHtml(s) + '" data-i="' + i + '">×</button>';
      skillsWrap.insertBefore(tag, skillsInput);
    });
  }
  skillsWrap.addEventListener('click', e => {
    const btn = e.target.closest('button[data-i]');
    if (btn){ skills.splice(Number(btn.dataset.i), 1); renderSkills(); }
    skillsInput.focus();
  });
  skillsInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ','){
      e.preventDefault();
      const v = skillsInput.value.replace(/,/g, '').trim();
      if (v && !skills.includes(v) && skills.length < 10){ skills.push(v); renderSkills(); }
      skillsInput.value = '';
    } else if (e.key === 'Backspace' && !skillsInput.value && skills.length){
      skills.pop(); renderSkills();
    }
  });

  /* budget type radio ↔ job type select stay in sync */
  form.querySelectorAll('input[name="budgetType"]').forEach(r =>
    r.addEventListener('change', () => { jobtype.value = r.value; }));
  jobtype.addEventListener('change', () => {
    const r = form.querySelector('input[name="budgetType"][value="' + jobtype.value + '"]');
    if (r) r.checked = true;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const titleV = title.value.trim(), descV = desc.value.trim(), catV = category.value;
    const minV = budgetMin.value, maxV = budgetMax.value;
    const expV = experience.value, durV = duration.value, jtV = jobtype.value;
    let ok = true;

    if (!V.minLen(titleV, 10)){ showFieldError('title-error', 'Title must be at least 10 characters.'); ok = false; } else clearFieldError('title-error');
    if (!V.selected(catV)){ showFieldError('category-error', 'Please select a category.'); ok = false; } else clearFieldError('category-error');
    if (!V.minLen(descV, 50)){ showFieldError('description-error', 'Description must be at least 50 characters.'); ok = false; } else clearFieldError('description-error');
    if (!skills.length){ showFieldError('skills-error', 'Add at least one required skill.'); ok = false; } else clearFieldError('skills-error');
    if (!V.isNumber(minV)){ showFieldError('budget-min-error', 'Enter a valid minimum budget.'); ok = false; } else clearFieldError('budget-min-error');
    if (!V.isNumber(maxV)){ showFieldError('budget-max-error', 'Enter a valid maximum budget.'); ok = false; } else clearFieldError('budget-max-error');
    if (ok && Number(maxV) <= Number(minV)){ showFieldError('budget-max-error', 'Maximum must be greater than minimum.'); ok = false; }
    if (!V.selected(expV)){ showFieldError('experience-error', 'Please select an experience level.'); ok = false; } else clearFieldError('experience-error');
    if (!V.selected(durV)){ showFieldError('duration-error', 'Please select a duration.'); ok = false; } else clearFieldError('duration-error');
    if (!V.selected(jtV)){ showFieldError('jobtype-error', 'Please select a job type.'); ok = false; } else clearFieldError('jobtype-error');
    if (!ok) return;

    DataStore.addJob({
      title: titleV, category: catV, description: descV, skills: [...skills],
      budgetType: jtV, min: Number(minV), max: Number(maxV),
      experience: expV, duration: durV
    });
    showToast('Job posted successfully!');
    setTimeout(() => window.location.href = 'jobs.html', 1000);
  });
})();