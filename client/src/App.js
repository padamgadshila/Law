import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Email from "./components/Email";
import PasswordReset from "./components/PasswordReset";
import Verify from "./components/Verify";
import AddEmployee from "./components/AddEmployee";
import AddClient from "./components/AddClient";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/email", element: <Email /> },
  { path: "/verify", element: <Verify /> },
  { path: "/resetPassword", element: <PasswordReset /> },
  { path: "/addEmployee", element: <AddEmployee /> },
  { path: "/addClient", element: <AddClient /> },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
