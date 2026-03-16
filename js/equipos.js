const API = 'http://localhost:3000/api'

let todosLosEquipos = []
let categoriaActiva = null

// ─── SESIÓN ───────────────────────────────────────────────────────
const token     = localStorage.getItem('token')
const haySession = !!token

// Ocultar banner si ya hay sesión
if (haySession) {
    const banner = document.getElementById('bannerGuest')
    if (banner) banner.style.display = 'none'

    // Cambiar botón header a nombre del usuario
    const btnSesion = document.getElementById('btnSesion')
    if (btnSesion) {
        const nombre = localStorage.getItem('nombre') || 'Mi Perfil'
        btnSesion.innerHTML = `<i class="fas fa-user-circle"></i> ${nombre}`
        btnSesion.href = 'perfil.html'
    }
}

// ─── COLORES POR ESTADO ───────────────────────────────────────────
function getBadgeColor(estado) {
    const colores = {
        disponible:    '#22c55e',
        prestado:      '#f59e0b',
        dañado:        '#ef4444',
        mantenimiento: '#6366f1'
    }
    return colores[estado] || '#94a3b8'
}

// ─── BOTÓN SOLICITAR ──────────────────────────────────────────────
// Si no hay sesión → redirige al login
// Si hay sesión    → llama al endpoint de solicitudes
async function solicitarEquipo(id_equipo, nombre, btn) {
    if (!haySession) {
        // Guardar intención para redirigir de vuelta después del login (opcional)
        sessionStorage.setItem('redirectAfterLogin', 'equipos.html')
        window.location.href = 'login.html'
        return
    }

    const id_usuario = parseInt(localStorage.getItem('id_usuario'))
    btn.disabled     = true
    btn.innerHTML    = '<i class="fas fa-circle-notch fa-spin"></i> Solicitando...'

    try {
        const res  = await fetch(`${API}/solicitudes`, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id_usuario, id_equipo })
        })

        const data = await res.json()

        if (res.ok) {
            mostrarToast(`✅ Solicitud enviada para "${nombre}"`, 'success')
            btn.innerHTML = '<i class="fas fa-check"></i> Solicitado'
            btn.style.background = '#22c55e'
        } else {
            mostrarToast(data.message || 'Error al enviar solicitud', 'error')
            btn.disabled  = false
            btn.innerHTML = 'Solicitar'
        }
    } catch {
        mostrarToast('Error de conexión', 'error')
        btn.disabled  = false
        btn.innerHTML = 'Solicitar'
    }
}

// ─── TOAST ────────────────────────────────────────────────────────
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.createElement('div')
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: ${tipo === 'success' ? '#1a392a' : '#ef4444'};
        color: white; padding: 14px 28px; border-radius: 12px;
        font-size: 0.88rem; font-weight: 600; z-index: 9999;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        animation: fadeInUp 0.3s ease;
    `
    toast.textContent = mensaje
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3500)
}

// ─── RENDERIZAR TARJETAS ──────────────────────────────────────────
function renderizarEquipos(equipos) {
    const contenedor = document.getElementById('contenedorEquipos')
    const subtitulo  = document.getElementById('subtituloSeccion')

    subtitulo.textContent = `${equipos.length} equipo${equipos.length !== 1 ? 's' : ''} encontrado${equipos.length !== 1 ? 's' : ''}`

    if (equipos.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <i class="fas fa-box-open"></i>
                <p>No hay equipos en esta categoría.</p>
            </div>`
        return
    }

    contenedor.innerHTML = equipos.map(equipo => {
        const disponible = equipo.estado === 'disponible'

        // Botón según sesión y estado
        let boton = ''
        if (disponible) {
            if (haySession) {
                boton = `<button onclick="solicitarEquipo(${equipo.id_equipo}, '${equipo.nombre.replace(/'/g, "\\'")}', this)"
                    class="btn-solicitar" style="margin-top:12px; width:100%; padding:10px; border:none;
                    background:var(--primary); color:white; border-radius:10px; font-weight:700;
                    font-size:0.85rem; cursor:pointer; font-family:'Montserrat',sans-serif; transition:0.2s;">
                    <i class="fas fa-hand-holding"></i> Solicitar
                </button>`
            } else {
                boton = `<a href="login.html"
                    style="display:block; margin-top:12px; width:100%; padding:10px; text-align:center;
                    background:var(--primary); color:white; border-radius:10px; font-weight:700;
                    font-size:0.85rem; text-decoration:none; box-sizing:border-box; transition:0.2s;">
                    <i class="fas fa-right-to-bracket"></i> Inicia sesión para solicitar
                </a>`
            }
        } else {
            boton = `<button disabled
                style="margin-top:12px; width:100%; padding:10px; border:none;
                background:#e2e8f0; color:#94a3b8; border-radius:10px; font-weight:700;
                font-size:0.85rem; cursor:not-allowed; font-family:'Montserrat',sans-serif;">
                <i class="fas fa-ban"></i> No disponible
            </button>`
        }

        return `
        <div class="card-noticia" style="display:flex; flex-direction:column;">
            <div style="position:relative;">
                <img src="${equipo.ruta_imagen || 'https://placehold.co/300x180?text=Sin+imagen'}"
                    alt="${equipo.nombre}"
                    style="width:100%; height:180px; object-fit:cover; border-radius:12px;"
                    onerror="this.src='https://placehold.co/300x180?text=Sin+imagen'">
                <span style="position:absolute; top:10px; right:10px;
                            background:${getBadgeColor(equipo.estado)}; color:white;
                            padding:3px 10px; border-radius:20px; font-size:0.72rem; font-weight:700;">
                    ${equipo.estado}
                </span>
            </div>
            <div style="padding: 15px 0; flex:1; display:flex; flex-direction:column;">
                <h3 style="margin: 8px 0 5px; font-size:1rem;">${equipo.nombre}</h3>
                <p style="color:var(--text-muted); font-size:0.85rem; flex:1; line-height:1.5;">
                    ${equipo.descripcion || 'Sin descripción'}
                </p>
                <p style="color:var(--primary); font-size:0.82rem; margin-top:8px;">
                    <i class="fas fa-tag"></i> ${equipo.categoria}
                </p>
                ${boton}
            </div>
        </div>`
    }).join('')
}

