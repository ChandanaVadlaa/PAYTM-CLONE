import React, { useState, useEffect } from "react";
import axios from "axios";

function Balance() {
  const [balance, setBalance] = useState(null); // Store balance
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle any errors

  // Fetch balance when the component mounts
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get(
          "http://localhost:3000/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        setBalance(response.data.balance); // Assuming the balance is in the response data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch balance.");
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex p-4">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">Rs {balance}</div>
    </div>
  );
}

export default Balance;
