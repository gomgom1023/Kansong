import React from "react";
import useBoardState from "../store/noticeState";
import '../pagenation.css'

const Pagenation = ({totalPages}) => {
    const { currentPage, getTotalPages, setCurrentPage, goToPreviousGroup, goToNextGroup, goToPreviousPage, goToNextPage} = useBoardState();
    //const totalPage = getTotalPages();
    //const pageNumbers = [...Array(totalPage).keys()].map((num) => num + 1);
    const pageNumbers = Array.from({length : totalPages}, (_, i) => i + 1);

    return(
        <div className="pagination">
            <button onClick={goToPreviousGroup} className=""><i className="xi-angle-left"></i><i className="xi-angle-left"></i></button>
            <button onClick={goToPreviousPage}><i className="xi-angle-left"></i></button>

            {pageNumbers.map((num) => (
                <button key={num} onClick={() => setCurrentPage(num)} className={num === currentPage ? "active" : ""}>
                    {num}
                </button>
            ))}

            <button onClick={goToNextPage}><i className="xi-angle-right"></i></button>
            <button onClick={goToNextGroup}><i className="xi-angle-right"></i><i className="xi-angle-right"></i></button>
        </div>
    )
}

export default Pagenation;