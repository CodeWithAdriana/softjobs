import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../contexts/Context.jsx";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const initialForm = { email: "docente@desafiolatam.com", password: "123456" };

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialForm);
  const { setDeveloper } = useContext(Context);

  const handleUser = (event) =>
    setUser({ ...user, [event.target.name]: event.target.value });

  const handleForm = (event) => {
    event.preventDefault();

    if (!user.email.trim() || !user.password.trim()) {
      return window.alert("Email y password obligatorias.");
    }

    if (!emailRegex.test(user.email)) {
      return window.alert("El formato del email no es correcto!");
    }

    // Llamada a la API de login con un timeout de 10 segundos
    axios
      .post("/api/login", user, { timeout: 10000 })
      .then(({ data }) => {
        window.sessionStorage.setItem("token", data.token);
        window.alert("Usuario identificado con éxito 😀.");
        setDeveloper({});
        navigate("/perfil");
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);

        // Manejo robusto de errores
        if (error.response && error.response.data) {
          window.alert(`${error.response.data.message} 🙁.`);
        } else {
          window.alert("Ocurrió un error inesperado 🙁.");
        }
      });
  };

  return (
    <form
      onSubmit={handleForm}
      className="col-10 col-sm-6 col-md-3 m-auto mt-5"
    >
      <h1>Iniciar Sesión</h1>
      <hr />
      <div className="form-group mt-1 ">
        <label>Email address</label>
        <input
          value={user.email}
          onChange={handleUser}
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter email"
        />
      </div>
      <div className="form-group mt-1 ">
        <label>Password</label>
        <input
          value={user.password}
          onChange={handleUser}
          type="password"
          name="password"
          className="form-control"
          placeholder="Password"
        />
      </div>
      <button type="submit" className="btn btn-light mt-3">
        Iniciar Sesión
      </button>
    </form>
  );
};

export default Login;
