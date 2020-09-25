import React from 'react';

const Notification = ({ message, error }) => {
    const style = {
        color: error ? 'red' : 'green',
        backgroundColor: '#D3D3D3',
        fontSize: 20,
        border: error ? '2px solid red' : '2px solid green',
        margin: '10px',
        padding: '5px',
    };

    if (message === null) {
        return null;
    }

    return <div style={style}>{message}</div>;
};

export default Notification;
