const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o Front-end se comunique com o Back-end
app.use(cors());

// Permite receber dados em JSON
app.use(express.json());


// ======================================================
// ARRAY - ESTRUTURA DE ARMAZENAMENTO DOS DADOS
// ======================================================

let alunos = [
    {
        id: 1,
        nome: "João Silva",
        idade: 20,
        curso: "Sistemas de Informação"
    },
    {
        id: 2,
        nome: "Maria Santos",
        idade: 22,
        curso: "Sistemas de Informação"
    }
];


// ======================================================
// CREATE - CRIAR ALUNO
// ======================================================

function criarAluno(nome, idade, curso) {

    const novoAluno = {
        id: alunos.length > 0
            ? Math.max(...alunos.map(aluno => aluno.id)) + 1
            : 1,

        nome: nome,
        idade: Number(idade),
        curso: curso
    };

    alunos.push(novoAluno);

    return novoAluno;
}


// ======================================================
// READ - LISTAR TODOS OS ALUNOS
// ======================================================

function listarAlunos() {
    return alunos;
}


// ======================================================
// READ - BUSCAR ALUNO PELO ID
// ======================================================

function buscarAluno(id) {

    return alunos.find(
        aluno => aluno.id === Number(id)
    );

}


// ======================================================
// UPDATE - ATUALIZAR ALUNO
// ======================================================

function atualizarAluno(id, nome, idade, curso) {

    const aluno = buscarAluno(id);

    if (!aluno) {
        return null;
    }

    aluno.nome = nome;
    aluno.idade = Number(idade);
    aluno.curso = curso;

    return aluno;
}


// ======================================================
// DELETE - EXCLUIR ALUNO
// ======================================================

function excluirAluno(id) {

    const indice = alunos.findIndex(
        aluno => aluno.id === Number(id)
    );

    if (indice === -1) {
        return false;
    }

    alunos.splice(indice, 1);

    return true;
}


// ======================================================
// ROTAS DA API
// ======================================================


// READ - listar todos
app.get("/api/alunos", (req, res) => {

    res.json(listarAlunos());

});


// READ - buscar por ID
app.get("/api/alunos/:id", (req, res) => {

    const aluno = buscarAluno(req.params.id);

    if (!aluno) {

        return res.status(404).json({
            mensagem: "Aluno não encontrado."
        });

    }

    res.json(aluno);

});


// CREATE - cadastrar
app.post("/api/alunos", (req, res) => {

    const { nome, idade, curso } = req.body;

    if (!nome || !idade || !curso) {

        return res.status(400).json({
            mensagem: "Nome, idade e curso são obrigatórios."
        });

    }

    const novoAluno = criarAluno(
        nome,
        idade,
        curso
    );

    res.status(201).json(novoAluno);

});


// UPDATE - atualizar
app.put("/api/alunos/:id", (req, res) => {

    const { nome, idade, curso } = req.body;

    if (!nome || !idade || !curso) {

        return res.status(400).json({
            mensagem: "Nome, idade e curso são obrigatórios."
        });

    }

    const alunoAtualizado = atualizarAluno(
        req.params.id,
        nome,
        idade,
        curso
    );

    if (!alunoAtualizado) {

        return res.status(404).json({
            mensagem: "Aluno não encontrado."
        });

    }

    res.json(alunoAtualizado);

});


// DELETE - excluir
app.delete("/api/alunos/:id", (req, res) => {

    const excluido = excluirAluno(
        req.params.id
    );

    if (!excluido) {

        return res.status(404).json({
            mensagem: "Aluno não encontrado."
        });

    }

    res.json({
        mensagem: "Aluno excluído com sucesso."
    });

});


// ======================================================
// INICIAR SERVIDOR
// ======================================================

app.listen(PORT, () => {

    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );

});