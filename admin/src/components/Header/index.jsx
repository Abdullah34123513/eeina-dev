import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "../../features/user/userThunks";
import toast from "react-hot-toast";
import {IonIcon} from "@ionic/react";
import {menuSharp, power, scan, search} from "ionicons/icons"; 

const Header = ({ sidebarRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleToggle = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 768) {
      sidebarRef.current.classList.toggle("collapsed");
    } else {
      sidebarRef.current.classList.toggle("active");

      sidebarRef.current.classList.remove("collapsed"); // for mobile view
    }
  }

  const logOutHandler = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
      toast.success("Logged out successfully");
    });
  };

  
  return (
    <header className="main-header">
      <ul className="header-nav">
        <li className="dropdown-toggler" id="nav-toggler" onClick={handleToggle}>
          <IonIcon icon={menuSharp} />
        </li>
        <li className="search-container hide-xs">
          <form className="form-search">
            <input
              type="search"
              placeholder="Search Settings"
              className="fs-md"
            />
            <button type="submit">
              <IonIcon icon={search} />
            </button>
          </form>
        </li>
        <li className="scan hide-xs">
          <Link to="" className="text-white">
            <IonIcon icon={scan} />
          </Link>
        </li>

        <li className="site-logo show-xs">
          <Link to="/">EEINA</Link>
        </li>

        <li className="logout ms-auto hide-xs">
          <Link className="text-white me-2" onClick={logOutHandler}>
            <IonIcon icon={power} />
            <span className="ms-1">Logout</span>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
