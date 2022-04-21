import type { NextPage } from "next";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import Head from "next/head";
import { useState } from "react";

type Song = {
  lyrics: string;
  title: string;
  video_link: string;
};

const Home: NextPage<{ song: Song }> = ({ song }) => {
  const videoId = new URLSearchParams(song.video_link.split("?")[1]).get("v");
  const [showLyrics, setShowLyrics] = useState(false);

  const onPlay = () => {
    (document.getElementsByClassName("lty-playbtn")[0] as any).click();
  };

  return (
    <div>
      <Head>
        <title>AP Player</title>
      </Head>
      <div className="flex justify-center items-center flex-col">
        <div className="flex flex-col border border-black rounded-lg p-4 my-16 w-[480px] gap-4">
          <h1 className="text-3xl text-center">AP Player</h1>
          <h2 className="text-xl text-center">{song.title}</h2>
          {videoId && <LiteYouTubeEmbed id={videoId} title={song.title} />}
          <div className="flex gap-4 justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onPlay}
            >
              Play
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowLyrics((s) => !s)}
            >
              {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Next Song
            </button>
          </div>
          {showLyrics && (
            <p style={{ whiteSpace: "pre-line" }}>{song.lyrics}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const resp: any = await fetch("https://api-dhillon.deta.dev/lyrics");
  const data = await resp.json();
  const songs: Song[] = data.map((d: any) => ({
    lyrics: d.lyrics,
    title: d.title,
    video_link: d.video_link,
  }));
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  return {
    props: { song: randomSong }, // will be passed to the page component as props
  };
}

export default Home;
