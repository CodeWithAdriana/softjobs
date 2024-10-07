const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const {
    getJobs,
    verificarCredenciales,
    ingresarUsuario,
    registrarConsultaMw,
    validarTokenMw,
    verificarCredencialesMw,
} = require("./consultas");

const JWT_SECRET_KEY = "6K!U?ñxiYk7T7P7Q7pZ$Aa~Y2";

// Configurar middlewares
app.use(cors());  // Habilita CORS para evitar problemas de origen cruzado
app.use(express.json()); // Middleware para parsear JSON en el body de las solicitudes
app.use(registrarConsultaMw); // Middleware personalizado

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

// Ruta para iniciar sesión y obtener un token
app.post("/login", verificarCredencialesMw, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: "1h" }); // Token expira en 1 hora
        console.log("Token generado en login:", token);
        res.json({ token });
    } catch (error) {
        console.error("Error en /login:", error);
        res.status(error.code || 500).send({ message: error.message || "Error interno del servidor" });
    }
});

// Ruta protegida para obtener la lista de usuarios
app.get("/usuarios", validarTokenMw, async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        const payload = jwt.verify(token, JWT_SECRET_KEY); // Verifica el token con la clave secreta
        console.log("Payload:", payload);

        const usuarios = await getJobs(); // Obtenemos los trabajos desde la función getJobs
        res.json(usuarios);
    } catch (error) {
        console.error("Error en /usuarios:", error);
        res.status(error.code || 500).send({ message: error.message || "Error interno del servidor" });
    }
});

app.post("/usuarios", async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;

        if (!email || !password || !rol || !lenguage) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        await ingresarUsuario(req.body);
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error en /usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

