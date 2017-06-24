import React from 'react';
import PropTypes from 'prop-types';

const ClientInfo = ({ client }) => {
    const render = () => (
        <div>
            <h3>Client name: {client.name}</h3>
        </div>
    );

    return render();
};

ClientInfo.propTypes = {
    client: PropTypes.object.isRequired,
};

export default ClientInfo;
