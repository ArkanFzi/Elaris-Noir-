"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Trash2, Search, User as UserIcon } from "lucide-react";
import { apiCall } from "@/app/lib/api";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function UsersManagement() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall("/users", {}, token!); // Assuming apiCall uses admin route prefix if handled, or we need full path
      // Wait, apiCall uses /api prefix. Our main.go registers /users under admin subrouter which has path prefix /api/users? No.
      // main.go: api = r.PathPrefix("/api").Subrouter() -> admin = api.NewRoute().Subrouter() -> admin.HandleFunc("/users")
      // So path is /api/users. Correct.
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Prevent deleting self?
    if (id === parseInt(currentUser?.id || "0")) {
      alert("You cannot delete yourself.");
      return;
    }

    if (!token || !window.confirm("Are you sure you want to delete this user? Action cannot be undone.")) return;
    try {
      await apiCall(`/users/${id}`, { method: "DELETE" }, token);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">
            Users Management
          </h1>
          <p className="text-gray-400">View and manage registered users</p>
        </div>
        <div className="bg-gold/10 px-4 py-2 rounded-lg border border-gold/20 text-gold text-sm font-medium">
          Total Users: {users.length}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-midnight-light border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-gold focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading users...</p>
        </div>
      ) : (
        <Card className="bg-midnight-light border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-gold">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">
                                                {u.first_name} {u.last_name}
                                            </div>
                                            <div className="text-sm text-gray-400">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        u.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(u.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No users found.</p>
                </div>
            )}
        </Card>
      )}
    </div>
  );
}
