import axios from "axios";

const API_KEY = "55677737-862d1a0c317a7b252ed3feed4";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: 15,
      page: page,
    },
  });

  return response.data;
}