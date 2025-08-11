import { useParams } from "react-router";
import UserRoleForm from "../../components/user/UserForm";

const EditUser = () => {
      const { id } = useParams();
      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">
                              Edit User
                        </div>

                        <div className="panel-body p-3 pb-0">
                              <UserRoleForm id={id} />
                        </div>
                  </div>
            </div>
      );
};

export default EditUser;
