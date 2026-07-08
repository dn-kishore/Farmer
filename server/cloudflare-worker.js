export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const city = url.searchParams.get("q");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    // Check if required parameters are present
    if (!city && !(lat && lon)) {
      return new Response(
        JSON.stringify({ error: "Missing parameter: lat/lon or q is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // Retrieve API key from environment secret, fallback to default if not set
    const apiKey = env.OPENWEATHER_KEY;
    
    let weatherUrl;
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    }

    try {
      const response = await fetch(weatherUrl);
      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Weather proxy failed",
          message: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }
};
