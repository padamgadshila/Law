import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../components/helpers/helper";

export const AuthorizeUser = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { status } = await auth();
        if (status === 201) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/expired" replace />;
};
