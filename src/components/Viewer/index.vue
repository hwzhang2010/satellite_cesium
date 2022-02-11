<template>
	<div id="cesiumContainer" class="viewer-container">
	    <slot></slot>
	</div>
</template>

<script>
	import mycesium from '../../mycesium';
	
	export default {
		name: 'Viewer',
		data() {
			return {}
		},
		mounted() {
			this.initViewer();
		},
		methods: {
			initViewer() {
				// cesium token, 网上找的
				let config = {}
				config.CESIUM_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns';
				// 初始化cesium的viewer
				const viewer = mycesium.initViewer(config);
				// 通知父组件
				this.$emit('on-viewer-completed', viewer); 
			}
		},
		
	}
</script>

<style scoped>
.viewer-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
