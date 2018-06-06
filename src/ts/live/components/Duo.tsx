import moment from 'moment';
import * as React from 'react';
import contractUtil from '../common/contractUtil';
import { IBalances, ICustodianPrices, ICustodianStates, IPriceBars } from '../common/types';
import D3OHLCChart from '../containers/D3OHLCChartContainer';

interface IProps {
	account: string;
	refresh: number;
	states: ICustodianStates;
	prices: ICustodianPrices;
	balances: IBalances;
	hourly: IPriceBars;
	minutely: IPriceBars;
}

export default class Duo extends React.PureComponent<IProps> {
	public render() {
		const { account, refresh, states, prices, balances/*, hourly, minutely*/ } = this.props;
		return (
			<div style={{position: 'relative'}}>
				<button onClick={() => contractUtil.create(account, 0.1)}>Create 0.1 eth</button>
				<button
					onClick={() => contractUtil.redeem(account, balances.tokenA, balances.tokenB)}
				>
					Redeem all balance
				</button>
				<div>{account || 'Unknown'}</div>
				<div>{'Updated at ' + moment(refresh).format()}</div>
				<pre>{JSON.stringify(states, null, 4)}</pre>
				<pre>{JSON.stringify(prices, null, 4)}</pre>
				<pre>{JSON.stringify(balances, null, 4)}</pre>
				<div className='d3-test-graph'><D3OHLCChart/></div>
			</div>
		);
	}
}