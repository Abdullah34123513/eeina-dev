import { useEffect, useState } from "react"
import handleGetApi from "../../../../API/Handler/getApi.handler";
import DiscoverCardContainer from "../../../../Components/DiscoverRecipes/DiscoverCardContainer/DiscoverCardContainer";
import propTypes from 'prop-types';

const AllRecipe = ({
      profile = false,
      profileID
}) => {

      const [userRecipes, setUserRecipes] = useState([]);

      useEffect(() => {
            async function getRecipesOfUser() {
                  const res = await handleGetApi(`user/recipes/${profileID}`);
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        setUserRecipes(res.data);
                  }
            }
            getRecipesOfUser();
      }, [profileID])


      return (
            <div>
                  <div>
                        <DiscoverCardContainer
                              recipes={userRecipes}
                              profile={profile}
                        />
                  </div>
            </div>
      )
}

AllRecipe.propTypes = {
      profile: propTypes.bool,
      profileID: propTypes.string
}

export default AllRecipe