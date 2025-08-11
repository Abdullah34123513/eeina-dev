import { Link } from "react-router";
import { IonIcon } from "@ionic/react";
import { appsOutline } from "ionicons/icons";
const SidebarHeader = () => {
      return (
            <div className="sidebar-header">
                  <div className="logo">
                        <Link to="/">
                              <IonIcon
                                    icon={appsOutline}
                                    className="logo-icon"
                              />
                              <span className="logo-text">EEINA</span>
                        </Link>
                  </div>
            </div>
      );
};

export default SidebarHeader;
