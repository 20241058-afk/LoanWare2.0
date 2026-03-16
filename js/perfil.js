const API   = 'https://prestamos-xi.vercel.app/api'
const token = localStorage.getItem('token')

// ── PROTEGER PÁGINA — si no hay sesión, mandar al login ───────────
if (!token) window.location.href = 'login.html'

// ── MOSTRAR ALERTA ────────────────────────────────────────────────
function mostrarAlerta(mensaje, tipo = 'success') {
    const alerta = document.getElementById('alertaPerfil')
    alerta.style.display      = 'flex'
    alerta.style.background   = tipo === 'success' ? 'rgba(34,197,94,0.1)'  : 'rgba(239,68,68,0.1)'
    alerta.style.color        = tipo === 'success' ? '#16a34a'               : '#dc2626'
    alerta.style.border       = `1.5px solid ${tipo === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
    alerta.innerHTML          = `<i class="fas fa-${tipo === 'success' ? 'circle-check' : 'triangle-exclamation'}"></i> ${mensaje}`
    setTimeout(() => alerta.style.display = 'none', 4000)
}

// ── CARGAR PERFIL ─────────────────────────────────────────────────
async function cargarPerfil() {
    try {
        const res  = await fetch(`${API}/usuarios/perfil`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.status === 401 || res.status === 403) {
            localStorage.clear()
            window.location.href = 'login.html'
            return
        }

        const data = await res.json()

        const nombreCompleto = `${data.nombre} ${data.ap_paterno} ${data.ap_materno}`
        const inicial        = data.nombre?.charAt(0).toUpperCase() || '?'
        const rol            = data.rol || (data.id_rol === 1 ? 'Administrador' : 'Usuario')

        // Header
        document.getElementById('headerNombre').textContent = data.nombre

        // Avatar
        document.getElementById('avatarLetra').textContent = inicial

        // Campos
        document.getElementById('perfilNombre').textContent        = nombreCompleto
        document.getElementById('perfilNombreCompleto').textContent = nombreCompleto
        document.getElementById('perfilUsuario').textContent       = `@${data.usuario}`
        document.getElementById('perfilCorreo').textContent        = data.correo
        document.getElementById('perfilRol').textContent           = rol
        document.getElementById('perfilRolTag').textContent        = rol

        // Actualizar localStorage
        localStorage.setItem('nombre', nombreCompleto)

    } catch (error) {
        console.error('Error cargando perfil:', error)
    }
}

// ── CAMBIAR CONTRASEÑA ────────────────────────────────────────────
async function cambiarPassword() {
    const password_actual = document.getElementById('passwordActual').value
    const password_nueva  = document.getElementById('passwordNueva').value

    if (!password_actual || !password_nueva) {
        mostrarAlerta('Completa ambos campos de contraseña.', 'error')
        return
    }

    if (password_nueva.length < 6) {
        mostrarAlerta('La nueva contraseña debe tener al menos 6 caracteres.', 'error')
        return
    }

    try {
        const res  = await fetch(`${API}/usuarios/password`, {
            method:  'PUT',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password_actual, password_nueva })
        })

        const data = await res.json()

        if (res.ok) {
            mostrarAlerta(data.message, 'success')
            document.getElementById('formPassword').reset()
        } else {
            mostrarAlerta(data.message || 'Error al cambiar la contraseña.', 'error')
        }

    } catch {
        mostrarAlerta('Error de conexión.', 'error')
    }
}

// ── CERRAR SESIÓN ─────────────────────────────────────────────────
function cerrarSesion() {
    localStorage.clear()
    window.location.href = 'login.html'
}

// ── INICIAR ───────────────────────────────────────────────────────
cargarPerfil()