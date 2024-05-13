import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

const ApiService = {
  fetchData: async () => {
    try {
      const response = await api.get("/hi");
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching data:", error);
    }
  },
};

export default ApiService;
