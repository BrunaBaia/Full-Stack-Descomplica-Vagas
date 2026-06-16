const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432
});

pool.connect()
  .then(() => {
    console.log("Banco conectado com sucesso ✅");
  })
  .catch((err) => {
    console.log("Erro ao conectar no banco ❌");
    console.log(err);
  });


// =========================
// CADASTRO
// =========================
app.post("/register", async (req, res) => {

  const { nome, email, senha } = req.body;

  try {

    const usuarioExiste = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        mensagem: "Email já cadastrado ❌"
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      "INSERT INTO users(nome,email,senha) VALUES($1,$2,$3)",
      [nome, email, senhaHash]
    );

    res.json({
      mensagem: "Cadastro realizado com sucesso ✅"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro no servidor ❌"
    });

  }

});


// =========================
// LOGIN
// =========================
app.post("/login", async (req, res) => {

  const { email, senha } = req.body;

  try {

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        mensagem: "Usuário não encontrado ❌"
      });
    }

    const usuario = result.rows[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaCorreta) {
      return res.status(400).json({
        mensagem: "Senha incorreta ❌"
      });
    }

    res.json({
      mensagem: "Login realizado com sucesso 🚀",
      usuario: usuario.nome
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro no servidor ❌"
    });

  }

});


// =========================
// CRIAR VAGA
// =========================
app.post("/vagas", async (req, res) => {

  const {
    empresa,
    cargo,
    status,
    data_candidatura,
    data_entrevista,
    link_vaga,
    observacoes,
    usuario_email
  } = req.body;

  try {

    await pool.query(
      `
      INSERT INTO vagas
      (
        empresa,
        cargo,
        status,
        data_candidatura,
        data_entrevista,
        link_vaga,
        observacoes,
        usuario_email
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [
        empresa,
        cargo,
        status,
        data_candidatura,
        data_entrevista,
        link_vaga,
        observacoes,
        usuario_email
      ]
    );

    res.status(201).json({
      mensagem: "Vaga cadastrada com sucesso ✅"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro ao cadastrar vaga ❌"
    });

  }

});


// =========================
// LISTAR VAGAS
// =========================
app.get("/vagas/:email", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM vagas
      WHERE usuario_email = $1
      ORDER BY id DESC
      `,
      [req.params.email]
    );

    res.json(result.rows);

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro ao listar vagas ❌"
    });

  }

});


// =========================
// EXCLUIR VAGA
// =========================
app.delete("/vaga/:id", async (req, res) => {

  try {

    await pool.query(
      "DELETE FROM vagas WHERE id = $1",
      [req.params.id]
    );

    res.json({
      mensagem: "Vaga removida com sucesso 🗑️"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro ao excluir vaga ❌"
    });

  }

});


// =========================
// ALTERAR STATUS
// =========================
app.put("/vaga/:id", async (req, res) => {

  try {

    await pool.query(
      `
      UPDATE vagas
      SET status = $1
      WHERE id = $2
      `,
      [
        req.body.status,
        req.params.id
      ]
    );

    res.json({
      mensagem: "Status atualizado ✅"
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      mensagem: "Erro ao atualizar status ❌"
    });

  }

});


// =========================
// SERVIDOR
// =========================
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🚀");
});