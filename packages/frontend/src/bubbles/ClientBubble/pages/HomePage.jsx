import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

/**
 * (pure function) This module represents the home page in the client bubble.
 * @param handleMenuClick {Function} Action to perform when the Show menu button is clicked
 * @param handleOrderClick {Function} Action to perform when the Order something button is clicked
 * @constructor
 */
const HomePage = ({ handleMenuClick, handleOrderClick }) => (
    <div>
        <Button
          callback={() => handleMenuClick()}
          text="Show menu"
        />
        <Button
          callback={() => handleOrderClick()}
          text="Order something"
        />
    </div>
);

HomePage.propTypes = {
    handleMenuClick: PropTypes.func.isRequired,
    handleOrderClick: PropTypes.func.isRequired,
};

export default HomePage;
