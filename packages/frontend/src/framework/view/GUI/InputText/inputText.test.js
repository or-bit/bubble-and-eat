import React from 'react';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';


import InputText from './InputText';

describe('InputText', () => {
	it('should contain an input tag', () => {
		const component = shallow(<InputText id={'mioid'} value={'myvalue'} />);
		expect(component.find('input').length).toEqual(1);
	});

	it('should have id', () => {
		const component = mount(<InputText id={'myid'} value={'myvalue'}/>);
		expect(component.props().id).toEqual('myid');
	});

	it('should have value', () => {
		const component = mount(<InputText id={'myid'} value={'myvalue'}/>);
		expect(component.props().value).toEqual('myvalue');
	});
});
