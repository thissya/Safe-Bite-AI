import Navbar from "./Navbar";
import { Input } from "@/components/ui/input"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
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

  const saveUserInfo = async() => {
    console.log(tempObj)
    const response = await axios.post('/updateMedicalCondition',tempObj);
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
      <div className="flex bg-slate-300 h-screen w-screen">
        <Navbar />
        <div className="flex flex-row w-full h-full items-center justify-center">
          <div className="flex flex-col h-[65vh] bg-white items-start justify-start w-[25vw] rounded-lg pl-5 pt-4 space-y-8 overflow-y-auto">
            {tempObj ? (
              <div className="mx-auto w-full space-y-8 p-5">
                <div className="flex flex-row items-center justify-center">
                  <Avatar>
                    <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="font-extralight p-4">
                    {tempObj.name}
                  </div>
                </div>
                <div className="">
                  <div>Age</div>
                  <Input 
                    onChange={(e) => setTempObj({ ...tempObj, age: parseInt(e.target.value) })} 
                    placeholder={tempObj.age} 
                    className='mt-4' 
                  />
                </div>
                <div className="">
                  <div>Gender</div>
                  <select 
                    value={tempObj.gender} 
                    onChange={(e) => setTempObj({ ...tempObj, gender: e.target.value })} 
                    className="p-2 mt-4 border rounded"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <div>Medical Issues</div>
                  {tempObj.medicalCondition && tempObj.medicalCondition.map((issue, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <Input
                        value={issue}
                        onChange={(e) => updateMedicalIssue(index, e.target.value)}
                        className="flex-1"
                      />
                      <button 
                        onClick={() => deleteMedicalIssue(index)} 
                        className="px-2 py-1 rounded flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    <div ref={listEndRef}/>
                    </div>
                  ))}
                  <button 
                    onClick={addMedicalIssue} 
                    className="border mt-4 px-4 py-2 rounded flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Medical Issue
                  </button>
                </div>
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={saveUserInfo} 
                    className="border mb-2 p-2 rounded flex items-center justify-center"
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

