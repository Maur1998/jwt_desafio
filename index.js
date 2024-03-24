const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const {
  agregarUsuario,
  verificarUsuario,
  obtenerDatosUsuario,
} = require("./consultas");
const { authMiddleware } = require("./auth.middleware");
const { consultaReporte } = require("./consulta.middleware");
require("dotenv").config();

app.listen(3000, console.log("Servidor iniciado"));
app.use(express.json());
app.use(cors());

app.post("/usuarios", consultaReporte, async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    const usuario = await agregarUsuario(email, password, rol, lenguage);
    return res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.post("/login", consultaReporte, async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarUsuario(email, password);
    const token = jwt.sign(
      email,
      (secretOrPrivateKey = process.env.JWT_SECRET)
    );
    const data = { res: "Usuario identificado", email: email, token: token };
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.get("/usuarios", consultaReporte, authMiddleware, async (req, res) => {
  try {
    const data = await obtenerDatosUsuario(req.user);
    const response = [data];
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});
