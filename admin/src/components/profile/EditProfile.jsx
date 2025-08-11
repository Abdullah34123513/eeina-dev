import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
      getUserProfile,
      updateUserProfile,
} from "../../features/user/userThunks";

const EditProfile = () => {
      const dispatch = useDispatch();
      const user = useSelector((state) => state.user.user);
      const [loading, setLoading] = useState(false);

      const [showModal, setShowModal] = useState(false);
      const [formData, setFormData] = useState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
      });

      // When the modal opens or the user data changes, sync the form state.
      useEffect(() => {
            if (user && showModal) {
                  setFormData({
                        firstName: user.firstName.en || "",
                        lastName: user.lastName.en || "",
                        email: user.email || "",
                        password: "",
                  });
            }
      }, [user, showModal]);

      const handleShow = () => setShowModal(true);
      const handleClose = () => setShowModal(false);

      const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                  ...prev,
                  [name]: value,
            }));
      };

      const handleSaveChanges = async () => {
            try {
                  setLoading(true);
                  await dispatch(updateUserProfile(formData)).unwrap();
                  toast.success("Profile updated successfully");
                  dispatch(getUserProfile());
                  handleClose();
            } catch (error) {
                  toast.error(error);
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="panel-body p-4">
                  <div className="row">
                        <div className="col-xl-8">
                              {/* Display current user information */}
                              <div className="row mb-3">
                                    <label className="col-form-label col-lg-3">
                                          Name
                                    </label>
                                    <div className="col-lg-9">
                                          <input
                                                type="text"
                                                className="form-control"
                                                value={`${user.firstName.en || ""} ${user.lastName.en || ""}`}
                                                disabled
                                          />
                                    </div>
                              </div>
                              <div className="row mb-3">
                                    <label className="col-form-label col-lg-3">
                                          Email
                                    </label>
                                    <div className="col-lg-9">
                                          <input
                                                type="email"
                                                className="form-control"
                                                value={user.email || ""}
                                                disabled
                                          />
                                    </div>
                              </div>
                              <div className="row mb-3">
                                    <div className="col-lg-9 offset-lg-3">
                                          <button
                                                className="btn btn-primary"
                                                onClick={handleShow}
                                          >
                                                Change Profile
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Modal for editing the profile */}
                  <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                              <Modal.Title>Edit Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="form-group mb-3">
                                    <label htmlFor="editFirstName">
                                          First Name
                                    </label>
                                    <input
                                          type="text"
                                          id="editFirstName"
                                          name="firstName"
                                          className="form-control"
                                          value={formData.firstName}
                                          onChange={handleInputChange}
                                    />
                              </div>
                              <div className="form-group mb-3">
                                    <label htmlFor="editLastName">
                                          Last Name
                                    </label>
                                    <input
                                          type="text"
                                          id="editLastName"
                                          name="lastName"
                                          className="form-control"
                                          value={formData.lastName}
                                          onChange={handleInputChange}
                                    />
                              </div>
                              <div className="form-group mb-3">
                                    <label htmlFor="editEmail">Email</label>
                                    <input
                                          type="email"
                                          id="editEmail"
                                          name="email"
                                          className="form-control"
                                          value={formData.email}
                                          onChange={handleInputChange}
                                    />
                              </div>
                              <div className="form-group mb-3">
                                    <label htmlFor="editPassword">
                                          Password
                                    </label>
                                    <input
                                          type="password"
                                          id="editPassword"
                                          name="password"
                                          className="form-control"
                                          value={formData.password}
                                          onChange={handleInputChange}
                                          autoComplete="new-password"
                                    />
                              </div>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                              </Button>
                              <Button
                                    variant="primary"
                                    onClick={handleSaveChanges}
                                    disabled
                              >
                                    {loading ? "Saving..." : "Save Changes"}
                              </Button>
                        </Modal.Footer>
                  </Modal>
            </div>
      );
};

export default EditProfile;
