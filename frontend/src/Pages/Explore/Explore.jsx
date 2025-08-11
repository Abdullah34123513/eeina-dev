import { useEffect, useState } from "react";
import CardContainer from "../../Components/CardSlider/CardContainer"
import DiscoverRecipes from "../../Components/DiscoverRecipes/DiscoverRecipes"
import handleGetApi from "../../API/Handler/getApi.handler";
import {  useSelector } from "react-redux";
import useTextLangChange from "../../Constant/text.constant";
// import { getUserProfile } from "../../../../backend/src/Controller/User/getUserProfile.controller";
// import { useLang } from "../../context/LangContext"

const Explore = () => {
      // const { isArabic } = useLang();
      const { user, isAuthenticated } = useSelector((state) => state.user);
      const {
            exploreCateTitle,
            exploreCateSub,
            popularIngredients,
            exploreIngSub,
            exporeCreTitle,
            exporeCreSub
      } = useTextLangChange()
      // const dispatch = useDispatch();


      const [categories, setCategories] = useState([]);
      const [ingredients, setIngredients] = useState([]);
      const [profileData, setProfileData] = useState([]);

      useEffect(() => {
            async function profileDataFetch() {
                  const res = await handleGetApi('user/get-all')
                  if (isAuthenticated) {
                        // dispatch(getUserProfile());
                        const filteredData = res?.data.filter((data) => data._id !== user._id)
                        setProfileData(filteredData)
                  }
                  else {
                        setProfileData(res?.data)
                  }
            }
            profileDataFetch()
      }, [user, isAuthenticated])

      useEffect(() => {
            async function profileDataFetch() {
                  const res = await handleGetApi('category/popular')
                  // console.log(res?.data)
                  setCategories(res?.data)
            }
            profileDataFetch()
      }, [])

      useEffect(() => {
            async function profileDataFetch() {
                  const res = await handleGetApi('ingredient/popular')
                  setIngredients(res?.data)
            }
            profileDataFetch()
      }, [])


      return (
            <div>
                  <CardContainer
                        title={exploreCateTitle}
                        subtitle={exploreCateSub}
                        route='/category'
                        btnRoute='/categories'
                        carouselData={categories}
                  />

                  <CardContainer
                        title={popularIngredients}
                        subtitle={exploreIngSub}
                        route='/ingredient'
                        btnRoute='/ingredients'
                        carouselData={ingredients}
                  />

                  <CardContainer
                        title={exporeCreTitle}
                        subtitle={exporeCreSub}
                        collections='creators'
                        route='/creators'
                        btnRoute="/creators"
                        isProfile
                        profileData={profileData}
                  />

                  <DiscoverRecipes />
            </div>
      )
}

export default Explore