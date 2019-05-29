// import {
// 	Constants as WrapperConstants,
// 	ICustodianAddresses,
// 	IDualClassStates
// } from '@finbook/duo-contract-wrapper';
//import { Table } from 'antd';
//import * as CST from 'ts/common/constants';
import * as d3 from 'd3';
import avt from 'images/avatar.png';
import duo3d from 'images/duo-3d.png';
import duoIcon from 'images/Duo_black.png';
import * as React from 'react';
//import { ColorStyles } from 'ts/common/styles';
import { web3Wrapper } from 'ts/common/wrappers';
import { stakeWrapper } from 'ts/common/wrappers';
import { SCard, SCardTag2, SCardTitle, SStakingButtonM } from './_styled';

interface IProps {
	enabled: boolean;
	address: string;
	duoBalance: number;
	award: number;
}

export default class AdminCard extends React.Component<IProps> {
	private handleApprove = async () => {
		const { address } = this.props;
		const txHash = await web3Wrapper.erc20Approve(
			web3Wrapper.contractAddresses.DUO,
			address,
			web3Wrapper.contractAddresses.Stake,
			0,
			true
		);
		console.log('Transaction submit: ' + txHash);
	};

	public render() {
		const { enabled, address, duoBalance, award } = this.props;
		return (
			<SCard
				title={
					<SCardTitle>
						DUO Staking
						<span style={{ fontSize: 14, marginLeft: 10 }}>
							{'(Staking/Unstaking ' + (enabled ? 'Enabled' : 'Disabled') + ')'}
						</span>
					</SCardTitle>
				}
				width="960px"
				margin="0 0 20px 0"
			>
				<div style={{ marginTop: 15 }}>
					<img
						style={{ width: 16, height: 16, marginRight: 10, marginLeft: 5 }}
						src={avt}
					/>
					My address: <span style={{ color: '#5CA4DE' }}>{address}</span>
				</div>
				<img
					style={{
						position: 'absolute',
						right: 15,
						bottom: 10,
						height: 100,
						width: 220
					}}
					src={duo3d}
				/>
				<div style={{ width: 560, display: 'flex', justifyContent: 'space-between' }}>
					<SCardTag2 style={{ pointerEvents: 'none' }}>
						<div className="bg-logo">
							<img src={duoIcon} />
						</div>
						<div className="tag-content">
							<div className={'tag-price USD'} style={{ fontSize: 12 }}>
								DUO Balance
							</div>
						</div>
						<div className="tag-subtext">
							<div
								style={{
									marginLeft: 20,
									fontSize: 20,
									fontWeight: 500,
									color: '#5CA4DE'
								}}
							>
								{d3.format(',.2f')(duoBalance)}
							</div>
						</div>
					</SCardTag2>
					<SCardTag2 style={{ pointerEvents: 'none' }}>
						<div className="bg-logo">
							<img src={duoIcon} />
						</div>
						<div className="tag-content">
							<div className={'tag-price USD'} style={{ fontSize: 12 }}>
								Staking Award
							</div>
						</div>
						<div className="tag-subtext">
							<div
								style={{
									marginLeft: 20,
									fontSize: 20,
									fontWeight: 500,
									color: '#5CA4DE'
								}}
							>
								{d3.format(',.2f')(award)}
							</div>
						</div>
					</SCardTag2>
					<div
						style={{
							width: 120,
							marginTop: 20,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							paddingBottom: 10
						}}
					>
						<SStakingButtonM onClick={this.handleApprove}>Approve DUO</SStakingButtonM>
						<SStakingButtonM
							style={{ cursor: !enabled ? 'not-allowed' : 'default' }}
							onClick={() =>
								enabled ||
								stakeWrapper.claimAward(address, {
									gasLimit: 1000000
								})
							}
						>
							Claim Award
						</SStakingButtonM>
					</div>
				</div>
			</SCard>
		);
	}
}
