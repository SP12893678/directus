import { defineDisplay } from '@directus/extensions';
import { TYPES, LOCAL_TYPES } from '@directus/constants';
import Row from './raw.vue' 

export default defineDisplay({
	id: 'raw',
	name: '$t:displays.raw.raw',
	icon: 'code',
	component: Row,
	options: [],
	types: TYPES,
	localTypes: LOCAL_TYPES,
});
