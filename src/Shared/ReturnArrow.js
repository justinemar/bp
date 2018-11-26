/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const ReturnArrow = ({ history }) => (
  <React.Fragment>
    <label htmlFor="return" className="return-label">
      <FontAwesomeIcon icon="angle-double-left" className="return" />
    </label>
    <input onClick={() => history.goBack()} type="button" id="return" className="opt-none" />
  </React.Fragment>
);


export default ReturnArrow;
