import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      await login(email, password);
      message.success("Successfully signed in!");

      navigate("/home");
    } catch (error) {
      message.error("Email or passoword is wrong");
    }
  };

  if (token != null) {
    navigate("/home");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
