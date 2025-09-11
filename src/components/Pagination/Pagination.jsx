import React from "react";
import "./Pagination.css";
import Button from "../../components/Button/Button";

function Pagination({currentPage, totalPages, onPageChange}){
return (
    <div className="pagination">
        
        <Button
            onClick={() => onPageChange(currentPage - 1)} 
            text="Previous"
            disabled={currentPage <= 1}
        />

        <span> Page {currentPage} of {totalPages} </span>
        
        <Button
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage >= totalPages}
            text="Next"
        />
    </div>
);
};

export default Pagination;
