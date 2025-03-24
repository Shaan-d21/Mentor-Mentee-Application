import axios from "axios";
import { apiUrl } from "~/lib/env";

const baseURL = apiUrl;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  Accept: "application/json",
  withCredentials: true,
};

const api = axios.create({
  baseURL,
  ...axiosConfig,
});

export default api;
