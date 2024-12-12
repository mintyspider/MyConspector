import React from "react";

const LoadMoreDataBtn = ({ state, fetchDataFun, additionalData }) => {
    if (state && state.totalDocs > state.results.length) {
        console.log("totalDocs:", state.totalDocs, "results:", state.results.length, "currentPage:", state.page);
        return (
            <button
                onClick={() => fetchDataFun({ ...additionalData, page: state.page + 1 })}
                className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
                Показать еще (●ˇ∀ˇ●)
            </button>
        );
    }

    return null;
};

export default LoadMoreDataBtn;
