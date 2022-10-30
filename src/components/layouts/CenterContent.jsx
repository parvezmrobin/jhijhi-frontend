/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */

import React from 'react';
import { node, string } from 'prop-types';

function CenterContent({ col, children }) {
  const _col = col || 'col';

  return (
    <div className="vh-md-100 d-flex align-items-center justify-content-center">
      <div className={_col}>{children}</div>
    </div>
  );
}

CenterContent.propTypes = {
  col: string,
  children: node,
};

export default CenterContent;
