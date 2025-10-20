//verificaAutenticado();

let Usuario = "";
let Nome = "";
let consultores = [];

async function carregarConsultores() {
    const token = localStorage.getItem(CHAVE);
    const response = await fetch('/verify', {
        body: JSON.stringify({ token }),
        method: 'POST',
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    Usuario = data.Usuario;
    Nome = data.Nome;

    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) userGreeting.textContent = `Olá, ${Nome}!`;

    const response2 = await fetch('/users');
    consultores = await response2.json();

    const list = document.getElementById("lista");
    if (!list) return;

    if (data.Secretaria) {
        consultores
            .filter(arq => !arq.Secretaria && arq.Nome !== "ADM")
            .forEach(({ Usuario, Nome }) => {
                list.innerHTML += `<option value="${Usuario}">${Nome}</option>`;
            });
    } else {
        [data].forEach(({ Usuario, Nome }) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {


    const modPresenca = document.getElementById('mod-presenca');
    const tbodyPresenca = document.getElementById("tbodyPresenca");
    const list = document.getElementById("lista");
    const nameinppresenca = document.getElementById("age_name_presenca");

    let todosPacientes = [];
    let pacientesFiltradosPresenca = [];
    let itemsPresenca = [];

    async function carregarPacientes() {
        const response = await fetch('/pacientes');
        todosPacientes = await response.json();
    }

    async function getConsultasBD(valuePacienteFiltrado) {
        const response = await fetch("/agendamentos_filtrado?id=" + valuePacienteFiltrado, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        itemsPresenca = await response.json();

        // ✅ 1. ADICIONAMOS ESTA LINHA para ler o valor do filtro de status do HTML
        const filtroStatus = document.getElementById("filtroStatus").value;

        // ✅ 2. SUBSTITUÍMOS o filtro antigo por esta nova lógica dinâmica
        itemsPresenca = itemsPresenca.filter(item => {
            // Se o usuário escolheu "Todos", mostre tanto "Compareceu" quanto "Faltou"
            if (filtroStatus === "Todos") {
                return item.Status_da_Consulta === "Compareceu" || item.Status_da_Consulta === "Faltou";
            }
            // Senão, mostre apenas o status exato que o usuário selecionou
            return item.Status_da_Consulta === filtroStatus;
        });

        // O resto da função continua igual
        const filtroData = document.getElementById("filtroData").value;
        const filtroMes = document.getElementById("filtroMes").value;
        const filtroAno = document.getElementById("filtroAno").value;

        itemsPresenca = itemsPresenca.filter(item => {
            const [ano, mes, dia] = item.Data_do_Atendimento.split("T")[0].split("-");
            const dataISO = `${ano}-${mes}-${dia}`;

            if (filtroData && filtroData !== dataISO) return false;
            if (filtroMes && filtroMes !== mes) return false;
            if (filtroAno && filtroAno !== ano) return false;

            return true;
        });

        itemsPresenca = itemsPresenca.map(arg => {
            arg.Nome = todosPacientes.find(({ id }) => id === arg.Nome)?.Nome || "Paciente não encontrado";
            return arg;
        });
    }

    // VERSÃO NOVA E CORRIGIDA DA FUNÇÃO
    function insertItemPresenca(item, index) {
        let tr = document.createElement("tr");
        const date = new Date(item.Data_do_Atendimento);
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const dataFormatada = adjustedDate.toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // ✅ LÓGICA ATUALIZADA PARA CRIAR OS "SELOS" DE STATUS
        const status = item.Status_da_Consulta;
        let statusHtml = '';

        if (status === "Compareceu") {
            statusHtml = '<span class="status status-presente">Presente</span>';
        } else if (status === "Faltou") {
            statusHtml = '<span class="status status-faltou">Faltou</span>';
        } else {
            statusHtml = status; // Caso exista outro status, apenas exibe o texto
        }

        // ✅ HTML DO 'tr' ATUALIZADO USANDO A VARIÁVEL statusHtml
        tr.innerHTML = `
        <td id="${item.id}">${item.Nome}</td>
        <td>${dataFormatada}</td>
        <td>${item.Horario_da_consulta}</td>
        <td>${item.Horario_de_Termino_da_consulta}</td>
        <td>${statusHtml}</td> 
        <td class="columnAction">
            <button type="button" onclick='showModal(${JSON.stringify(item)})'>Ver</button>
        </td>
    `;

        tbodyPresenca.appendChild(tr);
    }

    async function loadConsultas(event) {
        event.preventDefault();
        const pacienteFiltrado = document.getElementById("age_name_presenca");
        const valuePacienteFiltrado = pacienteFiltrado.value;

        await getConsultasBD(valuePacienteFiltrado);

        const tbodyPresenca = document.getElementById("tbodyPresenca");
        tbodyPresenca.innerHTML = "";
        itemsPresenca.forEach((item, index) => {
            insertItemPresenca(item, index);
        });
    }


    list.addEventListener("change", () => {
        if (list.value === "-") return;

        pacientesFiltradosPresenca = todosPacientes.filter(({ Especialista }) => Especialista === list.value);
        nameinppresenca.innerHTML = '';
        pacientesFiltradosPresenca.forEach(item => {
            nameinppresenca.innerHTML += `<option value="${item.id}">${item.Nome}</option>`;
        });
    });

    const btnPresenca = document.getElementById('presenca');
    if (btnPresenca) {
        btnPresenca.addEventListener('click', () => {
            if (list.value === "-") return;

            pacientesFiltradosPresenca = todosPacientes.filter(({ Especialista }) => Especialista === list.value);
            nameinppresenca.innerHTML = '';
            pacientesFiltradosPresenca.forEach(item => {
                nameinppresenca.innerHTML += `<option value="${item.id}">${item.Nome}</option>`;
            });

            modPresenca.style.display = "block";
        });
    }

    const btnVoltar = document.getElementById('btn-voltar-presenca');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = '../Menu/menu.html';
        });
    }

    const buscarBtn = document.querySelector(".cancel-button[onclick='loadConsultas(event)']");
    if (buscarBtn) buscarBtn.addEventListener("click", loadConsultas);

    carregarPacientes().catch(console.error);
    carregarConsultores().catch(console.error);
});

// ✅ ADICIONE AS FUNÇÕES DO MODAL AQUI EMBAIXO

// Função para MOSTRAR o modal e preencher com os dados
function showModal(item) {
    // Pega os elementos do modal pelo ID
    const modal = document.getElementById('meuModal');

    // Preenche os campos do modal com os dados do 'item' clicado
    document.getElementById('modal-paciente').textContent = item.Nome;

    // Formata a data para exibição
    const date = new Date(item.Data_do_Atendimento);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const dataFormatada = adjustedDate.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' });
    document.getElementById('modal-data').textContent = dataFormatada;

    document.getElementById('modal-horario').textContent = `${item.Horario_da_consulta} às ${item.Horario_de_Termino_da_consulta}`;

    const status = item.Status_da_Consulta === "Compareceu" ? "Presente" : "Faltou";
    document.getElementById('modal-status').textContent = status;

    // Encontra o nome do especialista para exibir
    const especialistaNome = consultores.find(e => e.Usuario === item.Especialista)?.Nome || "Não encontrado";
    document.getElementById('modal-especialista').textContent = especialistaNome;

    // ✅ ADICIONA A OBSERVAÇÃO
    // (Assumindo que o campo no seu banco de dados se chama 'Observacao')
    document.getElementById('modal-observacao').textContent = item.Observacao || "Nenhuma observação.";

    // Mostra o modal
    modal.style.display = 'flex';
}

// Função para FECHAR o modal
function closeModal() {
    const modal = document.getElementById('meuModal');
    modal.style.display = 'none';
}

// ✅ ADICIONE A FUNÇÃO PARA GERAR PDF AQUI
function gerarPDF() {
    // Pega o conteúdo do modal que será "impresso"
    const ticket = document.getElementById('ticket-para-pdf');
    const nomePaciente = document.getElementById('modal-paciente').textContent;
    const nomeArquivo = `agendamento_${nomePaciente.replace(/ /g, '_')}.pdf`;

    // Opções para o html2canvas para garantir melhor qualidade
    const options = {
        scale: 2, // Aumenta a resolução da captura
        useCORS: true,
        logging: false
    };

    // Usa html2canvas para capturar o elemento como uma imagem
    html2canvas(ticket, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Usa a forma mais segura de chamar a biblioteca jsPDF
        const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a5' // Tamanho de folha ideal para um ticket
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Adiciona a imagem ao PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Salva o PDF
        pdf.save(nomeArquivo);
    });
}



document.getElementById("ch-side").addEventListener("change", event => {
    const mainSide = document.getElementById("main-side");
    mainSide.classList.toggle("off", !event.target.checked);
});
