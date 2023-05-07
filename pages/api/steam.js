import axios from "axios";

export default async function handler(req, res) {
  const query = req.query;
  const steam_api_key = process.env.STEAM_API_KEY;
  
  if (query.type) {
    if (query.type == "wishlist") {
      if (query.steamid) {
        const wishlistUrl = `https://store.steampowered.com/wishlist/profiles/${query.steamid}/wishlistdata/`
        try {
          let response = await axios.get(wishlistUrl, {
            params: {
              p: query.page || 0,
            }
          });
          // console.log(response.data);
          res.status(200).json(response.data);
        } catch(error) {
          res.status(500).json(error);
        }
      }
    }
    else if (query.type == "appinfo") {
      if (query.appid) {
        try {
          const appInfoUrl = "https://store.steampowered.com/api/appdetails"
          let response = await axios.get(appInfoUrl, {
            params: {
              appids: query.appid,
            },
          });
          // console.log(response.data);
          res.status(200).json(response.data);
        }
        catch(error) {
          // console.error(error);
          res.status(500).json(error);
        }
      }
    }
  }
  // console.log(query);
  // res.status(200).json(query);
}