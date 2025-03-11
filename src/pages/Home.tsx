import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const {isAuthenticated} = useAuth()
  return (
    <div className=" bg-gray-100 dark:bg-green-700">
      {/* Hero Section */}
      <header className="bg-linear-to-bl from-green-500 to-green-600  text-white text-center py-16 px-6">
        <h1 className="text-5xl font-extrabold">Segunda mano y anuncios gratis PUJATON</h1>
        <p className="mt-4 text-lg">
          Vende y compra tus productos usados al mejor precio.
        </p>
        {!isAuthenticated &&
        <Link
          to="/register"
          className="mt-6 inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          Entra, compra y vende!
        </Link>
}
      </header>

      {/* Beneficios de la plataforma */}
      <section className="max-w-6xl mx-auto py-4 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
         COMPRA Y VENDE
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Descubre las ventajas de registrarte en nuestra plataforma.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 mt-10">
          {/* Beneficio 1 */}
          <div className="bg-white dark:bg-linear-to-bl from-green-800 to-green-950 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">💸 Encuentra Los Mejores Precios</h3>
            <p className="text-gray-600 dark:text-gray-100 mt-2">
              Encuentra los mejores precios y mejores productos en el mercado de la segunda mano.
            </p>
          </div>

          {/* Beneficio 2 */}
          <div className="bg-white dark:bg-linear-to-bl from-green-800 to-green-950 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">🌐 Conectate Al Mundo</h3>
            <p className="text-gray-600 dark:text-gray-100 mt-2">
              Conectate con personas de todo el mundo y forma la comunidad que te ayudara a vender todos tus productos.
            </p>
          </div>
        </div>

{!isAuthenticated &&
        <Link
          to="/register"
          className="mt-10 inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-500 transition hover:text-white"
        >
          ¡Regístrate Ahora!
        </Link>
} 
      </section>
    </div>
  );
}

export default Home;
