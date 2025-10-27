const API_BASE = 'http://server-risa.vercel.app';

const getBaseUrl = () => {
  return API_BASE;
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const buildHeaders = (hasBody = false) => {
  const headers = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (!entries.length) return '';
  const qs = new URLSearchParams();
  for (const [key, value] of entries) {
    qs.set(key, String(value));
  }
  return `?${qs.toString()}`;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

const request = async (path, { method = 'GET', body, query } = {}) => {
  const base = getBaseUrl();
  const queryString = buildQueryString(query);
  const url = `${base}/api/siklusku${path}${queryString}`;

  const hasBody = body !== undefined && body !== null;
  const options = {
    method,
    headers: buildHeaders(hasBody),
  };

  if (hasBody) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return handleResponse(response);
};

const omitNil = (obj) => Object.fromEntries(Object.entries(obj || {}).filter(([, v]) => v !== undefined && v !== null && v !== ''));

const toErdCyclePayload = (payload = {}) =>
  omitNil({
    start_date: payload.start_date ?? payload.start,
    end_date: payload.end_date ?? payload.end,
    period_length: payload.period_length ?? payload.periodLength,
    cycle_length: payload.cycle_length ?? payload.cycleLength,
    predicted_start_date: payload.predicted_start_date ?? payload.predictedStart,
  });

const toErdDailyNotePayload = (payload = {}) => {
  let symptoms = payload.symptoms;
  if (Array.isArray(symptoms)) {
    symptoms = symptoms
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter((s) => s.length > 0)
      .join(', ');
  } else if (typeof symptoms === 'string') {
    symptoms = symptoms.trim();
  } else {
    symptoms = null;
  }

  const menstrual_blood = payload.menstrual_blood ?? payload.flowLevel ?? null;

  return omitNil({
    mood: payload.mood,
    story: typeof payload.story === 'string' ? payload.story : payload.story ?? null,
    symptoms,
    menstrual_blood,
    cycle_id: payload.cycle_id ?? null,
  });
};

export const getCycles = async ({ limit, before } = {}) => request('/cycles', { query: { limit, before } });

export const createCycle = async (payload) => request('/cycles', { method: 'POST', body: toErdCyclePayload(payload) });

export const updateCycle = async (id, patch) => request(`/cycles/${encodeURIComponent(id)}`, { method: 'PATCH', body: toErdCyclePayload(patch) });

export const deleteCycle = async (id) => request(`/cycles/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const getPredictions = async ({ count } = {}) => request('/cycles/predictions', { query: { count } });

export const getDailyNotes = async ({ from, to, limit } = {}) => request('/daily-notes', { query: { from, to, limit } });

export const upsertDailyNote = async (date, payload) => request(`/daily-notes/${encodeURIComponent(date)}`, { method: 'PUT', body: toErdDailyNotePayload(payload) });

export const deleteDailyNote = async (date) => request(`/daily-notes/${encodeURIComponent(date)}`, { method: 'DELETE' });

export const getInsights = async () => request('/insights');

export const recomputeInsights = async () => request('/insights/recompute', { method: 'POST' });
