const EMAIL = "sophiaakemi1@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/sophia-akemi-177208396/";
const GITHUB = "https://github.com/sosoakemi";
const projects = window.PROJECTS || [];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- nome digitado ---------- */
function typeName() {
  if (reducedMotion) return;
  const title = document.getElementById("name");
  title.setAttribute("aria-label", "Sophia Akemi");
  title.textContent = "";

  const caret = document.createElement("span");
  caret.className = "caret";
  caret.setAttribute("aria-hidden", "true");

  // O texto ainda não digitado fica invisível, reservando o espaço do layout.
  const lines = ["Sophia", "Akemi"].map((text) => {
    const row = document.createElement("span");
    const typed = document.createElement("span");
    const rest = document.createElement("span");
    row.className = "name__line";
    row.setAttribute("aria-hidden", "true");
    rest.className = "name__rest";
    rest.textContent = text;
    row.append(typed, rest);
    title.append(row);
    return { text, typed, rest };
  });

  let lineIndex = 0;
  let charIndex = 0;

  const step = () => {
    const line = lines[lineIndex];
    line.typed.textContent = line.text.slice(0, charIndex);
    line.rest.textContent = line.text.slice(charIndex);
    line.typed.after(caret);

    if (charIndex < line.text.length) {
      charIndex += 1;
      setTimeout(step, 110);
    } else if (lineIndex < lines.length - 1) {
      lineIndex += 1;
      charIndex = 0;
      setTimeout(step, 260);
    } else {
      caret.classList.add("caret--done");
    }
  };

  setTimeout(step, 300);
}

/* ---------- projetos ---------- */
function externalLink(href, label) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = label;
  return a;
}

function renderProjects() {
  const list = document.getElementById("project-list");
  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project";

    const img = document.createElement("img");
    img.src = project.imagem;
    img.alt = `Tela do projeto ${project.nome}`;
    img.width = 1280;
    img.height = 800;
    img.loading = "lazy";

    const shot = externalLink(project.site || project.github, "");
    shot.className = "project__shot";
    shot.setAttribute("aria-label", `Abrir ${project.nome}`);
    shot.append(img);

    const title = document.createElement("h3");
    title.textContent = project.nome;

    const description = document.createElement("p");
    description.textContent = project.descricao;

    const tags = document.createElement("div");
    tags.className = "project__tags";
    tags.textContent = project.tags.join(" · ");

    const links = document.createElement("div");
    links.className = "project__links";
    if (project.site) links.append(externalLink(project.site, "ver online"));
    if (project.github) links.append(externalLink(project.github, "código"));

    card.append(shot, title, description, tags, links);
    list.append(card);
  });
}

/* ---------- terminal ---------- */
function setupTerminal() {
  const out = document.getElementById("term-out");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-in");
  const chips = document.getElementById("term-chips");
  const history = [];
  let historyIndex = 0;

  const print = (text, className) => {
    const line = document.createElement("div");
    line.textContent = text;
    if (className) line.className = className;
    out.append(line);
    return line;
  };

  const printLink = (label, href) => {
    const line = print(`${label} `);
    line.append(externalLink(href, href.replace(/^https:\/\/(www\.)?/, "")));
  };

  const commands = {
    help() {
      print("comandos disponíveis:");
      [
        ["whoami", "quem sou eu"],
        ["mindspeak", "meu projeto principal"],
        ["projetos", "outros projetos"],
        ["certificados", "cursos concluídos"],
        ["skills", "tecnologias"],
        ["contato", "como falar comigo"],
        ["clear", "limpar o terminal"],
      ].forEach(([name, text]) => print(`  ${name.padEnd(14)}${text}`));
    },
    whoami() {
      print("Sophia Akemi, desenvolvedora web e back-end.");
      print("São Paulo, Brasil. Programando desde 2022.", "dim");
    },
    mindspeak() {
      print("MindSpeak: interface cérebro-computador");
      print("EEG + ESP32 + React. Foco mental vira voz.", "dim");
      printLink("site:", "https://mindspeak-test.vercel.app");
    },
    certificados() {
      print("Java (DIO)  Networking Basics (Cisco)");
      print("Projeto de Sistemas Web (IFSC)");
      print("Projetos de Sistemas de TI (Fundação Bradesco)");
      print("JavaScript, HTML e CSS (Alura)");
    },
    projetos() {
      projects.forEach((project) => {
        printLink(`${project.nome}:`, project.site || project.github);
      });
    },
    skills() {
      print("JavaScript  TypeScript  Java  C++  SQL");
      print("React  Vite  Tailwind CSS  HTML  CSS");
      print("Git  Figma  MySQL  Arduino IoT  ESP32");
    },
    contato() {
      print(`email: ${EMAIL}`);
      printLink("linkedin:", LINKEDIN);
      printLink("github:", GITHUB);
    },
    clear() {
      out.textContent = "";
    },
  };

  const run = (raw) => {
    const name = raw.trim().toLowerCase();
    if (!name) return;
    print(`~ $ ${raw.trim()}`, "cmd");
    if (Object.hasOwn(commands, name)) {
      commands[name]();
    } else {
      print(`comando não encontrado: ${name}. Digite help.`, "dim");
    }
    out.scrollTop = out.scrollHeight;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value.trim()) history.push(input.value);
    historyIndex = history.length;
    run(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const step = event.key === "ArrowUp" ? -1 : 1;
    historyIndex = Math.min(history.length, Math.max(0, historyIndex + step));
    input.value = history[historyIndex] || "";
  });

  ["projetos", "skills", "certificados", "contato"].forEach((name) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.textContent = name;
    chip.addEventListener("click", () => run(name));
    chips.append(chip);
  });

  run("whoami");
  run("help");
  out.scrollTop = 0;
}

