import infura from 'ts/keys/infura.json';
import BeethovenWapper from '../../../../duo-contract-wrapper/src/BeethovenWapper';
import MagiWrapper from '../../../../duo-contract-wrapper/src/MagiWrapper';
import Web3Wrapper from '../../../../duo-contract-wrapper/src/Web3Wrapper';
import * as CST from './constants';

const provider =
	(__KOVAN__ ? CST.PROVIDER_INFURA_KOVAN : CST.PROVIDER_INFURA_MAIN) + '/' + infura.token;
export const web3Wrapper = new Web3Wrapper(window, '', provider, !__KOVAN__);
export const beethovenWappers = {
	Perpetual: new BeethovenWapper(
		web3Wrapper,
		web3Wrapper.contractAddresses.Custodians.Beethoven.Perpetual.custodian.address
	),
	'6M': new BeethovenWapper(
		web3Wrapper,
		web3Wrapper.contractAddresses.Custodians.Beethoven['6M'].custodian.address
	)
};

export const getBeethovenWrapperByTenor = (tenor: string) => {
	switch (tenor) {
		case CST.TH_6M:
			return beethovenWappers['6M'];
		default:
			return beethovenWappers.Perpetual;
	}
};

export const getBeethovenAddressByTenor = (tenor: string) => {
	switch (tenor) {
		case CST.TH_6M:
			return web3Wrapper.contractAddresses.Custodians.Beethoven['6M'];
		default:
			return web3Wrapper.contractAddresses.Custodians.Beethoven.Perpetual;
	}
};

export const magiWrapper = new MagiWrapper(
	web3Wrapper,
	web3Wrapper.contractAddresses.Oracles[0].address
);