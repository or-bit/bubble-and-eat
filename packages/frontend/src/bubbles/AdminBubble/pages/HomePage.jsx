import React from 'react';
import PropTypes from 'prop-types';
import { Button, WidgetsContainer } from 'monolith-frontend';

/**
 * (pure function) This module represents the home page in the admin bubble.
 * @module HomePage
 * @property props {Object}
 * @property props.handleBack {Function} Action to perform when back is clicked
 * @property props.handleSubmit {Function} Action to perform when submit is clicked
 * @constructor
 */
const HomePage = ({ handleMenuClick, handleOrdersClick }) => (
    <WidgetsContainer>
        <Button
          callback={() => handleMenuClick()}
          text="Show menu"
        />
        <Button
          callback={() => handleOrdersClick()}
          text="Show orders"
        />
    </WidgetsContainer>
    );

HomePage.propTypes = {
    handleMenuClick: PropTypes.func.isRequired,
    handleOrdersClick: PropTypes.func.isRequired,
};

export default HomePage;
