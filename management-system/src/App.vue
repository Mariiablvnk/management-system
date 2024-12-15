<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import '@/assets/main.scss';
</script>

<template>
  <header class="site-header">
    <div class="header-wrapper">
      <nav class="main-nav">
        <RouterLink to="/" class="nav-link">Projects</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

