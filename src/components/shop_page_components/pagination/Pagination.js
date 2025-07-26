import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    
    // Show current page and adjacent pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }
    
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button 
        className="pagination-button prev" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← PREVIOUS
      </button>
      
      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          <div 
            key={index} 
            className={`page-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
            onClick={() => page !== '...' && onPageChange(page)}
          >
            {page}
          </div>
        ))}
      </div>
      
      <button 
        className="pagination-button next" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        NEXT →
      </button>
    </div>
  );
};

export default Pagination;
