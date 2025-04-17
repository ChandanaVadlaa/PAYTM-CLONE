import React, { useState, useEffect } from "react";

function Appbar() {
  const [userName, setUserName] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name); // Set the user's name
    }
  }, []);

  const toggleProfilePopup = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // Reload to reset state
  };

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">PayTM App</div>
      <div className="flex relative">
        {userName && (
          <div
            className="flex flex-col justify-center h-full mr-4 cursor-pointer"
            onClick={toggleProfilePopup}
          >
            <div>Hello, {userName}</div>
          </div>
        )}
        <div
          className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2 cursor-pointer"
          onClick={toggleProfilePopup}
        >
          <div className="flex flex-col justify-center h-full text-xl">
            {userName ? userName[0] : "U"}
          </div>
        </div>
        {isProfileOpen && (
          <div className="absolute right-0 mt-12 bg-white shadow-md w-48 p-2 rounded-md border">
            <div className="text-gray-700 mb-2">{userName}</div>
            <button
              onClick={handleLogout}
              className="text-red-600 text-sm w-full py-1 px-2 text-left hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appbar;
