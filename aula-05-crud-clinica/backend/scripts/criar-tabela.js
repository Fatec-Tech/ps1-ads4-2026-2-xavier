require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../banco');

async function criarTabela() {
  try {
    const scriptPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(scriptPath, 'utf8');
    
    await pool.query(sql);
    console.log('Tabela de pacientes verificada/criada com sucesso no Supabase!');
  } catch (erro) {
    console.error('Erro ao criar tabela:', erro);
  } finally {
    pool.end();
  }
}

criarTabela();
