import React from 'react';
import PropTypes from 'prop-types';
import { Button, WidgetsContainer } from 'monolith-frontend';

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
