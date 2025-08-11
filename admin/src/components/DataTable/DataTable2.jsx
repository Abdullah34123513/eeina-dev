import React, { useState } from "react";
import PropTypes from "prop-types";

const DataTable2 = ({
      tableHeader,
      fields,
      datableData,
      onDelete = null,
      onEdit = null,
      onViewClick = null,
      onSearch,
      loading = false,
}) => {
      const [keyWord, setKeyWord] = useState("");

      return (
            <div>
                  <div className="row mb-3">
                        <div className="col-lg-6 offset-lg-6">
                              <div className="input-group">
                                    <input
                                          type="text"
                                          placeholder="Search..."
                                          value={keyWord}
                                          onChange={(e) => setKeyWord(e.target.value)}
                                          className="form-control"
                                    />
                                    <button
                                          className="btn btn-primary ms-1"
                                          onClick={() => onSearch(keyWord)}
                                    >
                                          <i className="fa-solid fa-search"></i>
                                    </button>
                              </div>
                        </div>
                  </div>
                  <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped">
                              <thead>
                                    <tr>
                                          {tableHeader.map((header, index) => (
                                                <th key={index}>{header}</th>
                                          ))}
                                    </tr>
                              </thead>
                              <tbody>
                                    {datableData.map((item, index) => (
                                          <tr key={index}>
                                                {fields.map((field, index) => (
                                                      <td key={index}>
                                                            {field === "image" ? (
                                                                  <img
                                                                        src={
                                                                              item.image?.url ||
                                                                              item.thumbnail?.url
                                                                        }
                                                                        alt={
                                                                              item.name?.en ||
                                                                              "No Image"
                                                                        }
                                                                        style={{
                                                                              width: "150px",
                                                                              height: "80px",
                                                                              objectFit: "cover",
                                                                              borderRadius: "5px",
                                                                        }}
                                                                  />
                                                            ) : field === "actions" ? (
                                                                  <div className="d-flex gap-1 flex-wrap justify-content-center align-items-center h-100 w-100">
                                                                        {onEdit && onEdit(item._id)}
                                                                        {onDelete && (
                                                                              <button
                                                                                    className="btn btn-danger btn-sm"
                                                                                    onClick={() =>
                                                                                          onDelete(
                                                                                                item._id
                                                                                          )
                                                                                    }
                                                                                    disabled={
                                                                                          loading
                                                                                    }
                                                                              >
                                                                                    <i className="fa-solid fa-trash"></i>
                                                                              </button>
                                                                        )}
                                                                  </div>
                                                            ) : Array.isArray(item[field]) ? (
                                                                  item[field].map((i, index) => (
                                                                        <span key={index}>
                                                                              {i?.en || i}
                                                                              {index <
                                                                              item[field].length - 1
                                                                                    ? ", "
                                                                                    : ""}
                                                                        </span>
                                                                  ))
                                                            ) : item[field] &&
                                                              typeof item[field] === "object" &&
                                                              "en" in item[field] ? (
                                                                  <span>{item[field].en}</span>
                                                            ) : (
                                                                  <span>{item[field]}</span>
                                                            )}
                                                      </td>
                                                ))}
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
            </div>
      );
};

DataTable2.propTypes = {
      tableHeader: PropTypes.arrayOf(PropTypes.string),
      datableData: PropTypes.arrayOf(PropTypes.object),
      fields: PropTypes.arrayOf(PropTypes.string),
      onDelete: PropTypes.func,
      onEdit: PropTypes.func,
      onViewClick: PropTypes.func,
      onSearch: PropTypes.func,
};

export default DataTable2;
