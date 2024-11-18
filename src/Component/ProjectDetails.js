import React from 'react'
// import '../Component/Edit_NewProject.css'
import { images } from './images/Imagesholder'
import "../Component/MainContent.css";
import "../Component/ProjectDetails.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
export default function ProjectDetails() {
    const navigate = useNavigate();

    const handleBack = (id) => {
      navigate(`/Myprojects`);
    };
  
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const [ownerEmail, setOwnerEmail] = useState("nicolar.schifano@gmail.com");
    const [userCustomId, setUserCustomId] = useState("MNIST");
    const [createdAt, setCreatedAt] = useState("04/12/2002");
    const [updatedAt, setUpdatedAt] = useState("04/12/2002");
  
    return (
     
      <div className="details_container main_container_editpage">
        <div className="details_header">
          <div className="details_header_left">
            <IoArrowBackOutline
              size={24}
              className="icon"
              onClick={() => handleBack()}
            />
            <h3 className="details_title">Edit - A New Project</h3>
          </div>
          <div className="details_header_right">
            <div className="details_dropdown">
              <div className="details_dropdown_trigger" onClick={toggleDropdown}>
                <h4>Actions</h4>
                {isOpen ? (
                  <img src={images.Icon} alt="action" width={24} />
                ) : (
                  <img src={images.Icon} alt="action" width={24} className="rotate" />
                )}
              </div>
              {isOpen && (
                <div
                  style={{
                    position: "relative",
                  }}
                  className="slide-bottom glass"
                >
                  <div
                    style={{
                      position: "absolute",
                    }}
                    className="dropdown"
                  >
                    <p className="dropdown-item">Delete Project</p>
                    <p className="dropdown-item">
                      Generate Date Bill of Materials
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="details_inputs_container">
          <div>
            <h4>Project Description</h4>
          </div>
          <div className="details_input_collection">
            <div className="details_input_block">
              <label for="user_custom_id">User Custom Id</label>
              <br />
              <input
                type="text"
                id="user_custom_id"
                name="user custom id"
                value={userCustomId}
                onChange={(e) => setUserCustomId(e.target.value)}
              />
              <br></br>
            </div>
            <div className="details_input_block">
              <label for="owner_email">Owner</label>
              <br />
              <input
                type="email"
                id="owner_email"
                name="owner email"
                value={ownerEmail} // Controlled input value
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
              <br></br>
            </div>
            <div className="details_input_block">
              <label for="created_aT">Created</label>
              <br />
              <input
                type="text"
                id="created_at"
                name="created_at"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
              />
              <br></br>
            </div>
            <div className="details_input_block">
              <label for="updated_at">Last Updated</label>
              <br />
              <input
                type="text"
                id="updated_at"
                name="updated_at"
                value={updatedAt}
                onChange={(e) => setUpdatedAt(e.target.value)}
              />
              <br></br>
            </div>
          </div>
        </div>
        <div>
          <div className="members_content d-flex justify-content-between">
            <div className="members_heading">
              <h2>Members</h2>
            </div>
            <div>
              {" "}
              <button className="new_members">Add Members</button>
            </div>
          </div>
          <div className="overflows margin">
            <table className="table table-bordered table-hover">
              <thead className="table_color">
                <tr className="table_row table_row_selected">
                  <th className="members_name members_name_selected">
                    Member Name
                  </th>
                  <th className="members_email members_email_selected">
                    Member Email
                  </th>
                  <th className="actions  actions_selected">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`table_data_row table_data_row_selected `}>
                  <td>A New Project 5</td>
                  <td>newproject@gmail.com</td>
  
                  {/* <td>{data.dataAvailability}</td>
                  <td>{data.personalData}</td> */}
  
                  <td>
                    <button className="edit_link">Remove Member</button>
                  </td>
                </tr>
                <tr className={`table_data_row table_data_row_selected `}>
                  <td>A New Project 4</td>
                  <td>newproject@gmail.com</td>
  
                  {/* <td>{data.dataAvailability}</td>
                  <td>{data.personalData}</td> */}
  
                  <td>
                    <button className="edit_link">Remove Member</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="">
          <div className="assets_content d-flex justify-content-between">
            <div className="assets_heading">
              <h2>Assets</h2>
            </div>
            <div>
              {" "}
              <button className="new_assets">Add Dataset or Model</button>
            </div>
          </div>
          <div className="overflows margin">
            <table className="table table-bordered table-hover">
              <thead className="table_color">
                <tr className="table_row table_row_selected">
                  <th className="asset_name asset_name_selected">Asset Name</th>
                  <th className="modality  modality_selected">Modality</th>
                  <th className="type type_selected">Type</th>
                  <th className="data_provider data_provider_selected">
                    Provider
                  </th>
                  <th className="homepage homepage_selected">Homepage</th>
                  <th className="actions actions_selected">Action</th>
                </tr>
              </thead>
              <tbody className={`table_data_row table_data_row_selected `}>
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: 15 }}>
                    <img src={images.Search} alt="no-result" width={140} />
                    <h1 className="no-result-text">No results..</h1>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }