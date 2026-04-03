<script setup>
import { onMounted, ref } from 'vue'

// REMPLACEMENT : Utilisation de la variable d'environnement injectée par Azure
// Si la variable n'existe pas, on garde localhost par défaut pour le dev local
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const firstname = ref('')
const loading = ref(false)
const error = ref('')
const created = ref(null)

const users = ref([])
const loadingUsers = ref(false)

function formatDate(iso) {
  if (!iso) return ''
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
    // Utilise l'URL dynamique (Azure ou Local)
    const r = await fetch(`${API_BASE}/api/users`)
    const data = await r.json()
    
    // Vérification de la réponse pour assurer la stabilité [cite: 17]
    if (!r.ok) throw new Error(data.error || `Erreur serveur: ${r.status}`)
    
    // On s'adapte à la structure de données renvoyée par le back
    users.value = Array.isArray(data) ? data : (data.users || [])
  } catch (e) {
    error.value = "Erreur de connexion au Backend : " + e.message
    console.error(e)
  } finally {
    loadingUsers.value = false
  }
}

async function createUser() {
  if (!firstname.value) return
  
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
    if (!r.ok) throw new Error(data.error || 'Impossible d\'ajouter l\'utilisateur')
    
    created.value = { id: data.id, firstname: data.firstname || firstname.value }
    firstname.value = ''
    await loadUsers() // Rafraîchissement automatique
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <main style="max-width: 520px; margin: 40px auto; font-family: system-ui; line-height: 1.5">
    <h1 style="color: #0078d4">Déploiement Azure : Full Stack</h1>
    <p style="font-size: 0.9em; color: #666">Connecté à : <code>{{ API_BASE }}</code></p>

    <section style="margin-top: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9">
      <h2 style="margin: 0 0 8px; font-size: 1.2em">Ajouter un utilisateur</h2>

      <form @submit.prevent="createUser" style="display: flex; gap: 8px">
        <input
          v-model.trim="firstname"
          type="text"
          placeholder="Prénom"
          required
          style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px"
        />
        <button 
          type="submit" 
          :disabled="loading" 
          style="padding: 8px 12px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer"
        >
          {{ loading ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>

      <p v-if="created" style="margin: 10px 0 0; color: #2e7d32">
        ✅ Enregistré : <strong>{{ created.firstname }}</strong> (ID: {{ created.id }})
      </p>

      <p v-if="error" style="margin: 10px 0 0; color: #b00020; font-size: 0.9em">❌ {{ error }}</p>
    </section>

    <section style="margin-top: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
        <h2 style="margin: 0; font-size: 1.2em">Utilisateurs (Base de données)</h2>
        <button @click="loadUsers" :disabled="loadingUsers" style="padding: 4px 8px; font-size: 0.8em">
          {{ loadingUsers ? '...' : 'Rafraîchir' }}
        </button>
      </div>

      <ul v-if="users.length" style="margin-top: 10px; padding-left: 20px">
        <li v-for="u in users" :key="u.id" style="margin-bottom: 4px">
          <strong>{{ u.firstname }}</strong> <span style="color: #666; font-size: 0.8em">(Créé le {{ formatDate(u.created_at) }})</span>
        </li>
      </ul>
      <p v-else-if="!loadingUsers" style="color: #666; font-style: italic">Aucun utilisateur trouvé.</p>
    </section>
  </main>
</template>