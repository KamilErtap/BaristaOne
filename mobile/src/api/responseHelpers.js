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

export const getOrders = (response) => {
  return (
    response?.data?.data?.orders ||
    response?.data?.orders ||
    response?.data?.data ||
    []
  );
};

export const getTable = (response) => {
  return (
    response?.data?.data?.table ||
    response?.data?.table ||
    response?.data?.data ||
    null
  );
};