import React from "react";
import { Bell, Calendar, HelpCircle, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearEvents } from "../features/eventSlice";
import { clearSubtasks } from "../features/subtaskSlice";
import { clearTasks } from "../features/taskSlice";
import { useDispatch } from "react-redux";

function Navbar({ username }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearEvents());
    dispatch(clearSubtasks());
    dispatch(clearTasks());
    dispatch({ type: "RESET_STORE" });
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
      <div className="relative w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for anything..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-purple-600 transition-colors">
          <Calendar size={20} />
        </button>
        <button className="text-gray-500 hover:text-purple-600 transition-colors">
          <HelpCircle size={20} />
        </button>
        <div className="relative">
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          <button className="text-gray-500 hover:text-purple-600 transition-colors">
            <Bell size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-800">{username}</div>
            <div className="text-xs text-gray-500">Rajasthan, India</div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
