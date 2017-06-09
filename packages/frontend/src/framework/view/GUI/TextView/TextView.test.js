import React from 'react';
import { shallow, mount } from 'enzyme';
import TextView from './TextView';

describe('TextView', () => {
    it('renders without crashing', () => {
        mount(<TextView text="This is a textView" />);
    });

    describe('render', () => {
        it('should render the textView', () => {
            const textView = shallow(<TextView text="This is a textView" />);
            const instance = textView.instance();
            expect(instance.props.text).toBe('This is a textView');
        });
    });
});
