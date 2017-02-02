<template>
    <div id="app">
        <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
            <router-view class="animated"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
    }
  }
}

</script>
<style lang="scss">
@import './styles/main';
</style>
