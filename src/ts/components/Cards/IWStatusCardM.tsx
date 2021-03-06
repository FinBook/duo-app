// import {
// 	Constants as WrapperConstants,
// 	ICustodianAddresses,
// 	IDualClassStates
// } from '@finbook/duo-contract-wrapper';
//import { IStakeAddress, IStakeStates } from '@finbook/duo-contract-wrapper';
import { Divider } from 'antd';
import * as d3 from 'd3';
import ethIcon from 'images/ethIconBg.png';
import moment from 'moment';
import * as React from 'react';
import { Link } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import * as StakingCST from 'ts/common/stakingCST';
import { SDivFlexCenter } from '../_styled';
import { SCard, SCardTitle, SStakingSwitch } from './_styled';

interface IProps {
	locale: string;
	boundaries: number[];
	phase: number;
	lastPrice: number;
	settlePrice: number;
	obPrice: number;
}
interface IState {
	countdown: string;
}

export default class IWStatusCardM extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			countdown: ''
		};
	}
	private timerID: number = 0;

	private updateCountdown = () => {
		const { phase } = this.props;
		const today = moment.utc().format('YYYY-MM-DD');
		const tommorow = moment
			.utc(today, 'YYYY-MM-DD')
			.add(1, 'days')
			.format('YYYY-MM-DD');
		const checkPoints = [
			0,
			moment.utc(`${today} 12:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf(),
			moment.utc(`${tommorow} 00:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf(),
			moment.utc(`${today} 04:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf()
		];
		const now = moment.utc();
		if (phase) {
			const diff = now.diff(checkPoints[phase]);
			this.setState({ countdown: moment.utc(Math.abs(diff)).format('HH:mm:ss') });
		}
	};

	public componentDidMount() {
		this.timerID = window.setInterval(() => this.updateCountdown(), 1000);
	}

	public componentWillUnmount() {
		window.clearInterval(this.timerID);
	}

	public render() {
		const { locale, boundaries, phase, lastPrice, settlePrice, obPrice } = this.props;
		const { countdown } = this.state;
		const result = settlePrice > obPrice * (1 - boundaries[0]) && settlePrice < obPrice * (1 + boundaries[0]) ? StakingCST.STK_IN[locale] : StakingCST.STK_OUT[locale]
		return (
			<SCard
				title={<SCardTitle>{StakingCST.STK_IW[locale]}</SCardTitle>}
				width="95%"
				margin="10px 0 20px 0"
				extra={
					<Link to={'/flex'}>
						<SStakingSwitch style={{ width: 124 }}>
							{StakingCST.STK_TOFLEX[locale]}
						</SStakingSwitch>
					</Link>
				}
			>
				<img
					src={ethIcon}
					style={{
						position: 'absolute',
						width: 100,
						height: 51,
						top: 48,
						right: 136,
						opacity: 0.07
					}}
				/>
				<div
					style={{
						width: '100%',
						textAlign: 'center',
						marginTop: 12,
						marginBottom: -10,
						fontSize: 18,
						fontWeight: 500,
						color: 'rgba(64,79,84,.8)'
					}}
				>
					ETH/USD
				</div>
				<Divider dashed />
				<SDivFlexCenter
					horizontal
					padding={'0 10px'}
					marginTop="-12px"
					marginBottom="-12px"
					style={{
						alignItems: 'center'
					}}
				>
					<div
						style={{
							padding: '5px 10px',
							fontSize: 40,
							fontWeight: 500,
							color: '#5CA4DE',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						{lastPrice ? d3.format('.2f')(lastPrice) : '-'}
					</div>
					<div
						style={{
							padding: '5px 10px'
						}}
					>
						<div
							style={{
								fontSize: 12,
								color: 'rgba(64,79,84,.8)'
							}}
						>
							{phase === 1
								? `${StakingCST.STK_VOLATILITY[locale]} ≤`
								: phase === 2
								? StakingCST.STK_ETHRANGE[locale]
								: StakingCST.STK_SETTLE[locale]}
						</div>
						<div
							style={{
								fontSize: 18,
								fontWeight: 500,
								color: '#5CA4DE'
							}}
						>
							{phase === 1
								? `± ${d3.format(',.2%')(boundaries[0])}`
								: phase === 2
								? obPrice === 0
									? 'Loading'
									: `${d3.format('.2f')(
											obPrice * (1 - boundaries[0])
									)} ~ ${d3.format('.2f')(obPrice * (1 + boundaries[0]))}`
								: settlePrice === 0
								? 'Loading'
								: `${d3.format('.2f')(settlePrice)} ${result}`}
						</div>
					</div>
				</SDivFlexCenter>
				<Divider dashed />
				<SDivFlexCenter
					horizontal
					padding={'0 14px'}
					marginTop="-12px"
					marginBottom="12px"
				>
					<div
						style={{
							padding: '5px 10px',
							fontSize: 16,
							fontWeight: 500,
							color: '#5CA4DE',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						{StakingCST.PHASE[phase][locale]}
					</div>
					<div
						style={{
							padding: '5px 5px',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						<span style={{ fontSize: 10, color: 'rgba(64,79,84,.8)' }}>
							{StakingCST.STK_TIMELEFT[locale]}
						</span>
						<span
							style={{
								display: 'flex',
								alignItems: 'center',
								marginLeft: 10,
								fontWeight: 500,
								fontSize: 16,
								color: '#5CA4DE'
							}}
						>
							{countdown ? countdown : 'Loading'}
						</span>
					</div>
				</SDivFlexCenter>
			</SCard>
		);
	}
}
