/* orders-data.js — Orders & Projects store (Orders + Project Details pages) */

const ORDER_STATUSES = {
  'pending':     { label:'Pending',     cls:'chip-amber'  },
  'in-progress': { label:'In Progress', cls:'chip-blue'   },
  'submitted':   { label:'Submitted',   cls:'chip-purple' },
  'completed':   { label:'Completed',   cls:'chip-green'  },
  'cancelled':   { label:'Cancelled',   cls:'chip-gray'   }
};

const dAgo = d => new Date(Date.now() - d * 86400000).toISOString();

function O(id,title,category,client,budget,status,start,due,milestones,delivery){
  return { id, title, category, client, budget, status, startDate:start, dueDate:due, milestones, delivery };
}
function M(title, tasks){ return { title, tasks: tasks.map(t => ({ text:t[0], done:t[1] })) }; }

const ORDERS_SEED = [
  O('ORD-2041','Restaurant Website with Online Menu','Web Development',
    { name:'Omar Farooq', company:'Spice Garden Restaurant', location:'Dubai, UAE', rating:4.8 },
    1800, 'in-progress', dAgo(10), dAgo(-12),
    [
      M('Design & Homepage', [['Homepage design approved',true],['Responsive layout done',true],['Client feedback round',true]]),
      M('Menu & Reservation System', [['Build menu CMS',true],['Reservation form',false],['Connect email notifications',false]]),
      M('Launch & Handover', [['Hosting setup',false],['Content upload',false],['Training call',false]])
    ],
    { package:'Full website with menu management, reservation form and Google Maps integration.', files:[], submittedOn:null, notes:'' }
  ),
  O('ORD-2038','Fitness App UI Design (20+ Screens)','UI/UX Design',
    { name:'Lena Hoffmann', company:'FitPulse GmbH', location:'Berlin, Germany', rating:4.9 },
    1200, 'submitted', dAgo(18), dAgo(-4),
    [
      M('Research & Wireframes', [['User flows',true],['Low-fi wireframes',true],['Client review',true]]),
      M('High-Fidelity Screens', [['Onboarding & auth',true],['Dashboard & tracking',true],['Settings & profile',true]]),
      M('Design System & Handoff', [['Component library',true],['Developer handoff file',true],['Final review',true]])
    ],
    { package:'Complete Figma file: 24 screens, prototype and design system.', files:['fitpulse-figma.fig','icons-pack.zip','handoff-notes.pdf'], submittedOn:dAgo(2), notes:'Includes interactive prototype link in the PDF.' }
  ),
  O('ORD-2031','Shopify Store Setup for Home Decor Brand','Web Development',
    { name:'Anna Kowalska', company:'HomeDecor Plus', location:'Warsaw, Poland', rating:4.6 },
    900, 'completed', dAgo(35), dAgo(7),
    [
      M('Store Configuration', [['Theme setup',true],['Payment gateways',true],['Shipping zones',true]]),
      M('Products & Content', [['Import 120 products',true],['Collection pages',true],['Policy pages',true]]),
      M('Launch', [['QA testing',true],['Go live',true],['Client training',true]])
    ],
    { package:'Fully configured Shopify store with 120 products, payments and shipping.', files:['store-handover.pdf','product-import.csv'], submittedOn:dAgo(9), notes:'Approved on first review.' }
  ),
  O('ORD-2029','SEO Campaign Dashboard (Client Reporting)','Web Development',
    { name:'David Chen', company:'BrightTech Marketing', location:'Singapore', rating:4.7 },
    2200, 'pending', dAgo(0), dAgo(-30),
    [
      M('Planning & Architecture', [['Define KPIs with client',false],['Data model design',false],['Tech stack confirmation',false]]),
      M('Dashboard Build', [['Auth & roles',false],['Charts & reports',false],['Automated emails',false]]),
      M('Deployment & Docs', [['Deploy to client server',false],['Documentation',false],['Handover call',false]])
    ],
    { package:'Web dashboard with keyword rankings, traffic graphs and monthly PDF reports.', files:[], submittedOn:null, notes:'' }
  ),
  O('ORD-2017','Travel Blog Build with Custom Theme','Web Development',
    { name:'Isabella Rossi', company:'Wander With Isa', location:'Rome, Italy', rating:5.0 },
    1500, 'completed', dAgo(60), dAgo(20),
    [
      M('Theme Design', [['Moodboard & style guide',true],['Homepage design',true],['Article template',true]]),
      M('Development', [['Custom WordPress theme',true],['Newsletter integration',true],['SEO setup',true]]),
      M('Launch', [['Content migration',true],['Go live',true],['30-day support',true]])
    ],
    { package:'Custom WordPress travel blog, migrated content and newsletter integration.', files:['blog-handover.pdf'], submittedOn:dAgo(22), notes:'Client left a 5★ review.' }
  ),
  O('ORD-2012','Legacy Portfolio Migration (Client Paused)','Graphic Design',
    { name:'Mark Johnson', company:'Johnson Studios', location:'Toronto, Canada', rating:4.2 },
    400, 'cancelled', dAgo(90), dAgo(60),
    [
      M('Asset Collection', [['Collect old files',true],['Organize assets',false]]),
      M('Migration', [['Portfolio rebuild',false],['Content review',false]])
    ],
    { package:'Migrate legacy portfolio site to modern template.', files:[], submittedOn:null, notes:'' }
  )
];

const OrdersStore = {
  KEY:'guildwork.orders',
  _read(){
    try{ const raw = localStorage.getItem(this.KEY); return raw ? JSON.parse(raw) : null; }
    catch(e){ return null; }
  },
  getOrders(){ return this._read() || ORDERS_SEED; },
  save(list){ localStorage.setItem(this.KEY, JSON.stringify(list)); },
  getOrder(id){ return this.getOrders().find(o => o.id === id) || null; },
  updateOrder(updated){
    const list = this.getOrders();
    const i = list.findIndex(o => o.id === updated.id);
    if (i > -1){ list[i] = updated; this.save(list); }
    return updated;
  },
  reset(){ localStorage.removeItem(this.KEY); },
  progress(order){
    const tasks = order.milestones.flatMap(m => m.tasks);
    if (!tasks.length) return order.status === 'completed' ? 100 : 0;
    return Math.round(tasks.filter(t => t.done).length / tasks.length * 100);
  },
  stats(){
    const list = this.getOrders();
    return {
      total: list.length,
      active: list.filter(o => ['in-progress','submitted'].includes(o.status)).length,
      completed: list.filter(o => o.status === 'completed').length,
      pending: list.filter(o => o.status === 'pending').length
    };
  }
};

function milestoneStatus(m){
  const done = m.tasks.filter(t => t.done).length;
  return done === 0 ? 'pending' : done === m.tasks.length ? 'completed' : 'in-progress';
}

function statusChipHtml(status){
  const s = ORDER_STATUSES[status] || ORDER_STATUSES.pending;
  return '<span class="chip ' + s.cls + '">' + s.label + '</span>';
}

function formatShortDate(iso){
  return new Date(iso).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' });
}