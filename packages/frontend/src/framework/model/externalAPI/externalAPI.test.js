import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import ExternalAPI from './ExternalAPI';

describe('ExternalAPI', () => {

	it('should have myurl', () => { //test an empty url
		const component = mount(<ExternalAPI myurl={'emptyurl'} />);
		expect(component.state().myurl).toEqual('emptyurl');
		expect(component.state().informations).toEqual('no info found');
	});

	it('informations should contain JSON found at url', () => {
		const component = mount(<ExternalAPI myurl={'http://api.icndb.com/jokes/random'} />);
		expect(component.state().myurl).toEqual('http://api.icndb.com/jokes/random');
		const url='http://api.icndb.com/jokes/random';

		let request = new XMLHttpRequest();
		request.open('GET', url, false);
		request.send(null);
	
		let info="empty informations";
		if (request.status === 200) {
			info=request.responseText;
		}
		expect(component.state().informations).toEqual(info);
	});

});
