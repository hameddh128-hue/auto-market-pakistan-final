import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getUsers, toggleBanUser, deleteUser } from "../../lib/admin";
import toast from "react-hot-toast";
import { FiSlash, FiCheck, FiTrash2 } from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setUsers(await getUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBan = async (id, currentlyBanned) => {
    try {
      await toggleBanUser(id, currentlyBanned);
      fetchUsers();
      toast.success("User status updated");
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user and all their ads?")) return;
    try {
      await deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <AdminLayout title="Manage Users">
      <h1 className="font-display text-2xl font-bold">Manage Users</h1>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 bg-sand text-xs uppercase text-slate-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {!loading && users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${u.is_banned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {u.is_banned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role !== "admin" && (
                    <div className="flex gap-2">
                      <button onClick={() => toggleBan(u.id, u.is_banned)} className="rounded border border-ink/15 p-1.5 hover:border-amber" title={u.is_banned ? "Unban" : "Ban"}>
                        {u.is_banned ? <FiCheck /> : <FiSlash />}
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)} className="rounded border border-red-200 p-1.5 text-red-600 hover:bg-red-50" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-4 text-sm text-slate-muted">Loading users...</p>}
      </div>
    </AdminLayout>
  );
}
