// 🔐 proteção da página criar.html
if (window.location.pathname.includes("criar.html")) {
  const token = localStorage.getItem("token");

  if (token !== "admin-token") {
    alert("Acesso negado");
    window.location.href = "login.html";
  }
}

// 🎯 ativar link da navbar
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// 🧭 navegação dos cards
document.querySelectorAll('.nav-card').forEach(card => {
  card.addEventListener('click', function () {
    const title = this.querySelector('h3').textContent.trim();
    console.log('Navegar para:', title);
  });
});

// 🎯 botões hero
document.querySelector('.btn-primary')?.addEventListener('click', () => {
  console.log('Explorar Exposições clicado');
});

document.querySelector('.btn-secondary')?.addEventListener('click', () => {
  document.querySelector('.sobre')?.scrollIntoView({ behavior: 'smooth' });
});

// 📤 upload (ainda simples)
async function uploadProject() {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Selecione um arquivo!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data.url;
}

// ➕ CRIAR PROJETO (AGORA CORRETO)
async function createProject() {
  const project = {
    title: document.getElementById("title")?.value,
    description: document.getElementById("description")?.value,
    status: "andamento"
  };

  await fetch("http://localhost:3000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify(project)
  });

  alert("Projeto criado!");
  window.location.href = "andamento.html";
}

// 📥 carregar projetos
async function loadProjects() {
  const response = await fetch("http://localhost:3000/projects");
  const projects = await response.json();

  renderProjects(projects);
}

// 🎨 renderizar projetos
function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = "";

  projects
    .filter(p => p.status === "andamento")
    .forEach(project => {
      const card = document.createElement("div");
      card.classList.add("nav-card");

      card.innerHTML = `
        <div class="nav-card-icon">⚙️</div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      `;

      container.appendChild(card);
    });
}

// 🚀 iniciar página
document.addEventListener("DOMContentLoaded", () => {

  // carregar projetos se existir container
  if (document.getElementById("projectsContainer")) {
    loadProjects();
  }

  // 👑 mostrar botão admin
  const adminBtn = document.getElementById("adminBtn");

  if (localStorage.getItem("token") === "admin-token") {
    if (adminBtn) adminBtn.style.display = "block";
  } else {
    if (adminBtn) adminBtn.style.display = "none";
  }
});

// 🔐 login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Login feito!");
    window.location.href = "criar.html";
  } else {
    alert("Erro no login");
  }
}