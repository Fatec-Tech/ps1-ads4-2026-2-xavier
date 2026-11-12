require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./banco');

const app = express();

app.use(cors());          
app.use(express.json());  

let proximoId = 4;

app.get('/pacientes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pacientes ORDER BY id ASC');
    res.json(rows);
  } catch (erro) {
    console.error('Erro ao buscar pacientes:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/pacientes/total', (req, res) => {
  res.json({ total: pacientes.length });
});

//Buscar um paciente pelo ID (GET)
app.get('/pacientes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // O $1 é uma variável segura para evitar ataques de SQL Injection
    const { rows } = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.json(rows[0]);
  } catch (erro) {
    console.error('Erro ao buscar paciente:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ROTA 3: Cadastrar novo paciente (POST)
app.post('/pacientes', async (req, res) => {
  try {
    // Extrai os dados do corpo da requisição
    const { nome, email, nascimento } = req.body ?? {};

    // Validação básica
    if (!nome || !email || !nascimento) {
      return res.status(400).json({ erro: 'Todos os campos (nome, email, nascimento) são obrigatórios' });
    }

    // Comando SQL para inserir e já retornar o registro criado (RETURNING *)
    const query = 'INSERT INTO pacientes (nome, email, nascimento) VALUES ($1, $2, $3) RETURNING *';
    const values = [nome, email, nascimento];

    const { rows } = await pool.query(query, values);

    // Retorna status 201 (Created) e o objeto do paciente com o novo ID gerado pelo banco
    res.status(201).json(rows[0]);

  } catch (erro) {
    console.error('Erro ao cadastrar paciente:', erro);
    
    // O código '23505' é o padrão do PostgreSQL para violação de valores únicos (UNIQUE)
    // Isso resolve o problema de e-mails duplicados sem precisarmos fazer um SELECT antes!
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
    }
    
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ROTA 4: Atualizar um paciente (PUT)
app.put('/pacientes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, email, nascimento } = req.body ?? {};

    // Validação básica
    if (!nome || !email || !nascimento) {
      return res.status(400).json({ erro: 'Todos os campos (nome, email, nascimento) são obrigatórios' });
    }

    // Comando SQL para atualizar (UPDATE) e retornar os novos dados (RETURNING *)
    const query = 'UPDATE pacientes SET nome = $1, email = $2, nascimento = $3 WHERE id = $4 RETURNING *';
    const values = [nome, email, nascimento, id];

    const { rows } = await pool.query(query, values);

    // Se o UPDATE não afetar nenhuma linha, significa que o ID não existe
    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    // Retorna o paciente atualizado com sucesso
    res.json(rows[0]);

  } catch (erro) {
    console.error('Erro ao atualizar paciente:', erro);
    
    // Tratamento para caso tente usar um e-mail que já pertence a outro paciente
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está sendo usado por outro paciente' });
    }
    
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ROTA 5: Excluir um paciente (DELETE)
app.delete('/pacientes/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Comando SQL para excluir. A propriedade rowCount diz quantas linhas foram afetadas
    const { rowCount } = await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);

    // Se rowCount for 0, significa que nenhum paciente tinha aquele ID
    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    // Retorna 204 No Content (sucesso, mas sem conteúdo no corpo da resposta)
    res.status(204).send();

  } catch (erro) {
    console.error('Erro ao excluir paciente:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});