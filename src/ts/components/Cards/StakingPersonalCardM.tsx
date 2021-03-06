// import {
// 	Constants as WrapperConstants,
// 	ICustodianAddresses,
// 	IDualClassStates
// } from '@finbook/duo-contract-wrapper';
//import { Table } from 'antd';
//import * as CST from 'ts/common/constants';
import { Button, Modal } from 'antd';
import * as d3 from 'd3';
import avt from 'images/avatar.png';
import duo3d from 'images/duo-3d.png';
import duoIcon from 'images/Duo_black.png';
import * as React from 'react';
import referralUtil from 'ts/common/referralUtil';
import * as StakingCST from 'ts/common/stakingCST';
import { IAddressInfo, IReferral } from 'ts/common/types';
//import { ColorStyles } from 'ts/common/styles';
import { stakeWrappers, web3Wrapper } from 'ts/common/wrappers';
import {
	SCard,
	SCardTag2,
	SCardTag4,
	SCardTitle,
	SStakingButtonM2,
	SStakingInput,
	SStakingRInfoBTN,
	SStakingRlinkM,
	SStakingSwitch
} from './_styled';

interface IProps {
	contractIndex: number;
	locale: string;
	enabled: boolean;
	address: string;
	duoBalance: number;
	award: number;
	enableApprove: boolean;
	linkReferralcode: string;
}
interface IState {
	visibleLink: boolean;
	visibleAddReferral: boolean;
	visibleChildren: boolean;
	visibleNode: boolean;
	referralCode: string;
	binded: boolean;
	bindedCode: string;
	addressInfo: IAddressInfo;
}
export default class StakingPersonalCardM extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			visibleLink: false,
			visibleAddReferral: false,
			visibleChildren: false,
			visibleNode: false,
			referralCode: this.props.linkReferralcode,
			binded: false,
			bindedCode: '',
			addressInfo: {}
		};
	}

	public componentDidMount = async () => {
		const { address } = this.props;
		const addressInfo = await referralUtil.getAddressInfo(address);
		const bindedCode = await referralUtil.checkExist(address);
		this.setState({
			binded: bindedCode ? true : false,
			bindedCode: bindedCode ? bindedCode : '',
			addressInfo: addressInfo
		});
	};

	public componentDidUpdate = async (prevProps: IProps) => {
		const { address } = this.props;
		if (address !== prevProps.address) {
			const addressInfo = await referralUtil.getAddressInfo(address);
			const bindedCode = await referralUtil.checkExist(address);
			this.setState({
				binded: bindedCode ? true : false,
				bindedCode: bindedCode ? bindedCode : '',
				addressInfo: addressInfo
			});
		}
	};

	private handleApprove = async () => {
		const { address, contractIndex } = this.props;
		const txHash = await web3Wrapper.erc20Approve(
			web3Wrapper.contractAddresses.DUO.address,
			address,
			web3Wrapper.contractAddresses.Stakes[contractIndex].address,
			0,
			true
		);
		console.log('Transaction submit: ' + txHash);
	};

	private handleCancel = () => {
		this.setState({
			visibleLink: false,
			visibleAddReferral: false,
			visibleChildren: false,
			visibleNode: false
		});
	};

	private handleInputChange = (value: string) => {
		this.setState({ referralCode: value });
	};

	private personalSign = async () => {
		const signHash = await web3Wrapper.web3PersonalSign(
			this.props.address,
			StakingCST.REFERRALCODE + this.state.referralCode
		);
		return signHash;
	};

	private handleBind = async () => {
		const { address, locale } = this.props;
		const { referralCode } = this.state;
		if (referralCode.length !== 6) window.alert(StakingCST.STK_RCWARING[locale]);
		else if (await referralUtil.checkExist(address))
			window.alert(StakingCST.STK_ALRBIND[locale]);
		else {
			const signHash = await this.personalSign();
			const data: IReferral = {
				address: address,
				referralCode: referralCode,
				signHash: signHash
			};
			await referralUtil.insertReferralEntry(data);
			this.handleCancel();
			window.alert(StakingCST.STK_BINDED[locale]);
		}
		this.setState({ referralCode: '' });
	};

	public render() {
		const {
			enabled,
			address,
			duoBalance,
			award,
			locale,
			enableApprove,
			contractIndex
		} = this.props;
		const {
			visibleLink,
			visibleAddReferral,
			referralCode,
			visibleChildren,
			visibleNode,
			binded,
			bindedCode,
			addressInfo
		} = this.state;
		let referralAwardDaily = 0;
		let referralAwardSum = 0;
		let stakingAwardDaily = 0;
		let stakingAwardSum = 0;
		if (addressInfo) {
			if (addressInfo.children)
				addressInfo.children.forEach(child => {
					referralAwardDaily += child.daily;
					referralAwardSum += child.accumulated;
				});
			if (contractIndex === 0)
				if (addressInfo.staking0)
					addressInfo.staking0.forEach(node => {
						stakingAwardDaily += node.daily;
						stakingAwardSum += node.accumulated;
					});
			if (contractIndex === 1)
				if (addressInfo.staking60)
					addressInfo.staking60.forEach(node => {
						stakingAwardDaily += node.daily;
						stakingAwardSum += node.accumulated;
					});
		}
		const stakingInfo = contractIndex === 0 ? addressInfo.staking0 : addressInfo.staking60;
		return (
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<Modal
					visible={visibleLink}
					title={StakingCST.STK_RLINK[locale]}
					onOk={this.handleCancel}
					onCancel={this.handleCancel}
					footer={[
						<Button key="ok" type="primary" onClick={this.handleCancel}>
							{StakingCST.STK_BTNOK[locale]}
						</Button>
					]}
				>
					<p style={{ marginBottom: 5 }}>{StakingCST.STK_RLCODE[locale]}</p>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<SStakingRlinkM>{address.slice(-6)}</SStakingRlinkM>
					</div>
					<p style={{ marginBottom: 5, marginTop: 10 }}>
						{StakingCST.STK_RLDESKTOP[locale]}
					</p>
					<div>
						<SStakingRlinkM id="referral-link-d">
							{'https://app.duo.network/staking?r=' + address.slice(-6)}
						</SStakingRlinkM>
					</div>
					<p style={{ marginBottom: 5, marginTop: 10 }}>
						{StakingCST.STK_RLMOBILE[locale]}
					</p>
					<div>
						<SStakingRlinkM id="referral-link-m">
							{'https://duo.ac?r=' + address.slice(-6)}
						</SStakingRlinkM>
					</div>
				</Modal>
				<Modal
					visible={visibleAddReferral}
					title={StakingCST.STK_BRLINK[locale]}
					onOk={this.handleCancel}
					onCancel={this.handleCancel}
					footer={[
						binded ? (
							<Button key="ok" type="primary" onClick={this.handleCancel}>
								{StakingCST.STK_BTNOK[locale]}
							</Button>
						) : (
							<Button key="ok" type="primary" onClick={this.handleBind}>
								{StakingCST.STK_BIND[locale]}
							</Button>
						)
					]}
				>
					{binded ? (
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							{bindedCode === '000000' ? (
								<div>{StakingCST.STK_RCODE0[locale]}</div>
							) : (
								<div>
									{StakingCST.STK_RCODEUSED[locale]}
									<span style={{ color: '#5CA4DE' }}>{bindedCode}</span>
								</div>
							)}
						</div>
					) : (
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div>{StakingCST.STK_RCODE[locale]}</div>
							<SStakingInput
								placeholder={StakingCST.STK_BINDINPUTPH[locale]}
								value={referralCode}
								onChange={e => this.handleInputChange(e.target.value)}
								style={{ width: 180 }}
							/>
						</div>
					)}
				</Modal>
				<Modal
					visible={visibleChildren}
					title={StakingCST.STK_RINFO[locale]}
					onOk={this.handleCancel}
					onCancel={this.handleCancel}
					footer={[
						<Button key="ok" type="primary" onClick={this.handleCancel}>
							{StakingCST.STK_BTNOK[locale]}
						</Button>
					]}
					className="mobile-list-modal"
				>
					{addressInfo.children ? (
						<div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									color: 'rgba(0,0,0,.7)',
									paddingRight: 5,
									marginBottom: 5
								}}
							>
								<span
									style={{
										width: '68%',
										paddingLeft: 5,
										fontSize: 10
									}}
								>
									{StakingCST.STK_REFEREE[locale]}
								</span>
								<span
									style={{
										width: '16%',
										textAlign: 'right',
										fontSize: 10
									}}
								>
									{StakingCST.STK_DAILY[locale]}
								</span>
								<span
									style={{
										width: '16%',
										textAlign: 'right',
										fontSize: 10
									}}
								>
									{StakingCST.STK_SUM[locale]}
								</span>
							</div>
							<ul
								style={{
									listStyle: 'none',
									paddingLeft: 0,
									width: '100%',
									maxHeight: 220,
									overflowY: 'scroll'
								}}
							>
								{addressInfo.children.map((child, index) => {
									return (
										<li className="referee-table-li" key={index}>
											<span
												style={{
													width: '68%',
													fontSize: 9,
													paddingLeft: 5
												}}
											>
												{child.address}
											</span>
											<span
												style={{
													width: '16%',
													textAlign: 'right',
													color: '#5CA4DE',
													fontSize: 12
												}}
											>
												{d3.format(',.2f')(child.daily)}
											</span>
											<span
												style={{
													width: '16%',
													textAlign: 'right',
													color: '#5CA4DE',
													fontSize: 12
												}}
											>
												{d3.format(',.2f')(child.accumulated)}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					) : (
						<span>{StakingCST.STK_NOREFEREE[locale]}</span>
					)}
				</Modal>
				<Modal
					visible={visibleNode}
					title={StakingCST.STK_SINFO[locale]}
					onOk={this.handleCancel}
					onCancel={this.handleCancel}
					footer={[
						<Button key="ok" type="primary" onClick={this.handleCancel}>
							{StakingCST.STK_BTNOK[locale]}
						</Button>
					]}
				>
					{stakingInfo ? (
						<div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									color: 'rgba(0,0,0,.7)',
									paddingRight: 5,
									marginBottom: 5
								}}
							>
								<span
									style={{
										width: '40%',
										paddingLeft: 5,
										fontSize: 10
									}}
								>
									{StakingCST.STK_NODE[locale]}
								</span>
								<span
									style={{
										width: '30%',
										textAlign: 'right',
										fontSize: 10
									}}
								>
									{StakingCST.STK_DAILY[locale]}
								</span>
								<span
									style={{
										width: '30%',
										textAlign: 'right',
										fontSize: 10
									}}
								>
									{StakingCST.STK_SUM[locale]}
								</span>
							</div>
							<ul
								style={{
									listStyle: 'none',
									paddingLeft: 0,
									width: '100%'
								}}
							>
								{stakingInfo.map((node, index) => {
									return (
										<li className="referee-table-li" key={index}>
											<span
												style={{
													width: '40%',
													fontSize: 10,
													paddingLeft: 5
												}}
											>
												{node.name.toUpperCase()}
											</span>
											<span
												style={{
													width: '30%',
													textAlign: 'right',
													color: '#5CA4DE',
													fontSize: 12
												}}
											>
												{d3.format(',.2f')(node.daily)}
											</span>
											<span
												style={{
													width: '30%',
													textAlign: 'right',
													color: '#5CA4DE',
													fontSize: 12
												}}
											>
												{d3.format(',.2f')(node.accumulated)}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					) : (
						<span>{StakingCST.STK_NONODE[locale]}</span>
					)}
				</Modal>
				<SCard
					title={<SCardTitle>{StakingCST.STK_ACCINFO[locale].toUpperCase()}</SCardTitle>}
					width="95%"
					margin="10px 0 20px 0"
					extra={
						<SStakingSwitch onClick={() => this.setState({ visibleAddReferral: true })}>
							{StakingCST.STK_BRLINK[locale]}
						</SStakingSwitch>
					}
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
							<img style={{ width: 16, height: 16, marginRight: 10 }} src={avt} />
							{StakingCST.STK_ADDRESS[locale]}:{' '}
							<div style={{ color: '#5CA4DE', marginTop: 10 }}>{address}</div>
						</a>
					</div>
					<img
						style={{
							position: 'absolute',
							right: 10,
							top: 55,
							height: 30,
							width: 65
						}}
						src={duo3d}
					/>
					<div>
						<SCardTag2
							style={{
								width: '100%',
								paddingTop: 0,
								height: 75
							}}
						>
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
										marginRight: 10,
										fontSize: 20,
										fontWeight: 500,
										color: '#5CA4DE',
										paddingLeft: 20
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
									top: 22
								}}
							>
								<SStakingButtonM2
									onClick={this.handleApprove}
									style={{
										width: 108,
										pointerEvents: enableApprove ? 'initial' : 'none',
										opacity: enableApprove ? 1 : 0.4
									}}
								>
									{StakingCST.STK_APPROVE[locale]}
								</SStakingButtonM2>
							</div>
						</SCardTag2>
						<SCardTag2
							style={{
								width: '100%',
								paddingTop: 0,
								height: 75
							}}
						>
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
										marginRight: 10,
										fontSize: 20,
										fontWeight: 500,
										color: '#5CA4DE',
										paddingLeft: 20
									}}
								>
									{d3.format(',.2f')(award)}
									<span style={{ fontSize: 10, marginLeft: 5 }}>DUO</span>
								</div>
							</div>
							<div
								style={{
									position: 'absolute',
									right: 10,
									top: 22
								}}
							>
								<SStakingButtonM2
									style={{
										width: 108,
										cursor: !enabled ? 'not-allowed' : 'default'
									}}
									onClick={() =>
										enabled &&
										stakeWrappers[contractIndex].claimAward(address, {
											gasLimit: 1000000
										})
									}
								>
									{StakingCST.STK_CLAIM[locale]}
								</SStakingButtonM2>
							</div>
						</SCardTag2>
						<SCardTag4
							style={{
								width: '100%',
								paddingTop: 0,
								marginTop: 10
							}}
						>
							<div className="bg-logo">
								<img src={duoIcon} />
							</div>
							<div className="tag-content" style={{ pointerEvents: 'none' }}>
								<div className={'tag-price'} style={{ fontSize: 12 }}>
									{StakingCST.STK_RAWARD[locale]}
								</div>
							</div>
							<div className="tag-subtext" style={{ pointerEvents: 'none' }}>
								<div
									style={{
										width: 170,
										marginLeft: 20,
										paddingRight: 5,
										fontSize: 12,
										fontWeight: 500,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										color: 'rgba(64,79,84,.8)'
									}}
								>
									<div>{StakingCST.STK_DAILY[locale]}</div>
									<div style={{ color: '#5CA4DE', fontSize: 16 }}>
										{d3.format(',.2f')(referralAwardDaily)}
										<span style={{ fontSize: 10, marginLeft: 5 }}>DUO</span>
									</div>
								</div>
							</div>
							<div className="tag-subtext" style={{ pointerEvents: 'none' }}>
								<div
									style={{
										width: 170,
										marginLeft: 20,
										paddingRight: 5,
										fontSize: 12,
										fontWeight: 500,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										color: 'rgba(64,79,84,.8)'
									}}
								>
									<div>{StakingCST.STK_SUM[locale]}</div>
									<div style={{ color: '#5CA4DE', fontSize: 16 }}>
										{d3.format(',.2f')(referralAwardSum)}
										<span style={{ fontSize: 10, marginLeft: 5 }}>DUO</span>
									</div>
								</div>
							</div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									marginTop: 5
								}}
							>
								<SStakingRInfoBTN
									onClick={() => this.setState({ visibleChildren: true })}
								>
									{StakingCST.STK_RINFO[locale]}
								</SStakingRInfoBTN>
							</div>
							<div
								style={{
									width: 108,
									position: 'absolute',
									right: 10,
									top: 15,
									display: 'flex',
									justifyContent: 'space-between'
								}}
							>
								<SStakingButtonM2
									onClick={() => this.setState({ visibleLink: true })}
								>
									{StakingCST.STK_RLINK[locale]}
								</SStakingButtonM2>
							</div>
						</SCardTag4>
						<SCardTag4
							style={{
								width: '100%',
								paddingTop: 0,
								marginTop: 10
							}}
						>
							<div className="bg-logo">
								<img src={duoIcon} />
							</div>
							<div className="tag-content" style={{ pointerEvents: 'none' }}>
								<div className={'tag-price'} style={{ fontSize: 12 }}>
									{StakingCST.STK_SAWARD[locale]}
								</div>
							</div>
							<div className="tag-subtext" style={{ pointerEvents: 'none' }}>
								<div
									style={{
										width: 170,
										marginLeft: 20,
										paddingRight: 5,
										fontSize: 12,
										fontWeight: 500,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										color: 'rgba(64,79,84,.8)'
									}}
								>
									<div>{StakingCST.STK_DAILY[locale]}</div>
									<div style={{ color: '#5CA4DE', fontSize: 16 }}>
										{d3.format(',.2f')(stakingAwardDaily)}
										<span style={{ fontSize: 10, marginLeft: 5 }}>DUO</span>
									</div>
								</div>
							</div>
							<div className="tag-subtext" style={{ pointerEvents: 'none' }}>
								<div
									style={{
										width: 170,
										marginLeft: 20,
										paddingRight: 5,
										fontSize: 12,
										fontWeight: 500,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										color: 'rgba(64,79,84,.8)'
									}}
								>
									<div>{StakingCST.STK_SUM[locale]}</div>
									<div style={{ color: '#5CA4DE', fontSize: 16 }}>
										{d3.format(',.2f')(stakingAwardSum)}
										<span style={{ fontSize: 10, marginLeft: 5 }}>DUO</span>
									</div>
								</div>
							</div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									marginTop: 5
								}}
							>
								<SStakingRInfoBTN
									onClick={() => this.setState({ visibleNode: true })}
								>
									{StakingCST.STK_SINFO[locale]}
								</SStakingRInfoBTN>
							</div>
						</SCardTag4>
					</div>
				</SCard>
			</div>
		);
	}
}
