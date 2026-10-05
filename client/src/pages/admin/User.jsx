import React, { useEffect, useState } from "react";
import { getAllUsers, blockUser } from "../../api/adminApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await getAllUsers(token);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, [token]);

  const handleBlock = async (id, isBlocked) => {
    await blockUser(id, token, !isBlocked);
    setUsers(
      users.map((u) => (u._id === id ? { ...u, isBlocked: !isBlocked } : u))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Users</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                {u.isBlocked ? "Blocked" : "Active"}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleBlock(u._id, u.isBlocked)}
                  className={`px-3 py-1 rounded ${
                    u.isBlocked ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
