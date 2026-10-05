import axios from "axios";

export const getDistanceInKm = async (origin, destination) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    const res = await axios.get(url);
    const data = res.data;

    if (data.rows[0].elements[0].status !== "OK") {
      throw new Error("Distance not found");
    }

    // meters → km
    const distanceInMeters = data.rows[0].elements[0].distance.value;
    return distanceInMeters / 1000;
  } catch (error) {
    console.error("Google Maps Error:", error.message);
    return null; // fallback
  }
};
