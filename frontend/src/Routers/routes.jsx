/* routes.js */
import Main from "../Layout/Main";
import Explore from "../Pages/Explore/Explore";
import Planner from "../Pages/Planner/Planner";
import Lists from "../Pages/Lists/Lists";
import ProtectiveRoute from "./ProtectiveRoute";
import RecipeDetails from "../Pages/RecipeDetails/RecipeDetails";
import Saved from "../Pages/Saved/Saved";
import Profile from "../Pages/UserDashboard/Profile/Profile";
import RecipeForm from "../Pages/CustomRecipeCreateForm/CustomRecipeCreateForm";
import UserLayout from "../Layout/UserLayout";
import Creators from "../Pages/Creators/Creators";
import AllCreators from "../Pages/AllCreators/AllCreators";
import AllCategories from "../Pages/AllCategories/AllCategories";
import AllIngredients from "../Pages/AllIngredients/AllIngredients";
import UserProfileSettingLayout from "../Layout/UserProfileSettingLayout";
import ProfileSettings from "../Pages/UserDashboard/ProfileSettings/ProfileSettings";
import Feedback from "../Pages/UserDashboard/ProfileSettings/Feedback";
import ProfileDeletion from "../Pages/UserDashboard/ProfileSettings/ProfileDeletion";
import IngredientSearchResult from "../Pages/SearchResult/IngredientSearchResult";
import CategorySearchResults from "../Pages/SearchResult/CategorySearchResult";
import SearchQueryLayout from "../Layout/SearchQueryLayout";
import SearchPage from "../Pages/SearchPage/SearchPage";
import FeedLayout from "../Layout/FeedLayout";
import Feed from "../Pages/Feed/Feed";
import IngredientDetails from "../Pages/IngredientDetails/IngredientDetails";
import ListLayout from "../Layout/ListLayout";
import NotFoundPage from "../Pages/NotFound";

// Export route objects (without creating the router)
export const routeConfig = [
      {
            path: "/",
            element: <Main />,
            children: [
                  { index: true, element: <Explore /> },
                  { path: "explore", element: <Explore /> },
                  {
                        path: "planner",
                        element: (
                              <ProtectiveRoute>
                                    <Planner />
                              </ProtectiveRoute>
                        ),
                  },
                  {
                        path: "saved",
                        element: (
                              <ProtectiveRoute>
                                    <Saved />
                              </ProtectiveRoute>
                        ),
                  },
                  { path: "recipe/:id", element: <RecipeDetails /> },
                  {
                        path: "recipe/create",
                        element: (
                              <ProtectiveRoute>
                                    <RecipeForm />
                              </ProtectiveRoute>
                        ),
                  },
                  {
                        path: "recipe/edit/:id",
                        element: (
                              <ProtectiveRoute>
                                    <RecipeForm />
                              </ProtectiveRoute>
                        ),
                  },
                  { path: "creators/:id", element: <Creators /> },
                  { path: "creators", element: <AllCreators /> },
                  { path: "categories", element: <AllCategories /> },
                  { path: "ingredients", element: <AllIngredients /> },
                  { path: "ingredient/:slag", element: <IngredientSearchResult /> },
                  { path: "category/:slag", element: <CategorySearchResults /> },
                  { path: "ingredient/details/:slug/:id", element: <IngredientDetails /> },
            ],
      },
      {
            path: "feed",
            element: (
                  <ProtectiveRoute>
                        <FeedLayout />
                  </ProtectiveRoute>
            ),
            children: [{ index: true, element: <Feed /> }],
      },
      {
            path: "user",
            element: (
                  <ProtectiveRoute>
                        <UserLayout />
                  </ProtectiveRoute>
            ),
            children: [
                  {
                        path: "profile",
                        element: (
                              <ProtectiveRoute>
                                    <Profile />
                              </ProtectiveRoute>
                        ),
                  },
            ],
      },
      {
            path: "user/:id/settings",
            element: (
                  <ProtectiveRoute>
                        <UserProfileSettingLayout />
                  </ProtectiveRoute>
            ),
            children: [
                  { index: true, element: <ProfileSettings /> },
                  { path: "feedback", element: <Feedback /> },
                  { path: "delete", element: <ProfileDeletion /> },
            ],
      },
      {
            path: "search",
            element: <SearchQueryLayout />,
            children: [{ index: true, element: <SearchPage /> }],
      },
      {
            path: "lists",
            element: (
                  <ProtectiveRoute>
                        <ListLayout />
                  </ProtectiveRoute>
            ),
            children: [{ path: ":id", element: <Lists /> }],
      },
      {
            path: "*",
            element: <NotFoundPage />,
      },
];