/* ---------- sinal EEG (simulação do MindSpeak) ---------- */
function setupSignal() {
  const canvas = document.getElementById("eeg");
  const ctx = canvas.getContext("2d");
  const attentionEl = document.getElementById("eeg-att");
  const wordEl = document.getElementById("eeg-word");
  const words = ["SIM", "NÃO", "ÁGUA", "OBRIGADO", "ESTOU BEM", "PRECISO DE AJUDA"];
  const THRESHOLD = 0.75;
  const STEP = 2;
  const pink = "#ff7ab6";
  const mint = "#5eead4";
  const line = "#3a4358";

  let width = 0;
  let height = 0;
  let points = [];
  let tick = 0;
  let wordIndex = 0;
  let selected = false;
  let visible = true;
  let frame = 0;

  const attentionAt = (t) =>
    0.6 + 0.26 * Math.sin(t * 0.011) + 0.1 * Math.sin(t * 0.037 + 1);

  const sample = (t) => {
    const attention = attentionAt(t);
    const wave =
      Math.sin(t * 0.21) * 0.45 +
      Math.sin(t * 0.47 + 1.3) * 0.3 +
      Math.sin(t * 0.93) * 0.18 +
      (Math.random() - 0.5) * 0.35;
    return { value: wave * (0.35 + attention * 0.65), hot: attention >= THRESHOLD };
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const needed = Math.ceil(width / STEP) + 2;
    while (points.length < needed) points.unshift(sample(tick++));
    points = points.slice(-needed);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const middle = height / 2;
    const amplitude = height * 0.42;
    const thresholdY = height * (1 - THRESHOLD) * 0.5;

    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, thresholdY);
    ctx.lineTo(width, thresholdY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    for (let i = 1; i < points.length; i += 1) {
      const start = i;
      const hot = points[i].hot;
      ctx.strokeStyle = hot ? pink : mint;
      ctx.beginPath();
      ctx.moveTo((i - 1) * STEP, middle - points[i - 1].value * amplitude);
      while (i < points.length && points[i].hot === hot) {
        ctx.lineTo(i * STEP, middle - points[i].value * amplitude);
        i += 1;
      }
      ctx.stroke();
      i = Math.max(i - 1, start);
    }
  };

  const updateReadout = () => {
    const attention = attentionAt(tick);
    attentionEl.textContent = `${Math.round(Math.min(attention, 1) * 100)}%`;
    const hot = attention >= THRESHOLD;
    if (hot && !selected) {
      wordIndex = (wordIndex + 1) % words.length;
      wordEl.textContent = words[wordIndex];
    }
    selected = hot;
    attentionEl.classList.toggle("on", hot);
    wordEl.classList.toggle("on", hot);
  };

  const loop = () => {
    frame += 1;
    if (frame % 2 === 0) {
      points.push(sample(tick++));
      points.shift();
      draw();
      updateReadout();
    }
    if (visible) requestAnimationFrame(loop);
  };

  resize();
  draw();
  updateReadout();
  window.addEventListener("resize", () => {
    resize();
    draw();
  });

  if (reducedMotion) return;

  new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) requestAnimationFrame(loop);
  }).observe(canvas);
  requestAnimationFrame(loop);
}

/* ---------- copiar email ---------- */
function setupCopyEmail() {
  const button = document.getElementById("copy-email");
  const feedback = document.getElementById("copy-feedback");
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      feedback.textContent = "Email copiado.";
    } catch {
      feedback.textContent = `Não consegui copiar. O email é ${EMAIL}`;
    }
  });
}

typeName();
renderProjects();
setupTerminal();
setupSignal();
setupCopyEmail();
