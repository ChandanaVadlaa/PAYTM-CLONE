import React from "react";
import Appbar from "../components/Appbar";
import Users from "../components/Users";
import Balance from "../components/Balance";

function Dashboard() {
  return (
    <>
      <Appbar />
      <Balance />
      <Users />
    </>
  );
}

export default Dashboard;
