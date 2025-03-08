import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GSynergyLogo from "../../assets/Gsynergy Logo V2 Long Description.svg";
import { logout } from "../../store";

type Props = {
  onLogout: () => void; // Prop to handle logout action
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("authToken"); // Clear token on logout
    navigate("/login");
  }, [dispatch, navigate]);
  return (
    <div className="flex justify-between items-center shadow px-5">
      <img src={GSynergyLogo} alt="" className="w-60" />
      <h1 className="text-4xl font-bold">Data Viewer App</h1>
      <button
        onClick={handleLogout}
        className=" top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
