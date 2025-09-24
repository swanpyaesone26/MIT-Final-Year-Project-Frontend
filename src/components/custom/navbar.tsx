import React from 'react';
import '../../global.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouseChimney, 
  faMagnifyingGlassChart, 
  faEnvelope, 
  faClipboardList, 
  faUserSecret, 
  faArrowRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';
import GradientText from '../ui/GradientText'


const Navbar = () => {
  return (
    <>
    <div className="h-screen">
    
        {/* Grid Container */}
      <div className="grid grid-cols-11 grid-rows-8 gap-0 font-serif bg-blue-950 h-full ">


        {/* Dashboard Owner name */}
        <div className="col-start-1 col-span-8 row-start-1 row-span-1 text-white  text-left p-12 flex items-center font-semibold rounded-none">
          <h1 className="font-serif tracking-wide text-2xl">
            <GradientText
              colors={["#F09819", "#E9CE44", "#FFD200", "#F8EEBF", "#EDDE5D"]}
              animationSpeed={3}
              showBorder={false}
              className="custom-class"
            >
               WELCOME BACK! Swan Pyae Sone
            </GradientText>
            </h1>
        </div>

        {/* Weather */}
        <div className="col-start-9 col-span-3 row-start-1 row-span-1 text-white flex items-center justify-center font-semibold rounded-none">
          Weather
        </div>




          {/* Home Button */}
          <div className="col-start-1 col-span-2 row-start-2 row-span-1 text-white bg-slate-950 flex items-stretch font-semibold rounded-none">
            <button className="w-full h-full flex items-center justify-start gap-2 cursor-pointer btn btn-ghost text-white rounded hover:bg-gray-900 px-4">
              <FontAwesomeIcon icon={faHouseChimney} />
              Home
            </button>
          </div>

          {/* Market Button */}
          <div className="col-start-1 col-span-2 row-start-3 row-span-1 text-white bg-slate-950 flex items-stretch font-semibold rounded-none">
            <Link 
              to="/market" 
              className="w-full h-full flex items-center justify-start gap-2 cursor-pointer btn btn-ghost text-white rounded hover:bg-gray-900 px-4 no-underline"
            >
              <FontAwesomeIcon icon={faMagnifyingGlassChart} />
              Market
            </Link>
          </div>

          {/* Content Button */}
          <div className="col-start-1 col-span-2 row-start-4 row-span-1 text-white bg-slate-950 flex items-stretch font-semibold rounded-none">
            <button className="w-full h-full flex items-center justify-start gap-2 cursor-pointer btn btn-ghost text-white rounded hover:bg-gray-900 px-4">
              <FontAwesomeIcon icon={faEnvelope} />
              Content
            </button>
          </div>

          {/* Summary Button */}
          <div className="col-start-1 col-span-2 row-start-5 row-span-1 text-white bg-slate-950 flex items-stretch font-semibold rounded-none">
            <button className="w-full h-full flex items-center justify-start gap-2 cursor-pointer btn btn-ghost text-white rounded hover:bg-gray-900 px-4">
              <FontAwesomeIcon icon={faClipboardList} />
              Summary
            </button>
          </div>

          {/* Risk Detection Button */}
          <div className="col-start-1 col-span-2 row-start-6 row-span-1 text-white bg-slate-950 flex items-stretch font-semibold rounded-none">
            <button className="w-full h-full flex items-center justify-start gap-2 cursor-pointer btn btn-ghost text-white rounded hover:bg-gray-900 px-4">
              <FontAwesomeIcon icon={faUserSecret} />
              Risk Detection
            </button>
          </div>

          {/* Log Out Button */}
          <div className="col-start-1 col-span-2 row-start-7 row-span-2 text-white bg-slate-950 flex items-stretch font-semibold rounded-none">
            <button className="w-full h-full flex items-center justify-start gap-2 cursor-pointer btn btn-ghost text-white rounded hover:bg-gray-900 px-4">
              <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: '#ffffff' }} />
              Log Out
            </button>
          </div>




        {/* Main Content Page */}
        <div className="col-start-3 col-span-9 row-start-2 row-span-7 bg-white rounded-none">

          {/* Main content Container */}
          <div className="grid grid-cols-6 grid-rows-[auto_1fr] h-full rounded-none">
            
            {/* Title section */}
            <div className="col-start-1 col-span-6 row-start-1 rounded-none">
              <h1 className="mt-5 text-center text-3xl font-serif  text-black font-semibold">Today Hot News</h1>
            </div>
            

            


          {/* News section */}
          <div className="col-start-1 col-span-6 row-start-2 h-full w-full font-semibold rounded-none p-4">
          </div>







          </div>

      </div>

      </div>

      </div>
    </>
  );
}

export default Navbar;