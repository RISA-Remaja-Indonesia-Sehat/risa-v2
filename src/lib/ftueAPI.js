const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server-risa.vercel.app';

export async function getFTUEProgress(token) {
  try {
    const response = await fetch(`${API_URL}/api/ftue/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch FTUE progress');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching FTUE progress:', error);
    return null;
  }
}

export async function markDialogComplete(token, dialogNumber) {
  try {
    const response = await fetch(`${API_URL}/api/ftue/mark-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dialogNumber }),
    });
    if (!response.ok) throw new Error('Failed to mark dialog complete');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error marking dialog complete:', error);
    return null;
  }
}

export async function isDialogCompleted(token, dialogNumber) {
  try {
    const response = await fetch(
      `${API_URL}/api/ftue/is-completed?dialogNumber=${dialogNumber}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error('Failed to check dialog completion');
    const data = await response.json();
    return data.completed;
  } catch (error) {
    console.error('Error checking dialog completion:', error);
    return false;
  }
}
