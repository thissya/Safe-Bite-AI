import Navbar from "./Navbar";
import { Input } from "@/components/ui/input"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "./Context";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const { userInfo, setUserInfo, Auth } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(!Auth){
      navigate('/');
    }
    async function getDetails() {
      try {
        const response = await axios.get("/profile");
        if (response.status == 200) {
          setUserInfo(response.data);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getDetails();
  }, []);

  return (
    <div className="flex bg-slate-300 h-screen w-screen">
      <Navbar/>
      <div className="flex flex-row w-full h-full items-center justify-center">
        <div className="flex flex-col h-[60vh] bg-white items-start justify-start w-[25vw] rounded-lg pl-5 pt-4 space-y-8">
          {userInfo ? (
            <div className="mx-auto w-full space-y-8 p-5">
            <div className="flex flex-row items-center justify-center">
              <Avatar>
                <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="font-extralight p-4">
                {userInfo.name}
              </div>
            </div>
            <div className="">
              <div>Age</div>
              <Input disabled placeholder={userInfo.age} />
            </div>
            <div className="">
              <div>Gender</div>
              <Input disabled placeholder={userInfo.gender} />
            </div>
            <div>
              <div>Medical Issues</div>
              <div>
                {
                  userInfo.medicalCondition.length == 0 ?
                    <li>No medical issues found</li>
                    :
                    (userInfo.medicalCondition.map((val, index) => (
                      <div key={index}>
                        <li>{val}</li>
                      </div>
                    )))
                }
              </div>
            </div>
          </div>
          ):
          (
          <div>Unexpected Error pls refresh the page</div>
          )}  
        </div>
      </div>
    </div>
  )
}
