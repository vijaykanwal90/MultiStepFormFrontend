const env = 'production'; // Corrected spelling
export const BASE_URL = env === 'development' ? "http://localhost:3001/api" : "https://multistepbackend.onrender.com/api";
