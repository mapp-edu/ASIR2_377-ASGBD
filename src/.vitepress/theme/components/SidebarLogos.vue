<script setup lang="ts">
/**
 * SidebarLogos.vue
 *
 * Inyectado en el slot 'sidebar-nav-after' del Layout de VitePress.
 * Muestra los logos institucionales (autor, GVA, centro) en la parte inferior
 * de la barra lateral, con adaptación reactiva al modo light/dark.
 *
 * Los datos se leen de themeConfig.logoBranding (configurado en config.mts).
 */
import { useData } from 'vitepress'
import ThemedImage from './ThemedImage.vue'

const { theme } = useData()
const b = theme.value.logoBranding as {
  mode: 'same' | 'invert' | 'separate'
  darkSuffix: string
  show?: { autor?: boolean; gva?: boolean; centro?: boolean }
  logos: {
    autor:  { src: string; height: string }
    gva:    { src: string; height: string }
    centro: { src: string; height: string }
  }
}
</script>

<template>
  <div class="sidebar-logos">
    <ThemedImage
      v-if="b.show?.autor !== false"
      :src="b.logos.autor.src"
      :mode="b.mode"
      :darkSuffix="b.darkSuffix"
      :height="b.logos.autor.height"
      alt="Autor"
      imgClass="logo-anim"
      imgStyle="display:block;margin:0 auto;"
    />
    <ThemedImage
      v-if="b.show?.gva !== false"
      :src="b.logos.gva.src"
      :mode="b.mode"
      :darkSuffix="b.darkSuffix"
      :height="b.logos.gva.height"
      alt="GVA"
      imgClass="logo-anim"
      imgStyle="display:block;margin:0 auto;margin-top:var(--custom-space-3);"
    />
    <ThemedImage
      v-if="b.show?.centro !== false"
      :src="b.logos.centro.src"
      :mode="b.mode"
      :darkSuffix="b.darkSuffix"
      :height="b.logos.centro.height"
      alt="Centro"
      imgClass="logo-anim"
      imgStyle="display:block;margin:0 auto;margin-top:var(--custom-space-3);"
    />
  </div>
</template>

<style scoped>
.sidebar-logos {
  padding: var(--custom-space-4) var(--custom-space-6) var(--custom-space-8);
  border-top: 1px solid var(--vp-c-divider);
  margin-top: var(--custom-space-2);
}
</style>
