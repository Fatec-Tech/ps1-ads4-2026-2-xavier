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
    const nomeBusca = req.query.nome;

    if (nomeBusca) {
      const query = 'SELECT * FROM pacientes WHERE nome ILIKE $1 ORDER BY id ASC';
      const values = [`%${nomeBusca}%`];

      const { rows } = await pool.query(query, values);
      return res.json(rows);
    }

    const { rows } = await pool.query('SELECT * FROM pacientes ORDER BY id ASC');
    res.json(rows);

  } catch (erro) {
    console.error('Erro ao buscar pacientes:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/pacientes/total', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM pacientes');
    res.json({ total: Number(rows[0].count) });
  } catch (erro) {
    console.error('Erro ao contar pacientes:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/pacientes/:id', async (req, res) => {
  try {
    const id = req.params.id;
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

app.post('/pacientes', async (req, res) => {
  try {
    const { nome, email, nascimento, telefone } = req.body ?? {};

    if (!nome || !email || !nascimento) {
      return res.status(400).json({ erro: 'Todos os campos (nome, email, nascimento) são obrigatórios' });
    }

    const query = 'INSERT INTO pacientes (nome, email, nascimento, telefone) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [nome, email, nascimento, telefone || null];

    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);

  } catch (erro) {
    console.error('Erro ao cadastrar paciente:', erro);

    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
    }

    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.put('/pacientes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, email, nascimento, telefone } = req.body ?? {};

    if (!nome || !email || !nascimento) {
      return res.status(400).json({ erro: 'Todos os campos (nome, email, nascimento) são obrigatórios' });
    }

    const query = 'UPDATE pacientes SET nome = $1, email = $2, nascimento = $3, telefone = $4 WHERE id = $5 RETURNING *';
    const values = [nome, email, nascimento, telefone || null, id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.json(rows[0]);

  } catch (erro) {
    console.error('Erro ao atualizar paciente:', erro);

    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está sendo usado por outro paciente' });
    }

    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.delete('/pacientes/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const { rowCount } = await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

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