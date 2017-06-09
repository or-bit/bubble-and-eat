import React from 'react';
import { shallow, mount } from 'enzyme';


import Label from './Label';

describe('Label', () => {
    it('renders without crashing', () => {
        mount(<Label value="label" forId="id" />);
    });

    describe('render', () => {
        it('should render the label with value = label', () => {
            const label = shallow(<Label value="label" forId="id" />);
            const instance = label.instance();
            expect(instance.props.value).toBe('label');
            expect(instance.props.forId).toBe('id');
        });
    });
});
