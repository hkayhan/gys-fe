import React from "react";
import styles from './Pagination.module.css'
const PaginationComp = ({ currentPage, totalPosts, paginate }) => {
    const totalPages = Math.ceil(totalPosts / 25); // Sayfa sayısını hesapla

    // Sayfa numaralarını hesaplayan yardımcı fonksiyon
    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 3;

        // İlk sayfa ve "..." işareti
        if (currentPage > maxPagesToShow + 1) {
            pageNumbers.push(1, "...");
        }

        // Mevcut sayfadan önceki 3 sayfa
        for (let i = Math.max(1, currentPage - maxPagesToShow); i < currentPage; i++) {
            pageNumbers.push(i);
        }

        // Mevcut sayfa
        pageNumbers.push(currentPage);

        // Mevcut sayfadan sonraki 3 sayfa
        for (let i = currentPage + 1; i <= Math.min(currentPage + maxPagesToShow, totalPages); i++) {
            pageNumbers.push(i);
        }

        // Son sayfa ve "..." işareti
        if (currentPage + maxPagesToShow < totalPages) {
            pageNumbers.push("...", totalPages);
        }

        return pageNumbers;
    };

    const handlePageClick = (page) => {
        if (page !== "..." && page !== currentPage) {
            paginate(page); // Sayfa değiştirme fonksiyonu
        }
    };

    return (
        <div className={styles['pagination']} >
            <span className={styles['pagination__number-indicator']}>aaaa</span>
            {/* Önceki Sayfa Butonu */}
            {currentPage > 1 && (
                <button
                    className={styles['pagination__arrow']}
                    onClick={() => paginate(currentPage - 1)}
                >
                    <span className={styles['pagination__arrow-half']}></span>
                    <span className={styles['pagination__arrow-half']}></span>
                </button>
            )}

            {/* Sayfa Numaraları */}
            {generatePageNumbers().map((page, index) => (
                <button
                    key={index}
                    className={`${styles['pagination__number']}  ${
                        page === currentPage ? styles['pagination__number--active'] : ""
                    }`}
                    onClick={() => handlePageClick(page)}
                >
                    {page}
                </button>
            ))}

            {/* Sonraki Sayfa Butonu */}
            {currentPage < totalPages && (
                <button
                    className={`${styles["pagination__arrow"]} ${styles["pagination__arrow--right"]}`}
                    onClick={() => paginate(currentPage + 1)}
                >
                    <span className={styles['pagination__arrow-half']}></span>
                    <span className={styles['pagination__arrow-half']}></span>
                </button>
            )}
            {/*<div className= {`${styles["flex"]}`}>*/}
            {/*    <ul>*/}
            {/*        <li>1</li>*/}
            {/*        <li>2</li>*/}
            {/*        <li>3</li>*/}
            {/*        <li>4</li>*/}
            {/*        <li>5</li>*/}
            {/*        <div className={`${styles["bar"]}`}></div>*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
    );
};

export default PaginationComp;