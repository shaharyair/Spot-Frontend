const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ENDPOINTS = {
  // get all the songs in acrcloud
  database_songs: "/database_songs",

  // upload a song to acrcloud
  upload_song: "/upload_song",

  // delete a song from acrcloud
  delete_song: "/delete_song",

  // get all locations available in storystory with relevent dates
  locations: "/locations",

  // search the songs that match to the locations stories
  location_songs: "/location_songs",
};

export { API_BASE_URL, ENDPOINTS };
