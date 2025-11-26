'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';
import useAuthStore from '@/app/store/useAuthStore';
import { isDialogCompleted, markDialogComplete } from '@/lib/ftueAPI';

export default function MissionsFTUE() {
  const [showDialog, setShowDialog] = useState(false);
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (user?.id && token) {
      checkAndShowDialog();
    }
  }, [user?.id, token]);

  const checkAndShowDialog = async () => {
    const completed = await isDialogCompleted(token, 4);
    if (!completed) {
      setTimeout(() => setShowDialog(true), 500);
    }
  };

  const handleDialogClose = async () => {
    setShowDialog(false);
    if (token) {
      await markDialogComplete(token, 4);
    }
  };

  return (
    <>
      {showDialog && (
        <AvatarDialog
          message={GUIDE_DATA.dialog4}
          onClose={handleDialogClose}
          show={showDialog}
        />
      )}
    </>
  );
}
