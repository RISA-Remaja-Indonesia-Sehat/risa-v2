'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';

export default function VaksinFTUE() {
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ftueStep = localStorage.getItem('ftue-step');
    
    if (token && ftueStep === '5') {
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
      localStorage.setItem('ftue-step', '6');
    }
  };

  const dialogs = [
    { message: GUIDE_DATA.dialog9, button: null },
    { 
      message: GUIDE_DATA.dialog10, 
      button: {
        type: 'link',
        label: 'Ke Misi Harian',
        href: '/missions',
        onBeforeNavigate: () => {
          localStorage.setItem('ftue-step', '6');
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
