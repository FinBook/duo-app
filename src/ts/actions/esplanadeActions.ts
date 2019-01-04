import * as CST from 'ts/common/constants';
import {IEsplanadeAddresses, IEsplanadeStates, VoidThunkAction  } from 'ts/common/types';
import { esplanadeWrapper } from 'ts/common/wrappers';

export function statesUpdate(states: IEsplanadeStates) {
	return {
		type: CST.AC_ESP_STATES,
		value: states
	};
}

export function addressesUpdate(addrs: IEsplanadeAddresses) {
	return {
		type: CST.AC_ESP_ADDRS,
		value: addrs
	};
}

export function getStates(): VoidThunkAction {
	return async dispatch => {
		const states = await esplanadeWrapper.getStates();
		dispatch(statesUpdate(states));
	};
}

export function getAddresses(): VoidThunkAction {
	return async dispatch => {
		dispatch(addressesUpdate(await esplanadeWrapper.getAddrs()));
	};
}

export function subscriptionUpdate(intervalId: number) {
	return {
		type: CST.AC_ESP_SUB,
		id: intervalId
	};
}

// export function refresh(): VoidThunkAction {
// 	return async dispatch => {
// 		await dispatch(getStates());
// 	};
// }

// export function subscribe(): VoidThunkAction {
// 	return async dispatch => {
// 		dispatch(subscriptionUpdate(0));
// 		dispatch(refresh());
// 		dispatch(subscriptionUpdate(window.setInterval(() => dispatch(refresh()), 60000)));
// 	};
// }

export function refreshAdmin(): VoidThunkAction {
	return async dispatch => {
		await dispatch(getStates());
		dispatch(getAddresses());
	};
}

export function subscribeAdmin(): VoidThunkAction {
	return async dispatch => {
		dispatch(subscriptionUpdate(0));
		dispatch(refreshAdmin());
		dispatch(subscriptionUpdate(window.setInterval(() => dispatch(refreshAdmin()), 60000)));
	};
}