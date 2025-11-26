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
      className="text-pink-400 cursor-pointer"
    >
      <ArrowBigLeft size={36} />
    </button>
  );
};

export default BackButton;