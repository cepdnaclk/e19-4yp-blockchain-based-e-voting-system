import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="p-4 text-center text-black bg-white">

      <h2 className="text-2xl mb-4">Login</h2>
      <button onClick={() => navigate("/voter")} className="m-2 px-4 py-2 bg-blue-500 text-black rounded">
        Login as Voter
      </button>
      <button onClick={() => navigate("/admin")} className="m-2 px-4 py-2 bg-green-500 text-black rounded">
        Login as Admin
      </button>
    </div>
  );
}
