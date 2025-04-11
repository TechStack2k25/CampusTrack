import React from 'react';
import '../styles/loading.css'; 

const Loading = ({ text = "Loading ...", size = 40 }) => {
  return (
    <div className="loading-container" role="status">
      <div className="spinner" style={{ width: size, height: size }}></div>
      <p className="loading-text">{text}</p>
    </div>
  );
};


export default Loading;
