import { Navigate } from "react-router-dom";

export const AuthorizeUser = ({ children }) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }

  return children;
};
