import axios from "axios";

const { data: IP } = await axios.get("https://api.ipify.org/");

console.log("[IP]", IP);

async function createSession(axiosInstance) {
  const login = await axiosInstance.post("/login", {
    email: process.env.email,
    password: process.env.password,
  });
  
  console.log("[login]", login);

  const sessionDetails = login.headers["set-cookie"][0];
  const cookieFormatted = `${sessionDetails};game-api-url=${login.swaggerUrl};game-api-token=${login.temporaryAPIToken}`;

  axiosInstance.defaults.headers.cookie = cookieFormatted;

  return axiosInstance;
}

async function getToken() {
  const axiosConfig = axios.create({ baseURL: "https://developer.clashofclans.com/api" });
  const axiosSession = await createSession(axiosConfig);

  const {
    data: { keys: existingKeys },
  } = await axiosSession.post("/apikey/list");

  for (let i = 0; i < existingKeys.length; i++) {
    const key = existingKeys[i];
    if (key.cidrRanges.includes(IP)) {
      return key.key;
    } else {
      await axiosSession.post("/apikey/revoke", {
        id: key.id,
      });
    }
  }

  const { data: key } = await axiosSession.post("/apikey/create", {
    name: "New Key",
    description: "Key for production service!",
    cidrRanges: [IP],
  });

  return key;
}

export default getToken;
