import { Route, Routes } from "react-router-dom";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import Dashboard from "../dashboard";
import Users from "../users";
import AddUser from "../users/adduser";
import EditUser from "../users/edituser";

export default function MainLayout({ isSidebar, setIsSidebar }) {
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/edit-user" element={<EditUser />} />
        </Routes>
      </main>
    </div>
  );
}
