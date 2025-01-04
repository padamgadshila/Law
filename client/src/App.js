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
import AddClientDocuments from "./components/AddClientDocuments";
import Admin from "./components/Admin";
import { AuthorizeUser } from "./middlewares/auth";
import Employee from "./components/Employee";
import Session from "./components/Session";
import EditClient from "./components/EditClient";
import EditEmployee from "./components/EditEmployee";
import UpdateProfile from "./components/UpdateProfile";
import Dashboard from "./components/Dashboard";

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
  {
    path: "/addEmployee",
    element: (
      <AuthorizeUser>
        <AddEmployee />
      </AuthorizeUser>
    ),
  },
  {
    path: "/addClient",
    element: (
      <AuthorizeUser>
        <AddClient />
      </AuthorizeUser>
    ),
  },
  {
    path: "/addClientDocuments",
    element: (
      <AuthorizeUser>
        <AddClientDocuments />
      </AuthorizeUser>
    ),
  },
  {
    path: "/admin",
    element: (
      <AuthorizeUser>
        <Admin />
      </AuthorizeUser>
    ),
  },
  {
    path: "/employee",
    element: (
      <AuthorizeUser>
        <Employee />
      </AuthorizeUser>
    ),
  },
  { path: "/expired", element: <Session /> },

  {
    path: "/edit",
    element: (
      <AuthorizeUser>
        <EditClient />
      </AuthorizeUser>
    ),
  },
  {
    path: "/editEmployee",
    element: (
      <AuthorizeUser>
        <EditEmployee />
      </AuthorizeUser>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <UpdateProfile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/d",
    element: <Dashboard />,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
