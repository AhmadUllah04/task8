/* ============================================================
   data.js — central data store + shared formatters (Guildwork)
   ============================================================ */

const CATEGORY_COLORS = {
  'Web Development':   '#4f46e5',
  'Graphic Design':    '#db2777',
  'UI/UX Design':      '#0ea5e9',
  'Mobile Development':'#10b981',
  'Content Writing':   '#f59e0b',
  'Digital Marketing': '#8b5cf6',
  'SEO':               '#ef4444',
  'WordPress':         '#0f766e',
  'Data Entry':        '#64748b'
};

function categoryColor(cat){ return CATEGORY_COLORS[cat] || '#64748b'; }

const daysAgo = d => new Date(Date.now() - d * 86400000).toISOString();

/* Helper to seed jobs */
function J(id,title,cat,type,min,max,exp,dur,days,props,skills,desc,client,loc,rating,hires){
  return { id, title, category:cat, budgetType:type, min, max, experience:exp, duration:dur,
    postedDate:daysAgo(days), proposals:props, skills, description:desc,
    client:{ name:client, location:loc, rating, hires, verified:true } };
}

/* Helper to seed services */
function S(id, title, category, price, rating, reviewsCount, deliveryDays, expLevel, freelancerName, freelancerAvatar, image, desc) {
  return { id, title, category, price, rating, reviewsCount, deliveryDays, expLevel, freelancerName, freelancerAvatar, image, description: desc };
}

const SEED_JOBS = [
  J('job-112','Hourly: Senior React Developer for Ongoing Work','Web Development','Hourly',35,55,'Expert','3+ months',0.1,18,['React','TypeScript','Redux'],'We are looking for a senior React developer to join our growing SaaS team. You will work on new features, code reviews and performance improvements. Long-term collaboration guaranteed.','TechNova Inc','Austin, USA',4.8,21),
  J('job-103','SEO Audit & Strategy for SaaS Blog','SEO','Fixed Price',300,500,'Intermediate','1–2 weeks',0.2,5,['SEO','Ahrefs','Content Strategy'],'Our blog traffic dropped 30% last quarter. We need a full technical SEO audit, keyword research and a 3-month content strategy we can execute in-house.','Maya Chen','Toronto, Canada',4.7,8),
  J('job-110','Fix & Optimize WooCommerce Checkout','WordPress','Fixed Price',200,350,'Intermediate','Less than 1 week',0.3,6,['WooCommerce','PHP','JavaScript'],'Checkout page sometimes fails on mobile Safari and cart abandonment is up. Need an experienced WooCommerce developer to debug, fix and optimize page speed.','James Wilson','Manchester, UK',4.5,15),
  J('job-106','Write 10 SEO Blog Articles (Tech Niche)','Content Writing','Fixed Price',250,400,'Intermediate','1–2 weeks',0.5,11,['Copywriting','SEO','Research'],'Looking for a tech writer who can produce 10 well-researched articles (1200–1500 words each) on AI, cybersecurity and cloud topics. SEO experience required.','Grace Liu','Singapore',4.9,30),
  J('job-102','Mobile App UI/UX Design for Fitness Startup','UI/UX Design','Fixed Price',800,1200,'Intermediate','1 month',1,8,['Figma','Prototyping','Mobile Design'],'We are building a fitness tracking app and need modern, clean UI screens (20+ screens) with a design system in Figma. Experience with health apps is a plus.','FitPulse Team','Berlin, Germany',4.6,5),
  J('job-107','Data Entry: Migrate 5,000 Records to CRM','Data Entry','Fixed Price',150,300,'Entry Level','1–2 weeks',1,21,['Excel','CRM','Data Cleaning'],'We need 5,000 customer records migrated from spreadsheets into HubSpot CRM. Accuracy is critical — must be detail-oriented and available to start immediately.','Robert Kim','Chicago, USA',4.3,11),
  J('job-101','Build a Modern E-commerce Website','Web Development','Fixed Price',1500,3000,'Expert','1–3 months',2,12,['React','Node.js','MongoDB'],'We need a complete e-commerce website for our clothing brand with product catalog, cart, secure checkout, order tracking and an admin dashboard. Designs are ready in Figma; we need clean, scalable code.','Sarah Mitchell','London, UK',4.9,12),
  J('job-109','Brand Identity & Logo Design','Graphic Design','Fixed Price',500,900,'Intermediate','1–2 weeks',2,16,['Illustrator','Branding','Logo Design'],'New specialty coffee brand needs a full identity: logo, color palette, typography and packaging guidelines. We want something warm, premium and memorable.','Brew & Co','Melbourne, Australia',4.8,9),
  J('job-104','WordPress Site Redesign for Law Firm','WordPress','Fixed Price',600,900,'Intermediate','1–2 weeks',3,9,['WordPress','Elementor','CSS'],'Our law firm website looks outdated. We want a modern, trustworthy redesign with better mobile experience, faster load times and improved contact forms. Content stays the same.','Harrison & Partners','New York, USA',4.6,17),
  J('job-108','Cross-Platform Fitness App (Flutter)','Mobile Development','Fixed Price',2000,4000,'Expert','1–3 months',4,7,['Flutter','Firebase','REST API'],'Build a cross-platform workout tracking app with video exercises, progress charts, reminders and Firebase auth. Backend API is already built; we need the Flutter app.','Amina Yusuf','Kuala Lumpur, Malaysia',4.7,6),
  J('job-105','Social Media Campaign for Product Launch','Digital Marketing','Fixed Price',400,700,'Entry Level','1–2 weeks',6,14,['Social Media','Facebook Ads','Copywriting'],'We are launching a new eco-friendly water bottle next month and need a 4-week social media campaign: content calendar, ad creative briefs and community engagement.','EcoSip','Amsterdam, Netherlands',4.4,3),
  J('job-113','Google Ads Management (Monthly Retainer)','Digital Marketing','Fixed Price',500,1000,'Expert','1 month',15,10,['Google Ads','PPC','Analytics'],'Managing $20k/month ad spend for our online store. Need a certified specialist to optimize campaigns, lower CPA and report weekly.','Laura Gómez','Madrid, Spain',4.9,14),
  J('job-111','Landing Page Copy for Fintech Product','Content Writing','Fixed Price',150,250,'Expert','Less than 1 week',10,4,['Copywriting','Fintech','Conversion'],'Need persuasive, conversion-focused copy for a fintech landing page (hero, features, pricing, FAQ). Portfolio with fintech or SaaS copy required.','PayNest','Dubai, UAE',4.8,7),
  J('job-114','UI Design System in Figma','UI/UX Design','Fixed Price',1000,1800,'Expert','1 month',20,5,['Figma','Design Systems','Component Library'],'Our product team needs a complete design system: tokens, components, variants and documentation in Figma. Must be maintainable and developer-friendly.','StreamLine','San Francisco, USA',5.0,19),
  J('job-115','Product Data Entry for Online Store','Data Entry','Fixed Price',100,200,'Entry Level','1–2 weeks',25,13,['Excel','Shopify','Product Listing'],'We have 400 products with images and descriptions in a supplier catalog that need to be listed on our Shopify store with correct variants and SEO titles.','HomeDecor Plus','Warsaw, Poland',4.2,6)
];

