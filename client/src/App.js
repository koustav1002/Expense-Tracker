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

const RootLayout = () => {
  // const { user } = useStore((state) => state);
  const user = useStore((state) => state);

  return !user ? (
    <Navigate to="/sign-in" replace={true} />
  ) : (
    <>
      <Navbar />
      <div className="min-h-[cal(h-screen-100px)]">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <main>
        <div className="w-full min-h-screen bg-gray-100 px-10 md:px-20">
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
