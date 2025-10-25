import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import AccountPage from "./pages/AccountPage";
import useStore from "./store/index";
import Navbar from "./components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const RootLayout = () => {
  const { user } = useStore((state) => state);

  const token = localStorage.getItem("token");

  let isValid = false;

  if (token) {
    try {
      const decoded = jwtDecode(token.split(" ")[1]); // remove "Bearer "
      const now = Date.now() / 1000;
      isValid = decoded.exp > now;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  return !user || !isValid ? (
    <Navigate to="/sign-in" replace={true} />
  ) : (
    <>
      <Navbar />
      <div className="min-h-[calc(h-screen-100px)]">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  const { theme } = useStore((state) => state);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    console.log(document.body.classList);
  }, [theme]);
  return (
    <BrowserRouter>
      <main>
        <div className="w-full min-h-screen bg-gray-100 px-10 md:px-20 dark:bg-slate-900">
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Navigate to="/overview" />} />
              <Route path="/overview" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
