import { useNavigate } from "react-router";
import "../../assets/css/notfound.css"; // Create this CSS file

const NotFound = () => {
      const navigate = useNavigate();

      return (
            <div className="not-found-container">
                  <h1>404</h1>
                  <h2>Page Not Found</h2>
                  <p>We couldn't find the page you're looking for.</p>
                  <div className="button-group">
                        <button onClick={() => navigate(-1)}>Go Back</button>
                        <button onClick={() => navigate("/")}>Home</button>
                  </div>
            </div>
      );
};

export default NotFound;
