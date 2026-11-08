# 1. GET (Listar todos os pacientes)
curl -i -X GET https://api-clinica-eduardo-xavier.onrender.com/pacientes

# 2. POST (Cadastrar novo paciente)
curl -i -X POST https://api-clinica-eduardo-xavier.onrender.com/pacientes \
-H "Content-Type: application/json" \
-d '{"nome": "Paciente Teste CLI", "email":"teste.cli@email.com", "nascimento":"1998-05-20"}'

# 3. GET por ID (Buscar o paciente criado)
curl -i -X GET https://api-clinica-eduardo-xavier.onrender.com/pacientes/4

# 4. PUT (Atualizar o paciente)
curl -i -X PUT https://api-clinica-eduardo-xavier.onrender.com/pacientes/4 \
-H "Content-Type: application/json" \
-d '{"nome": "Paciente Atualizado CLI", "email":"teste.cli@email.com", "nascimento":"1998-05-20"}'

# 5. DELETE (Remover o paciente)
curl -i -X DELETE https://api-clinica-eduardo-xavier.onrender.com/pacientes/4