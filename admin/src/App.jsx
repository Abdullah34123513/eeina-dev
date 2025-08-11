import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import { getUserProfile } from "./features/user/userThunks";

import routes from "./routes/routes";
import Loader from "./components/Loader";

const App = () => {
      const dispatch = useDispatch();
      const [initialLoad, setInitialLoad] = useState(true);

      const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

      useEffect(() => {
            dispatch(getUserProfile())
                  .then(() => setInitialLoad(false))
                  .catch(() => setInitialLoad(false));
      }, [dispatch, isAuthenticated]);

      if (initialLoad) return <Loader />;

      return (
            <HelmetProvider>
                  <RouterProvider router={routes} />
                  <Toaster position="bottom-center" reverseOrder={false} />
            </HelmetProvider>
      );
};

export default App;
