import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'monolith-frontend';

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
