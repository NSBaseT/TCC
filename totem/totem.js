document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todas as telas e botões
    const telas = document.querySelectorAll('.tela');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnBiometria = document.getElementById('btn-biometria');
    const btnFacial = document.getElementById('btn-facial');
    const btnVoltarInicio = document.getElementById('btn-voltar-inicio');

    // Função para gerenciar qual tela é mostrada
    function mostrarTela(idTela) {
        telas.forEach(tela => tela.classList.remove('ativa'));
        document.getElementById(idTela).classList.add('ativa');
    }

    // --- NAVEGAÇÃO ---
    btnIniciar.addEventListener('click', () => mostrarTela('tela-escolha'));
    btnVoltarInicio.addEventListener('click', () => mostrarTela('tela-inicial'));
    
    btnBiometria.addEventListener('click', () => {
        document.getElementById('titulo-aguardando').innerText = 'Leitura de Digital';
        document.getElementById('instrucao-aguardando').innerText = 'Por favor, posicione o dedo no leitor.';
        mostrarTela('tela-aguardando');
        iniciarProcessoDeIdentificacao('biometria');
    });

    btnFacial.addEventListener('click', () => {
        document.getElementById('titulo-aguardando').innerText = 'Reconhecimento Facial';
        document.getElementById('instrucao-aguardando').innerText = 'Por favor, olhe para a câmera.';
        mostrarTela('tela-aguardando');
        iniciarProcessoDeIdentificacao('facial');
    });

    // --- LÓGICA DE COMUNICAÇÃO COM O BACK-END ---
    async function iniciarProcessoDeIdentificacao(tipo) {
        console.log(`Iniciando identificação via ${tipo}...`);
        
        // **FUTURO**: Aqui enviaremos uma requisição para o seu servidor Express.
        // Ex: const response = await fetch('/api/totem/iniciar-leitura', { method: 'POST', body: JSON.stringify({ tipo }) });
        // O servidor então comanda o Arduino/ESP32 e espera a resposta.
        
        // **SIMULAÇÃO POR ENQUANTO**: Vamos simular que o back-end respondeu após 5 segundos.
        setTimeout(() => {
            // O back-end nos enviaria dados do paciente como este objeto JSON:
            const dadosDoServidor = {
                sucesso: true,
                paciente: { nome: "Nayara da Silva (Simulado)" },
                agendamento: {
                    profissional: "Dr. Ricardo Almeida",
                    data: "19/10/2025",
                    horario: "21:30",
                    esperaEstimada: "18 minutos"
                }
            };
            
            if (dadosDoServidor.sucesso) {
                preencherETrocarParaTelaTicket(dadosDoServidor);
            } else {
                // Lógica para falha na identificação (não implementada nesta simulação)
                console.log("Falha na identificação.");
                mostrarTela('tela-escolha'); // Volta para a tela de escolha
            }
        }, 5000);
    }

    function preencherETrocarParaTelaTicket(dados) {
        // Preenche os campos do ticket com os dados recebidos
        document.getElementById('ticket-paciente').innerText = dados.paciente.nome;
        document.getElementById('ticket-profissional').innerText = dados.agendamento.profissional;
        document.getElementById('ticket-data').innerText = dados.agendamento.data;
        document.getElementById('ticket-horario').innerText = dados.agendamento.horario;
        document.getElementById('ticket-espera').innerText = dados.agendamento.esperaEstimada;
        
        mostrarTela('tela-ticket');
        
        // **FUTURO**: Após mostrar o ticket, enviaremos um comando para a rota de impressão.
        // Ex: await fetch('/api/totem/imprimir', { method: 'POST', body: JSON.stringify(dados) });
        console.log("Comando para imprimir ticket seria enviado agora.");

        // Volta para a tela inicial após 10 segundos para o próximo paciente
        setTimeout(() => mostrarTela('tela-inicial'), 10000);
    }

    // Garante que o sistema comece na tela inicial
    mostrarTela('tela-inicial');
});