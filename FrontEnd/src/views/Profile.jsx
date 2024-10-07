import axios from "axios";
import Context from "../contexts/Context.jsx";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { getDeveloper, setDeveloper } = useContext(Context);

  const getDeveloperData = () => {
    const token = window.sessionStorage.getItem("token");

    axios
      .get("/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data: [user] }) => {
        setDeveloper({ ...user });
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);

        if (error.response && error.response.data) {
          console.error(error.response.data.message);
        }

        // Manejo de sesión
        window.sessionStorage.removeItem("token");
        setDeveloper(null);
        navigate("/");
      });
  };

  useEffect(getDeveloperData, []); // Ejecuta solo una vez al cargar el componente

  return (
    <div className="py-5">
      <h1>
        Bienvenido <span className="fw-bold">{getDeveloper?.email}</span>
      </h1>
      <h3>
        {getDeveloper?.rol} en {getDeveloper?.lenguage}
      </h3>
    </div>
  );
};

export default Profile;
