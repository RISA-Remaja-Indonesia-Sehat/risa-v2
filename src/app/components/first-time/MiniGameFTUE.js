'use client';
import { useState, useEffect } from 'react';
import AvatarDialog from './AvatarDialog';
import GUIDE_DATA from './guideData';
import useAuthStore from '@/app/store/useAuthStore';
import { isDialogCompleted, markDialogComplete } from '@/lib/ftueAPI';

export default function MiniGameFTUE() {
  const [showDialog, setShowDialog] = useState(false);
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (user?.id && token) {
      checkAndShowDialog();
    }
  }, [user?.id, token]);

  const checkAndShowDialog = async () => {
    const completed = await isDialogCompleted(token, 2);
    if (!completed) {
      setTimeout(() => setShowDialog(true), 500);
    }
  };

  const handleDialogClose = async () => {
    setShowDialog(false);
    if (token) {
      await markDialogComplete(token, 2);
    }
  };

  if (!user?.id || !token) return null;

  return (
    <>
      {showDialog && (
        <AvatarDialog
          message={GUIDE_DATA.dialog2}
          onClose={handleDialogClose}
          show={showDialog}
        />
      )}
    </>
  );
}
