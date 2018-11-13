import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as beethovanActions from '../actions/beethovanActions';
import * as uiActions from '../actions/uiActions';
import * as web3Actions from '../actions/web3Actions';
import { IState } from '../common/types';
import util from '../common/util';
import Beethoven from '../components/Beethoven';

function mapStateToProps(state: IState) {
	return {
		locale: state.ui.locale,
		states: state.beethovan.states,
		network: state.web3.network,
		account: state.web3.account,
		sourceLast: util.getLastPriceFromStatus(state.dynamo.status),
		conversions: state.beethovan.conversions,
		gasPrice: state.web3.gasPrice,
		eth: state.web3.balance,
		aToken: state.beethovan.balances.a,
		bToken: state.beethovan.balances.b
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscribe: (custodian: string) => dispatch(beethovanActions.subscribe(custodian)),
		unsubscribe: () => dispatch(beethovanActions.subscriptionUpdate(0)),
		refresh: (custodian: string) => dispatch(beethovanActions.refresh(custodian)),
		refreshBalance: (custodian: string) => {
			dispatch(web3Actions.getBalance());
			dispatch(beethovanActions.getBalances());
			dispatch(beethovanActions.getStates());
			dispatch(beethovanActions.fetchConversions(custodian));
		},
		updateLocale: (locale: string) => dispatch(uiActions.localeUpdate(locale))
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(Beethoven) as any);
