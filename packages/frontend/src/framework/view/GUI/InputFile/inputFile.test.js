import React from 'react';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';


import InputFile from './InputFile';

describe('InputFile', () => {
	it('should contain an input tag', () => {
		const component = shallow(<InputFile id='myid' />);
		expect(component.find('input').length).toEqual(1);
	});

	it('should have id', () => {
		const component = mount(<InputFile id='myid' />);
		expect(component.props().id).toEqual('myid');
	});
});
