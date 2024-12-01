import { Outlet } from "react-router-dom";
import AdminFooter from "../Admin/AdminFooter";
import AdminHeader from "../Admin/AdminHeader";
;

const AdminLayout = () => {
  console.log("Rendering AdminLayout");

  return (
    <>
      <AdminHeader />
      <div>
        <Outlet/>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminLayout;
