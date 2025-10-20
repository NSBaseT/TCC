verificaNaoAutenticado()

document.getElementById("btn_voltar_d").addEventListener("click", () => {
    window.location.href = '../Login/Login.html'
})

const inp_codigo = document.getElementById('codigo')
const inp_senha = document.getElementById('senha')
const inp_c_senha = document.getElementById('c_senha')

function resetar_senha(event) {
    event.preventDefault()


    if (inp_senha.value !== inp_c_senha.value) {
        alert("Senha Incorreta, tente novamente")
        return
    }

    const params = new URLSearchParams(window.location.search)
    const user = params.get("user")

    fetch('/resetar-senha', {
        method: "POST",
        body: JSON.stringify({

            usuario: user,
            codigo: Number(inp_codigo.value),
            senha: inp_senha.value

        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).finally(() => {
        window.location.href = `/sistema/Login/Login.html`
    })
}

document.getElementById('senha').addEventListener('input', function() {
    const senha = this.value;
    const forca = avaliarForcaSenha(senha);
    const senhaForcaDiv = document.getElementById('senhaForca');

    senhaForcaDiv.textContent = forca.mensagem;
    senhaForcaDiv.style.color = forca.cor;
});

document.getElementById('senha').addEventListener('input', function() {
    const senha = this.value;
    const forca = avaliarForcaSenha(senha);
    const senhaForcaDiv = document.getElementById('senhaForca');
    const bars = [document.getElementById('bar1'), document.getElementById('bar2'), document.getElementById('bar3')];

    senhaForcaDiv.textContent = forca.mensagem;
    senhaForcaDiv.style.color = forca.cor;

    // Resetando as cores das barras
    bars.forEach(bar => {
        bar.style.backgroundColor = 'lightgray';
    });

    // Atualizando as barras de acordo com a força
    if (forca.nivel === 1) {
        bars[0].style.backgroundColor = 'red';
    } else if (forca.nivel === 2) {
        bars[0].style.backgroundColor = 'orange';
        bars[1].style.backgroundColor = 'orange';
    } else if (forca.nivel === 3) {
        bars[0].style.backgroundColor = 'green';
        bars[1].style.backgroundColor = 'green';
        bars[2].style.backgroundColor = 'green';
    }
});




// Verificação de senha
function avaliarForcaSenha(senha) {
    let forca = {
        mensagem: '',
        cor: '',
        nivel: 0 // Nível de força (1, 2 ou 3)
    };

    if (senha.length === 0) {
        // Se a senha estiver vazia, retorna valores padrão
        forca.mensagem = '';
        forca.cor = '';
        forca.nivel = 0;
    } else if (senha.length < 6) {
        forca.mensagem = 'Senha Fraca';
        forca.cor = 'red';
        forca.nivel = 1;
    } else if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(senha)) {
        forca.mensagem = 'Senha Forte';
        forca.cor = 'green';
        forca.nivel = 3;
    } else if (/(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(senha)) {
        forca.mensagem = 'Senha Média';
        forca.cor = 'orange';
        forca.nivel = 2;
    } else {
        forca.mensagem = 'Fraca';
        forca.cor = 'red';
        forca.nivel = 1;
    }

    return forca;
}