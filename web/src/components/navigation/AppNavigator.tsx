import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// import { joinClasses } from "../../utils/helpers";
import { AuthPage, HomePage, SetUpPage } from "../../pages";
import { useAuth } from "../../providers/AuthProvider";
import { Pages } from "../../utils/constants";
import Loading from "../common/Loading";

export default function AppNavigator() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <Loading />;
  }

  return (
    <>
      <Router>
        {/* Main content area */}
        <main className="h-full">
          <Routes>
            <Route path={Pages.AUTH} element={<AuthPage />} />
            <Route
              path={`${Pages.HOME}`}
              element={user ? <HomePage /> : <Navigate to={Pages.AUTH} />}
            />
            <Route path={Pages.SETUP} element={<SetUpPage />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}
