/* ============================================================
   Guildwork — Messages, Notifications & Reviews (Week 6)
   Vanilla JS · mock data · IIFE-wrapped so it never clashes
   with globals from app.js / data.js.
   ============================================================ */

(function () {
  'use strict';

  /* ============================== Mock data ============================== */

  const CURRENT_USER = { name: 'AhmadUllah' };
  const MAX_REVIEW_CHARS = 600;
  const RATING_WORDS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };

  const conversations = [
    {
      id: 'c1', name: 'Sarah Mitchell', color: 'indigo', online: true,
      project: 'E-commerce Website Redesign', unread: 2,
      messages: [
        { from: 'them', text: 'Hi Ahmad! I went through the homepage mockups last night — they look fantastic.', time: '2025-05-19T09:12' },
        { from: 'me',   text: 'Thanks Sarah! The product carousel you asked for is now on the hero section.', time: '2025-05-19T09:20' },
        { from: 'them', text: 'Perfect. One tweak — could the mobile menu slide in from the right instead of dropping from the top?', time: '2025-05-19T09:24' },
        { from: 'them', text: 'And can we apply the new colour palette to the checkout page before Friday?', time: '2025-05-19T09:25' },
      ],
    },
    {
      id: 'c2', name: 'David Chen', color: 'blue', online: false,
      project: 'Logo Design for Coffee Brand', unread: 0,
      messages: [
        { from: 'me',   text: "Hi David, I've uploaded the three logo concepts to the project files.", time: '2025-05-18T15:02' },
        { from: 'them', text: 'Got them — concept 2 is exactly the vibe we wanted. Sending notes on the wordmark shortly.', time: '2025-05-18T16:38' },
      ],
    },
    {
      id: 'c3', name: 'Amara Okafor', color: 'green', online: true,
      project: 'Blog Content Writing (10 Articles)', unread: 1,
      messages: [
        { from: 'them', text: 'The first three articles are performing really well — page views are up 40%!', time: '2025-05-17T10:01' },
        { from: 'me',   text: "That's great to hear! I'll keep the same tone for the next batch.", time: '2025-05-17T10:05' },
        { from: 'them', text: 'Sending the revised outline for articles 4–6 in a few minutes.', time: '2025-05-17T10:08' },
      ],
    },
    {
      id: 'c4', name: 'James Rodriguez', color: 'amber', online: false,
      project: 'Mobile App UI Development', unread: 0,
      messages: [
        { from: 'them', text: 'Milestone 2 is approved. Invoicing now.', time: '2025-05-16T12:30' },
        { from: 'me',   text: 'Thanks James! Starting on the settings and profile screens next.', time: '2025-05-16T13:02' },
      ],
    },
    {
      id: 'c5', name: 'Fatima Zahra', color: 'rose', online: true,
      project: 'SEO Audit & Optimization', unread: 0,
      messages: [
        { from: 'them', text: 'Just wanted to say the audit report was incredibly thorough. Thank you!', time: '2025-05-15T18:20' },
        { from: 'me',   text: "You're very welcome! Happy to help with implementation whenever you're ready.", time: '2025-05-15T18:45' },
      ],
    },
  ];

  const notifications = [
    { id: 'n1', type: 'message',   icon: '✉️', tone: 'blue',   title: 'New message from Sarah Mitchell', desc: '“Could we apply the new colour palette to the checkout page before Friday?”', time: '2025-05-19T09:25', unread: true,  conversationId: 'c1' },
    { id: 'n2', type: 'proposal',  icon: '🎉', tone: 'green',  title: 'Proposal accepted',               desc: 'David Chen accepted your proposal for “Logo Design for Coffee Brand”.',        time: '2025-05-18T16:40', unread: true },
    { id: 'n3', type: 'review',    icon: '⭐', tone: 'amber',  title: 'New review received',             desc: 'Amara Okafor left you a 4-star review on “Blog Content Writing”.',             time: '2025-05-18T11:05', unread: true },
    { id: 'n4', type: 'project',   icon: '🚀', tone: 'violet', title: 'Project started',                 desc: '“Mobile App UI Development” with James Rodriguez is now in progress.',         time: '2025-05-17T14:30', unread: true },
    { id: 'n5', type: 'message',   icon: '✉️', tone: 'blue',   title: 'New message from Amara Okafor',   desc: '“Sending the revised outline for articles 4–6 in a few minutes.”',             time: '2025-05-17T10:08', unread: true, conversationId: 'c3' },
    { id: 'n6', type: 'completed', icon: '🏁', tone: 'green',  title: 'Project completed',               desc: '“SEO Audit & Optimization” for Fatima Zahra was marked as delivered.',         time: '2025-05-15T18:45', unread: false },
    { id: 'n7', type: 'proposal',  icon: '🎉', tone: 'green',  title: 'Proposal accepted',               desc: 'Sarah Mitchell accepted your proposal for “E-commerce Website Redesign”.',     time: '2025-05-14T09:15', unread: false },
  ];

  const completedProjects = [
    { id: 'p1', name: 'SEO Audit & Optimization' },
    { id: 'p2', name: 'Business Card & Brand Assets' },
    { id: 'p3', name: 'Website Copywriting (5 Pages)' },
  ];

  const reviews = [
    { id: 'r1', reviewer: 'Sarah Mitchell',  color: 'indigo', verified: 'Verified Client', rating: 5, date: '2025-05-12', project: 'SaaS Landing Page Design',    text: 'Ahmad delivered a pixel-perfect landing page ahead of schedule. Communication was clear at every milestone and the handoff files were immaculate.' },
    { id: 'r2', reviewer: 'David Chen',      color: 'blue',   verified: 'Verified Client', rating: 5, date: '2025-05-08', project: 'Poster Design for Product Launch', text: 'Three strong concepts, endless patience with revisions, and a final design we love. Highly recommended.' },
    { id: 'r3', reviewer: 'Amara Okafor',    color: 'green',  verified: 'Verified Client', rating: 4, date: '2025-04-30', project: 'Blog Content Writing (5 Articles)', text: 'Great articles with solid research. A couple of drafts needed an extra round of edits, but the final content performed really well.' },
    { id: 'r4', reviewer: 'James Rodriguez', color: 'amber',  verified: 'Verified Client', rating: 5, date: '2025-04-21', project: 'Mobile App UI Audit',         text: "Clean, actionable feedback and he caught edge cases we hadn't even considered. Will hire again." },
    { id: 'r5', reviewer: 'Fatima Zahra',    color: 'rose',   verified: 'Verified Client', rating: 5, date: '2025-04-15', project: 'SEO Audit & Optimization',    text: 'The audit was incredibly detailed and organic traffic is already up 18%. Excellent work.' },
  ];

  /* ============================== Helpers ============================== */

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(value) {
    return String(value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function initials(name) {
    return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  function formatRelative(iso) {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.round(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    return `${Math.round(days / 30)}mo ago`;
  }

  function formatClock(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function lastMessage(conv) {
    return conv.messages[conv.messages.length - 1];
  }

  /* ============================== Toast ============================== */

  function showToast(message, type = 'success') {
    const region = $('#toast-region');
    const toast = document.createElement('div');
    toast.className = `gw-toast is-${type}`;
    const icon = type === 'error' ? '⚠️' : (type === 'info' ? 'ℹ️' : '✅');
    toast.innerHTML = `<span aria-hidden="true">${icon}</span><span>${esc(message)}</span>`;
    region.appendChild(toast);

    window.setTimeout(() => {
      toast.classList.add('is-leaving');
      window.setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ============================== Tabs ============================== */

  const tabButtons = $$('#activity-tabs .tab-btn');

  function switchTab(name, moveFocus = false) {
    tabButtons.forEach((tab) => {
      const isActive = tab.dataset.tab === name;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      const panel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (panel) panel.hidden = !isActive;
      if (isActive && moveFocus) tab.focus();
    });
    try { history.replaceState(null, '', `#${name}`); } catch (err) { /* file:// safety */ }
  }

  function initTabs() {
    tabButtons.forEach((tab) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
      tab.addEventListener('keydown', (event) => {
        const index = tabButtons.indexOf(tab);
        let target = null;
        if (event.key === 'ArrowRight') target = tabButtons[(index + 1) % tabButtons.length];
        else if (event.key === 'ArrowLeft') target = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
        else if (event.key === 'Home') target = tabButtons[0];
        else if (event.key === 'End') target = tabButtons[tabButtons.length - 1];
        if (target) { event.preventDefault(); switchTab(target.dataset.tab, true); }
      });
    });

    const requested = new URLSearchParams(location.search).get('tab') || location.hash.slice(1);
    if (['messages', 'notifications', 'reviews'].includes(requested)) switchTab(requested);
  }

  /* ============================== Messaging ============================== */

  let activeConvId = null;

  function renderConversations(filterText = '') {
    const list = $('#conversation-list');
    const query = filterText.trim().toLowerCase();
    const visible = conversations.filter((c) => {
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.project.toLowerCase().includes(query) ||
        lastMessage(c).text.toLowerCase().includes(query)
      );
    });

    $('#conv-empty').hidden = visible.length > 0;

    list.innerHTML = visible.map((conv) => {
      const lm = lastMessage(conv);
      const prefix = lm.from === 'me' ? 'You: ' : '';
      return `
        <li class="conv-item">
          <button type="button"
                  class="conv-btn ${conv.id === activeConvId ? 'is-active' : ''} ${conv.unread > 0 ? 'has-unread' : ''}"
                  data-conv="${conv.id}"
                  ${conv.id === activeConvId ? 'aria-current="true"' : ''}>
            <span class="avatar avatar-${conv.color}" aria-hidden="true">
              ${initials(conv.name)}<span class="status-dot ${conv.online ? 'is-online' : ''}"></span>
            </span>
            <span class="conv-main">
              <span class="conv-name">${esc(conv.name)}</span>
              <span class="conv-preview">${esc(prefix + lm.text)}</span>
            </span>
            <span class="conv-side">
              <span class="conv-time">${formatRelative(lm.time)}</span>
              ${conv.unread > 0 ? `<span class="conv-unread" title="${conv.unread} unread">${conv.unread}</span>` : ''}
            </span>
          </button>
        </li>`;
    }).join('');
  }

  function renderMessages(conv) {
    const body = $('#chat-messages');
    body.innerHTML = conv.messages.map((m) => `
      <div class="msg-row ${m.from === 'me' ? 'out' : 'in'}">
        <div class="bubble">
          ${esc(m.text)}
          <time class="bubble-time" datetime="${m.time}">${formatClock(m.time)}</time>
        </div>
      </div>`).join('');
    body.scrollTop = body.scrollHeight;
  }

  function openConversation(id) {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;

    activeConvId = id;
    conv.unread = 0;

    $('#chat-empty').hidden = true;
    $('#chat-active').hidden = false;
    $('#chat-avatar').className = `avatar avatar-${conv.color}`;
    $('#chat-avatar').textContent = initials(conv.name);
    $('#chat-name').textContent = conv.name;

    const status = $('#chat-status');
    status.textContent = conv.online ? 'Online' : 'Last seen recently';
    status.classList.toggle('is-online', conv.online);

    $('#chat-project').textContent = conv.project;

    renderMessages(conv);
    renderConversations($('#conv-search').value);
    updateUnreadCounts();

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      $('#msgs-layout').classList.add('chat-open');
    } else {
      $('#chat-input').focus();
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    const input = $('#chat-input');
    const text = input.value.trim();

    if (!text) {
      showToast('Type a message before sending.', 'error');
      input.focus();
      return;
    }

    const conv = conversations.find((c) => c.id === activeConvId);
    if (!conv) return;

    conv.messages.push({ from: 'me', text, time: new Date().toISOString() });
    input.value = '';
    renderMessages(conv);
    renderConversations($('#conv-search').value); // refreshes preview + timestamp
  }

  /* ============================== Notifications ============================== */

  function renderNotifications() {
    const list = $('#notification-list');
    list.innerHTML = notifications.map((n) => `
      <li class="notif-item ${n.unread ? 'is-unread' : ''}">
        <button type="button" class="notif-btn" data-notif="${n.id}"
                aria-label="${esc(n.title)}. ${esc(n.desc)}${n.unread ? '. Unread.' : ''}">
          <span class="notif-icon notif-icon-${n.tone}" aria-hidden="true">${n.icon}</span>
          <span class="notif-body">
            <span class="notif-top">
              <span class="notif-title">${esc(n.title)}</span>
              <span class="notif-time">${formatRelative(n.time)}</span>
            </span>
            <span class="notif-desc">${esc(n.desc)}</span>
          </span>
          <span class="notif-unread-dot" aria-hidden="true"></span>
        </button>
      </li>`).join('');

    updateUnreadCounts();
  }

  function markNotificationAsRead(id, options = {}) {
    const notification = notifications.find((n) => n.id === id);
    if (!notification || !notification.unread) return;
    notification.unread = false;
    renderNotifications();
    if (!options.silent) showToast('Notification marked as read.');
  }

  function markAllNotificationsAsRead() {
    const unreadCount = notifications.filter((n) => n.unread).length;
    if (unreadCount === 0) {
      showToast('You are all caught up — no unread notifications.', 'info');
      return;
    }
    notifications.forEach((n) => { n.unread = false; });
    renderNotifications();
    showToast(`${unreadCount} notification${unreadCount === 1 ? '' : 's'} marked as read.`);
  }

  function updateUnreadCounts() {
    const unreadNotifs = notifications.filter((n) => n.unread).length;
    const unreadMsgs = conversations.reduce((sum, c) => sum + c.unread, 0);

    const msgBadge = $('#tab-msg-badge');
    msgBadge.hidden = unreadMsgs === 0;
    msgBadge.textContent = unreadMsgs;

    const notifBadge = $('#tab-notif-badge');
    notifBadge.hidden = unreadNotifs === 0;
    notifBadge.textContent = unreadNotifs;

    $('#bell-dot').classList.toggle('is-empty', unreadNotifs === 0);
    $('#bell-btn').setAttribute('aria-label',
      `Notifications${unreadNotifs ? ` (${unreadNotifs} unread)` : ''}`);

    $('#notif-summary').textContent = unreadNotifs
      ? `You have ${unreadNotifs} unread notification${unreadNotifs === 1 ? '' : 's'}.`
      : "You're all caught up. No unread notifications.";

    $('#mark-all-btn').disabled = unreadNotifs === 0;
  }

  /* ============================== Reviews ============================== */

  function renderReviews() {
    $('#reviews-grid').innerHTML = reviews.map((r) => `
      <article class="card review-card ${r.isNew ? 'is-new' : ''}">
        <header class="review-card-head">
          <span class="avatar avatar-${r.color}" aria-hidden="true">${initials(r.reviewer.replace(' (You)', ''))}</span>
          <div class="review-card-id">
            <h3 class="review-card-name">
              ${esc(r.reviewer)}
              <span class="verified-badge ${r.verified.includes('Freelancer') ? 'is-freelancer' : ''}">${esc(r.verified)}</span>
            </h3>
            <p class="review-meta">${esc(r.project)} · ${formatDate(r.date)}</p>
          </div>
          <span class="review-stars" role="img"
                aria-label="Rated ${r.rating} out of 5">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        </header>
        <p class="review-text">${esc(r.text)}</p>
      </article>`).join('');

    updateReviewSummary();
  }

  function updateReviewSummary() {
    const total = reviews.length;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    const rounded = Math.round(avg);
    $('#reviews-summary').innerHTML = `
      <span class="summary-num">${avg.toFixed(1)}</span>
      <div class="summary-meta">
        <span class="summary-stars" aria-hidden="true">${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}</span>
        <span class="summary-count">${total} review${total === 1 ? '' : 's'} · ${avg.toFixed(1)} average rating</span>
      </div>`;
  }

  function selectRating(value) {
    const options = $$('#star-group .star-option');
    options.forEach((option, index) => {
      option.classList.toggle('is-on', index < value);
      option.classList.remove('is-hover');
      option.querySelector('input').checked = Number(option.querySelector('input').value) === value;
    });
    $('#rating-output').textContent = `${value} / 5 — ${RATING_WORDS[value]}`;
    $('#rating-error').hidden = true;
  }

  function initStarRating() {
    const group = $('#star-group');
    const options = $$('.star-option', group);

    const paintPreview = (count) => {
      options.forEach((opt, i) => opt.classList.toggle('is-hover', i < count));
    };

    options.forEach((option, index) => {
      const input = option.querySelector('input');
      input.addEventListener('change', () => selectRating(Number(input.value)));
      input.addEventListener('mouseenter', () => paintPreview(index + 1));
      input.addEventListener('focus', () => paintPreview(index + 1)); // keyboard preview
      input.addEventListener('blur', () => paintPreview(0));
    });
    group.addEventListener('mouseleave', () => paintPreview(0));
  }

  function updateCharCount() {
    const text = $('#review-text');
    $('#char-counter').textContent = `${text.value.length} / ${MAX_REVIEW_CHARS}`;
  }

  function setFieldError(errorId, field, hasError) {
    $(errorId).hidden = !hasError;
    if (field) {
      if (hasError) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }
  }

  function resetReviewForm() {
    $('#review-form').reset();
    $$('#star-group .star-option').forEach((o) => o.classList.remove('is-on', 'is-hover'));
    $('#rating-output').textContent = 'No rating selected yet';
    $('#char-counter').textContent = `0 / ${MAX_REVIEW_CHARS}`;
  }

  function submitReview(event) {
    event.preventDefault();

    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const projectSelect = $('#review-project');
    const textArea = $('#review-text');
    const reviewText = textArea.value.trim();

    setFieldError('#project-error', projectSelect, false);
    setFieldError('#rating-error', null, false);
    setFieldError('#review-error', textArea, false);

    let firstInvalid = null;

    if (!projectSelect.value) {
      setFieldError('#project-error', projectSelect, true);
      firstInvalid = firstInvalid || projectSelect;
    }
    if (!ratingInput) {
      setFieldError('#rating-error', null, true);
      firstInvalid = firstInvalid || $('#star-group input');
    }
    if (reviewText.length < 10) {
      setFieldError('#review-error', textArea, true);
      firstInvalid = firstInvalid || textArea;
    }

    if (firstInvalid) {
      showToast('Please complete the highlighted fields before submitting.', 'error');
      firstInvalid.focus();
      return;
    }

    const project = completedProjects.find((p) => p.id === projectSelect.value);
    reviews.unshift({
      id: `r-${Date.now()}`,
      reviewer: `${CURRENT_USER.name} (You)`,
      color: 'slate',
      verified: 'Verified Freelancer',
      rating: Number(ratingInput.value),
      date: new Date().toISOString().slice(0, 10),
      project: project.name,
      text: reviewText,
      isNew: true,
    });

    renderReviews();
    resetReviewForm();
    showToast('Thank you! Your review has been published.');
  }

  function populateProjectSelect() {
    $('#review-project').innerHTML =
      '<option value="">Select a completed project…</option>' +
      completedProjects.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
  }

  /* ============================== Init ============================== */

  function init() {
    // Footer year (harmless if app.js already filled it)
    $$('[data-current-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    initTabs();
    populateProjectSelect();
    renderConversations();
    renderNotifications();
    renderReviews();
    initStarRating();
    updateCharCount();

    /* Messaging */
    $('#conv-search').addEventListener('input', (e) => renderConversations(e.target.value));
    $('#conversation-list').addEventListener('click', (event) => {
      const btn = event.target.closest('[data-conv]');
      if (btn) openConversation(btn.dataset.conv);
    });
    $('#chat-form').addEventListener('submit', sendMessage);
    $('#chat-back').addEventListener('click', () => {
      $('#msgs-layout').classList.remove('chat-open');
      const activeBtn = $('#conversation-list .conv-btn.is-active');
      if (activeBtn) activeBtn.focus();
    });

    /* Notifications */
    $('#bell-btn').addEventListener('click', () => switchTab('notifications'));
    $('#notification-list').addEventListener('click', (event) => {
      const btn = event.target.closest('[data-notif]');
      if (!btn) return;
      const notification = notifications.find((n) => n.id === btn.dataset.notif);
      markNotificationAsRead(btn.dataset.notif);
      // Deep-link message notifications into the chat
      if (notification && notification.conversationId) {
        switchTab('messages');
        openConversation(notification.conversationId);
      }
    });
    $('#mark-all-btn').addEventListener('click', markAllNotificationsAsRead);

    /* Reviews */
    $('#review-text').addEventListener('input', updateCharCount);
    $('#review-form').addEventListener('submit', submitReview);
  }

  init();
})();