const SEED_SERVICES = [
  S('srv-1', 'Full-Stack React & Node Web Application Build', 'Web Development', 450, 4.9, 38, 7, 'Expert', 'AhmadUllah', 'AH', '⚡', 'I will build a high-performance web app using React, Node.js, and MongoDB with modern Tailwind CSS or custom CSS UI.'),
  S('srv-2', 'Modern SaaS UI/UX Design System in Figma', 'UI/UX Design', 280, 5.0, 24, 5, 'Expert', 'Elena Rostova', 'ER', '🎨', 'Complete mobile & web design system with interactive prototypes, component library, and dark mode screens.'),
  S('srv-3', 'High-Converting Technical SEO Audit & Strategy', 'SEO', 150, 4.8, 42, 3, 'Intermediate', 'Marcus Vance', 'MV', '📊', 'In-depth SEO report fixing technical errors, keyword cannibalization, speed scores, and backlink analysis.'),
  S('srv-4', 'Cross-Platform Flutter Mobile App Development', 'Mobile Development', 600, 4.9, 19, 14, 'Expert', 'AhmadUllah', 'AH', '📱', 'Native iOS & Android mobile application using Flutter with Firebase integration and clean state management.'),
  S('srv-5', 'Custom Brand Identity, Logo & Design Guidelines', 'Graphic Design', 200, 4.7, 56, 4, 'Intermediate', 'Sofia Chen', 'SC', '✨', 'Unique vector logos, brand strategy, color swatch guidelines, and ready-to-print SVG/PNG files.'),
  S('srv-6', 'High-Impact Copywriting for SaaS & Tech Websites', 'Content Writing', 120, 4.9, 31, 2, 'Expert', 'David Miller', 'DM', '✍️', 'Clear, persuasive conversion copywriting for landing pages, features, product launch campaigns, and blogs.')
];

