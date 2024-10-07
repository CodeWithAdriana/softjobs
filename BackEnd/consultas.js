const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "6K!U?ñxiYk7T7P7Q7pZ$Aa~Y2"; // Clave secreta para JWT

// Configuración de la conexión a la base de datos
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "1234", // Cambia esto si tienes otra contraseña
    database: "softjobs",
    port: "5432",
});

// Función para verificar credenciales de usuario
const verificarCredenciales = async (email, password) => {
    try {
        const consulta = "SELECT * FROM usuarios WHERE email = $1";
        const values = [email];
        const { rows, rowCount } = await pool.query(consulta, values);

        if (!rowCount) {
            throw {
                code: 404,
                message: "No se encontró ningún usuario con este email",
            };
        }

        const usuario = rows[0];
        const passwordCorrecta = bcrypt.compareSync(password, usuario.password);

        if (!passwordCorrecta) {
            throw {
                code: 401,
                message: "La contraseña es incorrecta",
            };
        }
    } catch (error) {
        console.error("Error al verificar credenciales:", error);
        throw error;
    }
};

// Función para obtener los usuarios registrados (ejemplo de getJobs)
const getJobs = async () => {
    try {
        const { rows: usuarios } = await pool.query("SELECT * FROM usuarios");
        return usuarios;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
};

// Función para insertar un nuevo usuario en la base de datos
const ingresarUsuario = async ({ email, password, rol, lenguage }) => {
    try {
        console.log("Datos recibidos:", email, lenguage, password, rol);
        const passwordEncriptada = bcrypt.hashSync(password, 10);
        const consulta = `
            INSERT INTO usuarios (email, password, rol, lenguage)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [email, passwordEncriptada, rol, lenguage];
        await pool.query(consulta, values);
        console.log("Usuario insertado con éxito");
    } catch (error) {
        console.error("Error al insertar usuario en la base de datos:", error);
        throw error;
    }
};

// Middleware para registrar cada solicitud
const registrarConsultaMw = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
};

// Middleware para validar el token de autenticación
const validarTokenMw = (req, res, next) => {
    const token = req.header("Authorization")?.split("Bearer ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: "Acceso denegado: Token no proporcionado" });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET_KEY);
        req.usuario = payload;
        next();
    } catch (error) {
        console.error("Error de validación de token:", error);
        res.status(401).json({ message: "Acceso denegado: Token inválido" });
    }
};

// Middleware para verificar que las credenciales estén en el cuerpo de la solicitud
const verificarCredencialesMw = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Se requieren email y contraseña" });
    }
    next();
};

module.exports = {
    verificarCredenciales,
    getJobs,
    ingresarUsuario,
    verificarCredencialesMw,
    validarTokenMw,
    registrarConsultaMw,
};
