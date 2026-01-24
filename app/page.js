import VideoPlayer from "@/components/VideoPlayer";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="w-full">
        <VideoPlayer
          src="https://stream.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A.m3u8"
          poster="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/thumbnail.png"
          timeline="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/storyboard.vtt"
        />
      </div>
    </div>
  );
}
