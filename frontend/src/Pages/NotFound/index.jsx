import { Home, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const NotFoundPage = () => {
      const navigate = useNavigate();

      return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text font-sans p-4">
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-danger mb-4">
                        404
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-center">
                        Oops! Page Not Found
                  </p>
                  <p className="text-base md:text-lg text-gray-600 mb-8 text-center max-w-md">
                        Sorry, the page you are looking for does not exist, might have been removed,
                        or is temporarily unavailable.
                  </p>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                              onClick={() => navigate(-1)}
                              className="flex items-center justify-center px-6 py-3 bg-btnSecondary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition duration-300 ease-in-out"
                        >
                              <ArrowLeft size={20} className="mr-2" />
                              Go Back
                        </button>

                        <Link
                              to="/"
                              className="flex items-center justify-center px-6 py-3 bg-btnPrimary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition duration-300 ease-in-out"
                        >
                              <Home size={20} className="mr-2" />
                              Go Home
                        </Link>
                  </div>
            </div>
      );
};

export default NotFoundPage;
