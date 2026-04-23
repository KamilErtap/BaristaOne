export const unwrapData = (response) => {
  return response.data?.data || response.data;
};

export const getItems = (response) => {
  const data = unwrapData(response);
  return data.items || response.data;
};

export const getCategories = (response) => {
  const data = unwrapData(response);
  return data.categories || response.data;
};

export const getItem = (response) => {
  const data = unwrapData(response);
  return data.item || response.data;
};

export const getOrders = (response) => {
  const data = unwrapData(response);
  return data.orders || response.data;
};

export const getOrder = (response) => {
  const data = unwrapData(response);
  return data.order || response.data;
};

export const getAuthPayload = (response) => {
  return response.data?.data || response.data;
};

export const getCategory = (response) => {
  const data = unwrapData(response);
  return data.category || response.data;
};

export const getCategoryList = (response) => {
  const data = unwrapData(response);
  return data.categories || response.data;
};

export const getTable = (response) => {
  const data = unwrapData(response);
  return data.table || response.data;
};

export const getTables = (response) => {
  const data = unwrapData(response);
  return data.tables || response.data;
};