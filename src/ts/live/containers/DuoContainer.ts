import { connect } from 'react-redux';
import * as reduxTypes from '../common/reduxTypes';
import Duo from '../components/Duo';

function mapStateToProps(state: reduxTypes.IState) {
	return {
		account: state.contract.account,
		refresh: state.ui.refresh,
		states: state.contract.states,
		prices: state.contract.prices,
		balances: state.contract.balances,
		hourly: state.dynamo.hourly,
		minutely: state.dynamo.minutely
	};
}

export default connect(mapStateToProps, {})(Duo);
