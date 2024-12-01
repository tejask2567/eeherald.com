import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const Navigate=useNavigate()
  // Check if the user's role matches any of the allowed roles
  console.log("Checking roles in RequireAuth:", auth?.roles);
  console.log("Checking roles in allowedRoles:", allowedRoles[0]);
  if (auth?.roles === allowedRoles[0]){
    return <Outlet />
  }
  if (auth?.roles !== allowedRoles[0]){
    return (<>
        <h1>Not authorized</h1>
        <a href="/">Return home</a>
    </>)
  }
  /*return (
  auth?.roles === allowedRoles[0]
            ? <Outlet />
            : auth?.username
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />)*/
};

export default RequireAuth;
