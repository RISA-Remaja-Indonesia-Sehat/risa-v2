'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';

export default function PubertyQuestFTUE() {
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ftueStep = localStorage.getItem('ftue-step');
    
    if (token && ftueStep === '2') {
      setShowDialog(true);
      setCurrentStep(0);
    }
  }, []);

  const handleDialogClose = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowDialog(false);
      localStorage.setItem('ftue-step', '3');
    }
  };

  const dialogs = [
    { message: GUIDE_DATA.dialog3, button: null },
    { message: GUIDE_DATA.dialog4, button: null },
    { 
      message: GUIDE_DATA.dialog5, 
      button: {
        type: 'link',
        label: 'Baca Artikel',
        href: '/article/5',
        onBeforeNavigate: () => {
          localStorage.setItem('ftue-step', '3');
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
