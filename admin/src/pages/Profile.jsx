import MetaData from "../components/seo/MetaData";
import EditProfile from "../components/profile/EditProfile";

const Profile = () => {
  return (
    <>
      <MetaData title={"Profile"} />
        <div className="p-3">
          <div className="panel">
            <div className="panel-header border-bottom mb-3">Profile</div>

            <div className="panel-body p-3 pb-0">
              <EditProfile />
            </div>
          </div>
        </div>
    </>
  );
}

export default Profile