const SEED_PROPOSALS = [
  { id:'prp-1', jobId:'job-101', jobTitle:'Build a Modern E-commerce Website', bid:2200, days:30, status:'Shortlisted', submittedDate:daysAgo(1), coverLetter:'Hi Sarah, I have built 12+ e-commerce stores with React and Node.js, including cart, Stripe checkout and admin dashboards.' },
  { id:'prp-2', jobId:'job-102', jobTitle:'Mobile App UI/UX Design for Fitness Startup', bid:950, days:21, status:'Under Review', submittedDate:daysAgo(0.5), coverLetter:'I specialize in health & fitness apps and have designed 3 apps in this exact niche.' },
  { id:'prp-3', jobId:'job-104', jobTitle:'WordPress Site Redesign for Law Firm', bid:750, days:14, status:'Accepted', submittedDate:daysAgo(4), coverLetter:'Your current site loads in 6.2s on mobile — I will bring that under 2s.' },
  { id:'prp-4', jobId:'job-107', jobTitle:'Data Entry: Migrate 5,000 Records to CRM', bid:220, days:7, status:'Rejected', submittedDate:daysAgo(3), coverLetter:'I have done similar CRM migrations with a 99.9% accuracy record.' },
  { id:'prp-5', jobId:'job-106', jobTitle:'Write 10 SEO Blog Articles (Tech Niche)', bid:320, days:10, status:'Submitted', submittedDate:daysAgo(0.2), coverLetter:'I am a full-time tech writer with 60+ published articles on AI and cloud topics.' },
  { id:'prp-6', jobId:'job-112', jobTitle:'Hourly: Senior React Developer for Ongoing Work', bid:45, days:0, status:'Withdrawn', submittedDate:daysAgo(6), coverLetter:'Senior React developer with 6 years of experience.' }
];

const DataStore = {
  JOBS_KEY: 'gw.jobs.custom',
  SERVICES_KEY: 'gw.services.custom',
  PROPOSALS_KEY: 'gw.proposals',
  FAVORITES_KEY: 'gw.favorites',

  _read(key, fallback){
    try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch(e){ return fallback; }
  },
  _write(key, value){ localStorage.setItem(key, JSON.stringify(value)); },

  getAllJobs(){
    const custom = this._read(this.JOBS_KEY, []);
    return [...custom, ...SEED_JOBS].sort((a,b)=> new Date(b.postedDate) - new Date(a.postedDate));
  },
  getJobById(id){ return this.getAllJobs().find(j => j.id === id) || null; },

  getAllServices(){
    const custom = this._read(this.SERVICES_KEY, []);
    return [...custom, ...SEED_SERVICES];
  },
  getServiceById(id){ return this.getAllServices().find(s => s.id === id) || null; },

  getProposals(){ return this._read(this.PROPOSALS_KEY, SEED_PROPOSALS); },
  saveProposals(list){ this._write(this.PROPOSALS_KEY, list); },

  /* Favorites management */
  getFavorites(){ return this._read(this.FAVORITES_KEY, ['srv-1', 'job-102']); },
  toggleFavorite(id){
    let favs = this.getFavorites();
    if (favs.includes(id)) { favs = favs.filter(x => x !== id); }
    else { favs.push(id); }
    this._write(this.FAVORITES_KEY, favs);
    return favs.includes(id);
  },
  isFavorite(id){ return this.getFavorites().includes(id); },

  /* Marketplace Stats */
  getStats(){
    const jobs = this.getAllJobs();
    const services = this.getAllServices();
    const proposals = this.getProposals();
    const activeProjects = 4;
    const totalEarnings = 12450;
    return {
      totalJobs: jobs.length,
      totalServices: services.length,
      totalProposals: proposals.length,
      activeProjects,
      totalEarnings
    };
  },

  /* Proposals helpers */
  hasProposed(jobId){
    return this.getProposals().some(p => p.jobId === jobId && p.status !== 'Withdrawn');
  },
  addProposal(data){
    const list = this.getProposals();
    const proposal = {
      id: 'prp-' + Date.now(),
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      bid: data.bid,
      days: data.days,
      status: 'Submitted',
      submittedDate: new Date().toISOString(),
      coverLetter: data.coverLetter
    };
    list.unshift(proposal);
    this.saveProposals(list);
    return proposal;
  },
  setProposalStatus(id, status){
    const list = this.getProposals();
    const p = list.find(x => x.id === id);
    if (p){ p.status = status; this.saveProposals(list); }
    return p;
  },

  /* Post a job (client) */
  addJob(data){
    const custom = this._read(this.JOBS_KEY, []);
    const job = {
      id: 'job-' + Date.now(),
      title: data.title,
      category: data.category,
      budgetType: data.budgetType,
      min: data.min,
      max: data.max,
      experience: data.experience,
      duration: data.duration,
      postedDate: new Date().toISOString(),
      proposals: 0,
      skills: data.skills || [],
      description: data.description,
      client: { name: 'AhmadUllah', location: 'Pakistan', rating: 4.9, hires: 12, verified: true }
    };
    custom.unshift(job);
    this._write(this.JOBS_KEY, custom);
    return job;
  }
};

function formatRelativeDate(iso){
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + ' min ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h === 1 ? '1 hour ago' : h + ' hours ago';
  const d = Math.floor(h / 24);
  if (d === 1) return 'yesterday';
  if (d < 30) return d + ' days ago';
  return new Date(iso).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
}

function formatBudget(job){
  const money = n => '$' + Number(n).toLocaleString();
  return job.budgetType === 'Hourly'
    ? money(job.min) + '–' + money(job.max) + '/hr'
    : money(job.min) + ' – ' + money(job.max);
}