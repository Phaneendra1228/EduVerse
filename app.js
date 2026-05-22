// ========== EduVerse App ========== //

// ===== DATA =====
const meetingsData = [
  { id: 1, title: "New Lecturers Meeting", desc: "Learn the latest tools and techniques in modern web design and development.", month: "JUN", day: "10", price: "$32", cat: "Workshops", img: "images/meeting-banner.png" },
  { id: 2, title: "Online Teaching Techniques", desc: "Explore creative UI/UX practices and improve user-centered design skills.", month: "JUN", day: "14", price: "$34", cat: "Sessions", img: "images/about-banner.png" },
  { id: 3, title: "Network Teaching Concept", desc: "Present and discuss academic and technical research findings.", month: "JUN", day: "16", price: "$45", cat: "Seminars", img: "images/hero-banner.png" },
  { id: 4, title: "Student Training Meetup", desc: "Master productivity tools, time management, and career development.", month: "JUN", day: "22", price: "$52", cat: "Programs", img: "images/meeting-banner.png" },
  { id: 5, title: "Higher Education Conference", desc: "Enhance decision-making, leadership, and team management skills.", month: "JUN", day: "28", price: "$64", cat: "Conferences", img: "images/about-banner.png" },
  { id: 6, title: "AI & Machine Learning Workshop", desc: "Hands-on sessions on data analysis, AI models, and predictive systems.", month: "JUL", day: "05", price: "$78", cat: "Workshops", img: "images/hero-banner.png" },
  { id: 7, title: "Cloud Computing Webinar", desc: "Deploy, manage, and scale applications on AWS, Azure, and GCP.", month: "JUL", day: "12", price: "$28", cat: "Webinars", img: "images/meeting-banner.png" },
  { id: 8, title: "Frontend Dev Bootcamp", desc: "Deep dive into React, Vue, and modern CSS frameworks.", month: "JUL", day: "18", price: "$55", cat: "Workshops", img: "images/about-banner.png" },
];

const coursesData = [
  { id: 1, title: "Full Stack Web Development", desc: "Master the complete web stack with HTML, CSS, JavaScript, React, Node.js, and MongoDB.", rating: 4.9, reviews: 1234, hours: 120, price: "$249", tag: "Web Development", instructor: "Sarah Chen", role: "Senior Developer", initials: "SC", img: "images/course-webdev.png" },
  { id: 2, title: "Data Science & Machine Learning", desc: "Learn Python, pandas, scikit-learn, and TensorFlow to build intelligent systems.", rating: 4.8, reviews: 856, hours: 150, price: "$199", tag: "Data Science", instructor: "Dr. Michael Rodriguez", role: "Data Scientist", initials: "MR", img: "images/course-datascience.png" },
  { id: 3, title: "Mobile App Development", desc: "Build native iOS and Android apps using React Native and Flutter.", rating: 4.7, reviews: 642, hours: 100, price: "$279", tag: "Mobile", instructor: "Alex Johnson", role: "Mobile Developer", initials: "AJ", img: "images/course-mobile.png" },
  { id: 4, title: "Cloud & DevOps Engineering", desc: "Master AWS, Docker, Kubernetes, CI/CD pipelines, and infrastructure automation.", rating: 4.8, reviews: 512, hours: 130, price: "$229", tag: "Cloud", instructor: "Priya Sharma", role: "DevOps Engineer", initials: "PS", img: "images/hero-banner.png" },
  { id: 5, title: "Cybersecurity Fundamentals", desc: "Learn ethical hacking, network security, cryptography, and vulnerability assessment.", rating: 4.6, reviews: 389, hours: 90, price: "$189", tag: "Security", instructor: "James Wilson", role: "Security Analyst", initials: "JW", img: "images/meeting-banner.png" },
  { id: 6, title: "UI/UX Design Masterclass", desc: "Create stunning user interfaces with Figma, design systems, and user research.", rating: 4.9, reviews: 721, hours: 80, price: "$159", tag: "Design", instructor: "Emily Park", role: "Lead Designer", initials: "EP", img: "images/about-banner.png" },
];

