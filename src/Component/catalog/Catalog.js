import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '../images/Imagesholder';
import Loader from '../shared/loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FILTER_INITIAL_VALUE } from '../../constant/constant';
import CatalogTabs from './tabs';
import { pageCounter } from '../../helpers';
import '../Catalog.css';
import { BASE_URL, catelogListingApi } from '../../dataSources/Api/catelogApi';
import CatalogFilter from './calalogFilter';

const Catalog = () => {
  const [activeLink, setActiveLink] = useState('data-source');
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedItems = localStorage.getItem('selectedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [response, setResponse] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [filterValue, setFilterValue] = useState(FILTER_INITIAL_VALUE);
  const [userEmail, setUserEmail] = useState(null); // Store user email in state
  const filteredData = response;

  const navigate = useNavigate();
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const nextPage = () => {
    setLoading(true);
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    setLoading(true);
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const offset = (currentPage - 1) * rowsPerPage;

  const fetchData = async () => {
    setLoading(true);
    await catelogListingApi({
      limit: rowsPerPage,
      offset,
      filterData: filterValue,
    })
      .then((res) => {
        if (res) {
          setResponse(res?.entries);
          setTotalCount(res?.total_count);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [rowsPerPage, currentPage, filterValue]);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleDelete = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedItems = prevSelectedItems.filter((itemId) => itemId !== id);
      localStorage.setItem('selectedItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => {
      const newSelectedItems = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];

      localStorage.setItem('selectedItems', JSON.stringify(newSelectedItems));
      return newSelectedItems;
    });
  };
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedData1 = localStorage.getItem('sb-kybenuowpsbpozixatsc-auth-token');
    console.log("asdfghjkl", storedData1);

    if (storedData1) {
      const parsedData = JSON.parse(storedData1);
      const email = parsedData ? parsedData.user.email : null;
      setUserEmail(email);
    } else {
      console.log('No data found in localStorage.');
    }
  }, []);

  const handleSave = async () => {
    let newErrors = {};
    if (!projectName) {
      newErrors.projectName = 'This field is required';
    }
    if (!projectDescription) {
      newErrors.projectDescription = 'This field is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(`${BASE_URL}/create_ai_project`, {
          project_name: projectName,
          description: projectDescription,
          owner: userEmail, 
          user_custom_id: 'proj_1234',
          project_details: {
            pipeline: 'standard',
            status: 'active',
          },
          members: [
            { email: userEmail },
          ],
        });

        if (response.status === 200) {
          toast.success('', {
            position: 'top-right',
            autoClose: 3000,
          });
          handleCloseModal();
          setProjectName('');
          setProjectDescription('');
          navigate('/Myproject');
          localStorage.removeItem('selectedItems');

        }
      } catch (error) {
        toast.error('', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error('API error:', error);
      }
    }
  };
  const downloadCSV = () => {
    const csvRows = filteredData.map((item) => [
      item.full_name,
      item.modality,
      item.spdx_id,
      item.data_availability,
      // Check if personal_data_type is an array before calling .join()
      Array.isArray(item.personal_data_type)
        ? item.personal_data_type.join(', ')
        : item.personal_data_type || '',
    ]);
    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Selected_Data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container-fluid body_color_right">
        <CatalogFilter
          setCatlogFilterValue={setFilterValue}
          filterValue={filterValue}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <div className="parent_div">
          <CatalogTabs
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            setIsOpen={setIsOpen}
          />

          <div className="table-container">
            <div className="container-fluid calatog-table">
              <div className="row">
                <main className="col-12 p-0">
                  {activeLink === 'data-source' ? (
                    <>
                      <div className="overflows">
                        <table className="table table-bordered table-hover">
                          <thead className="table_color">
                            <tr className="table_row">
                              <th className="head_check_box">
                                <input
                                  type="checkbox"
                                  onChange={() => {
                                    const allIds = filteredData?.map(
                                      (data) => data.id
                                    );
                                    if (
                                      selectedItems?.length ===
                                      filteredData?.length
                                    ) {
                                      setSelectedItems([]);
                                      localStorage.removeItem('selectedItems');
                                    } else {
                                      setSelectedItems(allIds);
                                      localStorage.setItem(
                                        'selectedItems',
                                        JSON.stringify(allIds)
                                      );
                                    }
                                  }}
                                  checked={
                                    selectedItems?.length ===
                                    filteredData?.length
                                  }
                                />
                              </th>
                              <th className="full_name">Full Name</th>
                              <th className="modality">Modality</th>
                              <th className="Data_provider">Data Provider</th>
                              <th className="Data_availablity">
                                Data Availability
                              </th>
                              <th className="personal_data">Personal Data</th>
                              <th className="terms">Terms</th>
                              <th className="Homepage">Source Link</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((data) => (
                              <tr key={data.id} className={`table_data_row`}>
                                <td className="head_check_box">
                                  <input
                                    type="checkbox"
                                    checked={selectedItems?.includes(data.id)}
                                    onChange={() =>
                                      handleCheckboxChange(data.id)
                                    }
                                  />
                                </td>
                                <td>{data.full_name}</td>
                                <td>{data.modality || '-'}</td>
                                <td>{data.data_provider || '-'}</td>
                                <td>{data.data_availability || '-'}</td>
                                <td>{data.personal_data_type || '-'}</td>
                                <td>{data.usage_terms_type || '-'}</td>
                                <td>
                                  {' '}
                                  <a href={data.homepage} className="home_page">
                                    Link
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="d-flex justify-content-between page page">
                        <div className="d-flex align-items-center pages">
                          <label htmlFor="rowsPerPage" className="rowsPerPage">
                            Results per page
                          </label>
                          <select
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                          >
                            {pageCounter(totalCount, rowsPerPage)?.map((val) => (
                              <option value={val} key={`${val + 1}`}>
                                {val}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="d-flex align-items-center">
                          {currentPage > 1 && (
                            <span
                              className="color-icon-button home_page right_arrows"
                              onClick={prevPage}
                            >
                              <img
                                className="right_arrow1"
                                src={images.Right1}
                                alt="Back Arrow"
                              />
                            </span>
                          )}

                          <span className=" pagination-page">
                            Page {currentPage} of{' '}
                            {Math.ceil(totalCount / rowsPerPage)}
                          </span>

                          {currentPage <
                            Math.ceil(totalCount / rowsPerPage) && (
                            <span
                              className="color-icon-button home_page right_arrows"
                              onClick={nextPage}
                            >
                              <img
                                className="right_arrow2"
                                src={images.Right2}
                                alt="Next Arrow"
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="overflows">
                        <table className="table table-bordered table-hover">
                          <thead className="table_color">
                            <tr className="table_row table_row_selected">
                              <th className="full_name full_name_selected">
                                Full Name
                              </th>
                              <th className="modality  modality_selected">
                                Modality
                              </th>
                              <th className="Data_provider Data_provider_Selected">
                                Data Provider
                              </th>

                              <th className="terms terms__Selected">Terms</th>
                              <th className="Homepage Homepage_Selected">
                                Remove
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData
                              .filter((data) => selectedItems.includes(data.id))
                              .map((data) => (
                                <tr
                                  key={data.id}
                                  className={`table_data_row table_data_row_selected `}
                                >
                                  <td>{data.full_name}</td>
                                  <td>{data.modality}</td>
                                  <td>{data.data_provider}</td>
                                  <td>{data.usage_terms_type}</td>
                                  <td>
                                    <img
                                      className="delete "
                                      onClick={() => handleDelete(data.id)}
                                      src={images.Delete}
                                      alt="delete"
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>

                        {isModalOpen && (
                          <div className="modal-overlay">
                            <div className="modal-content">
                              <div className="main_box_catalog">
                                <div className="Catalog_pop_box">
                                  <div className="d-flex justify-content-between">
                                    <div></div>
                                    <div className="d-flex align-items-center Save_as_project">
                                      <h5 className="m-0">Save as a Project</h5>
                                    </div>
                                    <div>
                                      <button
                                        onClick={handleCloseModal}
                                        className="cross_btn p-0"
                                      >
                                        <img src={images.Cross1} alt="cross" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="input_text_container">
                                    <div className="input-wrapper">
                                      <label
                                        htmlFor="projectName"
                                        className="label-inputtext"
                                      >
                                        Project Name
                                      </label>
                                      <input
                                        type="text"
                                        className={`input-text ${
                                          errors.projectName
                                            ? 'input-error'
                                            : ''
                                        }`}
                                        placeholder="Badal.Ai"
                                        value={projectName}
                                        onChange={(e) =>
                                          setProjectName(e.target.value)
                                        }
                                        required
                                      />
                                      <div className="error-field-required">
                                        {' '}
                                        {errors.projectName && (
                                          <span className="error-message">
                                            {errors.projectName}
                                          </span>
                                        )}{' '}
                                      </div>
                                    </div>

                                    <div className="input-wrapper">
                                      <label
                                        htmlFor="projectDescription"
                                        className="label-inputtext"
                                      >
                                        Project Description
                                      </label>
                                      <input
                                        type="text"
                                        className={`input-text ${
                                          errors.projectDescription
                                            ? 'input-error'
                                            : ''
                                        }`}
                                        placeholder="badal.Ai"
                                        value={projectDescription}
                                        onChange={(e) =>
                                          setProjectDescription(e.target.value)
                                        }
                                        required
                                      />
                                      <div className="error-field-required">
                                        {' '}
                                        {errors.projectDescription && (
                                          <span className="error-message">
                                            {errors.projectDescription}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="botton_comb d-flex justify-content-end">
                                  <div className="d-flex button_bar">
                                    <div>
                                      <div>
                                        <button
                                          className=" Filters"
                                          onClick={handleCloseModal}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                    <div>
                                      <button
                                        className=" Filters filter_apply_btn "
                                        onClick={handleSave}
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="botton_comb d-flex justify-content-end">
                        <div className="d-flex button_bar">
                          <div>
                            <button
                              className=" Save_aProject"
                              onClick={handleButtonClick}
                            >
                              Save as Project
                            </button>
                          </div>{' '}
                          <div>
                            <button
                              className=" filter_apply_btn Bill_Material"
                              onClick={downloadCSV}
                            >
                              Generate Data Bill of Material
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalog;
