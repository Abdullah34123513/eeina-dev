import ProtectedRoute from "./ProtectedRoute";
import { createBrowserRouter } from "react-router";

import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layout/DashboardLayout";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ImportRecipe from "../pages/Recipe/Import/ImportRecipe";
import AllImportRecipe from "../pages/Recipe/Import/AllImportRecipe";
import EditRecipe from "../pages/Recipe/EditRecipe";
import AllIngredients from "../pages/Ingredient/AllIngredients";
import EditIngredient from "../pages/Ingredient/EditIngredient";
import AllUsers from "../pages/users/AllUsers";
import EditUser from "../pages/users/EditUser";
import AllRecipes from "../pages/Recipe/AllRecipes";
import AllMealTypes from "../pages/mealType/AllMealTypes";
import EditMealType from "../pages/mealType/EditMealType";
import AllHealthLabels from "../pages/healthLabels/AllHealthLabels";
import EditHealthLabel from "../pages/healthLabels/EditHealthLabel";
import AllDietLabels from "../pages/dietLabels/AllDietLabels";
import EditDietLabel from "../pages/dietLabels/EditDietLabel";
import EditCuisine from "../pages/cuisine/EditCuisine";
import AllCuisine from "../pages/cuisine/AllCuisine";
import Tags from "../pages/tags/Tags";
import NotFound from "../pages/NotFound";

const routes = createBrowserRouter([
      {
            path: "/",
            element: (
                  <ProtectedRoute>
                        <DashboardLayout />
                  </ProtectedRoute>
            ),
            children: [
                  {
                        index: true,
                        element: <Dashboard />,
                  },
                  {
                        path: "profile",
                        element: <Profile />,
                  },
                  {
                        path: "meal-types",
                        element: <AllMealTypes />,
                  },
                  {
                        path: "meal-type/edit/:id",
                        element: <EditMealType />,
                  },
                  {
                        path: "health-labels",
                        element: <AllHealthLabels />,
                  },
                  {
                        path: "health-label/edit/:id",
                        element: <EditHealthLabel />,
                  },
                  {
                        path: "diet-labels",
                        element: <AllDietLabels />,
                  },
                  {
                        path: "diet-label/edit/:id",
                        element: <EditDietLabel />,
                  },
                  {
                        path: "cuisines",
                        element: <AllCuisine />,
                  },
                  {
                        path: "cuisine/edit/:id",
                        element: <EditCuisine />,
                  },
                  {
                        path: "import-recipe",
                        element: <ImportRecipe />,
                  },
                  {
                        path: "all-import-recipes",
                        element: <AllImportRecipe />,
                  },
                  {
                        path: "all-recipes",
                        element: <AllRecipes />,
                  },
                  {
                        path: "recipe/edit/:id",
                        element: <EditRecipe />,
                  },
                  {
                        path: "ingredients",
                        element: <AllIngredients />,
                  },
                  {
                        path: "ingredient/edit/:id",
                        element: <EditIngredient />,
                  },
                  {
                        path: "users",
                        element: <AllUsers />,
                  },
                  {
                        path: "user/edit/:id",
                        element: <EditUser />,
                  },
                  {
                        path: "tags",
                        element: <Tags />,
                  },
            ],
      },
      {
            path: "/login",
            element: <Login />,
      },
      {
            path: "*",
            element: <NotFound />,
      },
]);

export default routes;
