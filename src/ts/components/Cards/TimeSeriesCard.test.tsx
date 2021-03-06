// fix for @ledgerhq/hw-transport-u2f 4.28.0
import '@babel/polyfill';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import * as React from 'react';
import RadioExtra from '../Common/RadioExtra';
import TimeSeriesCard from './TimeSeriesCard';

describe('TimeSeriesCard Test', () => {
	describe('Test Snapshot', () => {
		const acceptedPrices = [
			{
				contractAddress: '0x0',
				sender: '0x0',
				timestamp: 1539843443,
				transactionHash: 'test',
				blockNumber: 3,
				price: 123,
				navA: 123,
				navB: 123
			}
		];
		const locale = 'EN';
		const period = 60;
		const source = 'test';
		const prices = [
			{
				base: 'USD',
				close: 203.69,
				high: 203.72,
				low: 203.67,
				open: 203.72,
				period: 60,
				quote: 'ETH',
				source: 'kraken',
				timestamp: 1539846000000,
				volume: 0
			}
		];
		const handleSourceUpdate = jest.fn(() => 1234567890);
		const handlePeriodUpdate = jest.fn(() => 1234567890);
		it('Test Snapshot', () => {
			const wrapper = shallow(
				<TimeSeriesCard
					type={'type'}
					underlying={'underlying'}
					tokenA={'tokenA'}
					tokenB={'tokenB'}
					acceptedPrices={acceptedPrices}
					locale={locale}
					period={period}
					prices={prices}
					source={source}
					handleSourceUpdate={handleSourceUpdate}
					handlePeriodUpdate={handlePeriodUpdate}
				/>
			);
			expect(wrapper).toMatchSnapshot();
		});
		it('Test Snapshot', () => {
			const wrapper = mount(
				<TimeSeriesCard
					type={'type'}
					underlying={'underlying'}
					tokenA={'tokenA'}
					tokenB={'tokenB'}
					acceptedPrices={acceptedPrices}
					locale={locale}
					period={5}
					prices={prices}
					source={source}
					handleSourceUpdate={handleSourceUpdate}
					handlePeriodUpdate={handlePeriodUpdate}
				/>
			);
			wrapper.find(RadioExtra).simulate('change', { target: { value: '5' } });
		});
	});
});
