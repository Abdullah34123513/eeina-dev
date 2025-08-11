import { useEffect, useState, useMemo } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../app/slice/useSlice";
import Loader from "./Components/Loader";
// import useDynamicTags from "./Functions/useDynamicTags";
import { useLang } from "./context/LangContext";
import { routeConfig } from "./Routers/routes";

const App = () => {
      // useDynamicTags();
      const dispatch = useDispatch();
      const [initialLoad, setInitialLoad] = useState(true);
      const { isArabic } = useLang();
      const lang = isArabic ? "ar" : "en";
      const isAuthenticated = useSelector(state => state.user.isAuthenticated);

      // Automatically redirect from domain.com to /en or /ar
      useEffect(() => {
            const pathParts = window.location.pathname.split("/").filter(Boolean);
            const currentPrefix = pathParts[0];

            // If at root path or invalid lang prefix
            if (!currentPrefix || (currentPrefix !== "en" && currentPrefix !== "ar")) {
                  const newLang = isArabic ? "ar" : "en";
                  const restOfPath = pathParts.slice(1).join("/");
                  const redirectTo = `/${newLang}${restOfPath ? `/${restOfPath}` : ""}`;

                  window.location.replace(redirectTo);
            }
      }, [isArabic]);

      // Re-create router when lang changes
      const router = useMemo(
            () => createBrowserRouter(routeConfig, { basename: `/${lang}` }),
            [lang]
      );

      // Sync URL prefix if changed while navigating
      useEffect(() => {
            if (!initialLoad) {
                  const [, current, ...rest] = window.location.pathname.split('/');
                  if ((current === 'en' || current === 'ar') && current !== lang) {
                        const newPath = `/${lang}/${rest.join('/')}`;
                        window.history.replaceState(null, '', newPath);
                        window.location.reload();
                  }
            }
      }, [lang, initialLoad]);

      // Fetch user profile
      useEffect(() => {
            dispatch(getUserProfile())
                  .then(() => setInitialLoad(false))
                  .catch(() => setInitialLoad(false));
      }, [dispatch, isAuthenticated]);

      // Show loader until profile loaded
      if (initialLoad) return <Loader />;

      return (
            <div>
                  <RouterProvider key={lang} router={router} />
                  <Toaster position="bottom-center" reverseOrder={false} />
            </div>
      );
};

export default App;
