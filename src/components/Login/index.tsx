import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../../store/index";
import GSynergyLogo from "../../assets/Gsynergy Logo V2 Long Description.svg";

const dummyCredentials = {
  username: "admin",
  password: "password123",
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username === dummyCredentials.username &&
      password === dummyCredentials.password
    ) {
      dispatch(login(username));
      // Set session timeout
      setTimeout(() => {
        dispatch(logout());
        navigate("/login");
      }, SESSION_TIMEOUT);
      navigate("/store"); // Redirect to planning page after login
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <img className="w-60 mx-auto mb-10" src={GSynergyLogo} alt="GSynergyLogo" />
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 bg-gray-100 rounded shadow"
        >
          <h2 className="text-xl font-bold mx-auto w-max">Login</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border p-2 w-full rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
