import React from 'react';
import PropTypes from 'prop-types';

export default function Image({ caption, src }) {
    return (
        <figure>
            <img alt={caption} src={src} />
            <figcaption>{caption}</figcaption>
        </figure>
    );
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
};
