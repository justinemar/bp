
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';

function Spinner({ fetchInProgress, defaultRender }) {
    if (fetchInProgress) {
        return (
          <FontAwesomeIcon className="dashboard-icon fa-spin" icon="spinner" />
        );
    }
    return defaultRender;
}


export default Spinner;
