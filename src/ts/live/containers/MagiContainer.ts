import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as magiActions from '../actions/magiActions';
import { IState } from '../common/types';
import { web3Wrapper } from '../common/wrappers';
import Magi from '../components/Magi';

function mapStateToProps(state: IState) {
	return {
		acceptedPrices: state.magi.acceptedPrices
	};
}

function mapDispatchToProps(dispatch: ThunkDispatch<IState, undefined, AnyAction>) {
	return {
		subscribe: () => dispatch(magiActions.subscribe(web3Wrapper.contractAddresses.Magi)),
		unsubscribe: () => dispatch(magiActions.subscriptionUpdate(0))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Magi);
