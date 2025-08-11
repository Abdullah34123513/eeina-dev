import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

import handleApi from "../../api/handler/apiHanlder";
import DataTable2 from "../../components/DataTable/DataTable2";

const AllUsers = () => {
      const [users, setUsers] = useState([]);
      const [allUsers, setAllUsers] = useState([]);
      useEffect(() => {
            let isMounted = true;
            const fetchIngredients = async () => {
                  try {
                        const { data } = await handleApi("user", "get");
                        console.log(data);
                        if (isMounted) {
                              setAllUsers(data);
                              setUsers(data);
                        }
                  } catch (error) {
                        toast.error(error || "Failed to fetch users.");
                  }
            };
            fetchIngredients();
            return () => {
                  isMounted = false;
            };
      }, []);

      const handleDeleteUser = (id) => {
            console.log(id);
      };

      const handleEditUser = (id) => (
            <Link className="btn btn-primary btn-sm" to={`/user/edit/${id}`}>
                  <i className="fa-solid fa-pen"></i>
            </Link>
      );

      const handleSearch = (keyWord) => {
            if (!keyWord) {
                  setUsers(allUsers);
                  return;
            }

            const lowerKeyWord = keyWord.toLowerCase();

            // Filter usres based on _id, firstName, lastName, email and role
            const filteredUsers = allUsers.filter((user) => {
                  const {
                        _id,
                        firstName: { en: firstName },
                        lastName: { en: lastName },
                        email,
                        role,
                  } = user;
                  return (
                        _id?.toLowerCase().includes(lowerKeyWord) ||
                        firstName?.toLowerCase().includes(lowerKeyWord) ||
                        lastName?.toLowerCase().includes(lowerKeyWord) ||
                        email?.toLowerCase().includes(lowerKeyWord) ||
                        role?.toLowerCase().includes(lowerKeyWord)
                  );
            });
            setUsers(filteredUsers);
      };

      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">All Users</div>

                        <div className="panel-body p-3 pb-0">
                              {/* <DataTable
                                    tableHeader={[
                                          "Image",
                                          "Name",
                                          "role",
                                          "Actions",
                                    ]}
                                    tableData={users}
                                    fields={[
                                          "image",
                                          "name",
                                          "role",
                                          "actions",
                                    ]}
                                    rootPath="user"
                                    onDelete={handleDeleteUser}
                              /> */}
                              <DataTable2
                                    tableHeader={[
                                          "ID",
                                          "First Name",
                                          "Last Name",
                                          "Email",
                                          "Role",
                                          "Actions",
                                    ]}
                                    fields={[
                                          "_id",
                                          "firstName",
                                          "lastName",
                                          "email",
                                          "role",
                                          "actions",
                                    ]}
                                    datableData={users}
                                    onDelete={handleDeleteUser}
                                    onEdit={handleEditUser}
                                    onSearch={handleSearch}
                              />
                        </div>
                  </div>
            </div>
      );
};

export default AllUsers;
