const themeBtn = document.getElementById("themeBtn");
const savedList = document.getElementById("savedList");
const output = document.getElementById("output");
const robot = document.getElementById("robot");

themeBtn.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';

        document.querySelectorAll('.card').forEach(card => {
            card.style.backgroundColor = '#1e293b';
            card.style.color = '#f8fafc';
        });

        document.querySelectorAll('textarea, select').forEach(el => {
            el.style.backgroundColor = '#334155';
            el.style.color = '#f8fafc';
            el.style.borderColor = '#475569';
        });

    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';

        document.querySelectorAll('.card').forEach(card => {
            card.style.backgroundColor = '#ffffff';
            card.style.color = '#1f2937';
        });

        document.querySelectorAll('textarea, select').forEach(el => {
            el.style.backgroundColor = '';
            el.style.color = '';
            el.style.borderColor = '';
        });
    }
}

function generatePrompt() {
    const type = document.getElementById("type").value;
    const role = document.getElementById("role").value;
    const tone = document.getElementById("tone").value;
    const input = document.getElementById("input").value;

    if (!input.trim()) {
        alert("Enter topic or code");
        return;
    }

    let prompt = "";

    if (type === "explain") {
        prompt = `Act as a ${role}.\nExplain "${input}" in a ${tone} tone.
        \nUse examples and give a short summary.`;
    } else if (type === "debug") {
        prompt = `Act as a senior ${role}.\nDebug the following code.
        \nExplain errors and provide corrected code.\n\n${input}`;
    } else if (type === "write") {
        prompt = `Act as a ${role}.
        \nWrite structured and engaging content on "${input}" in a ${tone} tone.`;
    } else if (type === "interview") {
        prompt = `Generate interview questions and answers for "${input}".
        \nCover beginner to advanced level.`;
    } else if (type === "idea") {
        prompt = `Suggest innovative project ideas related to "${input}".
        \nInclude features and tech stack.`;
    }

    output.value = prompt;

    robot.classList.add("active");
    setTimeout(() => robot.classList.remove("active"), 600);
}

function copyPrompt() {
    if (!output.value) {
        alert("No prompt to copy"); 
        return;
    }
    output.select();
    document.execCommand("copy");
    alert("Prompt copied!");
}

function savePrompt() {
    if (!output.value) 
        return;
    let prompts = JSON.parse(localStorage.getItem("prompts")) || [];
    prompts.push(output.value);
    localStorage.setItem("prompts", JSON.stringify(prompts));
    loadSaved();
}

function loadSaved() {
    savedList.innerHTML = "";
    let prompts = JSON.parse(localStorage.getItem("prompts")) || [];

    prompts.forEach((p, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        <span onclick="loadPrompt(${index})" style="cursor:pointer;">
        <i class="fa-solid fa-file-lines"></i> Prompt ${index + 1}
        </span>
        <button class="btn btn-sm btn-danger" onclick="deletePrompt(${index})">
        <i class="fa-solid fa-trash"></i>
        </button>`;
        savedList.appendChild(li);
    });
}

function loadPrompt(index) {
    let prompts = JSON.parse(localStorage.getItem("prompts")) || [];
    output.value = prompts[index];
}

function deletePrompt(index) {
    let prompts = JSON.parse(localStorage.getItem("prompts")) || [];
    prompts.splice(index, 1);
    localStorage.setItem("prompts", JSON.stringify(prompts));
    loadSaved();
}

function downloadPrompt() {
    if (!output.value) { 
        alert("No prompt to download"); 
        return; }

    const blob = new Blob([output.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        if (loader) loader.remove();
    }, 2300);
});

loadSaved();
