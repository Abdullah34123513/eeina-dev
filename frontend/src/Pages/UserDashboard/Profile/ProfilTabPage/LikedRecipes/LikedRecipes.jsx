import { useEffect, useState } from "react"
import propTypes from 'prop-types';
import handleGetApi from "../../../../../API/Handler/getApi.handler";
import DiscoverCardContainer from "../../../../../Components/DiscoverRecipes/DiscoverCardContainer/DiscoverCardContainer";

const LikedRecipes = ({
      profile = false,
      
}) => {

      const [userLikedRecipes, setUserLikedRecipes] = useState([]);

      useEffect(() => {
            async function getRecipesOfUser() {
                  const res = await handleGetApi(`like`);
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        setUserLikedRecipes(res.data);
                  }
            }
            getRecipesOfUser();
      }, [])

      return (
            <div>
                  <div>
                        <DiscoverCardContainer
                              recipes={userLikedRecipes}
                              profile={profile}
                        />
                  </div>
            </div>
      )
}

LikedRecipes.propTypes = {
      profile: propTypes.bool,
      profileID: propTypes.string
}

export default LikedRecipes