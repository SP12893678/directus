import { defineDisplay } from '@directus/extensions';
import { TYPES, LOCAL_TYPES } from '@directus/constants';
import Row from './raw.vue' 
import { h, defineComponent } from 'vue';

export default defineDisplay({
	id: 'raw',
	name: '$t:displays.raw.raw',
	icon: 'code',
	// component: Row,
	component: defineComponent({
		props: ['value'],
		setup(props, { slots }) {
			const value = typeof props.value === 'string' ? props.value : JSON.stringify(props.value);
			return () => [
				value,
				slots.default && slots.default({ 'copyValue': value })
			];
		}
	}),
	options: [],
	types: TYPES,
	localTypes: LOCAL_TYPES,
});
