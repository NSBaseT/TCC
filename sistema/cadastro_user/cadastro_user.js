//verificaAutenticado()

document.getElementById("btn_voltar_b").addEventListener("click", () => {
    window.location.href = '../Login/Login.html'
 })

const nameinp = document.getElementById("name")
const emailinp = document.getElementById("email")
const userinp = document.getElementById("user")
const senhainp = document.getElementById("senha")
const c_senhainp = document.getElementById("c_senha")
const issecretaria = document.getElementById("secretaria")
const isprofissional = document.getElementById("profissional")


const fotinha = document.getElementById("fotinha")


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


async function cadastro_user(event) {
    event.preventDefault()

if (senhainp.value!==c_senhainp.value){
    alert("Senha Incorreta")
    return
}

let foto = null

if (fotinha.files.length !== 0) {
    const arquivoFoto = fotinha.files[0]
    foto = await toBase64(arquivoFoto)
}

    fetch("/cadastro_user", {
        method: "POST",
        body: JSON.stringify({

            Nome: nameinp.value,
            Email: emailinp.value,
            Usuario: userinp.value,
            Senha: senhainp.value,
            Secretaria: issecretaria.checked,
            Profissional: isprofissional.checked,
            foto,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Usuário cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
}

 document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
   })

   function displayThumbnail(event) {
    const input = event.target;
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const thumbnail = document.getElementById('thumbnail');
        thumbnail.src = e.target.result;
        thumbnail.style.display = 'block';
      }
      reader.readAsDataURL(file);
    }
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


