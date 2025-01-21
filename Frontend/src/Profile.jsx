import Navbar from "./Navbar";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./Context";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { userInfo, setUserInfo, Auth } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth) {
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
    <div className="h-screen flex items-center justify-center bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Navbar />
      <div className="flex flex-row w-full h-full items-center justify-center">
        <div className="flex flex-col h-[65vh] bg-neutral-900 text-neutral-300 items-start justify-start w-[25vw] rounded-lg pl-5 pt-4 space-y-8 overflow-y-auto">
          {userInfo ? (
            <div className="mx-auto w-full space-y-8 p-5">
              <div className="flex flex-row items-center justify-center">
                <Avatar>
                  <AvatarFallback className="text-neutral-900 font-bold">{userInfo.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="font-semibold text-purple-500 text-xl p-4">{userInfo.name}</div>
              </div>
              <div className="text-neutral-100 font-semibold">
                <div className="my-3">Age</div>
                <Input disabled placeholder={userInfo.age} />
              </div>
              <div className="text-neutral-100 font-semibold">
                <div className="my-3">Gender</div>
                <Input disabled placeholder={userInfo.gender} />
              </div>
              <div className="text-neutral-50">
                <div className="my-3">Medical Issues</div>
                <div className="h-32 overflow-y-auto max-h-[200px]"> {/* Added max height and scrolling */}
                  {userInfo.medicalCondition.length === 0 ? (
                    <li>No medical issues found</li>
                  ) : (
                    userInfo.medicalCondition.map((val, index) => (
                      <div key={index}>
                        <li>{val}</li>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>Unexpected Error, please refresh the page</div>
          )}
        </div>
      </div>
    </div>
  );
}
