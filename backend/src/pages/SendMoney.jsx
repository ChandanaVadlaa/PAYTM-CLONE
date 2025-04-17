"use client";

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Banknote } from "lucide-react";

export default function SendMoney() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/account/transfer",
        {
          to: id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setMessage("Transfer successful!");
      setAmount("");
    } catch (error) {
      console.error("Transfer error:", error);
      setMessage("Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Send Money
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fast, secure, and easy transfers
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">Recipient</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount (in Rs)
                </label>
                <div className="mt-2 p-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Banknote
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="price-currency"
                    >
                      INR
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleTransfer}
                disabled={isLoading || !amount}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    Initiate Transfer{" "}
                    <ArrowRight
                      className="ml-2 -mr-1 h-4 w-4"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </div>
          </div>
          {message && (
            <div
              className={`px-6 py-4 ${
                message.includes("successful") ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p
                className={`text-sm ${
                  message.includes("successful")
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
