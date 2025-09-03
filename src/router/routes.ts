import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MonsterBuilder.vue') },
    ],
  },
  {
    path: '/monsterarchive',
    component: () => import('layouts/TemplateEditorLayout.vue'),
    children: [{ path: '', component: () => import('pages/MonsterArchive.vue') }],
  },
  {
    path: '/spells',
    component: () => import('layouts/TemplateEditorLayout.vue'),
    children: [{ path: '', component: () => import('pages/SpellsEditor.vue') }],
  },
  {
    path: '/templates',
    component: () => import('layouts/TemplateEditorLayout.vue'),
    children: [
      { path: '', component: () => import('pages/TemplatesEditor.vue') },
    ],
  },
  {
    path: '/reset',
    component: () => import('layouts/ErrorCorrection.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