const roadmapData = [
  { step: 1, title: "Foundations", desc: "Master HTML, CSS, and JavaScript. Build static sites and understand web fundamentals.", tags: ["HTML5", "CSS3", "JavaScript", "Git"] },
  { step: 2, title: "Frontend Frameworks", desc: "Learn React or Vue.js to build dynamic, component-driven user interfaces.", tags: ["React", "Vue.js", "TypeScript", "Tailwind"] },
  { step: 3, title: "Backend Development", desc: "Build server-side applications with Node.js, Express, and database design.", tags: ["Node.js", "Express", "PostgreSQL", "MongoDB"] },
  { step: 4, title: "Full Stack Integration", desc: "Connect frontend and backend. Build REST APIs and full-stack applications.", tags: ["REST API", "GraphQL", "Auth", "Deployment"] },
  { step: 5, title: "Advanced Topics", desc: "Explore DevOps, cloud services, microservices, and system design patterns.", tags: ["Docker", "AWS", "CI/CD", "Kubernetes"] },
  { step: 6, title: "Career Ready", desc: "Prepare your portfolio, resume, and interview skills to land your dream job.", tags: ["Portfolio", "Resume", "Interview", "Networking"] },
];

const chatResponses = {
  courses: "📚 We offer 200+ courses including Web Development, Data Science, Mobile Apps, Cloud & DevOps, Cybersecurity, and UI/UX Design. Visit the Courses page to explore!",
  meetings: "📅 We have workshops, seminars, and webinars every week! Check the Meetings page for upcoming events.",
  career: "🚀 Our Career Guidance section has a complete roadmap from foundations to job-ready skills. Check it out!",
  resume: "📝 Use our Resume Builder to create a professional resume instantly. It's free and easy!",
  price: "💰 Course prices range from $159 to $279. We also offer scholarships and free trial periods!",
  certificate: "🎓 Yes! You receive a verified digital certificate upon completing any course.",
  help: "💡 I can help with info about courses, meetings, career guidance, resume building, pricing, and certificates. Just ask!",
  default: "🤔 Interesting question! I'd recommend checking our Courses or Career Guidance pages for more details. Type 'help' to see what I can assist with."
};

// ===== DOM ELEMENTS =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const pages = document.querySelectorAll('.page');
const navAnchors = document.querySelectorAll('[data-page]');
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// ===== NAVIGATION =====
function navigateTo(pageName) {
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageName);
  if (target) {
    target.classList.add('active');
    target.classList.remove('page-transition');
    void target.offsetWidth; // force reflow
    target.classList.add('page-transition');
    // Show page header for non-home pages
    const header = target.querySelector('.page-header');
    if (header) header.style.display = 'block';
  }
  // Update active link
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageName);
  });
  // Close mobile nav
  navLinks.classList.remove('open');
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Trigger skill bar animations on dossier page
  if (pageName === 'dossier') animateSkillBars();
}

navAnchors.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(a.dataset.page);
  });
});

// Hamburger
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// ===== RENDER MEETINGS =====
function renderMeetings(containerId, data) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = data.map(m => `
    <div class="meeting-card" data-cat="${m.cat}">
      <div class="meeting-card-img">
        <img src="${m.img}" alt="${m.title}" loading="lazy">
        <span class="meeting-card-price">${m.price}</span>
      </div>
      <div class="meeting-card-body">
        <div class="meeting-card-date">
          <div><span class="month">${m.month}</span><div class="day">${m.day}</div></div>
          <div><h3>${m.title}</h3><p>${m.desc}</p></div>
        </div>
      </div>
    </div>
  `).join('');
}

renderMeetings('homeMeetingsGrid', meetingsData.slice(0, 4));
renderMeetings('allMeetingsGrid', meetingsData);

// Meeting tabs filtering
document.querySelectorAll('.meetings-tabs').forEach(tabGroup => {
  tabGroup.querySelectorAll('.meeting-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabGroup.querySelectorAll('.meeting-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.textContent.trim();
      const grid = tabGroup.nextElementSibling;
      if (!grid) return;
      grid.querySelectorAll('.meeting-card').forEach(card => {
        if (cat === 'All Events' || cat === card.dataset.cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});

// ===== RENDER COURSES =====
function renderCourses(data) {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;
  grid.innerHTML = data.map(c => `
    <div class="course-card">
      <div class="course-card-img">
        <img src="${c.img}" alt="${c.title}" loading="lazy">
        <span class="course-card-tag">${c.tag}</span>
        <span class="course-card-price">${c.price}</span>
      </div>
      <div class="course-card-body">
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="course-meta">
          <div class="course-rating">
            ${'★'.repeat(Math.floor(c.rating))}${'☆'.repeat(5 - Math.floor(c.rating))}
            <span>${c.rating} (${c.reviews.toLocaleString()})</span>
          </div>
          <span>⏱ ${c.hours} hours</span>
        </div>
        <div class="course-instructor">
          <div class="course-instructor-avatar">${c.initials}</div>
          <div class="course-instructor-info"><h4>${c.instructor}</h4><p>${c.role}</p></div>
        </div>
        <div class="course-btns">
          <button class="btn btn-primary" onclick="window.location.href='login.html'">Enroll Now</button>
          <button class="btn btn-secondary" onclick="alert('Demo Feature: This would open a test window.')">Take Test</button>
        </div>
      </div>
    </div>
  `).join('');
}

renderCourses(coursesData);

// Course search
const courseSearch = document.getElementById('courseSearch');
if (courseSearch) {
  courseSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = coursesData.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q)
    );
    renderCourses(filtered);
  });
}

