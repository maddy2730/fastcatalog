import axios from 'axios';

 export const BASE_URL = 'https://api.fastcatalog.ai';

export const catelogListingApi = async ({ limit, offset= 0, filterData }) => {
  const payloadFilter = {
    names: [filterData.name] || [],
    data_availability: filterData.data_availability || '',
    modality: [filterData.modality ]|| [],
    personal_data_type: filterData.personal_data_type || '',
    spdx_id: filterData.spdx_id
  };
  const response = await axios.post(`${BASE_URL}/list_catalog_entries?limit=${limit || 10}&offset=${offset}`, payloadFilter);
  return response?.data;
};
