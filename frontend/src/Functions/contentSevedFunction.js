import toast from "react-hot-toast";
import { getUserProfile } from "../../app/slice/useSlice";
import handlePostApi from "../API/Handler/postApi.handler";


const handleSaveRecipe = async ({
      setSaved,
      saved,
      dispatch,
      navigate,
      id
}) => {
      // Optimistically update local state for immediate UI feedback
      const alreadySaved = saved;
      setSaved(!alreadySaved);

      if (alreadySaved) {
            try {
                  const res = await handlePostApi(`recipe-user/unsave/${id}`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        toast.success('Recipe unsaved successfully');
                        dispatch(getUserProfile());
                        navigate('/explore');
                  }
            } catch (error) {
                  // Revert UI change on error
                  setSaved(alreadySaved);
                  console.error('Failed to unsave recipe:', error);
                  toast.error('Failed to unsave recipe');
            }
      } else {
            try {
                  const res = await handlePostApi(`recipe-user/save/${id}`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        toast.success('Recipe saved successfully');
                        dispatch(getUserProfile());
                        // navigate('/saved');
                  }
            } catch (error) {
                  // Revert UI change on error
                  setSaved(alreadySaved);
                  console.error('Failed to save recipe:', error);
                  toast.error('Failed to save recipe');
            }
      }
};


export default handleSaveRecipe;