import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import handleApi from "../../api/handler/apiHanlder";

const Tags = () => {
      const [loading, setLoading] = useState(false);
      const [tags, setTags] = useState([]);

      const [newTag, setNewTag] = useState({
            location: "",
            script: "",
            status: "",
      });

      useEffect(() => {
            const fetchTags = async () => {
                  try {
                        const res = await handleApi("tags", "GET");
                        setTags(res.data);
                  } catch (error) {
                        toast.error(
                              error.message || error.response?.data?.message
                        );
                        console.log(error);
                  }
            };
            fetchTags();
      }, []);

      const handleInputChange = (e) => {
            const { name, value } = e.target;
            setNewTag({
                  ...newTag,
                  [name]: value,
            });
      };

      const handleExisitingTagChange = (e, id) => {
            const { name, value } = e.target;
            const updatedTags = tags.map((tag) => {
                  if (tag._id === id) {
                        return {
                              ...tag,
                              [name]: value,
                        };
                  }
                  return tag;
            });
            setTags(updatedTags);

            console.log(updatedTags);
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            try {
                  // Create new tag if it has valid values
                  if (
                        newTag.location !== "" &&
                        newTag.status !== "" &&
                        newTag.script !== ""
                  ) {
                        const res = await handleApi(
                              "tags/create",
                              "POST",
                              newTag
                        );
                        if (res.statusCode === 201) {
                              toast.success("Tag created successfully");
                              setTags([...tags, res.data]);
                              return;
                        }
                  }

                  let success = false;

                  // Update existing tags
                  await Promise.all(
                        tags.map(async (tag) => {
                              try {
                                    const res = await handleApi(
                                          `tags/${tag._id}`,
                                          "PUT",
                                          tag
                                    );
                                    if (res.statusCode === 200) success = true;
                              } catch (error) {
                                    toast.error(
                                          error.message ||
                                                error.response?.data?.message
                                    );
                                    console.log(error);
                              }
                        })
                  );

                  // Show a single success message if at least one tag was updated successfully
                  if (success) {
                        toast.success("Tags updated successfully");
                  }
            } catch (error) {
                  toast.error("An error occurred while updating tags.");
                  console.log(error);
            } finally {
                  setNewTag({ location: "", script: "", status: "" });
                  setLoading(false);
            }
      };

      const handleDelete = async (e, id) => {
            e.preventDefault();
            e.stopPropagation();

            try {
                  const res = await handleApi(`tags/${id}`, "DELETE");
                  if (res.statusCode === 200) {
                        toast.success("Tag deleted successfully");
                        setTags(tags.filter((tag) => tag._id !== id));
                  }
            } catch (error) {
                  toast.error(error.message || error.response?.data?.message);
                  console.log(error);
            }
      };

      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">
                              Manage Tags
                        </div>
                        <div className="panel-body p-3 pb-0">
                              <form onSubmit={handleSubmit} className="p-4">
                                    <div className="row">
                                          <div className="col-xl-8">
                                                {/* Existing tags */}
                                                <div className="row mb-3">
                                                      <label className="col-lg-3 col-form-label">
                                                            Existing Tags
                                                      </label>
                                                      <div className="col-lg-9">
                                                            {tags.length > 0 ? tags.map(
                                                                  (tag, i) => (
                                                                        <div
                                                                              key={
                                                                                    i
                                                                              }
                                                                        >
                                                                              <div className="row mb-3">
                                                                                    <div className="col-12">
                                                                                          <textarea
                                                                                                name="script"
                                                                                                id=""
                                                                                                value={
                                                                                                      tag?.script
                                                                                                }
                                                                                                className="form-control"
                                                                                                onChange={(
                                                                                                      e
                                                                                                ) =>
                                                                                                      handleExisitingTagChange(
                                                                                                            e,
                                                                                                            tag._id
                                                                                                      )
                                                                                                }
                                                                                          ></textarea>
                                                                                    </div>
                                                                              </div>
                                                                              <div className="row mb-3">
                                                                                    <div className="col-5">
                                                                                          <select
                                                                                                name="location"
                                                                                                id=""
                                                                                                value={
                                                                                                      tag?.location
                                                                                                }
                                                                                                className="form-control"
                                                                                                onChange={(
                                                                                                      e
                                                                                                ) =>
                                                                                                      handleExisitingTagChange(
                                                                                                            e,
                                                                                                            tag._id
                                                                                                      )
                                                                                                }
                                                                                          >
                                                                                                <option value="">
                                                                                                      Select
                                                                                                      Location
                                                                                                </option>
                                                                                                <option value="head">
                                                                                                      Head
                                                                                                </option>
                                                                                                <option value="body">
                                                                                                      Body
                                                                                                </option>
                                                                                          </select>
                                                                                    </div>
                                                                                    <div className="col-5">
                                                                                          <select
                                                                                                name="status"
                                                                                                id=""
                                                                                                value={
                                                                                                      tag?.status
                                                                                                }
                                                                                                className="form-control"
                                                                                                onChange={(
                                                                                                      e
                                                                                                ) =>
                                                                                                      handleExisitingTagChange(
                                                                                                            e,
                                                                                                            tag._id
                                                                                                      )
                                                                                                }
                                                                                          >
                                                                                                <option value="">
                                                                                                      Select
                                                                                                      Status
                                                                                                </option>
                                                                                                <option value="active">
                                                                                                      Active
                                                                                                </option>
                                                                                                <option value="inactive">
                                                                                                      Inactive
                                                                                                </option>
                                                                                          </select>
                                                                                    </div>
                                                                                    <div className="col-2">
                                                                                          <button
                                                                                                className="btn btn-danger float-end"
                                                                                                onClick={(
                                                                                                      e
                                                                                                ) =>
                                                                                                      handleDelete(
                                                                                                            e,
                                                                                                            tag._id
                                                                                                      )
                                                                                                }
                                                                                          >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                          </button>
                                                                                          <div className="clearfix"></div>
                                                                                    </div>
                                                                              </div>
                                                                        </div>
                                                                  )
                                                            ): (<input type="text" className="form-control" placeholder="No tags found" disabled />)}
                                                      </div>
                                                </div>
                                                {/*New tag */}
                                                <div className="row mb-3">
                                                      <label className="col-lg-3 col-form-label">
                                                            New Tag
                                                      </label>
                                                      <div className="col-lg-9">
                                                            <div className="row mb-3">
                                                                  <div className="col-12">
                                                                        <textarea
                                                                              name="script"
                                                                              id=""
                                                                              value={
                                                                                    newTag.script
                                                                              }
                                                                              onChange={
                                                                                    handleInputChange
                                                                              }
                                                                              className="form-control"
                                                                              placeholder="Enter your tag script"
                                                                        ></textarea>
                                                                  </div>
                                                            </div>
                                                            <div className="row mb-3">
                                                                  {/* Location */}
                                                                  <div className="col-lg-6">
                                                                        <select
                                                                              name="location"
                                                                              id=""
                                                                              value={
                                                                                    newTag.location
                                                                              }
                                                                              onChange={
                                                                                    handleInputChange
                                                                              }
                                                                              className="form-control"
                                                                        >
                                                                              <option value="">
                                                                                    Select
                                                                                    Location
                                                                              </option>
                                                                              <option value="head">
                                                                                    Head
                                                                              </option>
                                                                              <option value="body">
                                                                                    Body
                                                                              </option>
                                                                        </select>
                                                                  </div>
                                                                  <div className="col-lg-6">
                                                                        <select
                                                                              name="status"
                                                                              id=""
                                                                              value={
                                                                                    newTag.status
                                                                              }
                                                                              onChange={
                                                                                    handleInputChange
                                                                              }
                                                                              className="form-control"
                                                                        >
                                                                              <option value="">
                                                                                    Select
                                                                                    Status
                                                                              </option>
                                                                              <option value="active">
                                                                                    Active
                                                                              </option>
                                                                              <option value="inactive">
                                                                                    Inactive
                                                                              </option>
                                                                        </select>
                                                                  </div>
                                                                  <div className="col-lg-6"></div>
                                                            </div>
                                                      </div>
                                                </div>

                                                {/* Submit Button */}
                                                <div className="row">
                                                      <div className="col-lg-9 offset-lg-3">
                                                            <button
                                                                  type="submit"
                                                                  className="btn btn-primary"
                                                                  disabled={
                                                                        loading
                                                                  }
                                                            >
                                                                  {loading
                                                                        ? "Updating..."
                                                                        : "Save Changes"}
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </form>
                        </div>
                  </div>
            </div>
      );
};

export default Tags;
