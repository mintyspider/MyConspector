import React, { useState } from 'react'

const Notification = () => {

    const [filter, setFilter] = useState("Все");
    let filters = ['Все', 'Нравится', 'Контекстуры', 'Ответы'];
    let filterOptions = ['all', 'like', 'comment', 'reply'];
    const handleFilter = (e) => {
        let btn = e.target;
        setFilter(btn.innerText);
        console.log("filter=>",filter)
    }
    return (
        <div>
            <h1 className='max-md:hidden text-2xl lg:text-3xl font-medium text-dark-grey text-center'>Оповещения</h1>
            <div className='my-8 flex gap-6'>
                {
                    filters.map((filterName, i) => {
                        return (
                            <button key={i} onClick={handleFilter} className={`text-md md:text-xl font-medium ${filter === filterName ? "text-bold text-purple" : "text-dark-grey"}`}>{filterName}</button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Notification
