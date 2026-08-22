
/* A publiweb nao calcula nada. Ela mostra, esconde e acende.
   Todas as tabelas ja vieram prontas do Python — inclusive as variacoes de
   ano, criterio e modo de leitura, que sao enumeraveis (9 anos x 2 criterios
   x 2 modos). Por isso nao ha banco nem SQL aqui: nao ha nada a consultar. */

const CORES = [
  {fundo:"#cfe4f5", borda:"#2f6f9f"},
  {fundo:"#cdeade", borda:"#1baf7a"},
  {fundo:"#ddd8f2", borda:"#4a3aa7"}
];
const TINTA = "#12233a";

function ver(seletor, atributo, valor){
  document.querySelectorAll(seletor).forEach(el => {
    el.style.display = el.dataset[atributo] === valor ? "" : "none";
  });
}

function aplicar(){
  const ano = document.querySelector("#ano");
  const criterio = document.querySelector("#criterio");
  const modo = document.querySelector("#modo");
  const mes = document.querySelector("#mes");
  if (ano) ver("section.ano", "ano", ano.value);
  if (criterio) ver(".criterio", "criterio", criterio.value);
  if (modo) ver(".grade", "modo", modo.value);
  if (mes) ver("section.mes", "mes", mes.value);
  const confronto = document.querySelector("#confronto");
  if (confronto) ver(".confronto", "confronto", confronto.value);
  acender();
}

/* Acende as celulas de ate 3 jogadores. A identidade mora na BORDA saturada,
   nao no fundo: os tres tons pasteis ficam perto demais um do outro para se
   distinguirem sozinhos. */
function acender(){
  document.querySelectorAll("td[data-aceso]").forEach(td => {
    td.style.background = td.dataset.fundoOriginal;
    td.style.color = "";
    td.style.borderColor = "";
    td.style.fontWeight = td.dataset.pesoOriginal;
    delete td.dataset.aceso;
  });
  const escolhidos = [...document.querySelectorAll("select.seguir")].map(s => s.value);
  escolhidos.forEach((nome, i) => {
    if (!nome) return;
    const cor = CORES[i];
    document.querySelectorAll("td").forEach(td => {
      if (td.textContent.trim() !== nome) return;
      if (td.dataset.fundoOriginal === undefined){
        td.dataset.fundoOriginal = td.style.background;
        td.dataset.pesoOriginal = td.style.fontWeight;
      }
      td.style.background = cor.fundo;
      td.style.color = TINTA;
      td.style.borderColor = cor.borda;
      td.style.fontWeight = "700";
      td.dataset.aceso = "1";
    });
  });
}

/* A lista vem do Python, num data-atributo. Varrer a tabela parecia mais
   esperto e estava errado: a segunda coluna das grades e mes ou colocacao,
   entao o seletor enchia de "10o", "11o", "12o". Quem sabe quem e jogador
   e a apuracao, nao o DOM. */
/* ---- abas: o mesmo mostrar/esconder dos outros filtros ---- */
function trocarAba(chave){
  document.querySelectorAll(".aba").forEach(el => {
    el.style.display = el.dataset.aba === chave ? "" : "none";
  });
  document.querySelectorAll(".aba-botao").forEach(b => {
    b.classList.toggle("aqui", b.dataset.alvo === chave);
  });
  acender();
}

function nomes(){
  const fonte = document.querySelector("#jogadores");
  return fonte ? fonte.dataset.nomes.split("|").filter(Boolean) : [];
}

document.addEventListener("DOMContentLoaded", () => {
  const lista = nomes();
  /* `select.seguir`, e nao `.seguir`: o container tinha a mesma classe dos
     elementos de dentro, entao o primeiro innerHTML apagava os tres selects.
     O container foi renomeado, e aqui exige-se a tag de proposito. */
  document.querySelectorAll("select.seguir").forEach(s => {
    s.innerHTML = '<option value="">(ninguém)</option>' +
      lista.map(n => `<option>${n}</option>`).join("");
    s.addEventListener("change", acender);
  });
  ["#ano", "#criterio", "#modo", "#mes", "#confronto"].forEach(id => {
    const el = document.querySelector(id);
    if (el) el.addEventListener("change", aplicar);
  });

  document.querySelectorAll(".aba-botao").forEach(b => {
    b.addEventListener("click", () => trocarAba(b.dataset.alvo));
  });
  const primeira = document.querySelector(".aba-botao");
  if (primeira) trocarAba(primeira.dataset.alvo);

  /* A coluna do nome so gruda onde a tabela de fato rola na horizontal;
     marcar todas encheria de sombra tabela que nem precisa. */
  document.querySelectorAll("div[style*='overflow-x']").forEach(caixa => {
    if (caixa.scrollWidth > caixa.clientWidth + 2){
      caixa.classList.add("tabela-rolante");
      const primeira = caixa.querySelector("table tr > *:first-child");
      const segunda = caixa.querySelector("table tr > *:nth-child(2)");
      if (primeira && segunda) segunda.parentElement.parentElement
        .querySelectorAll("tr > *:nth-child(2)")
        .forEach(c => { c.style.left = primeira.getBoundingClientRect().width + "px"; });
    }
  });

  aplicar();
});
