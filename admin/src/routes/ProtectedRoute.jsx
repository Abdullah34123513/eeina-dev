import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }) => {
      const { isAuthenticated, loading, user } = useSelector(
            (state) => state.user
      );
      const location = useLocation();

      if (loading) return <Loader />;
      if (
            isAuthenticated &&
            (user.role === "admin" || user.role === "super-admin")
      )
            return children;

      return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
