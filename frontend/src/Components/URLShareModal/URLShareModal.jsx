import { useEffect, useState } from "react";
import {
      X,
      Linkedin,
      Facebook,
      Send, // can represent Telegram
      Instagram,
      Link,
} from "lucide-react";
import PropTypes from "prop-types";

export default function ShareProfileModal({ isOpen, setIsOpen, URL }) {
      const [shortUrl, setShortUrl] = useState("");
      const [isCopying, setIsCopying] = useState(false);

      useEffect(() => {
            if (!isOpen) return; // only run when modal opens

            const currentUrl = typeof window !== "undefined" ? window.location.href : "";

            const targetUrl = URL || currentUrl;

            fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(targetUrl)}`)
                  .then((res) => res.text())
                  .then((data) => {
                        setShortUrl(data);
                  })
                  .catch((err) => {
                        console.error("Error shortening URL:", err);
                        setShortUrl(targetUrl); // fallback to original
                  });
      }, [isOpen, URL]); // depend on `isOpen` and `URL`

      // Copy link to clipboard
      const handleCopyLink = () => {
            if (!shortUrl) return;
            setIsCopying(true);
            navigator.clipboard
                  .writeText(shortUrl)
                  .then(() => {
                        alert("Link copied to clipboard!");
                  })
                  .catch((err) => {
                        console.error("Failed to copy link:", err);
                  })
                  .finally(() => {
                        setIsCopying(false);
                  });
      };

      // Social share functions
      const shareOnLinkedIn = () => {
            const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortUrl)}`;
            window.open(url, "_blank");
      };

      const shareOnFacebook = () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`;
            window.open(url, "_blank");
      };

      // Instagram doesn't have a simple share link for desktop
      const shareOnInstagram = () => {
            window.open("https://www.instagram.com/", "_blank");
      };

      const shareOnTelegram = () => {
            const url = `https://t.me/share/url?url=${encodeURIComponent(shortUrl)}`;
            window.open(url, "_blank");
      };

      // If the modal is not open, return null
      if (!isOpen) return null;

      return (
            <div className="fixed inset-0 z-[999999999] flex items-center justify-center bg-black bg-opacity-50">
                  {/* Modal container */}
                  <div className=" w-80 rounded-md bg-white p-5 shadow-lg">
                        {/* Close button (top-right) */}
                        <div className="relative flex items-center mb-10">
                              <h1 className="absolute inset-0 text-center text-3xl font-medium text-primary my-6 flex items-center justify-center">
                                    Share URL
                              </h1>
                              <div className="ml-auto">
                                    <X
                                          className="cursor-pointer"
                                          onClick={() => setIsOpen(false)}
                                    />
                              </div>
                        </div>

                        <div
                              className="flex flex-col items-center space-y-6 p-10"
                        >
                              {/* Copy link section */}
                              <div
                                    className="flex cursor-pointer items-center space-x-2 hover:underline"
                                    onClick={handleCopyLink}
                              >
                                    <Link className="h-5 w-5 text-primary" />
                                    <span className="text-sm text-gray-700">
                                          {isCopying ? "Copying..." : "Copy Link"}
                                    </span>
                              </div>

                              {/* OR text */}
                              <div className="text-center text-gray-500">OR</div>

                              {/* Social icons */}
                              <div className="flex items-center justify-around space-x-10">
                                    <Linkedin
                                          className="h-6 w-6 cursor-pointer text-primary hover:scale-110"
                                          onClick={shareOnLinkedIn}
                                    />
                                    <Instagram
                                          className="h-6 w-6 cursor-pointer text-primary hover:scale-110"
                                          onClick={shareOnInstagram}
                                    />
                                    <Facebook
                                          className="h-6 w-6 cursor-pointer text-primary hover:scale-110"
                                          onClick={shareOnFacebook}
                                    />
                                    <Send
                                          className="h-6 w-6 cursor-pointer text-primary hover:scale-110"
                                          onClick={shareOnTelegram}
                                    />
                              </div>
                        </div>
                  </div>
            </div>
      );
}


ShareProfileModal.propTypes = {
      isOpen: PropTypes.bool.isRequired,
      setIsOpen: PropTypes.func.isRequired,
      URL: PropTypes.string,
};

