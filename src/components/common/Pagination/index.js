import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from '../../../hooks/usePagination';
import styles from './Pagination.module.scss';

const cx = classnames.bind(styles);

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={cx(styles.paginationContainer, { [className]: className })}
    >
      <li
        className={cx(styles.paginationItem, {
          [styles.disabled]: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className={cx(styles.arrow, styles.left)} />
      </li>
      {paginationRange.map((pageNumber, idx) => {
        if (pageNumber === DOTS) {
          return <li className={cx(styles.paginationItem, styles.dots)} key={idx}>&#8230;</li>;
        }

        return (
          <li
            className={cx(styles.paginationItem, {
              [styles.selected]: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
            key={idx}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={cx(styles.paginationItem, {
          [styles.disabled]: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className={cx(styles.arrow, styles.right)} />
      </li>
    </ul>
  );
};

export default Pagination;