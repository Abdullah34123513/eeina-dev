import { useEffect, useState } from "react";

// A loader component that simulates a video player loading state
const VideoPlayerLoader = ({
      className = "w-full aspect-square rounded-lg bg-black",
      overlayClassName = "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50",
      spinnerClassName = "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500",
}) => {
      return (
            <div className={`relative ${className}`}>
                  {/* You can add a placeholder background image or color here */}
                  <div className={overlayClassName}>
                        <div className={spinnerClassName}></div>
                  </div>
            </div>
      );
};

const TikTokPlayer = ({ url, className = "w-full aspect-square rounded-lg" }) => {
      const [videoSrc, setVideoSrc] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const fetchVideo = async () => {
                  try {
                        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
                        const response = await fetch(apiUrl);
                        const data = await response.json();

                        if (data?.data?.play) {
                              setVideoSrc(data.data.play);
                        }
                  } catch (error) {
                        console.error("Error fetching TikTok video:", error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchVideo();
      }, [url]);

      if (loading) {
            return <VideoPlayerLoader className={className} />;
      }

      if (!videoSrc) {
            return <p>Error loading video.</p>;
      }

      return <video src={videoSrc} controls autoPlay loop muted className={className} />;
};

export default TikTokPlayer;
