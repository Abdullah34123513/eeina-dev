import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import handleApi from "../../api/handler/apiHanlder";
import toast from "react-hot-toast";

const DataTable = ({
      tableHeader = [],
      fields = [],
      tableData = [],
      rootPath,
      onDelete, // Added callback prop
}) => {
      const handleDelete = async (id) => {
            try {
                  const res = await handleApi(`${rootPath}/${id}`, "delete");
                  if (res.statusCode === 200) {
                        toast.success(res.message);
                        // Call the onDelete callback to update the parent state
                        if (onDelete) {
                              onDelete(id);
                        }
                  } else {
                        toast.error(res.message);
                  }
            } catch (error) {
                  toast.error(
                        error?.response?.data?.message ||
                              error?.message ||
                              "An error occurred while deleting"
                  );
            }
      };

      return (
            <div className="table-responsive">
                  <table className="table table-bordered table-hover table-striped">
                        <thead>
                              <tr>
                                    <th>S.No:#</th>
                                    {tableHeader.map((header, index) => (
                                          <th key={index}>{header}</th>
                                    ))}
                              </tr>
                        </thead>
                        <tbody>
                              {tableData.map((item, index) => (
                                    <tr key={item._id || index}>
                                          <td style={{ width: "20px" }}>
                                                {index + 1}
                                          </td>
                                          {fields.map((field) => (
                                                <td
                                                      key={field}
                                                      className="text-truncate"
                                                      style={{
                                                            maxWidth: "200px",
                                                      }}
                                                >
                                                      {field === "image" ? (
                                                            item.image?.url ? (
                                                                  <img
                                                                        src={
                                                                              item
                                                                                    .image
                                                                                    .url
                                                                        }
                                                                        alt={
                                                                              item.name ||
                                                                              "No Image"
                                                                        }
                                                                        style={{
                                                                              width: "150px",
                                                                              height: "80px",
                                                                              objectFit:
                                                                                    "cover",
                                                                              borderRadius:
                                                                                    "5px",
                                                                        }}
                                                                  />
                                                            ) : (
                                                                  "No Image"
                                                            )
                                                      ) : field ===
                                                        "actions" ? (
                                                            <div className="d-flex gap-1 flex-wrap justify-content-center align-items-center h-100 w-100">
                                                                  <Link
                                                                        className="btn btn-primary btn-sm"
                                                                        to={`/admin/${rootPath}/edit/${item._id}`}
                                                                  >
                                                                        <i className="fa-solid fa-pen"></i>
                                                                  </Link>
                                                                  <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() =>
                                                                              handleDelete(
                                                                                    item._id
                                                                              )
                                                                        }
                                                                  >
                                                                        <i className="fa-solid fa-trash"></i>
                                                                  </button>
                                                            </div>
                                                      ) : Array.isArray(
                                                              item[field]
                                                        ) ? (
                                                            item[field].join(
                                                                  ", "
                                                            )
                                                      ) : (
                                                            item[field]
                                                      )}
                                                </td>
                                          ))}
                                    </tr>
                              ))}
                        </tbody>
                  </table>
            </div>
      );
};

DataTable.propTypes = {
      tableHeader: PropTypes.arrayOf(PropTypes.string),
      tableData: PropTypes.arrayOf(PropTypes.object),
      fields: PropTypes.arrayOf(PropTypes.string),
      rootPath: PropTypes.string.isRequired,
      onDelete: PropTypes.func, // Specify onDelete as a function (optional)
};

export default React.memo(DataTable);
