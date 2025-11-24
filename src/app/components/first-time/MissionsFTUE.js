'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';

export default function MissionsFTUE() {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ftueStep = localStorage.getItem('ftue-step');
    const ftueComplete = localStorage.getItem('ftue-complete');
    
    if (token && ftueStep === '6' && !ftueComplete) {
      setTimeout(() => {
        setShowDialog(true);
      }, 500);
    }
  }, []);

  const handleDialogClose = () => {
    setShowDialog(false);
    localStorage.setItem('ftue-complete', 'true');
  };

  return (
    <>
      {showDialog && (
        <AvatarDialog
          message={GUIDE_DATA.dialog11}
          onClose={handleDialogClose}
          show={showDialog}
        />
      )}
    </>
  );
}
