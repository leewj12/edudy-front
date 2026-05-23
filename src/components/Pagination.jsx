// src/components/Pagination.jsx
import React from 'react';
import styles from '../css/Pagination.module.css';

const Pagination = ({ currentPage, totalPages, pagesPerGroup = 5, onPageChange }) => {
  if (totalPages < 1) return null;

  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const groupStartPage = (currentGroup - 1) * pagesPerGroup + 1;
  const groupEndPage = Math.min(groupStartPage + pagesPerGroup - 1, totalPages);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);

  const handlePreviousGroup = () => {
    if (currentGroup > 1) {
      const newGroup = currentGroup - 1;
      onPageChange((newGroup - 1) * pagesPerGroup + 1);
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < totalGroups) {
      const newGroup = currentGroup + 1;
      onPageChange((newGroup - 1) * pagesPerGroup + 1);
    }
  };

  return (
    <div className={styles.paginationWrapper}>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        처음
      </button>
      
      <button
        onClick={handlePreviousGroup}
        disabled={currentGroup === 1}
        className={styles.pageButton}
      >
        {'<'}
      </button>

      {Array.from({ length: groupEndPage - groupStartPage + 1 }, (_, i) => {
        const page = groupStartPage + i;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={handleNextGroup}
        disabled={currentGroup === totalGroups}
        className={styles.pageButton}
      >
        {'>'}
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        끝
      </button>
    </div>
  );
};

export default Pagination;
