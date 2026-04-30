export const getAuthPayload = (response) => {
  return response?.data?.data || response?.data || {};
};

export const getItems = (response) => {
  return (
    response?.data?.data?.items ||
    response?.data?.items ||
    response?.data?.data ||
    []
  );
};

export const getCategories = (response) => {
  return (
    response?.data?.data?.categories ||
    response?.data?.categories ||
    response?.data?.data ||
    []
  );
};

export const getItem = (response) => {
  return (
    response?.data?.data?.item ||
    response?.data?.item ||
    response?.data?.data ||
    null
  );
};