document.addEventListener("DOMContentLoaded", function () {

    console.log("SCRIPT CARREGADO");

    // =========================
    // ✅ CADASTRO
    // =========================
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            console.log("clicou cadastrar");

            const dados = {
                nome: document.getElementById("nome")?.value,
                dataNascimento: document.getElementById("dataNascimento")?.value,
                cpf: document.getElementById("cpf")?.value,
                genero: document.getElementById("genero")?.value,
                cor: document.getElementById("cor")?.value,
                pais: document.getElementById("pais")?.value,
                estado: document.getElementById("estado")?.value,
                cidade: document.getElementById("cidade")?.value,
                cep: document.getElementById("cep")?.value,
                endereco: document.getElementById("endereco")?.value,
                instituicao: document.getElementById("instituicao")?.value,
                curso: document.getElementById("curso")?.value,
                periodo: document.getElementById("periodo")?.value,
                formatura: document.getElementById("formatura")?.value,
                vaga: document.getElementById("vaga")?.value,
                email: document.getElementById("emailCadastro")?.value,
                senha: document.getElementById("senhaCadastro")?.value
            };

            // 🔥 DEBUG (ESSENCIAL)
            console.log("DADOS ENVIADOS:", dados);

            const mensagem = document.getElementById("mensagem");

            try {
                const resposta = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                const res = await resposta.json();

                mensagem.innerText = res.mensagem;

            } catch (erro) {
                console.log(erro);
                mensagem.innerText = "Erro ao conectar ❌";
            }
        });
    }

    // =========================
    // ✅ LOGIN
    // =========================
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            console.log("clicou login");

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const mensagem = document.getElementById("mensagem");

            try {
                const resposta = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });

                const dados = await resposta.json();

                console.log("LOGIN:", dados);

                mensagem.innerText = dados.mensagem;

                if (dados.mensagem.includes("sucesso")) {

                    localStorage.setItem("user", email);

                    mensagem.innerText = "Login realizado com sucesso 🚀";

                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);

                }

            } catch (erro) {
                console.log(erro);
                mensagem.innerText = "Erro ao conectar ❌";
            }
        });
    }

});