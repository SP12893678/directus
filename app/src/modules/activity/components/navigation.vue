<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { Filter } from '@directus/types';
import { computed,ref } from 'vue';
import { useI18n } from 'vue-i18n';
import NavigationItem from './navigation-item.vue';
import { useCollectionsStore } from '@/stores/collections';
import { getCollectionRoute } from '@/utils/get-route';

const props = defineProps<{
	filter?: Filter;
}>();

const emit = defineEmits(['update:filter']);

const { t } = useI18n();

const search = ref('');
const collectionsStore = useCollectionsStore();
const userStore = useUserStore();
const currentUserID = computed(() => userStore.currentUser?.id);

const filterField = computed(() => Object.keys(props.filter ?? {})[0] ?? null);
const filterValue = computed(() => Object.values(props.filter ?? {})[0]?._eq ?? null);
const collection = computed(() => collectionsStore.getCollection("directus_activity"));
const to = computed(() => (collection.value.schema ? getCollectionRoute(collection.value.collection) : ''));

function setNavFilter(key: string, value: any) {
	emit('update:filter', {
		[key]: {
			_eq: value,
		},
	});
}

function clearNavFilter() {
	emit('update:filter', null);
}
</script>

<template>
	<v-list nav>
		<navigation-item
			show-hidden
			:collection="collection"
			:search="search"
			@click="clearNavFilter"
		/>
		
		<v-list-item
			clickable
			:active="filterField === 'user' && filterValue === currentUserID"
			:to="to"
			@click="setNavFilter('user', currentUserID)"
		>
			<v-list-item-icon>
				<v-icon name="face" />
			</v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="t('my_activity')" />
			</v-list-item-content>
		</v-list-item>

		<v-divider />

		<v-list-item
			clickable
			:active="filterField === 'action' && filterValue === 'create'"
			:to="to"
			@click="setNavFilter('action', 'create')"
		>
			<v-list-item-icon>
				<v-icon name="add" />
			</v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="t('create')" />
			</v-list-item-content>
		</v-list-item>

		<v-list-item
			clickable
			:active="filterField === 'action' && filterValue === 'update'"
			:to="to"
			@click="setNavFilter('action', 'update')"
		>
			<v-list-item-icon>
				<v-icon name="check" />
			</v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="t('update')" />
			</v-list-item-content>
		</v-list-item>

		<v-list-item
			clickable
			:active="filterField === 'action' && filterValue === 'delete'"
			:to="to"
			@click="setNavFilter('action', 'delete')"
		>
			<v-list-item-icon>
				<v-icon name="clear" />
			</v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="t('delete_label')" />
			</v-list-item-content>
		</v-list-item>

		<v-list-item
			clickable
			:active="filterField === 'action' && filterValue === 'comment'"
			:to="to"
			@click="setNavFilter('action', 'comment')"
		>
			<v-list-item-icon>
				<v-icon name="chat_bubble_outline" />
			</v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="t('comment')" />
			</v-list-item-content>
		</v-list-item>

		<v-list-item
			clickable
			:active="filterField === 'action' && filterValue === 'login'"
			:to="to"
			@click="setNavFilter('action', 'login')"
		>
			<v-list-item-icon>
				<v-icon name="login" />
			</v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="t('login')" />
			</v-list-item-content>
		</v-list-item>
	</v-list>
</template>
