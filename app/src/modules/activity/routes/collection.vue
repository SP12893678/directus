<script setup lang="ts">
import { useExtension } from '@/composables/use-extension';
import { usePreset } from '@/composables/use-preset';
import LayoutSidebarDetail from '@/views/private/components/layout-sidebar-detail.vue';
import SearchInput from '@/views/private/components/search-input.vue';
import { useLayout } from '@directus/composables';
import { Filter } from '@directus/types';
import { mergeFilters } from '@directus/utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ActivityNavigation from '../components/navigation.vue';
import { getCollectionRoute } from '@/utils/get-route';
import { useRouter } from 'vue-router';
import { unexpectedError } from '@/utils/unexpected-error';
import BookmarkAdd from '@/views/private/components/bookmark-add.vue';

defineProps<{
	primaryKey?: string;
}>();

const { t } = useI18n();

const { 
	layout, 
	layoutOptions, 
	layoutQuery, 
	filter, 
	search,
	bookmarkExists,
	saveCurrentAsBookmark,
	bookmarkTitle,
	resetPreset,
	bookmarkSaved,
	bookmarkIsMine,
	refreshInterval,
	busy: bookmarkSaving,
	clearLocalSave,
} = usePreset(ref('directus_activity'));

const { layoutWrapper } = useLayout(layout);

const currentLayout = useExtension('layout', layout);

const roleFilter = ref<Filter | null>(null);

const router = useRouter();

const { bookmarkDialogActive, creatingBookmark, createBookmark } = useBookmarks();

function useBookmarks() {
	const bookmarkDialogActive = ref(false);
	const creatingBookmark = ref(false);

	return {
		bookmarkDialogActive,
		creatingBookmark,
		createBookmark,
	};

	async function createBookmark(bookmark: any) {
		creatingBookmark.value = true;

		try {
			const newBookmark = await saveCurrentAsBookmark({
				bookmark: bookmark.name,
				icon: bookmark.icon,
				color: bookmark.color,
			});

			router.push(`${getCollectionRoute(newBookmark.collection)}?bookmark=${newBookmark.id}`);

			bookmarkDialogActive.value = false;
		} catch (error) {
			unexpectedError(error);
		} finally {
			creatingBookmark.value = false;
		}
	}
}
</script>

<template>
	<component
		:is="layoutWrapper"
		v-slot="{ layoutState }"
		v-model:layout-options="layoutOptions"
		v-model:layout-query="layoutQuery"
		:filter="mergeFilters(filter, roleFilter)"
		:filter-user="filter"
		:filter-system="roleFilter"
		:search="search"
		show-select="none"
		collection="directus_activity"
	>
		<private-view
			:title="t('activity_feed')"
			:small-header="currentLayout?.smallHeader"
			:header-shadow="currentLayout?.headerShadow"
		>
			<template #title-outer:prepend>
				xzczx
				<v-button class="header-icon" rounded disabled icon secondary>
					<v-icon name="access_time" />
				</v-button>
			</template>

			<template #actions:prepend>
				<component :is="`layout-actions-${layout}`" v-bind="layoutState" />
			</template>

			<template #title-outer:append>
				<div class="bookmark-controls">
					<bookmark-add
						v-if="!bookmark"
						v-model="bookmarkDialogActive"
						class="add"
						:saving="creatingBookmark"
						@save="createBookmark"
					>
						<template #activator="{ on }">
							<v-icon v-tooltip.right="t('create_bookmark')" class="toggle" clickable name="bookmark" @click="on" />
						</template>
					</bookmark-add>

					<v-icon v-else-if="bookmarkSaved" class="saved" name="bookmark" filled />

					<template v-else-if="bookmarkIsMine">
						<v-icon
							v-tooltip.bottom="t('update_bookmark')"
							class="save"
							clickable
							name="bookmark_save"
							@click="savePreset()"
						/>
					</template>

					<bookmark-add
						v-else
						v-model="bookmarkDialogActive"
						class="add"
						:saving="creatingBookmark"
						@save="createBookmark"
					>
						<template #activator="{ on }">
							<v-icon class="toggle" name="bookmark" clickable @click="on" />
						</template>
					</bookmark-add>

					<v-icon
						v-if="bookmark && !bookmarkSaving && bookmarkSaved === false"
						v-tooltip.bottom="t('reset_bookmark')"
						name="settings_backup_restore"
						clickable
						class="clear"
						@click="clearLocalSave"
					/>
				</div>
			</template>

			<template #actions>
				<search-input v-model="search" v-model:filter="filter" collection="directus_activity" />
			</template>

			<template #navigation>
				<activity-navigation v-model:filter="roleFilter" />
			</template>

			<component :is="`layout-${layout}`" v-bind="layoutState">
				<template #no-results>
					<v-info :title="t('no_results')" icon="search" center>
						{{ t('no_results_copy') }}
					</v-info>
				</template>

				<template #no-items>
					<v-info :title="t('item_count', 0)" icon="access_time" center>
						{{ t('no_items_copy') }}
					</v-info>
				</template>
			</component>

			<router-view name="detail" :primary-key="primaryKey" />

			<template #sidebar>
				<sidebar-detail icon="info" :title="t('information')" close>
					<div v-md="t('page_help_activity_collection')" class="page-description" />
				</sidebar-detail>
				<layout-sidebar-detail v-model="layout">
					<component :is="`layout-options-${layout}`" v-bind="layoutState" />
				</layout-sidebar-detail>
				<component :is="`layout-sidebar-${layout}`" v-bind="layoutState" />
			</template>
		</private-view>
	</component>
</template>

<style lang="scss" scoped>
.content {
	padding: var(--content-padding);
}

.header-icon {
	--v-button-color-disabled: var(--theme--foreground);
}
</style>
