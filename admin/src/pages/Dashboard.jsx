import { useEffect, useState } from "react";
import PanelCard from "../components/PanelCard";
import MetaData from "../components/seo/MetaData";

const Dashboard = () => {
      const [counts, setCounts] = useState({
            trainingCount: 0,
            newsCount: 0,
            certificateCount: 0,
      });

      // useEffect(() => {
      //   const fetchData = async () => {
      //     try {
      //       const [trainings, news, certificates] = await Promise.all([
      //         getTrainings(),
      //         getNews(),
      //         getCertificates(),
      //       ]);

      //       setCounts({
      //         trainingCount: trainings?.trainings?.length || 0,
      //         newsCount: news?.data?.length || 0,
      //         certificateCount: certificates?.data?.length || 0,
      //       });
      //     } catch (error) {
      //       console.error("Error fetching dashboard data:", error);
      //     }
      //   };

      //   fetchData();
      // }, []);

      return (
            <>
                  <MetaData title="Dashboard" />
                  <div className="row g-3 mb-2">
                        {/* <PanelCard
                              amount={counts.newsCount}
                              label="News"
                              colorClass="bg-primary"
                              iconName="newspaper-outline"
                              link="/news"
                              linkText="View All"
                        />
                        <PanelCard
                              amount={counts.trainingCount}
                              label="Trainings"
                              colorClass="bg-success"
                              iconName="person-add-outline"
                              link="/trainings"
                              linkText="View All"
                        />
                        <PanelCard
                              amount={counts.certificateCount}
                              label="Certificates"
                              colorClass="bg-info"
                              iconName="medal-outline"
                              link=/certificates"
                              linkT"ext="View All"
                        /> */}
                  </div>
            </>
      );
};

export default Dashboard;
