const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "pgadmin",
  database: "softjobs",
  allowExitOnIdle: true,
});

const agregar = async (email, password, rol, lenguage) => {
  const consultaId = "SELECT id FROM usuarios ORDER BY id DESC LIMIT 1";
  const insertarUsuario = "INSERT INTO usuarios VALUES ($1,$2,$3,$4,$5)";
  const usuarioExiste = "SELECT * FROM usuarios WHERE email = $1";
  password = bcrypt.hashSync(password);
  const { rows } = await pool.query(usuarioExiste, [email]);
  if (rows.length > 0) {
    console.log("usuario existente");
    return "Usuario existente";
  } else {
    const { rows } = await pool.query(consultaId);
    if (rows.length == 0) {
      var id = 1;
    } else {
      var id = rows.length + 1;
    }
    const datos = [id, email, password, rol, lenguage];
    await pool.query(insertarUsuario, datos);
    console.log("Usuario Agregado Exitosamente");
    return "Usuario Agregado Exitosamente";
  }
};

const verificar = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptado } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptado);
  if (!rowCount || !passwordEsCorrecta) {
    throw {
      code: 404,
      message: "Usuario no registrado, por ffavor verifique los datos",
    };
  }
  console.log("Usuario verificado");
  return "Usuario verificado";
};

const obtenerData = async (email) => {
  const consultaUsuario = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const {
    rows: [usuario],
  } = await pool.query(consultaUsuario, values);
  const { rol, lenguage } = usuario;
  return { email: email, rol: rol, lenguage: lenguage };
};

module.exports = { agregar, verificar, obtenerData };
