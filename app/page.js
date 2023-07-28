"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function Page() {
  const [username, setUsername] = useState("");
  const [songsData, setSongsData] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);

  const handleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/songs`, {
        params: { username },
      });
      setSongsData(response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  return (
    <div className='flex justify-center items-center flex-col gap-2 m-5'>
      <h1 className='text-xl'>Spot.</h1>
      <div className='flex justify-center items-center gap-2'>
        <Input
          type='text'
          placeholder='Username'
          value={username}
          onChange={handleUsernameChange}
          pattern='^[a-zA-Z][a-zA-Z0-9._]{1,29}$'
          title='Username must start with a letter and can only contain letters, numbers, periods, and underscores.'
        />
        <Button type='submit' onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {openSearch ? (
        <div className='flex justify-center items-center gap-2'>
          <Input type='text' />
          <Button type='submit'>It Works</Button>
        </div>
      ) : (
        <div>
          <Button variant='outline' size='icon' onClick={handleOpenSearch}>
            <Search />
          </Button>
        </div>
      )}
      {songsData.map((song) => (
        <div key={song.id}>
          <p>Title: {song.title}</p>
          <p>Artist: {song.artist}</p>
          <p>Album: {song.album}</p>
        </div>
      ))}
    </div>
  );
}

export default Page;
