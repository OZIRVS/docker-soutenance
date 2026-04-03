<template>
  <main style="max-width: 520px; margin: 40px auto; font-family: system-ui">
    <h1>Démo Front ↔ Back ↔ DB</h1>

    <section style="margin-top: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px">
      <h2 style="margin: 0 0 8px">Ajouter un utilisateur</h2>

      <form @submit.prevent="createUser" style="display: flex; gap: 8px">
        <input
          v-model.trim="firstname"
          type="text"
          placeholder="Prénom"
          required
          style="flex: 1; padding: 8px"
        />
        <button type="submit" :disabled="loading" style="padding: 8px 12px">
          {{ loading ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>

      <p v-if="created" style="margin: 10px 0 0">
        ✅ Enregistré : <strong>{{ created.firstname }}</strong> (id {{ created.id }})
      </p>

      <p v-if="error" style="margin: 10px 0 0; color: #b00020">❌ {{ error }}</p>
    </section>

    <section style="margin-top: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px">
      <h2 style="margin: 0 0 8px">Utilisateurs en base</h2>

      <button @click="loadUsers" :disabled="loadingUsers" style="padding: 8px 12px">
        {{ loadingUsers ? 'Chargement...' : 'Rafraîchir' }}
      </button>

      <ul style="margin-top: 10px">
        <li v-for="u in users" :key="u.id">
          #{{ u.id }} — {{ u.firstname }} — {{ formatDate(u.created_at) }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script  setup>
import { onMounted, ref } from 'vue'

const API_BASE = 'http://localhost:3000' // si tu changes le port, ajuste ici

const firstname = ref('')
const loading = ref(false)
const error = ref('')
const created = ref(null)

const users = ref([])
const loadingUsers = ref(false)

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

async function loadUsers() {
  loadingUsers.value = true
  error.value = ''
  try {
    const r = await fetch(`${API_BASE}/api/users`)
    const data = await r.json()
    if (!r.ok || !data.success) throw new Error(data.error || 'Erreur API')
    users.value = data.users
  } catch (e) {
    error.value = e.message || String(e)
  } finally {
    loadingUsers.value = false
  }
}

async function createUser() {
  loading.value = true
  error.value = ''
  created.value = null

  try {
    const r = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname: firstname.value }),
    })
    const data = await r.json()
    if (!r.ok || !data.success) throw new Error(data.error || 'Erreur API')
    created.value = { id: data.id, firstname: data.firstname }
    firstname.value = ''
    await loadUsers()
  } catch (e) {
    error.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)
</script>
