import { useState } from "react";
import "./Role.css";
import { Link } from "react-router-dom";


export default function RoleSelect() {
  const [role, setRole] = useState("admin");

  return (
    <div className="bg1">
      <div className="card1">
        <h2>Please select your role</h2>
        <p className="subtitle">
          Choose the role that best describes you
        </p>

        <div className="roles">
          <div
            className={role === "admin" ? "role active" : "role"}
            onClick={() => setRole("admin")}
          >
            <span style={{ fontSize: "80px" }}>🛡️</span> {/* Increased icon size */}
            <span>Admin</span>
          </div>

          <div
            className={role === "citizen" ? "role active" : "role"}
            onClick={() => setRole("citizen")}
          >
            <span style={{ fontSize: "80px" }}>🏙️</span> {/* Increased icon size */}
            <span>User</span>
          </div>
        </div>
       <Link to="/login">
        <button className="continue">Continue</button>
        </Link>
       
      </div>
    </div>
  );
}