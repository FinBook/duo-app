//import { IStatus } from '@finbook/duo-market-data';
import { IStakeAddress, IStakeLot, IStakeStates } from '@finbook/duo-contract-wrapper';
import { Button, Layout, Modal } from 'antd';
import queryString from 'query-string';
import * as React from 'react';
import * as CST from 'ts/common/constants';
import * as StakingCST from 'ts/common/stakingCST';
import { web3Wrapper } from 'ts/common/wrappers';
import StakingInfoCard from 'ts/components/Cards/StakingInfoCard';
import StakingNodeCard from 'ts/components/Cards/StakingNodesCard';
import StakingPersonalCard from 'ts/components/Cards/StakingPersonalCard';
import Header from 'ts/containers/HeaderContainer';
import { SContent } from '../_styled';
interface IProps {
	contractStates: IStakeStates;
	account: string;
	duoBalance: number;
	duoAllowance: number;
	addresses: IStakeAddress;
	userStakes: { [key: string]: IStakeLot[] };
	oracleStakes: { [key: string]: number };
	userAward: number;
	subscribe: () => any;
	locale: string;
}

interface IState {
	visible: boolean;
	showed: boolean;
	approved: boolean;
	checkReferral: boolean;
}

export default class Staking extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			visible: false,
			showed: false,
			approved: false,
			checkReferral: false
		};
	}
	public componentDidMount() {
		this.props.subscribe();
		document.title = 'DUO | Staking';
	}

	public static async getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
		const { duoAllowance, addresses } = nextProps;
		if (addresses.priceFeedList.length > 0 && duoAllowance === 0 && !prevState.showed)
			return {
				visible: true,
				approved: false,
				showed: true
			};
		else if (addresses.priceFeedList.length > 0 && duoAllowance > 0)
			return {
				approved: true
			};
		return null;
	}
	private handleCancel = () => {
		this.setState({ visible: false });
	};

	private handleApprove = async () => {
		const { account } = this.props;
		const txHash = await web3Wrapper.erc20Approve(
			web3Wrapper.contractAddresses.DUO.address,
			account,
			web3Wrapper.contractAddresses.Stakes[0].address,
			0,
			true
		);
		this.setState({ visible: false });
		console.log('Transaction submit: ' + txHash);
	};
	public render() {
		const {
			contractStates,
			account,
			duoBalance,
			addresses,
			userStakes,
			oracleStakes,
			userAward,
			locale
		} = this.props;
		const { visible, approved } = this.state;
		const code = queryString.parse((this.props as any).location.search)
		return (
			<Layout>
				<Header />
				<Modal
					visible={visible}
					title={StakingCST.STK_REMIUNDER[locale]}
					onOk={this.handleCancel}
					onCancel={this.handleCancel}
					footer={[
						<Button key="ok" type="primary" onClick={this.handleApprove}>
							{StakingCST.STK_OK[locale]}
						</Button>
					]}
				>
					<p>{StakingCST.STK_REMIUNDERTEST[locale]}</p>
				</Modal>
				<SContent>
					<StakingInfoCard
						locale={locale}
						contractStates={contractStates}
						title={StakingCST.STK_TITLEFLEX[locale]}
						oracleStakes={oracleStakes}
						addresses={addresses}
					/>
					<StakingPersonalCard
						locale={locale}
						enabled={contractStates.canStake}
						address={account}
						duoBalance={duoBalance}
						award={userAward}
						enableApprove={!approved}
						linkReferralcode={(code as any).r || ''}
					/>
					{addresses.priceFeedList.length ? (
						addresses.priceFeedList.map((addr, i) => (
							<StakingNodeCard
								locale={locale}
								enabled={contractStates.canStake}
								title={
									StakingCST.STK_ORACKE[locale] + ' (' + CST.AC_STK_NODES[i] + ')'
								}
								key={i}
								myDUO={duoBalance}
								myStake={userStakes}
								myAddr={account}
								oracleAddr={addr}
								oracleStakes={oracleStakes}
							/>
						))
					) : (
						<div
							style={{
								width: 960,
								height: 150,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								border: '1px dashed rgba(0,0,0,.3)',
								borderRadius: 4,
								fontSize: 16,
								color: 'rgba(0,0,0,.6)'
							}}
						>
							{StakingCST.STK_LOADINGNODES[locale]}
						</div>
					)}
				</SContent>
			</Layout>
		);
	}
}
