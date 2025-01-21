import Navbar from "./Navbar";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "./Context";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

export default function Update() {

  const listEndRef = useRef(null);

  const { userInfo } = useUser();
  const [tempObj, setTempObj] = useState(userInfo);

  const addMedicalIssue = () => {
    setTempObj({ ...tempObj, medicalCondition: [...(tempObj.medicalCondition || []), ""] });
  };

  const updateMedicalIssue = (index, value) => {
    const updatedIssues = [...tempObj.medicalCondition];
    updatedIssues[index] = value;
    setTempObj({ ...tempObj, medicalCondition: updatedIssues });
  };

  const deleteMedicalIssue = (index) => {
    const updatedIssues = tempObj.medicalCondition.filter((_, i) => i !== index);
    setTempObj({ ...tempObj, medicalCondition: updatedIssues });
  };

  const saveUserInfo = async () => {
    console.log(tempObj);
    const response = await axios.post('/updateMedicalCondition', tempObj);
    console.log(response);
    console.log("User information saved:", tempObj);
  };

  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("listEndRef is not set");
    }
  }, [tempObj]);

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className="flex flex-row w-full h-full items-center justify-center">
          <div className="flex flex-col h-[65vh] bg-neutral-900 text-neutral-300 items-start justify-start w-[25vw] rounded-lg pl-5 pt-4 space-y-8 overflow-y-auto">
            {tempObj ? (
              <div className="mx-auto w-full space-y-8 p-5">
                <div className="flex flex-row items-center justify-center">
                  <Avatar>
                    <AvatarFallback className="text-neutral-900 font-bold">{userInfo.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-purple-500 text-xl p-4">{tempObj.name}</div>
                </div>
                <div className="text-neutral-200 font-semibold">
                  <div className="my-2">Age</div>
                  <Input 
                    onChange={(e) => setTempObj({ ...tempObj, age: parseInt(e.target.value) })} 
                    placeholder={tempObj.age} 
                    className=" text-neutral-200" 
                  />
                </div>
                <div className="text-neutral-200 font-semibold">
                  <div className="">Gender</div>
                  <select 
                    value={tempObj.gender} 
                    onChange={(e) => setTempObj({ ...tempObj, gender: e.target.value })} 
                    className="p-2 mt-1 border rounded text-neutral-300 bg-neutral-900" 
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="text-neutral-200">
                  <div className="my-1 font-semibold">Medical Issues</div>
                  {tempObj.medicalCondition && tempObj.medicalCondition.map((issue, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-4">
                      <Input
                        value={issue}
                        onChange={(e) => updateMedicalIssue(index, e.target.value)}
                        className="flex-1 text-neutral-200"
                      />
                      <button 
                        onClick={() => deleteMedicalIssue(index)} 
                        className="px-2 py-1 rounded flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addMedicalIssue} 
                    className="border mt-4 px-4 py-2 rounded flex items-center justify-center font-semibold text-neutral-50"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Medical Issue
                  </button>
                </div>
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={saveUserInfo} 
                    className="border mb-2 p-2 rounded flex items-center justify-center font-semibold text-neutral-50"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div>Unexpected Error. Please refresh the page.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
