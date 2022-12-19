<template>
  <footer class="footer">
    <div class="content has-text-right">
      <a href="https://github.com/ethstorage/tutorial" target="_blank">
        <font-awesome-icon :style="{color: this.color}" size="2x" :icon="['fab', 'github']"/>
      </a>
      <a href="https://twitter.com/EthStorage" target="_blank">
        <font-awesome-icon :style="{color: this.color}" size="2x" :icon="['fab', 'twitter']"/>
      </a>
      <a href="https://ethstorage.medium.com/" target="_blank">
        <font-awesome-icon :style="{color: this.color}" size="2x" :icon="['fab', 'medium']"/>
      </a>
      <a href="https://t.me/ethstorage" target="_blank">
        <font-awesome-icon :style="{color: this.color}" size="2x" :icon="['fab', 'telegram']"/>
      </a>
      <a href="https://discord.gg/xhCwaMp7ps" target="_blank">
        <font-awesome-icon :style="{color: this.color}" size="2x" :icon="['fab', 'discord']"/>
      </a>
    </div>
  </footer>
</template>
<script>
export default {
  name: "Footer",
  props: {
    color: {
      type: String,
      default: '#ffffff',
    }
  },
  components: {},
};
</script>

<style>
.footer {
  padding-top: 40px !important;
  padding-bottom: 50px !important;
  background-color: transparent !important;
  height: 75px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer a {
  color: #000;
  font-size: 13px;
  padding: 10px;
  vertical-align: middle;
}
</style>
