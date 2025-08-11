import { useState } from "react";
import { Link } from "react-router";
import { IonIcon } from "@ionic/react";
import { desktopSharp, newspaperOutline } from "ionicons/icons";

const SidebarNav = () => {
      // State to track which dropdown is open
      const [openIndex, setOpenIndex] = useState(null);

      const handleDropdown = (index) => {
            // If the same dropdown is clicked again, close it
            if (openIndex === index) {
                  setOpenIndex(null);
            } else {
                  setOpenIndex(index); // Open the clicked dropdown
            }
      };

      return (
            <>
                  <nav className="sidbar-nav">
                        <ul>
                              <li className="dashboard">
                                    <Link to="#">
                                          <div className="icon-container">
                                                <IonIcon icon={desktopSharp} />
                                          </div>
                                          <span>Dashboard</span>
                                    </Link>
                              </li>
                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 1 ? "open" : ""}`}
                                          onClick={() => handleDropdown(1)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Recipes</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 1
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="all-recipes">
                                                      All Recipes
                                                </Link>
                                          </li>
                                          <li>
                                                <Link to="all-import-recipes">
                                                      Imported Recipe
                                                </Link>
                                          </li>
                                          <li>
                                                <Link to="import-recipe">
                                                      + Import Recipe
                                                </Link>
                                          </li>
                                    </ul>
                              </li>

                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 2 ? "open" : ""}`}
                                          onClick={() => handleDropdown(2)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Ingredients</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 2
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="ingredients">
                                                      All Ingredients
                                                </Link>
                                          </li>
                                          {/* <li>
                                                <Link to="/ingredient/create">
                                                      + New Ingredients
                                                </Link>
                                          </li> */}
                                    </ul>
                              </li>

                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 3 ? "open" : ""}`}
                                          onClick={() => handleDropdown(3)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Users</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 3
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="users">
                                                      All Users
                                                </Link>
                                          </li>
                                    </ul>
                              </li>

                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 5 ? "open" : ""}`}
                                          onClick={() => handleDropdown(5)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Meal Type</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 5
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="meal-types">
                                                      All Meal Type
                                                </Link>
                                          </li>
                                          {/* <li>
                                                <Link to=/meal-type/add">
                                                      + Meal Type
                                                </Link>
                                          </li> */}
                                    </ul>
                              </li>

                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 4 ? "open" : ""}`}
                                          onClick={() => handleDropdown(4)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Health Labels</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 4
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="health-labels">
                                                      All Health Labels
                                                </Link>
                                          </li>
                                          {/* <li>
                                                <Link to=/health-label/add">
                                                      + Health Labels
                                                </Link>
                                          </li> */}
                                    </ul>
                              </li>
                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 7 ? "open" : ""}`}
                                          onClick={() => handleDropdown(7)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Diet Labels</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 7
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="diet-labels">
                                                      All Diet Labels
                                                </Link>
                                          </li>
                                          {/* <li>
                                                <Link to=/diet-label/add">
                                                      + Diet Labels
                                                </Link>
                                          </li> */}
                                    </ul>
                              </li>

                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 6 ? "open" : ""}`}
                                          onClick={() => handleDropdown(6)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Cuisine</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 6
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="cuisines">
                                                      All Cuisine
                                                </Link>
                                          </li>
                                          {/* <li>
                                                <Link to="cuisine/add">
                                                      + Cuisine
                                                </Link>
                                          </li> */}
                                    </ul>
                              </li>

                              <li>
                                    <Link
                                          to="#"
                                          className={`inner-toggle ${openIndex === 8 ? "open" : ""}`}
                                          onClick={() => handleDropdown(8)} // Handle click for the second dropdown
                                    >
                                          <div className="icon-container">
                                                <IonIcon
                                                      icon={newspaperOutline}
                                                />
                                          </div>
                                          <span>Tags</span>
                                          <i
                                                className={`fa-solid fa-chevron-left toggle-icon ${
                                                      openIndex === 8
                                                            ? "rotate"
                                                            : ""
                                                }`}
                                          ></i>
                                    </Link>
                                    <ul className="inner-drop">
                                          <li>
                                                <Link to="tags">
                                                      All Tags
                                                </Link>
                                          </li>
                                    </ul>
                              </li>
                        </ul>
                  </nav>
            </>
      );
};

export default SidebarNav;
