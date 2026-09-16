const pacientes = [];
let pacientesArquivo = 0;

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const corpoTabela = document.getElementById('tabela-pacientes-body');
const mensagemCarregando = document.getElementById('carregando');
const mensagemVazia = document.getElementById('mensagem-vazia');
const mensagemErro = document.getElementById('mensagem-erro');
const contadorPacientes = document.getElementById('contador-pacientes');
let URL_PACIENTES = 'data/pacientes.json';
// Para testar o erro amigável, troque a URL acima por um arquivo inexistente:
// URL_PACIENTES = 'data/pacientes-inexistentes.json';

function adicionarPaciente(nome, email, nascimento) {
	pacientes.push({ nome, email, nascimento });
}

function atualizarContadorPacientes() {
	const pacientesManualmente = Math.max(pacientes.length - pacientesArquivo, 0);
	contadorPacientes.textContent = `Pacientes do arquivo: ${pacientesArquivo} | Cadastrados nesta sessão: ${pacientesManualmente}`;
}

function mostrarErro(mensagem) {
	mensagemErro.textContent = mensagem;
	mensagemErro.classList.remove('d-none');
}

function ocultarErro() {
	mensagemErro.textContent = '';
	mensagemErro.classList.add('d-none');
}

function renderizarTabela() {
	corpoTabela.innerHTML = '';

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');
		linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
    `;
		corpoTabela.appendChild(linha);
	});

	const temPacientes = pacientes.length > 0;
	tabela.classList.toggle('d-none', !temPacientes);
	mensagemVazia.classList.toggle('d-none', temPacientes);
	mensagemCarregando.classList.add('d-none');
	atualizarContadorPacientes();
}

function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

async function carregarPacientesIniciais() {
	mensagemCarregando.classList.remove('d-none');
	mensagemCarregando.textContent = 'Carregando pacientes...';
	ocultarErro();

	try {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const resposta = await fetch(URL_PACIENTES);

		if (!resposta.ok) {
			throw new Error(`Erro HTTP: ${resposta.status}`);
		}

		const dados = await resposta.json();

		pacientes.splice(0, pacientes.length);
		pacientesArquivo = Array.isArray(dados) ? dados.length : 0;

		if (Array.isArray(dados)) {
			dados.forEach((paciente) => {
				adicionarPaciente(paciente.nome, paciente.email, paciente.nascimento);
			});
		}

		renderizarTabela();

		if (pacientes.length === 0) {
			mensagemCarregando.classList.add('d-none');
			mensagemVazia.classList.remove('d-none');
		}
	} catch (erro) {
		console.error('Não foi possível carregar os pacientes:', erro);
		mensagemCarregando.classList.add('d-none');
		tabela.classList.add('d-none');
		mensagemVazia.classList.add('d-none');
		mostrarErro('Não foi possível carregar os pacientes no momento. Tente novamente mais tarde.');
		contadorPacientes.textContent = 'Pacientes do arquivo: 0 | Cadastrados nesta sessão: 0';
	}
}

formulario.addEventListener('submit', (event) => {
	event.preventDefault();

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;

	if (!nome || !email || !nascimento) {
		return;
	}

	adicionarPaciente(nome, email, nascimento);
	renderizarTabela();
	formulario.reset();
});

carregarPacientesIniciais();
