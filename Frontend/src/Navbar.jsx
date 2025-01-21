import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faCog,faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useUser } from "./Context";


const Navbar = () => {
  const { userInfo, setAuth, setToken, setUserInfo, setUserId } = useUser();
  const nav = useNavigate();

  const handleLogout = ()=>{
    setAuth(false);
    setToken('');
    setUserInfo(null);
    setUserId(null);
    nav('/signup');
  };

  return (
    <>
      <div className="h-screen w-[20vh] flex flex-row bg-purple-900 justify-center">
        <div className="space-y-8 mt-20">
          <button className="flex items-center space-x-2">
            {userInfo &&
              <>
                <Avatar>
                  <AvatarFallback className="text-neutral-950 bg-purple-100 font-bold">{userInfo.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="font-bold text-white">{userInfo.name}</div>
              </>
            }
          </button>
          <button className="flex items-center justify-end space-x-3 mt-5" onClick={() => { nav('/profile') }}>
            <FontAwesomeIcon icon={faUser} className="text-xl" />
            <div className="font-semibold text-neutral-300">Profile</div>
          </button>
          <button className="flex items-center justify-end space-x-3" onClick={() => { nav("/update") }}>
            <FontAwesomeIcon icon={faCog} className="text-xl" />
            <div className="font-semibold text-neutral-300">Update</div>
          </button>
          <button className="flex items-center justify-end space-x-3" onClick={() => { nav('/chatbot') }}>
            <FontAwesomeIcon icon={faRobot} className="text-xl" />
            <div className="font-semibold text-neutral-300">ChatBot</div>
          </button>
          <button className="flex items-center justify-end space-x-3" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="text-xl"/>
            <div className="font-semibold text-neutral-300">Logout</div>
          </button>
        </div>
      </div>
    </>
  );
};


export default Navbar;
