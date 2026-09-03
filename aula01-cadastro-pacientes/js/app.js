// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const contadorPacientes = document.getElementById('contador-pacientes');

function atualizarContadorPacientes() {
	contadorPacientes.textContent = `Total de pacientes: ${pacientes.length}`;
}

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone) {
	const emailNormalizado = email.trim().toLowerCase();
	const emailDuplicado = pacientes.some((paciente) => paciente.email.toLowerCase() === emailNormalizado);

	if (emailDuplicado) {
		alert('E-mail já cadastrado.');
		return false;
	}

	const novoPaciente = {
		nome: nome.trim(),
		email: email.trim(),
		nascimento,
		telefone: telefone.trim(),
	};

	pacientes.push(novoPaciente);
	return true;
}

function calcularIdade(dataISO) {
	const dataNascimento = new Date(`${dataISO}T00:00:00`);
	const hoje = new Date();
	let idade = hoje.getFullYear() - dataNascimento.getFullYear();
	const mesAtual = hoje.getMonth();
	const mesNascimento = dataNascimento.getMonth();

	if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())) {
		idade -= 1;
	}

	return idade;
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
	tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');

		linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
      <td>${paciente.telefone}</td>
      <td>${calcularIdade(paciente.nascimento)}</td>
    `;

		tabela.appendChild(linha);
	});

	atualizarContadorPacientes();
}

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
	event.preventDefault(); // evita o recarregamento da página

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
	const telefone = document.getElementById('telefone').value;

	const cadastrado = adicionarPaciente(nome, email, nascimento, telefone);
	if (!cadastrado) {
		return;
	}

	renderizarTabela();
	formulario.reset(); // limpa os campos do formulário
});

atualizarContadorPacientes();
