import { useNavigate } from "react-router-dom";


function VerticalNavbar(){
    const navigate = useNavigate();
    return (
        <nav className =" mb-20 flex items-center justify-between py-6">
            <div className = "flex flex-shrink-0  items-center">
                <h2 className="mx-2 text-purple-400 text-l font-bold font-mono ">Food Sentinal AI </h2>
            </div>
            <div className="m-8 flex items-center justify-center gap-4 text-base font-mono">
                <span className="text-purple-300" onClick={()=>{navigate('/Home')}}>Home</span>
                <span className="text-purple-300" onClick={()=>{navigate('/about')}}>About</span>
                <span className="text-purple-300" onClick={()=>{navigate('/contact')}}>Contact</span>
                {/* <span className="text-white" onClick={()=>{navigate('login')}}>Login/signup</span> */}

            </div>
        </nav>
    );
}

export default VerticalNavbar;