/* validation.js — small form-validation helpers */

function showFieldError(errorId, message){
  const el = document.getElementById(errorId);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function clearFieldError(errorId){
  const el = document.getElementById(errorId);
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

const V = {
  required: v => String(v).trim() !== '',
  minLen:   (v, n) => String(v).trim().length >= n,
  isNumber: v => v !== '' && !isNaN(Number(v)) && Number(v) > 0,
  selected: v => v !== ''
};