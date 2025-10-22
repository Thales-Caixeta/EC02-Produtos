// ===== Modelo =====
class Funcionario {
  #id;
  #nome;
  #idade;
  #cargo;
  #salario;
  constructor(id, nome, idade, cargo, salario) {
    this.#id = id;
    this.#nome = nome;
    this.#idade = Number(idade);
    this.#cargo = cargo;
    this.#salario = Number(salario);
  }
  get id() {
    return this.#id;
  }
  get nome() {
    return this.#nome;
  }
  get idade() {
    return this.#idade;
  }
  get cargo() {
    return this.#cargo;
  }
  get salario() {
    return this.#salario;
  }
  set nome(v) {
    this.#nome = v;
  }
  set idade(v) {
    this.#idade = Number(v);
  }
  set cargo(v) {
    this.#cargo = v;
  }
  set salario(v) {
    this.#salario = Number(v);
  }
  toString() {
    return `#${this.#id} ${this.#nome} (${
      this.#cargo
    }) — R$ ${this.#salario.toFixed(2)}`;
  }
}

// ===== Estado =====
let seqId = Number(localStorage.getItem("seqId") || 1);

// Carrega do localStorage (agora lendo propriedades simples)
const load = () => {
  const raw = JSON.parse(localStorage.getItem("funcionarios") || "[]");
  return raw.map(
    (f) => new Funcionario(f.id, f.nome, f.idade, f.cargo, f.salario)
  );
};
let funcionarios = load();

// Salva no localStorage (serializando via getters)
const save = () => {
  const plain = funcionarios.map((f) => ({
    id: f.id,
    nome: f.nome,
    idade: f.idade,
    cargo: f.cargo,
    salario: f.salario,
  }));
  localStorage.setItem("funcionarios", JSON.stringify(plain));
  localStorage.setItem("seqId", String(seqId));
};

let sort = { key: "id", dir: "asc" };
let page = 1,
  pageSize = 5;

// ===== Helpers =====
const $ = (s) => document.querySelector(s);
const tbody = $("#tbody"),
  totalPill = $("#totalPill"),
  rel = $("#relatorio");
const q = $("#q"),
  fCargo = $("#fCargo"),
  pageInfo = $("#pageInfo");