// ─── SELECCIONAR CATEGORÍA ────────────────────────────────────────
function seleccionarCategoria(idCategoria, elemento) {
    document.querySelectorAll('.categoria-item').forEach(el => el.classList.remove('activa'))
    elemento.classList.add('activa')
    categoriaActiva = idCategoria

    document.getElementById('tituloSeccion').textContent = idCategoria
        ? elemento.querySelector('span:not(.badge-count)')?.textContent || 'Catálogo'
        : 'Catálogo de Equipos'

    renderizarEquipos(idCategoria
        ? todosLosEquipos.filter(e => e.id_categoria === idCategoria)
        : todosLosEquipos
    )
}

// ─── FILTRAR CATEGORÍAS EN SIDEBAR ───────────────────────────────
function filtrarCategorias() {
    const texto = document.getElementById('buscador').value.toLowerCase()
    document.querySelectorAll('.categoria-item[data-nombre]').forEach(el => {
        const nombre = el.dataset.nombre.toLowerCase()
        el.parentElement.style.display = nombre.includes(texto) ? '' : 'none'
    })
}

// ─── CARGAR CATEGORÍAS ────────────────────────────────────────────
async function cargarCategorias() {
    try {
        const res = await fetch(`${API}/categorias`)
        const categorias = await res.json()

        const lista = document.getElementById('listaCategorias')
        document.getElementById('cargandoCategorias').remove()

        categorias.forEach(cat => {
            const count = todosLosEquipos.filter(e => e.id_categoria === cat.id_categoria).length
            if (count === 0) return

            const li = document.createElement('li')
            li.innerHTML = `
                <a class="categoria-item" data-nombre="${cat.nombre}"
                onclick="seleccionarCategoria(${cat.id_categoria}, this)">
                    <i class="fas fa-box"></i>
                    <span>${cat.nombre}</span>
                    <span class="badge-count">${count}</span>
                </a>`
            lista.appendChild(li)
        })

        document.getElementById('badge-todos').textContent = todosLosEquipos.length

    } catch (error) {
        console.error('Error cargando categorías:', error)
    }
}

// ─── CARGAR EQUIPOS ───────────────────────────────────────────────
async function cargarEquipos() {
    try {
        const res  = await fetch(`${API}/equipos`)
        todosLosEquipos = await res.json()
        renderizarEquipos(todosLosEquipos)
        await cargarCategorias()
    } catch (error) {
        document.getElementById('contenedorEquipos').innerHTML = `
            <div class="sin-resultados">
                <i class="fas fa-triangle-exclamation"></i>
                <p>Error al conectar con el servidor: ${error.message}</p>
            </div>`
    }
}

cargarEquipos()