import { shallow } from 'enzyme';
import * as React from 'react';
import StatusCard from './StatusCard';

describe('AuthCard Test', () => {
	describe('User Login', () => {
		const status = [
			{
				process: 'test',
				timestamp: 123
			}
		];
		it('Test Snapshot', () => {
			const wrapper = shallow(<StatusCard status={status} />);
			expect(wrapper).toMatchSnapshot();
		});
	});
});
