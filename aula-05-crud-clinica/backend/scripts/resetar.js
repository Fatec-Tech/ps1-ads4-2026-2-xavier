require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../banco');

async function resetarTabela() {
  let client;

  try {
    const scriptPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(scriptPath, 'utf8');

    console.warn('Atenção: este comando apagará todos os pacientes cadastrados.');
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS pacientes');
    await client.query(schema);
    await client.query('COMMIT');

    console.log('Tabela de pacientes recriada com sucesso.');
  } catch (erro) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (erroRollback) {
        console.error('Erro ao desfazer o reset:', erroRollback);
      }
    }
    console.error('Erro ao resetar tabela:', erro);
    process.exitCode = 1;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

resetarTabela();
