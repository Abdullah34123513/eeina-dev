import { Grid2x2, ThumbsUp/* , Video */ } from "lucide-react";
import { useState } from "react";
import AllRecipe from "./ProfilTabPage/AllRecipe";
import { useSelector } from "react-redux";
import LikedRecipes from "./ProfilTabPage/LikedRecipes/LikedRecipes";



const Profile = () => {
      const { user } = useSelector((state) => state.user);

      // Track which tab is active
      const [activeTab, setActiveTab] = useState('tab1');



      return (
            <div className=" mx-auto ">
                  {/* Tab Buttons */}
                  <div className="flex space-x-10 mb-4">
                        <button
                              onClick={() => setActiveTab('tab1')}
                              className={`flex items-center px-4  py-2 text-primary  transition-colors ${activeTab === 'tab1'
                                    ? 'border-b border-primary'
                                    : 'border-b border-transparent'
                                    }`}
                        >
                              <div
                                    className="w-full flex items-center justify-center"
                              >
                                    <Grid2x2
                                          size={28}
                                          className=" " />
                              </div>
                        </button>

                        {/* <button
                              onClick={() => setActiveTab('tab2')}
                              className={`flex items-center px-4  py-2 text-primary  transition-colors ${activeTab === 'tab2'
                                    ? 'border-b border-primary'
                                    : 'border-b border-transparent'
                                    }`}
                        >
                              <div
                                    className="w-full flex items-center justify-center"
                              >
                                    <Video
                                          size={28}
                                          className=" " />
                              </div>
                        </button> */}

                        <button
                              onClick={() => setActiveTab('tab3')}
                              className={`flex items-center px-4  py-2 text-primary  transition-colors ${activeTab === 'tab3'
                                    ? 'border-b border-primary'
                                    : 'border-b border-transparent'
                                    }`}
                        >
                              <div
                                    className="w-full flex items-center justify-center"
                              >
                                    <ThumbsUp
                                          size={28}
                                          className=" " />
                              </div>
                        </button>
                  </div>

                  {/* Tab Content */}
                  <div
                        className="px-2 lg:px-20 lg:py-8"
                  >
                        {activeTab === 'tab1' && (
                              <div>
                                    <AllRecipe
                                          profile={true}
                                          profileID={user?._id}
                                    />
                              </div>
                        )}

                        {/* {activeTab === 'tab2' && (
                              <div>
                                    <h2 className="text-xl font-semibold mb-2">Tab 2 Content</h2>
                                    {dataTab2 ? (
                                          <ul className="list-disc pl-5 space-y-1">
                                                {dataTab2.map((item) => (
                                                      <li key={item.id}>{item.name || item.title}</li>
                                                ))}
                                          </ul>
                                    ) : (
                                          <p>Loading data for Tab 2...</p>
                                    )}
                              </div>
                        )} */}

                        {activeTab === 'tab3' && (
                              <div>
                                    <LikedRecipes
                                          profile={true}
                                    />
                              </div>
                        )}
                  </div>
            </div>
      )
}

export default Profile