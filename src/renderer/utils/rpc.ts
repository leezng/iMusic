import call from 'main/call';

export { call };

export const getPreferences = async () => {
  const data = await call.sendToMain('get-preferences');
  return data;
};

export const setPreferences = async (data = {}) => {
  await call.sendToMain('set-preferences', data);
  return true;
};
