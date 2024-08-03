<script setup lang="ts">
withDefaults(defineProps<{
		value?: any;
	}>(), {
	value: ''
});
</script>

<template>
	<span>
		{{$props.value === 'string' ? $props.value : JSON.stringify($props.value)}}
		<slot :copy-value="$props.value" />
	</span>
</template>

<style lang="scss" scoped>
.datetime {
	overflow: hidden;
	line-height: 1.15;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
