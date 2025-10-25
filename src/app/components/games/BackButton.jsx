import React from 'react'
import { ArrowBigLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const handleBack = () => {
  const navigate = useNavigate();
  navigate("/mini-game");
}


const BackButton = () => {
  return (
    <div>
         <button
             id="backBtn"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-400 text-white shadow-md hover:shadow-lg hover:bg-pink-500 transition-all duration-300 transform hover:-translate-x-1"
            onClick={handleBack} 
                        >
                           <ArrowBigLeft size={24} />
                        </button>
    </div>
  )
}

export default BackButton