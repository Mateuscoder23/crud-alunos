// ======================================================
// ENDEREÇO DA API
// ======================================================

const API_URL = "http://localhost:3000/api/alunos";


// ======================================================
// ELEMENTOS DO HTML
// ======================================================

const form =
    document.getElementById("aluno-form");

const idInput =
    document.getElementById("aluno-id");

const nomeInput =
    document.getElementById("nome");

const idadeInput =
    document.getElementById("idade");

const cursoInput =
    document.getElementById("curso");

const lista =
    document.getElementById("lista-alunos");

const mensagem =
    document.getElementById("mensagem");

const tituloForm =
    document.getElementById("titulo-form");

const btnSalvar =
    document.getElementById("btn-salvar");

const btnCancelar =
    document.getElementById("btn-cancelar");

const btnAtualizar =
    document.getElementById("btn-atualizar");


// ======================================================
// READ
// CARREGAR TODOS OS ALUNOS
// ======================================================

async function carregarAlunos() {

    try {

        const resposta =
            await fetch(API_URL);


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar os alunos."
            );

        }


        const alunos =
            await resposta.json();


        renderizarAlunos(alunos);


    } catch (erro) {

        mostrarMensagem(
            "Erro ao conectar com o Back-end. " +
            "Verifique se o servidor está rodando.",
            true
        );

    }

}


// ======================================================
// MOSTRAR ALUNOS NA TABELA
// ======================================================

function renderizarAlunos(alunos) {

    lista.innerHTML = "";


    if (alunos.length === 0) {

        lista.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhum aluno cadastrado.

                </td>

            </tr>

        `;

        return;

    }


    alunos.forEach(aluno => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${aluno.id}
            </td>

            <td>
                ${aluno.nome}
            </td>

            <td>
                ${aluno.idade}
            </td>

            <td>
                ${aluno.curso}
            </td>

            <td>

                <button
                    class="acao editar"
                    onclick="editarAluno(${aluno.id})"
                >
                    Editar
                </button>


                <button
                    class="acao excluir"
                    onclick="excluirAluno(${aluno.id})"
                >
                    Excluir
                </button>

            </td>

        `;


        lista.appendChild(linha);

    });

}


// ======================================================
// CREATE / UPDATE
// FORMULÁRIO
// ======================================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const dados = {

            nome:
                nomeInput.value.trim(),

            idade:
                idadeInput.value,

            curso:
                cursoInput.value.trim()

        };


        try {

            let resposta;


            // ==================================================
            // UPDATE
            // ==================================================

            if (idInput.value) {

                resposta =
                    await fetch(
                        `${API_URL}/${idInput.value}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(dados)

                        }
                    );

            }


            // ==================================================
            // CREATE
            // ==================================================

            else {

                resposta =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(dados)

                        }
                    );

            }


            const resultado =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    resultado.mensagem
                );

            }


            // Mensagem

            if (idInput.value) {

                mostrarMensagem(
                    "Aluno atualizado com sucesso!"
                );

            }

            else {

                mostrarMensagem(
                    "Aluno cadastrado com sucesso!"
                );

            }


            limparFormulario();


            carregarAlunos();


        } catch (erro) {

            mostrarMensagem(
                erro.message,
                true
            );

        }

    }
);


// ======================================================
// EDITAR ALUNO
// UPDATE
// ======================================================

async function editarAluno(id) {

    try {

        const resposta =
            await fetch(
                `${API_URL}/${id}`
            );


        const aluno =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                aluno.mensagem
            );

        }


        // Preenche o formulário

        idInput.value =
            aluno.id;

        nomeInput.value =
            aluno.nome;

        idadeInput.value =
            aluno.idade;

        cursoInput.value =
            aluno.curso;


        // Muda o formulário

        tituloForm.textContent =
            "Editar aluno";

        btnSalvar.textContent =
            "Salvar alterações";

        btnCancelar.classList.remove(
            "hidden"
        );


        // Volta para o topo

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (erro) {

        mostrarMensagem(
            erro.message,
            true
        );

    }

}


// ======================================================
// DELETE
// EXCLUIR ALUNO
// ======================================================

async function excluirAluno(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este aluno?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem || "Erro ao excluir aluno."
            );
        }

        alert("Aluno excluído com sucesso!");

        // Atualiza a tabela
        await carregarAlunos();

    } catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Erro ao excluir aluno: " +
            erro.message
        );

    }
}


// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

function limparFormulario() {

    form.reset();


    idInput.value = "";


    tituloForm.textContent =
        "Cadastrar aluno";


    btnSalvar.textContent =
        "Cadastrar";


    btnCancelar.classList.add(
        "hidden"
    );

}


// ======================================================
// BOTÃO CANCELAR
// ======================================================

btnCancelar.addEventListener(
    "click",
    limparFormulario
);


// ======================================================
// BOTÃO ATUALIZAR LISTA
// ======================================================

btnAtualizar.addEventListener(
    "click",
    carregarAlunos
);


// ======================================================
// MOSTRAR MENSAGEM
// ======================================================

function mostrarMensagem(
    texto,
    erro = false
) {

    mensagem.innerHTML = `

        <div class="${erro ? "erro" : "sucesso"}">

            ${texto}

        </div>

    `;


    setTimeout(() => {

        mensagem.innerHTML = "";

    }, 4000);

}


// ======================================================
// EXECUTAR QUANDO ABRIR A PÁGINA
// ======================================================

carregarAlunos();