// ===== RENDER ROADMAP =====
function renderRoadmap() {
  const roadmap = document.getElementById('roadmap');
  if (!roadmap) return;
  roadmap.innerHTML = roadmapData.map(r => `
    <div class="roadmap-step">
      <div class="roadmap-dot">${r.step}</div>
      <div class="roadmap-content">
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
        <div class="tech-tags">${r.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
}

renderRoadmap();

// ===== RESUME BUILDER =====
const resumeFields = ['r-name', 'r-phone', 'r-email', 'r-linkedin', 'r-degree', 'r-college', 'r-year', 'r-skills', 'r-exp', 'r-objective'];

function updateResumePreview() {
  const name = document.getElementById('r-name')?.value || 'Your Name';
  const phone = document.getElementById('r-phone')?.value || 'Phone';
  const email = document.getElementById('r-email')?.value || 'Email';
  const linkedin = document.getElementById('r-linkedin')?.value || 'LinkedIn';
  const degree = document.getElementById('r-degree')?.value || '';
  const college = document.getElementById('r-college')?.value || '';
  const year = document.getElementById('r-year')?.value || '';
  const skills = document.getElementById('r-skills')?.value || '';
  const exp = document.getElementById('r-exp')?.value || '';
  const objective = document.getElementById('r-objective')?.value || '';

  document.getElementById('prev-name').textContent = name;
  document.getElementById('prev-contact').textContent = `${email} • ${phone} • ${linkedin}`;
  document.getElementById('prev-objective').textContent = objective || 'Your career objective will appear here...';
  document.getElementById('prev-education').textContent = degree && college ? `${degree} — ${college} (${year})` : 'Your education details will appear here...';
  document.getElementById('prev-skills').textContent = skills || 'Your skills will appear here...';
  document.getElementById('prev-exp').textContent = exp || 'Your experience will appear here...';
}

resumeFields.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateResumePreview);
});

const generateBtn = document.getElementById('generateResume');
if (generateBtn) {
  generateBtn.addEventListener('click', () => {
    updateResumePreview();
    // Flash effect on preview
    const preview = document.getElementById('resumePreview');
    preview.style.boxShadow = '0 0 40px rgba(108,92,231,0.4)';
    setTimeout(() => { preview.style.boxShadow = ''; }, 1500);
  });
}

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
  });
}

// ===== CHATBOT =====
chatbotBtn.addEventListener('click', () => {
  chatbotPanel.classList.toggle('open');
});
chatbotClose.addEventListener('click', () => {
  chatbotPanel.classList.remove('open');
});

function addChatMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + type;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes('course') || lower.includes('learn')) return chatResponses.courses;
  if (lower.includes('meeting') || lower.includes('event') || lower.includes('workshop')) return chatResponses.meetings;
  if (lower.includes('career') || lower.includes('roadmap') || lower.includes('guidance')) return chatResponses.career;
  if (lower.includes('resume') || lower.includes('cv')) return chatResponses.resume;
  if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) return chatResponses.price;
  if (lower.includes('certificate') || lower.includes('certif')) return chatResponses.certificate;
  if (lower.includes('help') || lower.includes('hi') || lower.includes('hello')) return chatResponses.help;
  return chatResponses.default;
}

function handleChatSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  addChatMessage(text, 'user');
  chatInput.value = '';
  setTimeout(() => {
    addChatMessage(getBotResponse(text), 'bot');
  }, 600);
}

chatSend.addEventListener('click', handleChatSend);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleChatSend();
});

// ===== ACCORDION =====
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    // Toggle current
    if (!isOpen) item.classList.add('open');
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .meeting-card, .course-card, .roadmap-step, .stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString() + '+';
    }, 30);
  });
}

// Trigger counters when about page is visible
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      aboutObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const aboutPage = document.getElementById('page-about');
if (aboutPage) aboutObserver.observe(aboutPage);

console.log('✅ EduVerse loaded successfully!');
