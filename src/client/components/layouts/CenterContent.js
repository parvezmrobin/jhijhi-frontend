/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React from 'react';


function CenterContent(props) {
  const col = props.col || 'col';

  return (
    <div className="vh-md-100 d-flex align-items-center justify-content-center">
      <div className={col}>
        {props.children}
      </div>
    </div>
  );
}

export default CenterContent;
