import { useEffect } from "react";
import { getAccessToken } from "../apis/ProjectApi";
import { TOKEN } from "../utils/constant";

const OAuthCallback = () => {
  useEffect(() => {
    const fetchAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get(TOKEN.CODE);

      if (!code) {
        console.error("No code found in URL");
        return;
      }
      try {
        const { data } = await getAccessToken(code);
        const accessToken = data.access_token;
        localStorage.setItem(TOKEN.ACCESS_TOKEN, accessToken);
        window.close();
      } catch (error) {
        console.error("Failed to get access token", error);
      }
    };

    fetchAccessToken();
  }, []);

  return <div>Processing OAuth...</div>;
};

export default OAuthCallback;
