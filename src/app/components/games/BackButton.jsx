import React from "react";
import { ArrowBigLeft } from "lucide-react";

import { useRouter } from "next/navigation"; 

const BackButton = () => {

  const router = useRouter(); 

  const handleBack = () => {
  
    router.push("/mini-game"); 
  };

  return (
    <button
      id="backBtn"
      onClick={handleBack} 
      className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-400 text-white"
    >
      <ArrowBigLeft size={24} />
    </button>
  );
};

export default BackButton;