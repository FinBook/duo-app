// import {
// 	Constants as WrapperConstants,
// 	ICustodianAddresses,
// 	IDualClassStates
// } from '@finbook/duo-contract-wrapper';
//import { IStakeAddress, IStakeStates } from '@finbook/duo-contract-wrapper';
import * as d3 from 'd3';
import avt from 'images/avatar.png';
import duoIcon from 'images/Duo_black.png';
import * as React from 'react';
import * as StakingCST from 'ts/common/stakingCST';
//import { Link } from 'react-router-dom';
import warrentUtil from 'ts/common/warrantUtil';
import { stakeWrappers } from 'ts/common/wrappers';
import { SCard, SCardTag2, SCardTitle, SStakingButtonM, SStakingButtonM2, SStakingInput } from './_styled';

interface IProps {
	address: string;
	locale: string;
	duoBalance: number;
	refresh: () => any;
}

interface IState {
	addressInfo: any;
	inputText: string;
	inputValue: number;
}

export default class IWOperationCard extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			addressInfo: {},
			inputText: '',
			inputValue: 0
		};
	}
	private handleInputChange = (value: string) => {
		const newText =
			parseInt(value, 0).toString() === 'NaN' ? '' : parseInt(value, 0).toString();
		this.setState({ inputText: newText, inputValue: parseInt(value, 0) });
	};
	private insertStake = async (txHash: string) => {
		const item = {
			address: this.props.address,
			amount: this.state.inputValue.toString(),
			txHash: txHash
		};
		warrentUtil.insetStakingEntry(item);
	};
	private handleStake = async () => {
		const { address, locale, refresh } = this.props;
		const contractIndex = 0;
		const oracleAddr = '0x8cff57292ab098728f26f7d2e2bdfc6b1729dddb';
		const { inputValue } = this.state;
		if (inputValue >= 300) {
			const txHash = await stakeWrappers[contractIndex].stake(
				address,
				oracleAddr,
				inputValue,
				{
					gasLimit: 1000000
				}
			);
			this.insertStake(txHash);
			this.setState({ inputText: '', inputValue: 0 });
			refresh();
			console.log('Transaction submit: ' + txHash);
		} else {
			window.alert(StakingCST.STK_WARING2[locale] + '300 duo');
			this.setState({ inputText: '', inputValue: 0 });
		}
	};

	public render() {
		const { address, locale, duoBalance } = this.props;
		const { inputText } = this.state;
		return (
			<SCard
				title={<SCardTitle>Operation</SCardTitle>}
				width="500px"
				margin="0 0 0 0"
				height="300px"
			>
				<div style={{ marginTop: 15 }}>
					<a
						style={{ color: 'rgba(0,0,0,.6)' }}
						target="_blank"
						href={
							'https://etherscan.io/token/0x56e0b2c7694e6e10391e870774daa45cf6583486?a=' +
							address
						}
					>
						<img
							style={{
								width: 16,
								height: 16,
								marginRight: 10,
								marginLeft: 5
							}}
							src={avt}
						/>
						{StakingCST.STK_ADDRESS[locale]}:{' '}
						<span style={{ color: '#5CA4DE' }}>{address}</span>
					</a>
				</div>
				<div
					style={{
						width: 455,
						display: 'flex',
						justifyContent: 'space-between'
					}}
				>
					<SCardTag2 style={{width: 220}}>
						<div className="bg-logo">
							<img src={duoIcon} />
						</div>
						<div className="tag-content" style={{ pointerEvents: 'none' }}>
							<div className={'tag-price USD'} style={{ fontSize: 12 }}>
								{StakingCST.STK_BALANCE[locale]}
							</div>
						</div>
						<div className="tag-subtext" style={{ pointerEvents: 'none' }}>
							<div
								style={{
									marginLeft: 20,
									fontSize: 20,
									fontWeight: 500,
									color: '#5CA4DE'
								}}
							>
								{d3.format(',.2f')(duoBalance)}
								<span style={{ fontSize: 10, marginLeft: 5 }}>DUO</span>
							</div>
						</div>
						<div
							style={{
								position: 'absolute',
								right: 10,
								top: 18
							}}
						>
							<SStakingButtonM
								// onClick={this.handleApprove}
								// style={{
								// 	pointerEvents: enableApprove ? 'initial' : 'none',
								// 	opacity: enableApprove ? 1 : 0.4
								// }}
							>
								{StakingCST.STK_APPROVE[locale]}
							</SStakingButtonM>
						</div>
					</SCardTag2>
					<SCardTag2 style={{width: 220}}>
						<div className="bg-logo">
							<img src={duoIcon} />
						</div>
						<div className="tag-content" style={{ pointerEvents: 'none' }}>
							<div className={'tag-price USD'} style={{ fontSize: 12 }}>
								{StakingCST.STK_AWARD[locale]}
							</div>
						</div>
						<div className="tag-subtext" style={{ pointerEvents: 'none' }}>
							<div
								style={{
									marginLeft: 20,
									fontSize: 20,
									fontWeight: 500,
									color: '#5CA4DE'
								}}
							>
								{d3.format(',.2f')(0.00)}
							</div>
						</div>
						<div
							style={{
								position: 'absolute',
								right: 10,
								top: 18
							}}
						>
							<SStakingButtonM
								// style={{ cursor: !enabled ? 'not-allowed' : 'default' }}
								// onClick={() =>
								// 	enabled &&
								// 	stakeWrappers[contractIndex].claimAward(address, {
								// 		gasLimit: 1000000
								// 	})
								// }
							>
								{StakingCST.STK_CLAIM[locale]}
							</SStakingButtonM>
						</div>
					</SCardTag2>
				</div>
				<div
					style={{
						width: 168,
						marginTop: 10,
						height: 90,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between'
					}}
				>
					<div
						style={{
							width: '100%',
							height: 60,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							border: '1px dashed rgba(0,0,0,.2)',
							padding: 2
						}}
					>
						<SStakingInput
							placeholder={StakingCST.STK_PLACEHODLER[locale]}
							value={inputText}
							onChange={e => this.handleInputChange(e.target.value)}
						/>
						<SStakingButtonM2 onClick={() => this.handleStake()}>
							{StakingCST.STK_STAKE[locale]}
						</SStakingButtonM2>
					</div>
				</div>
			</SCard>
		);
	}
}
