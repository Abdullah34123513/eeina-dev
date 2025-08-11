import handlePostApi from "../API/Handler/postApi.handler";

export const handleLike = async ({
      dataID,
      isAuthenticated,
      isLiked,
      setIsLiked,
      likeCount,
      setLikeCount,
      collection
}) => {
      if (!isAuthenticated) {
            return alert("Please login to like or unlike.");
      }

      // Store previous state in case we need to revert.
      const previousLiked = isLiked;
      const previousLikeCount = likeCount;

      // Optimistically update the UI.
      if (isLiked) {
            setIsLiked(false);
            setLikeCount((prev) => prev - 1);
      } else {
            setIsLiked(true);
            setLikeCount((prev) => prev + 1);
      }

      try {
            // Make the API call to toggle like status
            const res = await handlePostApi(`${collection}/${dataID}`);
            console.log("Like API response:", res);

            // If the response is not successful, revert the UI update.
            if (!(res?.statusCode === 200 || res?.statusCode === 201)) {
                  setIsLiked(previousLiked);
                  setLikeCount(previousLikeCount);
            }
      } catch (error) {
            console.log("Error liking recipe:", error);
            // Revert on error.
            setIsLiked(previousLiked);
            setLikeCount(previousLikeCount);
      }
};