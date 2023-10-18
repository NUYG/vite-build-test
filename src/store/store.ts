import { createStore } from 'vuex';
import type { State, Card } from './state';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const store = createStore<State>({
    state,
    mutations,
    actions,
    getters,
});

export default store;