const moeda = (v) =>
  `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const toast = (msg, type = "ok") => {
  const el = $("#toast");
  if (!el) return;
  $("#toastIcon").className = type;
  $("#toastMsg").textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
};

// filtros
const filterList = () => {
  const term = (q?.value || "").toLowerCase().trim();
  const cargo = fCargo?.value || "";
  return funcionarios.filter(
    (f) =>
      (!term || f.nome.toLowerCase().includes(term)) &&
      (!cargo || f.cargo === cargo)
  );
};

const applySort = (arr) => {
  const k = sort.key,
    dir = sort.dir === "asc" ? 1 : -1;
  return arr.slice().sort((a, b) => {
    const va = a[k],
      vb = b[k];
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
};

const paginate = (arr) => {
  const totalPages = Math.max(1, Math.ceil(arr.length / pageSize));
  page = Math.min(page, totalPages);
  const start = (page - 1) * pageSize;
  const items = arr.slice(start, start + pageSize);
  if (pageInfo) pageInfo.textContent = `${page}/${totalPages}`;
  return items;
};

const refreshCargoFilter = () => {
  if (!fCargo) return;
  const cargos = [...new Set(funcionarios.map((f) => f.cargo))].sort();
  fCargo.innerHTML =
    `<option value="">Todos os cargos</option>` +
    cargos.map((c) => `<option value="${c}">${c}</option>`).join("");
};

// ===== Form =====
const getForm = () => ({
  id: $("#id").value.trim(),
  nome: $("#nome").value.trim(),
  idade: $("#idade").value.trim(),
  cargo: $("#cargo").value.trim(),
  salario: $("#salario").value.trim(),
});
const clearForm = () => {
  ["id", "nome", "idade", "cargo", "salario"].forEach(
    (i) => ($("#" + i).value = "")
  );
  const c = $("#btnCadastrar"),
    a = $("#btnAtualizar");
  if (c) c.style.display = "inline-block";
  if (a) a.style.display = "none";
};
const fillForm = (f) => {
  $("#id").value = f.id;
  $("#nome").value = f.nome;
  $("#idade").value = f.idade;
  $("#cargo").value = f.cargo;
  $("#salario").value = f.salario;
  const c = $("#btnCadastrar"),
    a = $("#btnAtualizar");
  if (c) c.style.display = "none";
  if (a) a.style.display = "inline-block";
};

// ===== Render =====
const render = () => {
  const filtered = filterList();
  const ordered = applySort(filtered);
  const pageItems = paginate(ordered);

  tbody.innerHTML = pageItems
    .map(
      (f) => `
    <tr>
      <td>${f.id}</td>
      <td>${f.nome}</td>
      <td><span class="chip">${f.idade}</span></td>
      <td><span class="chip">${f.cargo}</span></td>
      <td>${moeda(f.salario)}</td>
      <td>
        <button class="btn btn-edit" onclick="editar(${f.id})">Editar</button>
        <button class="btn btn-danger" onclick="excluir(${
          f.id
        })">Excluir</button>
      </td>
    </tr>`
    )
    .join("");

  totalPill.textContent = filtered.length;
  refreshCargoFilter();
  save();
};

// ===== CRUD =====
const cadastrar = () => {
  const { nome, idade, cargo, salario } = getForm();
  if (!nome || !idade || !cargo || !salario)
    return toast("Preencha todos os campos", "warn");
  const f = new Funcionario(seqId++, nome, idade, cargo, salario);
  funcionarios.push(f);
  page = 1;
  render();
  clearForm();
  toast("Cadastrado");
};

window.editar = (id) => {
  const f = funcionarios.find((x) => x.id === id);
  if (!f) return;
  fillForm(f);
};

window.excluir = (id) => {
  if (!confirm("Confirma excluir este funcionário?")) return;
  funcionarios = funcionarios.filter((f) => f.id !== id);
  render();
  clearForm();
  toast("Excluído");
};

const atualizar = () => {
  const { id, nome, idade, cargo, salario } = getForm();
  if (!id) return toast("Nada selecionado", "warn");
  const i = funcionarios.findIndex((f) => f.id === Number(id));
  if (i === -1) return;
  funcionarios[i].nome = nome;
  funcionarios[i].idade = idade;
  funcionarios[i].cargo = cargo;
  funcionarios[i].salario = salario;
  render();
  clearForm();
  toast("Atualizado");
};

// ===== Relatórios =====
const salarioMaior5k = () => {
  const arr = filterList().filter((f) => f.salario > 5000);
  rel.innerHTML = `<b>Salário > 5000</b><br>${
    arr.map((f) => f.toString()).join("<br>") || "— vazio —"
  }`;
};
const mediaSalarial = () => {
  const arr = filterList();
  const m = arr.length
    ? arr.reduce((acc, f) => acc + f.salario, 0) / arr.length
    : 0;
  rel.innerHTML = `<b>Média salarial</b><br>${moeda(m)}`;
};
const cargosUnicos = () => {
  const set = new Set(filterList().map((f) => f.cargo));
  rel.innerHTML = `<b>Cargos únicos</b><br>${
    [...set].join(", ") || "— vazio —"
  }`;
};
const nomesUpper = () => {
  const lista = filterList().map((f) => f.nome.toUpperCase());
  rel.innerHTML = `<b>Nomes em maiúsculo</b><br>${
    lista.join(", ") || "— vazio —"
  }`;
};
const limparRel = () => (rel.innerHTML = "");

// ===== Eventos =====
$("#btnCadastrar")?.addEventListener("click", () => cadastrar());
$("#btnAtualizar")?.addEventListener("click", () => atualizar());
$("#btnCancelar")?.addEventListener("click", () => clearForm());

$("#btnSalarioMaior5k")?.addEventListener("click", () => salarioMaior5k());
$("#btnMediaSalarial")?.addEventListener("click", () => mediaSalarial());
$("#btnCargosUnicos")?.addEventListener("click", () => cargosUnicos());
$("#btnNomesUpper")?.addEventListener("click", () => nomesUpper());
$("#btnLimparRel")?.addEventListener("click", () => limparRel());

q?.addEventListener("input", () => {
  page = 1;
  render();
});
fCargo?.addEventListener("change", () => {
  page = 1;
  render();
});
$("#btnLimparFiltro")?.addEventListener("click", () => {
  if (q) q.value = "";
  if (fCargo) fCargo.value = "";
  page = 1;
  render();
});

$("#prev")?.addEventListener("click", () => {
  if (page > 1) {
    page--;
    render();
  }
});
$("#next")?.addEventListener("click", () => {
  page++;
  render();
});

// ===== Seed (só se vazio) =====
if (funcionarios.length === 0) {
  funcionarios.push(
    new Funcionario(seqId++, "Rebert", 24, "Frontend", 5200),
    new Funcionario(seqId++, "Richard", 29, "Backend", 7800),
    new Funcionario(seqId++, "Jon Snow", 32, "QA", 4200)
  );
}
render();
