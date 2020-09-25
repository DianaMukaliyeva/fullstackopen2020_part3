import React from 'react';

const Filter = ({ filter, handleFilter }) => (
    <div>
        name: <input value={filter} onChange={handleFilter} />
    </div>
);

export default Filter;
