'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';

export default function SiklusFTUE() {
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ftueStep = localStorage.getItem('ftue-step');
    
    if (token && ftueStep === '4') {
      setTimeout(() => {
        setShowDialog(true);
        setCurrentStep(0);
      }, 500);
    }
  }, []);

  const handleDialogClose = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else {
      setShowDialog(false);
      localStorage.setItem('ftue-step', '5');
    }
  };

  const dialogs = [
    { message: GUIDE_DATA.dialog7, button: null },
    { 
      message: GUIDE_DATA.dialog8, 
      button: {
        type: 'link',
        label: 'Ke Vaksin HPV',
        href: '/vaksin-hpv',
        onBeforeNavigate: () => {
          localStorage.setItem('ftue-step', '5');
        }
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
