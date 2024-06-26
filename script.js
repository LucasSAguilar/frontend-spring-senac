const todosFilmes = [];

document
  .getElementById("filmeForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const sinopse = document.getElementById("sinopse").value;
    const genero = document.getElementById("genero").value;
    const anoLancamento = document.getElementById("anoLancamento").value;

    const filmeData = {
      titulo,
      sinopse,
      genero,
      anoLancamento,
    };

    try {
      const response = await fetch("http://localhost:8080/filme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filmeData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o filme");
      }

      const filmeCadastrado = await response.json();
      console.log("Filme cadastrado com sucesso:", filmeCadastrado);
      alert("Filme cadastrado com sucesso!");
      buscarFilmes();
    } catch (error) {
      console.error("Erro ao cadastrar o filme:", error);
      alert("Erro ao cadastrar o filme.");
    }
  });

async function buscarFilmes() {
  try {
    const response = await fetch("http://localhost:8080/filme");
    if (!response.ok) {
      throw new Error("Erro ao buscar os filmes");
    }
    const filmes = await response.json();
    const lista = document.getElementById("filmes");
    lista.innerHTML = "";
    filmes.forEach((filme) => {
      todosFilmes.push(filme);
      const filmeItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = filme.id;
      link.innerHTML = `Título: ${filme.titulo}, Gênero: ${filme.genero}, Ano: ${filme.anoLancamento} - Sinopse: ${filme.sinopse}`;

      filmeItem.textContent = "";

      filmeItem.appendChild(link);
      lista.appendChild(filmeItem);
    });
  } catch (error) {
    console.error("Erro ao buscar os filmes:", error);
    alert("Erro ao buscar os filmes.");
  }
}

buscarFilmes();

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8080/analise")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Ocorreu um problema com a sua operação fetch: " + response.status
        );
      }
      console.log(response);
      return response.json();
    })
    .then((data) => {
      const listaAnalises = document.querySelector("#listaAnalises"); 
      data.forEach((item) => {
        const avaliacaoItem = document.createElement("li");
        avaliacaoItem.innerHTML = `Filme: ${item.filme.titulo}, Nota: ${item.nota}, Análise: ${item.analise}`;
        listaAnalises.appendChild(avaliacaoItem);
      });
    })
    .catch((error) => console.error("Erro:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8080/filme")
    .then((response) => response.json())
    .then((filmes) => {
      const selectFilme = document.getElementById("filmeSelect");
      filmes.forEach((filme) => {
        const option = document.createElement("option");
        option.value = filme.id;
        option.textContent = filme.titulo;
        selectFilme.appendChild(option);
      });
    })
    .catch((error) => console.error("Erro ao carregar filmes:", error));
});

document
  .getElementById("formAnalise")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const filmeId = document.getElementById("filmeSelect").value;
    const comentario = document.getElementById("comentario").value;
    const nota = document.getElementById("nota").value;
    var objetoEnvio = {};

    todosFilmes.forEach((filme) => {
      if (filme.id == filmeId) {
        objetoEnvio = {
          id: Math.random() * 1000,
          filme: {
            id: filme.id,
            titulo: filme.titulo,
            sinopse: filme.sinopse,
            genero: filme.genero,
            anoLancamento: filme.anoLancamento,
          },
          analise: comentario,
          nota: nota,
        };
      }
    });

    fetch("http://localhost:8080/analise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objetoEnvio),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao enviar análise");
        }
        if (
          response.headers.get("content-length") === "0" ||
          !response.headers.get("content-type").includes("application/json")
        ) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("Análise enviada com sucesso:", data);
          document.getElementById("formAnalise").reset();
        } else {
          console.log(
            "Análise enviada com sucesso, sem dados JSON na resposta."
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar análise:", error);
      });
  });
