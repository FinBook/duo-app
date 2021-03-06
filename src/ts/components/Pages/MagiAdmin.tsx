import { IMagiStates } from '@finbook/duo-contract-wrapper';
import { Layout } from 'antd';
import * as React from 'react';
import { IAddresses, IMagiPriceFeed } from 'ts/common/types';
import Header from 'ts/containers/HeaderContainer';
import { SContent, SDivFlexCenter } from '../_styled';
import DecodeCard from '../Cards/DecodeCard';
import MagiAdminCard from '../Cards/MagiAdminCard';

interface IProps {
	priceFeeds: IMagiPriceFeed;
	operator: { balance: number; address: string };
	roleManager: { balance: number; address: string };
	states: IMagiStates;
	account: string;
	locale: string;
	coldAddresses: IAddresses;
	subscribe: () => any;
	unsubscribe: () => any;
	refresh: () => any;
}

export default class MagiAdmin extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props);
	}
	public componentDidMount() {
		this.props.subscribe();
		document.title = `DUO | MagiAdmin`;
	}

	public componentWillUnmount() {
		this.props.unsubscribe();
	}

	public render() {
		const {
			priceFeeds,
			states,
			account,
			locale,
			refresh,
			coldAddresses,
			operator,
			roleManager
		} = this.props;
		const isColdAddr = Object.keys(coldAddresses).includes(account);
		return (
			<Layout>
				<Header />
				<SContent>
					<SDivFlexCenter center style={{alignItems: 'center'}}>
					<MagiAdminCard
						states={states}
						priceFeeds={priceFeeds}
						operator={operator}
						roleManager={roleManager}
						locale={locale}
						isColdAddr={isColdAddr}
						account={account}
						refresh={refresh}
					/>
					<DecodeCard type={''} tenor={''} contractName={'MAGI'} />
					</SDivFlexCenter>
				</SContent>
			</Layout>
		);
	}
}
