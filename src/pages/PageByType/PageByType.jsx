import React, { useEffect, useState, useContext } from 'react';  
import axiosInstance from '../../axios/axiosInstance';
import { SizeEnum } from "../../enums/enums";
import { useParams } from 'react-router-dom';
import Filter from '../../components/Filter/Filter';
import Cards from '../../components/Cards/Cards';
import "./PageByType.css";
import Pagination from '../../components/Pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faPaw, faAnglesRight, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import Modal from "../../components/Modal/Modal" ;
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from "../../context/AppContext"; 
import Loader from '../../components/Loader/Loader';

function PageByType() {
  const { type } = useParams();
  const { authToken, isAdmin } = useContext(AppContext);  
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    size: [],
    ageRange: '',
    priceRange: ''
  });
  const [petToDelete, setPetToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/Pet/pets-by-type/${type}`);
      setPets(response.data);
      setFilteredPets(response.data);
    } catch (err) {
      console.log(err.message);
      setError("Sorry, we are unable to display the pets at the moment. Please try again later.");
    } finally {
      setLoading(false);
     
    }
  };

  const filterBySize = (pet) => {
    return filters.size.length === 0 || filters.size.includes(SizeEnum[pet.size]);
  };

  const filterByAge = (pet) => {
    if (!filters.ageRange) return true;
    const age = pet.age;
    if (filters.ageRange === "21+") {
      return age >= 21;
    }
    const [min, max] = filters.ageRange.split('-').map(Number);
    return max ? age >= min && age <= max : age >= min;
  };

  const filterByPrice = (pet) => {
    if (!filters.priceRange) return true;
    const price = pet.price;
    if (filters.priceRange === "18+") {
      return price >= 18;  
    }
    const [min, max] = filters.priceRange.split('-').map((value) => parseFloat(value));
    return max ? price >= min && price <= max : price >= min;
  };

  const applyFilters = () => {

    let filtered = [...pets];

    if (searchQuery) {
      filtered = filtered.filter((pet) =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered
      .filter(filterBySize)
      .filter(filterByAge)
      .filter(filterByPrice);

    setFilteredPets(filtered);
    setPageNumber(1);
  
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const petsToShow = filteredPets.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(filteredPets.length / pageSize));

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleDeleteClick = (id) => {
    setPetToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;
    try {
      await axiosInstance.delete(`/Pet/delete-pet/${petToDelete}`);
      setIsDeleteModalOpen(false);
      setPetToDelete(null);
      fetchPets();
      toast.success("Pet deleted successfully!");
      setError(null);
    } catch (err) {
      console.log(err.message);
      setError("Error deleting pet");
      toast.error("There was an error deleting the pet.");
    }
  };

  useEffect(() => {
    fetchPets();
  }, [type]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, pets]);

  return (
    <div className="all-pageT">
      <div className='search-and-text-bytype'>
        <div className='search-and-result-bytype'>
          <div className="search-bar-bytype">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </div>
          <p className="result-info-bytype">Result: {filteredPets.length}</p>
        </div>
        <h3 className={isAdmin ? "admin-textT" : "user-textT"}>
            Pets bring joy! Find your ideal companion to rent today. <FontAwesomeIcon icon={faPaw} />
        </h3>
      </div>

      <div className="pets-sideT">
        <Filter onFilterChange={handleFilterChange} showAnimalType={false} disabled={loading} />

  {loading ? (
      <Loader />
  ) : !loading && filteredPets.length === 0 && !error ? (
    pets.length === 0 ? (
      <p className="no-pets-message">Currently, there are no pets available.</p>
    ) : (
      <p className="no-pets-message">No pets match your search or filters.</p>
    )
  ) : (
          <Cards 
            cardData={petsToShow.map(pet => ({
              imageUrl: "/images/cat.jpg",
              nameImage: pet.nameImage,
              name: pet.name,
              price: pet.price,
              status: pet.status,
              buttonText: " See more",
              buttonLink: `/pet/${pet.id}`,
              icon: faAnglesRight,
              iconS: isAdmin ? faTrash : null,   
              title: "Delete pet",
              onDeleteClick: () => handleDeleteClick(pet.id),
              averageRating: pet.averageRating,
            }))}
            className='pets-page'
          />
        )}
      {error && <p className="error-message">{error}</p>}  
      </div>

      <Pagination 
        currentPage={pageNumber} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
      
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to delete this pet?`}
        />
      )}
    </div>
  );
}

export default PageByType;
