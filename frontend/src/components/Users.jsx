import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    axios
      .get(`http://localhost:3000/user/bulk?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.error("Error fetching users:", error));
  }, [filter, navigate]);

  return (
    <>
      <div className="m-2 font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
}

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="px-3 flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.name[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>{user.name}</div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <button
          onClick={() => {
            navigate(`/send?id=${user._id}&name=${user.name}`);
          }}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="h-4 w-4 mr-1" />
          Send Money
        </button>
      </div>
    </div>
  );
}

export default Users;
