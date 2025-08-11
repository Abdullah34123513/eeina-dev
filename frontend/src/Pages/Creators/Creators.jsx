/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import UserHeader from "../UserDashboard/Profile/UserHeader"
import { useEffect, useState } from "react";
import handleGetApi from "../../API/Handler/getApi.handler";
import { Grid2x2, Video } from "lucide-react";
import AllRecipe from "../UserDashboard/Profile/ProfilTabPage/AllRecipe";

const Creators = () => {
      const { id } = useParams();
      const [profile, setProfile] = useState(null);
      // Track which tab is active
      const [activeTab, setActiveTab] = useState('tab1');

      // States for fetched data in each tab
      const [dataTab1, setDataTab1] = useState(null);
      const [dataTab2, setDataTab2] = useState(null);

      useEffect(() => {
            const getLoggedUser = async () => {
                  const res = await handleGetApi(`user/profile/${id}`);
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        setProfile(res.data);
                  }
            };
            getLoggedUser();
      }, [id])

      return (
            <div>
                  <UserHeader
                        profile={profile}
                  />


                  <div
                        className="w-[95%] mx-auto p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)]  rounded-xl"
                  >
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

                              <button
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
                              </button>
                        </div>
                        {/* Tab Content */}
                        <div
                              className="px-20 py-8"
                        >
                              {activeTab === 'tab1' && (
                                    <div>
                                          <AllRecipe
                                                profile={false}
                                                profileID={id}
                                          />
                                    </div>
                              )}

                              {activeTab === 'tab2' && (
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
                              )}
                        </div>
                  </div>
            </div>
      )
}

export default Creators