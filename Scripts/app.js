/* ============================================
   NEHUL – Museu Digital
   app.js — interações da página
   ============================================ */

// Navegação: ativa o link correspondente à seção atual
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// Cards de navegação: pronto para receber ação de roteamento
document.querySelectorAll('.nav-card').forEach(card => {
  card.addEventListener('click', function () {
    const title = this.querySelector('h3').textContent.trim();
    console.log('Navegar para:', title);
    // Adicione aqui o roteamento quando integrar com o resto do site
  });
});

// Botões do hero
document.querySelector('.btn-primary')?.addEventListener('click', () => {
  console.log('Explorar Exposições clicado');
  // Adicione aqui a navegação para a seção de exposições
});

document.querySelector('.btn-secondary')?.addEventListener('click', () => {
  document.querySelector('.sobre')?.scrollIntoView({ behavior: 'smooth' });
});

async function uploadProject() {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Selecione um arquivo!");
    return;
  }

  // 1. Enviar arquivo pro backend
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  console.log("URL do arquivo:", data.url);

}

//async function createProject() {
  //const file = document.getElementById("fileInput").files[0];

  // upload
  //const formData = new FormData();
  //formData.append("file", file);

  //const uploadRes = await fetch("http://localhost:3000/upload", {
    //method: "POST",
    //body: formData
  //});

  //const uploadData = await uploadRes.json();

  // criar projeto
  //const project = {
    //title: "Título",
    //description: "Descrição",
    //imageUrl: uploadData.url
  //};

 //console.log(project);
//}

async function loadProjects() {
  const response = await fetch("http://localhost:3000/projects");
  const projects = await response.json();

  renderProjects(projects);
}

function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");

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

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("projectsContainer")) {
    loadProjects();
  }
});