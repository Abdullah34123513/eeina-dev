import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { openModal } from "../../app/slice/modalSlice";
import Loader from "../Components/Loader";

/**
 * A protected route component that checks if the user is authenticated.
 * If the user is authenticated, it renders the children components.
 * If the user is not authenticated, it dispatches an action to open a modal and redirects to the home page.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered if the user is authenticated.
 * @returns {ReactNode} - The rendered component.
 */
const ProtectiveRoute = ({ children }) => {
      // Access the user slice (make sure to destructure from state.user)
      const { isAuthenticated, loading } = useSelector((state) => state.user);
      const location = useLocation();
      const dispatch = useDispatch();


      if (loading) {
            return <Loader />;
      }

      if (isAuthenticated) {
            return children;
      }

      dispatch(openModal());
      return <Navigate to="/" state={{ from: location }} replace />;
};

ProtectiveRoute.propTypes = {
      children: PropTypes.node.isRequired,
};

export default ProtectiveRoute;