'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';

export default function FTUEWrapper() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ftueComplete = localStorage.getItem('ftue-complete');
    
    if (token && !ftueComplete) {
      setShowDialog(true);
      setCurrentStep(0);
    }
  }, []);

  const handleDialogClose = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setShowDialog(false);
    }
  };

  const handleTryNowClick = () => {
    localStorage.setItem('ftue-step', '2');
    router.push('/mini-game/puberty-quest');
  };

  const dialogs = [
    {
      message: GUIDE_DATA.dialog1,
      button: null
    },
    {
      message: GUIDE_DATA.dialog2,
      button: {
        label: 'Coba Sekarang',
        onClick: handleTryNowClick
      }
    }
  ];

  return (
    <>
      {showDialog && currentStep < dialogs.length && (
        <AvatarDialog
          message={dialogs[currentStep].message}
          onClose={handleDialogClose}
          show={showDialog}
          button={dialogs[currentStep].button}
        />
      )}
    </>
  );
}
