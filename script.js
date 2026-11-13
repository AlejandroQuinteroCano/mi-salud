// Mi Salud - Fase 4 (Corregida): Sincronización en la Nube con Control de Tiempo de Espera
// Autor: Alejandro Quintero

// =========================================================================
// 0. CONFIGURACIÓN DE FIREBASE (PROYECTO: marketlab-media)
// =========================================================================
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAGkoMFG9Yz2Pxyuk5Ax6HZ3SlYKio7cfc",
    authDomain: "marketlab-media.firebaseapp.com",
    projectId: "marketlab-media",
    storageBucket: "marketlab-media.firebasestorage.app",
    messagingSenderId: "265817204806",
    appId: "1:265817204806:web:7f4d315f1a7307d872c247"
};

let dbNube = null;
let nubeActiva = false;

function conTimeout(promesa, ms = 4000) {
    return Promise.race([
        promesa,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de espera agotado con Firestore')), ms))
    ]);
}

function inicializarFirebase() {
    if (FIREBASE_CONFIG.apiKey && typeof firebase !== 'undefined') {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }
            dbNube = firebase.firestore();
            nubeActiva = true;
        } catch (err) {
            console.error("Error iniciando Firebase:", err);
            nubeActiva = false;
        }
    }
    actualizarIndicadorNube(nubeActiva);
}

function actualizarIndicadorNube(conectado, detalleError = '') {
    const texto = conectado
        ? "☁️ Conectado en la Nube (Historial sincronizado)"
        : `⚠️ Nube pendiente (${detalleError || 'Revisa Firestore/Reglas'}) — Modo Local activo`;
    const badgeHeader = document.getElementById('estadoNubeBadge');
    const badgeLogin = document.getElementById('loginEstadoNube');
    if (badgeHeader) badgeHeader.textContent = texto;
    if (badgeLogin) badgeLogin.textContent = texto;
}

const DB_USERS_KEY = 'mi_salud_usuarios_v4';
const DB_DOCS_KEY = 'mi_salud_documentos_v4';
const SESSION_KEY = 'mi_salud_sesion_activa_v4';

// =========================================================================
// 1. BASE DE CONOCIMIENTO: MIS CUIDADOS (VIDEOS REALES + ADAPTACIÓN POR EDAD)
// =========================================================================
const VIDEOS_POR_EDAD = {
    mayor: {
        titulo: 'Rutina de Movilidad y Equilibrio para Adulto Mayor',
        urlEmbed: 'https://www.youtube.com/embed/31_hn0bNhrg',
        urlDirecta: 'https://www.youtube.com/watch?v=31_hn0bNhrg'
    },
    juvenil: {
        titulo: 'Activación Física y Postura Saludable Juvenil',
        urlEmbed: 'https://www.youtube.com/embed/LmWkf4HJGPI',
        urlDirecta: 'https://www.youtube.com/watch?v=LmWkf4HJGPI'
    }
};

const CONTENIDO_SALUD = {
    general: {
        titulo: 'Prevención y Salud General',
        videos: [
            { titulo: 'Rutina de ejercicios de movilidad articular', urlEmbed: 'https://www.youtube.com/embed/O_XD_3dtkXw', urlDirecta: 'https://www.youtube.com/watch?v=O_XD_3dtkXw' },
            { titulo: 'Liberar zona lumbar y mejorar postura', urlEmbed: 'https://www.youtube.com/embed/LmWkf4HJGPI', urlDirecta: 'https://www.youtube.com/watch?v=LmWkf4HJGPI' },
            { titulo: 'Cardio suave de bajo impacto en casa', urlEmbed: 'https://www.youtube.com/embed/MzyHX4K38sY', urlDirecta: 'https://www.youtube.com/watch?v=MzyHX4K38sY' }
        ],
        alimentacion: [
            'Distribuye tu plato: 50% vegetales variados, 25% proteína magra (pescado, pollo, legumbres) y 25% carbohidratos integrales.',
            'Toma de 6 a 8 vasos de agua pura durante el día.',
            'Reduce alimentos ultraprocesados, azúcares añadidos y exceso de sal.'
        ],
        deportes: [
            { nombre: 'Caminata Rápida', detalle: '30-45 min, 5 veces por semana. Mejora la salud cardiovascular sin impacto.' },
            { nombre: 'Natación', detalle: '40 min, 2-3 veces por semana. Fortalece toda la musculatura cuidando articulaciones.' },
            { nombre: 'Ciclismo Recreativo', detalle: '30-60 min, 3 veces por semana. Excelente resistencia aeróbica.' }
        ]
    },
    hipertension: {
        titulo: 'Control de Hipertensión Arterial',
        videos: [
            { titulo: 'Cardio de bajo impacto para controlar la presión alta', urlEmbed: 'https://www.youtube.com/embed/MzyHX4K38sY', urlDirecta: 'https://www.youtube.com/watch?v=MzyHX4K38sY' },
            { titulo: 'Hipertensión arterial y entrenamiento muscular seguro', urlEmbed: 'https://www.youtube.com/embed/ebTMSHSUSIg', urlDirecta: 'https://www.youtube.com/watch?v=ebTMSHSUSIg' },
            { titulo: 'Tai Chi suave para equilibrio y control cardiovascular', urlEmbed: 'https://www.youtube.com/embed/31_hn0bNhrg', urlDirecta: 'https://www.youtube.com/watch?v=31_hn0bNhrg' }
        ],
        alimentacion: [
            'Aplica la dieta DASH: reduce la sal a menos de 5g/día y evita enlatados, embutidos y caldos concentrados.',
            'Prioriza alimentos ricos en potasio y magnesio: banano, aguacate, espinaca, lentejas y nueces sin sal.',
            'Modera el consumo de cafeína y evita el alcohol.'
        ],
        deportes: [
            { nombre: 'Caminata Aeróbica Moderada', detalle: '30 min diarios a paso constante para favorecer la vasodilatación.' },
            { nombre: 'Ciclismo Estático Suave', detalle: '25-35 min, 4 veces por semana sin picos bruscos de esfuerzo.' },
            { nombre: 'Yoga y Respiración', detalle: '20-30 min diarios para reducir el estrés y estabilizar la frecuencia cardíaca.' }
        ]
    },
    diabetes: {
        titulo: 'Control Glucémico y Diabetes',
        videos: [
            { titulo: 'Actividad física, deporte y control de diabetes', urlEmbed: 'https://www.youtube.com/embed/H-bwA9gXLNM', urlDirecta: 'https://www.youtube.com/watch?v=H-bwA9gXLNM' },
            { titulo: 'Ejercicio efectivo para regular niveles de glucosa', urlEmbed: 'https://www.youtube.com/embed/V1jp-FXzsoc', urlDirecta: 'https://www.youtube.com/watch?v=V1jp-FXzsoc' },
            { titulo: 'Cardio moderado en casa sin impacto', urlEmbed: 'https://www.youtube.com/embed/MzyHX4K38sY', urlDirecta: 'https://www.youtube.com/watch?v=MzyHX4K38sY' }
        ],
        alimentacion: [
            'Orden de ingesta: come primero verduras/fibra, luego proteína y al final carbohidratos complejos (avena, legumbres).',
            'Evita azúcares refinados, jugos de fruta colados y harinas blancas.',
            'Mantén horarios fijos de comida para estabilizar la glucemia.'
        ],
        deportes: [
            { nombre: 'Caminata Postprandial', detalle: '15 minutos después de cada comida principal para reducir picos de glucosa.' },
            { nombre: 'Fuerza Ligera con Bandas', detalle: '2-3 veces por semana para aumentar la captación muscular de glucosa.' },
            { nombre: 'Natación / Aquagym', detalle: '30-40 min, 3 veces por semana protegiendo los pies.' }
        ]
    },
    osteomuscular: {
        titulo: 'Salud Osteomuscular y Espalda',
        videos: [
            { titulo: 'Rutina de ejercicios para liberar zona lumbar y caderas', urlEmbed: 'https://www.youtube.com/embed/LmWkf4HJGPI', urlDirecta: 'https://www.youtube.com/watch?v=LmWkf4HJGPI' },
            { titulo: 'Ejercicios terapéuticos para aliviar dolor lumbar', urlEmbed: 'https://www.youtube.com/embed/75PNUYMsXLs', urlDirecta: 'https://www.youtube.com/watch?v=75PNUYMsXLs' },
            { titulo: 'Movilidad articular suave paso a paso', urlEmbed: 'https://www.youtube.com/embed/O_XD_3dtkXw', urlDirecta: 'https://www.youtube.com/watch?v=O_XD_3dtkXw' }
        ],
        alimentacion: [
            'Incluye alimentos antiinflamatorios: salmón, sardina, cúrcuma, jengibre y aceite de oliva extra virgen.',
            'Asegura aporte de calcio y vitamina D (lácteos descremados, brócoli, sol suave 15 min).',
            'Mantén un peso saludable para reducir carga sobre columna y rodillas.'
        ],
        deportes: [
            { nombre: 'Natación (Espalda / Crol)', detalle: '30-45 min, 3 veces por semana sin carga gravitacional sobre discos.' },
            { nombre: 'Pilates Terapéutico', detalle: '30 min, 3 veces por semana para fortalecer la faja abdominal profunda.' },
            { nombre: 'Caminata en Plano', detalle: '30 min diarios con calzado amortiguado, evitando impactos.' }
        ]
    },
    respiratorio: {
        titulo: 'Cuidado Respiratorio',
        videos: [
            { titulo: 'Ejercicios suaves de movilidad y respiración', urlEmbed: 'https://www.youtube.com/embed/31_hn0bNhrg', urlDirecta: 'https://www.youtube.com/watch?v=31_hn0bNhrg' },
            { titulo: 'Cardio progresivo de baja intensidad en casa', urlEmbed: 'https://www.youtube.com/embed/MzyHX4K38sY', urlDirecta: 'https://www.youtube.com/watch?v=MzyHX4K38sY' },
            { titulo: 'Rutina de estiramiento y expansión torácica', urlEmbed: 'https://www.youtube.com/embed/LmWkf4HJGPI', urlDirecta: 'https://www.youtube.com/watch?v=LmWkf4HJGPI' }
        ],
        alimentacion: [
            'Consume antioxidantes (vitamina C y E): cítricos, kiwi, pimentón y frutos rojos.',
            'Mantén hidratación con agua tibia o infusiones suaves para fluidificar secreciones.',
            'Evita bebidas heladas o alimentos con sulfitos si desencadenan tos.'
        ],
        deportes: [
            { nombre: 'Natación en Piscina Temperada', detalle: '30-40 min, 2-3 veces por semana en ambiente húmedo favorable.' },
            { nombre: 'Caminata Progresiva', detalle: '30 min diarios con calentamiento suave de 5 minutos al iniciar.' },
            { nombre: 'Yoga Respiratorio', detalle: '30 min, 3 veces por semana coordinando respiración diafragmática.' }
        ]
    },
    estres: {
        titulo: 'Bienestar Mental y Manejo del Estrés',
        videos: [
            { titulo: 'Tai Chi guiado para calma mental y equilibrio', urlEmbed: 'https://www.youtube.com/embed/31_hn0bNhrg', urlDirecta: 'https://www.youtube.com/watch?v=31_hn0bNhrg' },
            { titulo: 'Estiramientos para liberar tensión acumulada', urlEmbed: 'https://www.youtube.com/embed/LmWkf4HJGPI', urlDirecta: 'https://www.youtube.com/watch?v=LmWkf4HJGPI' },
            { titulo: 'Activación suave para mejorar el ánimo', urlEmbed: 'https://www.youtube.com/embed/O_XD_3dtkXw', urlDirecta: 'https://www.youtube.com/watch?v=O_XD_3dtkXw' }
        ],
        alimentacion: [
            'Incluye alimentos ricos en magnesio y triptófano: avena, banano, cacao puro y almendras.',
            'Evita cafeína y pantallas al menos 6 horas antes de acostarte.',
            'Toma infusiones relajantes como manzanilla o toronjil en la noche.'
        ],
        deportes: [
            { nombre: 'Caminata al Aire Libre', detalle: '30-45 min diarios en zonas verdes para disminuir el cortisol.' },
            { nombre: 'Yoga Restaurativo', detalle: '30 min, 3-4 veces por semana para liberar tensión cervical.' },
            { nombre: 'Baile o Ciclismo', detalle: '30 min, 3 veces por semana para estimular endorfinas.' }
        ]
    }
};

// =========================================================================
// 2. CAPA DE DATOS HÍBRIDA (FIRESTORE CON TIMEOUT + RESPALDO LOCAL)
// =========================================================================
function obtenerUsuariosPorDefecto() {
    const hoy = new Date().toISOString().split('T')[0];
    return [
        {
            id: 'usr_admin_1',
            usuario: 'admin',
            password: 'admin123',
            rol: 'admin',
            perfil: {
                nombre: 'Alejandro',
                documento: '16.076.155',
                edad: '31',
                rh: 'O+',
                eps: 'Salud Total',
                enfermedad: 'general',
                alergias: 'Ninguna',
                emergencia: '3016629992',
                foto: './img/ia.jpg'
            },
            medicamentos: [
                {
                    id: 101,
                    nombre: 'Suplemento Vitamínico',
                    frecuencia: '8:00 AM',
                    cantidad: 30,
                    fechaInicio: hoy,
                    fechaFin: sumarDias(hoy, 30),
                    proximaToma: obtenerHoraFuturaISO(120),
                    alerta30Enviada: false,
                    alertaHoraEnviada: false
                }
            ],
            examenes: [
                {
                    id: 201,
                    sector: 'Laboratorio Clínico',
                    titulo: 'Glucosa Basal',
                    fecha: hoy,
                    resultado: '95 mg/dL (Normal)',
                    porcentaje: 65
                }
            ],
            recomendaciones: [
                { id: 301, texto: 'Tomar medicamentos a tiempo', fecha: hoy, completada: true },
                { id: 302, texto: 'Próxima cita de control', fecha: hoy, completada: false }
            ],
            citas: [
                {
                    id: 401,
                    especialidad: 'Cardiólogo',
                    fecha: sumarDias(hoy, 6),
                    hora: '10:00',
                    lugar: 'Salud Total Sede Principal',
                    alerta1DiaEnviada: false,
                    alerta30MinEnviada: false
                }
            ]
        },
        {
            id: 'usr_pac_1',
            usuario: 'paciente1',
            password: '1234',
            rol: 'paciente',
            perfil: {
                nombre: 'María Gómez',
                documento: '43.987.654',
                edad: '64',
                rh: 'A+',
                eps: 'Savia Salud',
                enfermedad: 'hipertension',
                alergias: 'Penicilina',
                emergencia: '3001234567',
                foto: './img/ia.jpg'
            },
            medicamentos: [
                {
                    id: 501,
                    nombre: 'Losartán 50 mg',
                    frecuencia: 'Cada 12h',
                    cantidad: 28,
                    fechaInicio: hoy,
                    fechaFin: sumarDias(hoy, 14),
                    proximaToma: obtenerHoraFuturaISO(25),
                    alerta30Enviada: false,
                    alertaHoraEnviada: false
                }
            ],
            examenes: [
                {
                    id: 502,
                    sector: 'Cardiología',
                    titulo: 'Control Presión Arterial',
                    fecha: hoy,
                    resultado: '118/76 mmHg (Controlada)',
                    porcentaje: 75
                }
            ],
            recomendaciones: [
                { id: 503, texto: 'Reducir consumo de sal diario', fecha: hoy, completada: false }
            ],
            citas: []
        }
    ];
}

async function sincronizarUsuariosDesdeNube() {
    let locales = JSON.parse(localStorage.getItem(DB_USERS_KEY) || 'null');
    if (!locales || locales.length === 0) {
        locales = obtenerUsuariosPorDefecto();
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(locales));
    }

    if (!nubeActiva || !dbNube) return locales;

    try {
        const snapshot = await conTimeout(dbNube.collection('mi_salud_usuarios').get(), 4000);
        if (snapshot.empty) {
            for (const u of locales) {
                await conTimeout(dbNube.collection('mi_salud_usuarios').doc(u.id).set(u), 3000);
            }
            actualizarIndicadorNube(true);
            return locales;
        } else {
            const desdeNube = [];
            snapshot.forEach(doc => desdeNube.push(doc.data()));
            localStorage.setItem(DB_USERS_KEY, JSON.stringify(desdeNube));
            actualizarIndicadorNube(true);
            return desdeNube;
        }
    } catch (e) {
        console.warn("Firestore no respondió a tiempo o falta habilitar reglas:", e.message);
        actualizarIndicadorNube(false, 'Activa Firestore / Reglas');
        return locales;
    }
}

function obtenerUsuariosCache() {
    let locales = JSON.parse(localStorage.getItem(DB_USERS_KEY) || 'null');
    if (!locales || locales.length === 0) {
        locales = obtenerUsuariosPorDefecto();
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(locales));
    }
    return locales;
}

function obtenerUsuarioActivo() {
    const idActivo = localStorage.getItem(SESSION_KEY);
    if (!idActivo) return null;
    return obtenerUsuariosCache().find(u => u.id === idActivo) || null;
}

async function guardarUsuarioEnNubeYLocal(usuarioModificado) {
    const usuarios = obtenerUsuariosCache();
    const idx = usuarios.findIndex(u => u.id === usuarioModificado.id);
    if (idx !== -1) usuarios[idx] = usuarioModificado;
    else usuarios.push(usuarioModificado);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(usuarios));

    if (nubeActiva && dbNube) {
        try {
            await conTimeout(dbNube.collection('mi_salud_usuarios').doc(usuarioModificado.id).set(usuarioModificado), 4000);
            actualizarIndicadorNube(true);
        } catch (e) {
            console.warn("Guardado en caché local; pendiente sincronizar nube:", e.message);
        }
    }
}

let documentosUsuarioActual = [];

async function cargarDocumentosPaciente(userId) {
    const todosLocales = JSON.parse(localStorage.getItem(DB_DOCS_KEY) || '[]');
    let docsUsuario = todosLocales.filter(d => d.userId === userId);

    if (nubeActiva && dbNube) {
        try {
            const snap = await conTimeout(dbNube.collection('mi_salud_documentos').where('userId', '==', userId).get(), 4000);
            docsUsuario = [];
            snap.forEach(doc => docsUsuario.push(doc.data()));
            docsUsuario.sort((a, b) => b.id - a.id);

            const otros = todosLocales.filter(d => d.userId !== userId);
            localStorage.setItem(DB_DOCS_KEY, JSON.stringify([...otros, ...docsUsuario]));
        } catch (e) {
            console.warn("Usando documentos locales:", e.message);
        }
    }
    documentosUsuarioActual = docsUsuario;
    renderizarGaleriaDocumentos();
}

async function guardarDocumentoPaciente(nuevoDoc) {
    documentosUsuarioActual.unshift(nuevoDoc);
    const todosLocales = JSON.parse(localStorage.getItem(DB_DOCS_KEY) || '[]');
    todosLocales.unshift(nuevoDoc);
    localStorage.setItem(DB_DOCS_KEY, JSON.stringify(todosLocales));
    renderizarGaleriaDocumentos();

    if (nubeActiva && dbNube) {
        try {
            await conTimeout(dbNube.collection('mi_salud_documentos').doc(String(nuevoDoc.id)).set(nuevoDoc), 4000);
        } catch (e) {
            console.warn("Documento guardado localmente:", e.message);
        }
    }
}

async function eliminarDocumentoPaciente(docId) {
    documentosUsuarioActual = documentosUsuarioActual.filter(d => d.id !== docId);
    const todosLocales = JSON.parse(localStorage.getItem(DB_DOCS_KEY) || '[]').filter(d => d.id !== docId);
    localStorage.setItem(DB_DOCS_KEY, JSON.stringify(todosLocales));
    renderizarGaleriaDocumentos();

    if (nubeActiva && dbNube) {
        try {
            await conTimeout(dbNube.collection('mi_salud_documentos').doc(String(docId)).delete(), 4000);
        } catch (e) {}
    }
}

// =========================================================================
// 3. INICIALIZACIÓN Y NAVEGACIÓN
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    inicializarFirebase();
    configurarLogin();
    configurarNavegacionSuperior();
    configurarDropzone();
    configurarPerfilYFoto();
    configurarCitas();
    configurarNuevaRecomendacion();
    configurarAdminCrearUsuario();

    const usuario = obtenerUsuarioActivo();
    if (usuario) {
        await mostrarAplicacion(usuario);
    } else {
        sincronizarUsuariosDesdeNube();
    }

    setInterval(verificarAlarmasTiempoReal, 30000);
});

function cambiarSubpagina(nombreSubpagina) {
    ['inicio', 'cuidados', 'historial', 'admin'].forEach(sp => {
        const el = document.getElementById(`subpagina-${sp}`);
        if (el) el.style.display = (sp === nombreSubpagina) ? 'block' : 'none';
    });

    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.toggle('activo', btn.getAttribute('data-subpagina') === nombreSubpagina);
    });

    if (nombreSubpagina === 'cuidados') renderizarBienestar();
    if (nombreSubpagina === 'historial') renderizarTodo();
    if (nombreSubpagina === 'admin') renderizarListaUsuariosAdmin();
}

function configurarNavegacionSuperior() {
    document.querySelectorAll('.nav-link[data-subpagina]').forEach(btn => {
        btn.addEventListener('click', () => cambiarSubpagina(btn.getAttribute('data-subpagina')));
    });
}

// =========================================================================
// 4. LOGIN, LOGOUT Y PANEL ADMIN (CON PROTECCIÓN ANTI-BLOQUEO)
// =========================================================================
function configurarLogin() {
    const form = document.getElementById('formLogin');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btnSubmitLogin');
        const errorEl = document.getElementById('loginError');
        const u = document.getElementById('loginUsuario').value.trim();
        const p = document.getElementById('loginPassword').value.trim();

        btn.textContent = 'Verificando...';
        btn.disabled = true;
        errorEl.textContent = '';

        try {
            const usuarios = await sincronizarUsuariosDesdeNube();
            const encontrado = usuarios.find(x => x.usuario === u && x.password === p);

            if (!encontrado) {
                errorEl.textContent = '❌ Usuario o contraseña incorrectos.';
                return;
            }

            localStorage.setItem(SESSION_KEY, encontrado.id);
            await mostrarAplicacion(encontrado);
        } catch (err) {
            console.error('Error durante inicio de sesión:', err);
            errorEl.textContent = '⚠️ Error al iniciar sesión. Intenta nuevamente.';
        } finally {
            btn.textContent = 'Ingresar';
            btn.disabled = false;
        }
    });
}

async function mostrarAplicacion(usuario) {
    document.getElementById('pantallaLogin').style.display = 'none';
    document.getElementById('appPrincipal').style.display = 'block';

    const esAdmin = usuario.rol === 'admin';
    document.getElementById('btnNavAdminTop').style.display = esAdmin ? 'inline-block' : 'none';
    document.getElementById('btnNavAdminSide').style.display = esAdmin ? 'block' : 'none';

    cambiarSubpagina('inicio');
    renderizarTodo();
    await cargarDocumentosPaciente(usuario.id);
    verificarAlarmasTiempoReal();
}

function cerrarSesion() {
    localStorage.removeItem(SESSION_KEY);
    document.getElementById('appPrincipal').style.display = 'none';
    document.getElementById('pantallaLogin').style.display = 'flex';
    document.getElementById('formLogin').reset();
}

function configurarAdminCrearUsuario() {
    const form = document.getElementById('formCrearUsuario');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const actual = obtenerUsuarioActivo();
        if (!actual || actual.rol !== 'admin') return;

        const username = document.getElementById('nuevoUsuario').value.trim();
        const usuarios = await sincronizarUsuariosDesdeNube();
        if (usuarios.some(u => u.usuario.toLowerCase() === username.toLowerCase())) {
            alert('⚠️ Ese usuario ya existe.');
            return;
        }

        const nuevo = {
            id: 'usr_' + Date.now(),
            usuario: username,
            password: document.getElementById('nuevoPassword').value.trim(),
            rol: document.getElementById('nuevoRol').value,
            perfil: {
                nombre: document.getElementById('nuevoNombre').value.trim(),
                documento: '',
                edad: document.getElementById('nuevaEdad').value.trim(),
                rh: document.getElementById('nuevoRH').value.trim().toUpperCase(),
                eps: document.getElementById('nuevaEPS').value,
                enfermedad: document.getElementById('nuevaEnfermedad').value,
                alergias: '',
                emergencia: '',
                foto: './img/ia.jpg'
            },
            medicamentos: [],
            examenes: [],
            recomendaciones: [],
            citas: []
        };

        await guardarUsuarioEnNubeYLocal(nuevo);
        form.reset();
        renderizarListaUsuariosAdmin();
        alert(`✅ Usuario "${nuevo.perfil.nombre}" creado correctamente.`);
    });
}

function renderizarListaUsuariosAdmin() {
    const contenedor = document.getElementById('listaUsuariosAdmin');
    const actual = obtenerUsuarioActivo();
    if (!contenedor || !actual || actual.rol !== 'admin') return;

    contenedor.innerHTML = obtenerUsuariosCache().map(u => `
        <div class="tarjeta-registro" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${escaparHTML(u.perfil.nombre)}</strong> (${u.rol.toUpperCase()})<br>
                <small>Usuario: <code>${escaparHTML(u.usuario)}</code> | Clave: <code>${escaparHTML(u.password)}</code> | EPS: ${escaparHTML(u.perfil.eps)}</small>
            </div>
            ${u.id !== actual.id ? `<button type="button" onclick="eliminarUsuarioAdmin('${u.id}')" class="btn-salir-mini">Eliminar</button>` : '<small style="color:#1b4d32; font-weight:700;">Activo</small>'}
        </div>
    `).join('');
}

async function eliminarUsuarioAdmin(id) {
    if (!confirm('¿Eliminar este usuario y su historial?')) return;
    const restantes = obtenerUsuariosCache().filter(u => u.id !== id);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(restantes));
    if (nubeActiva && dbNube) {
        try { await conTimeout(dbNube.collection('mi_salud_usuarios').doc(id).delete(), 4000); } catch (e) {}
    }
    renderizarListaUsuariosAdmin();
}

// =========================================================================
// 5. PERFIL PERSONAL Y FOTO DE PERFIL
// =========================================================================
function alternarEdicionPerfil(editar) {
    document.getElementById('vistaLecturaPerfil').style.display = editar ? 'none' : 'flex';
    document.getElementById('formDatosPersonales').style.display = editar ? 'flex' : 'none';
}

function configurarPerfilYFoto() {
    const inputFoto = document.getElementById('inputFotoPerfil');
    if (inputFoto) {
        inputFoto.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const usuario = obtenerUsuarioActivo();
            if (!usuario) return;

            const foto = await comprimirImagen(file, 220, 0.72);
            usuario.perfil.foto = foto;
            await guardarUsuarioEnNubeYLocal(usuario);
            renderizarPerfilLateral(usuario);
        });
    }

    const form = document.getElementById('formDatosPersonales');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usuario = obtenerUsuarioActivo();
            if (!usuario) return;

            usuario.perfil.nombre = document.getElementById('pacienteNombre').value.trim();
            usuario.perfil.edad = document.getElementById('pacienteEdad').value.trim();
            usuario.perfil.rh = document.getElementById('pacienteRH').value.trim().toUpperCase();
            usuario.perfil.documento = document.getElementById('pacienteDocumento').value.trim();
            usuario.perfil.eps = document.getElementById('pacienteEPS').value;
            usuario.perfil.enfermedad = document.getElementById('pacienteEnfermedad').value;
            usuario.perfil.alergias = document.getElementById('pacienteAlergias').value.trim();
            usuario.perfil.emergencia = document.getElementById('pacienteEmergencia').value.trim();

            await guardarUsuarioEnNubeYLocal(usuario);
            alternarEdicionPerfil(false);
            renderizarTodo();
        });
    }
}

function renderizarPerfilLateral(usuario) {
    const p = usuario.perfil;
    const primerNombre = (p.nombre || 'Usuario').split(' ')[0];
    document.getElementById('headerSaludo').textContent = `Hola, ${primerNombre}`;

    const foto = p.foto || './img/ia.jpg';
    document.getElementById('headerAvatar').src = foto;
    document.getElementById('perfilAvatarPreview').src = foto;

    document.getElementById('lblNombre').textContent = p.nombre || '--';
    document.getElementById('lblEdad').textContent = p.edad ? `${p.edad} años` : '--';
    document.getElementById('lblRH').textContent = p.rh || '--';
    document.getElementById('lblEPS').textContent = p.eps || '--';
    document.getElementById('lblEnfermedad').textContent = CONTENIDO_SALUD[p.enfermedad]?.titulo || 'Salud General';

    document.getElementById('pacienteNombre').value = p.nombre || '';
    document.getElementById('pacienteEdad').value = p.edad || '';
    document.getElementById('pacienteRH').value = p.rh || '';
    document.getElementById('pacienteDocumento').value = p.documento || '';
    document.getElementById('pacienteEPS').value = p.eps || 'Salud Total';
    document.getElementById('pacienteEnfermedad').value = p.enfermedad || 'general';
    document.getElementById('pacienteAlergias').value = p.alergias || '';
    document.getElementById('pacienteEmergencia').value = p.emergencia || '';
}

// =========================================================================
// 6. DROPZONE Y LECTURA DE ARCHIVOS
// =========================================================================
let archivoActualDataURL = null;

function configurarDropzone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    if (!dropZone || !fileInput) return;

    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) {
            document.getElementById('dropZoneTexto').textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
        }
    });

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            document.getElementById('dropZoneTexto').textContent = `Archivo listo: ${e.dataTransfer.files[0].name}`;
        }
    });
}

document.getElementById('fileForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const result = document.getElementById('result');
    const preview = document.getElementById('preview');
    const panelConfirmacion = document.getElementById('panelConfirmacionDatos');
    const file = fileInput.files[0];

    preview.innerHTML = '';
    panelConfirmacion.style.display = 'none';
    archivoActualDataURL = null;

    if (!file) {
        result.textContent = 'Selecciona o arrastra una foto o PDF antes de analizar.';
        result.style.color = '#1b4d32';
        return;
    }

    const validImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (validImages.includes(file.type)) {
        result.textContent = '⏳ Leyendo imagen médica (OCR)...';
        result.style.color = '#1b4d32';
        archivoActualDataURL = await comprimirImagen(file, 720, 0.65);

        preview.innerHTML = `<img src="${archivoActualDataURL}" style="max-width:100%; max-height:200px; border-radius:8px; margin-top:10px; border:1px solid #dce6e0;">`;

        Tesseract.recognize(archivoActualDataURL, 'spa', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    result.textContent = `⏳ Procesando texto... ${Math.round(m.progress * 100)}%`;
                }
            }
        }).then(({ data: { text } }) => {
            result.textContent = '✅ Documento leído. Confirma los datos para guardarlos:';
            result.style.color = '#1b4d32';
            mostrarPanelConfirmacion(text, file.name);
        }).catch(() => {
            result.textContent = '⚠️ Completa los datos manualmente para guardar el archivo:';
            mostrarPanelConfirmacion('', file.name);
        });

    } else if (file.type === 'application/pdf') {
        result.textContent = '⏳ Extrayendo información del PDF...';
        const reader = new FileReader();
        reader.onload = function () {
            pdfjsLib.getDocument(new Uint8Array(this.result)).promise.then(pdf => {
                let promesas = [];
                for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
                    promesas.push(pdf.getPage(i).then(p => p.getTextContent()).then(c => c.items.map(x => x.str).join(' ')));
                }
                Promise.all(promesas).then(paginas => {
                    result.textContent = '✅ PDF leído. Confirma los datos para guardarlos:';
                    mostrarPanelConfirmacion(paginas.join('\n'), file.name);
                });
            });
        };
        reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (ev) => {
            result.textContent = '✅ Texto leído.';
            mostrarPanelConfirmacion(ev.target.result, file.name);
        };
        reader.readAsText(file);
    } else {
        result.textContent = 'Formato no soportado. Usa PDF, JPG o PNG.';
        result.style.color = '#b52b27';
        return;
    }

    document.getElementById('reiniciar').disabled = false;
});

function analizarTextoMedico(texto) {
    const hoy = new Date().toISOString().split('T')[0];
    const limpio = (texto || '').replace(/\r/g, '');
    const lineas = limpio.split('\n').map(l => l.trim()).filter(l => l.length > 2);

    let fecha = hoy;
    const mISO = limpio.match(/\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/);
    const mLat = limpio.match(/\b(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](20\d{2})\b/);
    if (mISO) fecha = `${mISO[1]}-${mISO[2]}-${mISO[3]}`;
    else if (mLat) fecha = `${mLat[3]}-${mLat[2]}-${mLat[1]}`;

    const esMed = /\b(\d+\s*(mg|g|ml|mcg)|tabletas?|c[aá]psulas?|gotas|jarabe|cada\s+\d+\s*h|f[oó]rmula)\b/i.test(limpio);
    const esEx = /\b(hemograma|glucosa|colesterol|hemoglobina|creatinina|orina|laboratorio|ecograf[ií]a|radiograf[ií]a|resultado)\b/i.test(limpio);
    const tipo = (esEx && !esMed) ? 'examen' : 'formula';

    const lineaMed = lineas.find(l => /\b\d+\s*(mg|g|ml|mcg)\b/i.test(l)) || '';
    const mFrec = limpio.match(/(cada\s+\d+\s*(horas?|h)|una\s+vez\s+al\s+d[ií]a)/i);
    const mCant = limpio.match(/(\d+)\s*(tabletas?|c[aá]psulas?|unidades?|pastillas?)/i);

    let sector = 'Laboratorio Clínico';
    if (/ecograf[ií]a|radiograf[ií]a|rayos\s*x|resonancia/i.test(limpio)) sector = 'Imágenes Diagnósticas';
    else if (/electrocardiograma|cardiolog[ií]a|presi[oó]n/i.test(limpio)) sector = 'Cardiología';
    else if (!esEx) sector = 'Medicina General';

    const lineaEx = lineas.find(l => esEx) || (lineas[0] || '');
    const recs = lineas.filter(l => /\b(recomendaci[oó]n|evitar|ayunas|dieta|reposo|control|tomar)\b/i.test(l)).slice(0, 3).join('\n');

    return {
        tipo,
        fecha,
        medNombre: lineaMed.substring(0, 55),
        medFrec: mFrec ? mFrec[0] : 'Cada 8h',
        medCant: mCant ? parseInt(mCant[1], 10) : 14,
        proximaToma: obtenerHoraFuturaISO(60),
        exSector: sector,
        exTitulo: lineaEx.substring(0, 55),
        exResultado: limpio.substring(0, 180),
        recomendaciones: recs
    };
}

function mostrarPanelConfirmacion(texto, nombreArchivo) {
    const d = analizarTextoMedico(texto);
    const panel = document.getElementById('panelConfirmacionDatos');
    panel.style.display = 'block';

    panel.innerHTML = `
        <h3 style="color:#1b4d32;">Guardar en Historial (${escaparHTML(nombreArchivo)})</h3>
        <div class="form-stack">
            <select id="confTipo" class="campo-salud">
                <option value="formula" ${d.tipo === 'formula' ? 'selected' : ''}>Fórmula Médica (Medicamento)</option>
                <option value="examen" ${d.tipo === 'examen' ? 'selected' : ''}>Examen / Resultado Médico</option>
            </select>
            <input type="date" id="confFecha" value="${d.fecha}" class="campo-salud">

            <div id="bloqueFormula" class="form-stack" style="display:${d.tipo === 'formula' ? 'flex' : 'none'};">
                <input type="text" id="confMedNombre" value="${escaparHTML(d.medNombre)}" placeholder="Medicamento y dosis" class="campo-salud">
                <div style="display:flex; gap:6px;">
                    <input type="text" id="confMedFrec" value="${escaparHTML(d.medFrec)}" placeholder="Frecuencia" class="campo-salud">
                    <input type="number" id="confMedCant" value="${d.medCant}" min="1" placeholder="Cant." class="campo-salud">
                </div>
                <label class="label-campo">Próxima toma (Alarma 30 min antes y hora exacta):
                    <input type="datetime-local" id="confMedToma" value="${d.proximaToma}" class="campo-salud">
                </label>
            </div>

            <div id="bloqueExamen" class="form-stack" style="display:${d.tipo === 'examen' ? 'flex' : 'none'};">
                <select id="confExSector" class="campo-salud">
                    <option value="Laboratorio Clínico" ${d.exSector === 'Laboratorio Clínico' ? 'selected' : ''}>Laboratorio Clínico</option>
                    <option value="Imágenes Diagnósticas" ${d.exSector === 'Imágenes Diagnósticas' ? 'selected' : ''}>Imágenes Diagnósticas</option>
                    <option value="Cardiología" ${d.exSector === 'Cardiología' ? 'selected' : ''}>Cardiología</option>
                    <option value="Medicina General" ${d.exSector === 'Medicina General' ? 'selected' : ''}>Medicina General</option>
                </select>
                <input type="text" id="confExTitulo" value="${escaparHTML(d.exTitulo)}" placeholder="Nombre del examen" class="campo-salud">
                <input type="text" id="confExResultado" value="${escaparHTML(d.exResultado)}" placeholder="Resultado (ej. 95 mg/dL Normal)" class="campo-salud">
            </div>

            <textarea id="confRecs" rows="2" placeholder="Recomendaciones médicas (una por línea)..." class="campo-salud">${escaparHTML(d.recomendaciones)}</textarea>
            <button type="button" id="btnGuardarDoc" class="btn-primario">Guardar en mi Historial</button>
        </div>
    `;

    document.getElementById('confTipo').addEventListener('change', (e) => {
        const esF = e.target.value === 'formula';
        document.getElementById('bloqueFormula').style.display = esF ? 'flex' : 'none';
        document.getElementById('bloqueExamen').style.display = esF ? 'none' : 'flex';
    });

    document.getElementById('btnGuardarDoc').addEventListener('click', async () => {
        const usuario = obtenerUsuarioActivo();
        if (!usuario) return;

        const btn = document.getElementById('btnGuardarDoc');
        btn.textContent = 'Guardando...';
        btn.disabled = true;

        const tipo = document.getElementById('confTipo').value;
        const fecha = document.getElementById('confFecha').value;

        await guardarDocumentoPaciente({
            id: Date.now(),
            userId: usuario.id,
            nombreArchivo,
            tipo,
            fecha,
            imagenDataURL: archivoActualDataURL,
            textoExtraido: (texto || 'Registro manual').substring(0, 12000)
        });

        if (tipo === 'formula') {
            const nombre = document.getElementById('confMedNombre').value.trim();
            if (nombre) {
                usuario.medicamentos.unshift({
                    id: Date.now() + 1,
                    nombre,
                    frecuencia: document.getElementById('confMedFrec').value.trim(),
                    cantidad: parseInt(document.getElementById('confMedCant').value, 10) || 1,
                    fechaInicio: fecha,
                    fechaFin: sumarDias(fecha, 7),
                    proximaToma: document.getElementById('confMedToma').value,
                    alerta30Enviada: false,
                    alertaHoraEnviada: false
                });
            }
        } else {
            usuario.examenes.unshift({
                id: Date.now() + 2,
                sector: document.getElementById('confExSector').value,
                titulo: document.getElementById('confExTitulo').value.trim() || 'Examen médico',
                fecha,
                resultado: document.getElementById('confExResultado').value.trim(),
                porcentaje: 70
            });
        }

        const recs = document.getElementById('confRecs').value.trim();
        if (recs) {
            recs.split('\n').map(r => r.trim()).filter(Boolean).forEach((txt, idx) => {
                usuario.recomendaciones.unshift({
                    id: Date.now() + 10 + idx,
                    texto: txt,
                    fecha,
                    completada: false
                });
            });
        }

        await guardarUsuarioEnNubeYLocal(usuario);
        renderizarTodo();
        panel.innerHTML = `<strong style="color:#1b4d32;">✅ Archivo e información guardados correctamente.</strong>`;
    });
}

// =========================================================================
// 7. RENDERIZADO DE TODAS LAS SECCIONES
// =========================================================================
function renderizarTodo() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    renderizarPerfilLateral(usuario);
    renderizarResumenInicio(usuario);
    renderizarCitas(usuario);
    renderizarRecomendaciones(usuario);
    renderizarHistorialCompleto(usuario);
    renderizarGaleriaDocumentos();
    renderizarBienestar();
}

function renderizarResumenInicio(usuario) {
    const contMed = document.getElementById('resumenMedicamentosActivos');
    if (contMed) {
        contMed.innerHTML = usuario.medicamentos.length === 0
            ? '<p class="texto-suave">Sin medicamentos activos.</p>'
            : usuario.medicamentos.slice(0, 4).map(m => `
                <div class="item-med-compacto">
                    <span class="check-circulo">✓</span>
                    <div style="flex:1;">
                        <strong>${escaparHTML(m.nombre)}</strong> - ${escaparHTML(m.frecuencia)}<br>
                        <small style="color:#5a6b61;">Quedan ${m.cantidad} und.</small>
                    </div>
                    <button type="button" onclick="registrarTomaMedicamento(${m.id})" class="btn-secundario" style="padding:3px 8px; font-size:11px;">Tomar</button>
                </div>
            `).join('');
    }

    const contRes = document.getElementById('resumenResultadosRecientes');
    if (contRes) {
        contRes.innerHTML = usuario.examenes.length === 0
            ? '<p class="texto-suave">Sin resultados recientes.</p>'
            : usuario.examenes.slice(0, 4).map(ex => `
                <div style="font-size:13px;">
                    <div><strong>${escaparHTML(ex.titulo)}:</strong> ${escaparHTML(ex.resultado)}</div>
                    <div class="barra-progreso-bg">
                        <div class="barra-progreso-fill" style="width:${ex.porcentaje || 70}%;"></div>
                    </div>
                </div>
            `).join('');
    }
}

function renderizarHistorialCompleto(usuario, sectorFiltro = 'Todos') {
    const contMed = document.getElementById('listaMedicamentos');
    if (contMed) {
        contMed.innerHTML = usuario.medicamentos.length === 0
            ? '<p class="texto-suave">No tienes medicamentos registrados.</p>'
            : usuario.medicamentos.map(m => `
                <div class="tarjeta-registro" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>💊 ${escaparHTML(m.nombre)}</strong> (${escaparHTML(m.frecuencia)})<br>
                        <small>Cantidad: ${m.cantidad} | Vigencia: ${m.fechaInicio} al ${m.fechaFin}</small>
                    </div>
                    <button type="button" onclick="eliminarItemUsuario('medicamentos', ${m.id})" class="btn-salir-mini">✕</button>
                </div>
            `).join('');
    }

    const contEx = document.getElementById('listaExamenes');
    const filtros = document.getElementById('filtrosSector');
    if (contEx && filtros) {
        const sectores = ['Todos', ...new Set(usuario.examenes.map(e => e.sector))];
        filtros.innerHTML = sectores.map(s => `
            <button type="button" onclick="filtrarSector('${s}')" class="btn-secundario"
                style="margin-right:5px; background:${sectorFiltro === s ? '#1b4d32' : '#e6f2eb'}; color:${sectorFiltro === s ? '#fff' : '#1b4d32'};">
                ${s}
            </button>
        `).join('');

        const lista = sectorFiltro === 'Todos' ? usuario.examenes : usuario.examenes.filter(e => e.sector === sectorFiltro);
        contEx.innerHTML = lista.length === 0
            ? '<p class="texto-suave">No hay exámenes en este sector.</p>'
            : lista.map(ex => `
                <div class="tarjeta-registro" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="background:#e6f2eb; color:#1b4d32; padding:2px 8px; border-radius:8px; font-size:11px; font-weight:700;">${escaparHTML(ex.sector)}</span>
                        <small style="margin-left:6px;">${ex.fecha}</small><br>
                        <strong>${escaparHTML(ex.titulo)}:</strong> ${escaparHTML(ex.resultado)}
                    </div>
                    <button type="button" onclick="eliminarItemUsuario('examenes', ${ex.id})" class="btn-salir-mini">✕</button>
                </div>
            `).join('');
    }
}

function filtrarSector(sector) {
    const usuario = obtenerUsuarioActivo();
    if (usuario) renderizarHistorialCompleto(usuario, sector);
}

function renderizarGaleriaDocumentos() {
    const galeria = document.getElementById('galeriaDocumentos');
    if (!galeria) return;

    galeria.innerHTML = documentosUsuarioActual.length === 0
        ? '<p class="texto-suave">Aún no hay archivos guardados en tu cuenta.</p>'
        : documentosUsuarioActual.map(doc => `
            <div class="doc-card">
                ${doc.imagenDataURL ? `<img src="${doc.imagenDataURL}" alt="Doc">` : `<div style="height:100px; background:#e6f2eb; display:flex; align-items:center; justify-content:center; border-radius:6px; margin-bottom:6px; font-weight:700; color:#1b4d32;">📄 PDF</div>`}
                <strong>${escaparHTML(doc.nombreArchivo)}</strong><br>
                <small>${doc.fecha}</small>
                <div style="display:flex; gap:4px; margin-top:6px;">
                    <button type="button" onclick="abrirModalDocumento(${doc.id})" class="btn-primario" style="flex:1; padding:4px; font-size:11px;">Ver</button>
                    <button type="button" onclick="eliminarDocumentoPaciente(${doc.id})" class="btn-salir-mini" style="padding:4px 7px;">✕</button>
                </div>
            </div>
        `).join('');
}

// =========================================================================
// 8. SUBPÁGINA MIS CUIDADOS (VIDEOS AUTOMÁTICOS POR ENFERMEDAD Y EDAD)
// =========================================================================
function renderizarBienestar() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    const cond = usuario.perfil.enfermedad || 'general';
    const edad = parseInt(usuario.perfil.edad, 10) || 30;
    const plan = CONTENIDO_SALUD[cond] || CONTENIDO_SALUD.general;

    const videosAdaptados = [...plan.videos];
    let guiaEdad = `Adulto (${edad} años): actividad física moderada y constante.`;

    if (edad >= 60) {
        guiaEdad = `Adulto mayor (${edad} años): videos y ejercicios adaptados a bajo impacto y equilibrio.`;
        videosAdaptados[2] = VIDEOS_POR_EDAD.mayor;
    } else if (edad < 18) {
        guiaEdad = `Etapa juvenil (${edad} años): deportes recreativos, movilidad e hidratación.`;
        videosAdaptados[2] = VIDEOS_POR_EDAD.juvenil;
    }

    document.getElementById('encabezadoBienestar').innerHTML = `
        <strong>Plan activo: ${plan.titulo}</strong><br>
        <span>${guiaEdad}</span>
    `;

    document.getElementById('contenedorVideosSalud').innerHTML = videosAdaptados.map((v, i) => `
        <div class="video-card">
            <iframe src="${v.urlEmbed}" title="${escaparHTML(v.titulo)}" allowfullscreen loading="lazy"></iframe>
            <div style="padding:10px;">
                <small style="color:#1b4d32; font-weight:700;">VIDEO ${i + 1} DE 3</small>
                <p style="margin:4px 0 8px 0; font-size:13px; font-weight:600;">${escaparHTML(v.titulo)}</p>
                <a href="${v.urlDirecta}" target="_blank" rel="noopener" style="font-size:12px; color:#1b4d32; font-weight:700;">Ver en YouTube ↗</a>
            </div>
        </div>
    `).join('');

    document.getElementById('contenedorAlimentacion').innerHTML = `
        <ul style="margin:0; padding-left:18px; line-height:1.6;">
            ${plan.alimentacion.map(tip => `<li>${escaparHTML(tip)}</li>`).join('')}
        </ul>
    `;

    document.getElementById('contenedorDeportes').innerHTML = plan.deportes.map(d => `
        <div class="deporte-card">
            <strong style="color:#1b4d32;">🏅 ${escaparHTML(d.nombre)}</strong>
            <p style="margin:6px 0 0 0; font-size:12px; color:#3a4a41;">${escaparHTML(d.detalle)}</p>
        </div>
    `).join('');
}

// =========================================================================
// 9. CITAS, RECOMENDACIONES Y ALARMAS SONORAS
// =========================================================================
function configurarCitas() {
    const form = document.getElementById('formCitas');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuario = obtenerUsuarioActivo();
        if (!usuario) return;

        usuario.citas.push({
            id: Date.now(),
            especialidad: document.getElementById('citaEspecialidad').value.trim(),
            fecha: document.getElementById('citaFecha').value,
            hora: document.getElementById('citaHora').value,
            lugar: document.getElementById('citaLugar').value.trim() || usuario.perfil.eps,
            alerta1DiaEnviada: false,
            alerta30MinEnviada: false
        });

        usuario.citas.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
        await guardarUsuarioEnNubeYLocal(usuario);
        renderizarCitas(usuario);
        form.reset();
        verificarAlarmasTiempoReal();
    });
}

function renderizarCitas(usuario) {
    const cont = document.getElementById('listaCitas');
    if (!cont) return;

    cont.innerHTML = usuario.citas.length === 0
        ? '<p class="texto-suave">Sin citas agendadas.</p>'
        : usuario.citas.map(c => `
            <div class="cita-row">
                <div>
                    <strong>${escaparHTML(c.especialidad)}</strong> - ${c.fecha}, ${c.hora}<br>
                    <small style="color:#5a6b61;">📍 ${escaparHTML(c.lugar)}</small>
                </div>
                <button type="button" onclick="eliminarItemUsuario('citas', ${c.id})" style="background:none; border:none; color:#b52b27; cursor:pointer; font-weight:700;">✕</button>
            </div>
        `).join('');
}

function configurarNuevaRecomendacion() {
    const form = document.getElementById('formNuevaRecomendacion');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('inputNuevaRec');
        const texto = input.value.trim();
        if (!texto) return;

        const usuario = obtenerUsuarioActivo();
        if (!usuario) return;

        usuario.recomendaciones.push({
            id: Date.now(),
            texto,
            fecha: new Date().toISOString().split('T')[0],
            completada: false
        });
        await guardarUsuarioEnNubeYLocal(usuario);
        renderizarRecomendaciones(usuario);
        input.value = '';
    });
}

function renderizarRecomendaciones(usuario) {
    const cont = document.getElementById('listaRecomendaciones');
    if (!cont) return;

    cont.innerHTML = usuario.recomendaciones.length === 0
        ? '<p class="texto-suave">Sin recomendaciones registradas.</p>'
        : usuario.recomendaciones.map(r => `
            <div class="rec-row">
                <input type="checkbox" ${r.completada ? 'checked' : ''} onchange="alternarRecomendacionUsuario(${r.id})">
                <span style="flex:1; text-decoration:${r.completada ? 'line-through' : 'none'}; color:${r.completada ? '#7a8a81' : '#1e2923'};">
                    ${escaparHTML(r.texto)}
                </span>
                <button type="button" onclick="eliminarItemUsuario('recomendaciones', ${r.id})" style="background:none; border:none; color:#b52b27; cursor:pointer;">✕</button>
            </div>
        `).join('');
}

function reproducirSonidoAlerta() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.16);
            gain.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.16);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.16 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.16);
            osc.stop(ctx.currentTime + i * 0.16 + 0.32);
        });
    } catch (e) {}
}

function probarSonidoAlerta() {
    reproducirSonidoAlerta();
    mostrarBannerAlerta('🔔 Alarma activada: Recibirás avisos sonoros 1 día antes y 30 min antes de citas y medicinas.');
}

function mostrarBannerAlerta(msg) {
    document.getElementById('textoAlertaGlobal').textContent = msg;
    document.getElementById('bannerAlertaGlobal').style.display = 'flex';
}

function cerrarBannerAlerta() {
    document.getElementById('bannerAlertaGlobal').style.display = 'none';
}

async function verificarAlarmasTiempoReal() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    const ahora = new Date();
    let cambios = false;

    usuario.citas.forEach(c => {
        if (!c.fecha || !c.hora) return;
        const diff = (new Date(`${c.fecha}T${c.hora}:00`) - ahora) / 60000;
        if (diff > 30 && diff <= 1440 && !c.alerta1DiaEnviada) {
            c.alerta1DiaEnviada = true;
            cambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`📅 Cita mañana: ${c.especialidad} a las ${c.hora} (${c.lugar}).`);
        }
        if (diff > 0 && diff <= 30 && !c.alerta30MinEnviada) {
            c.alerta30MinEnviada = true;
            cambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`⏰ ¡Cita en ${Math.ceil(diff)} min! ${c.especialidad} a las ${c.hora}.`);
        }
    });

    usuario.medicamentos.forEach(m => {
        if (!m.proximaToma || m.cantidad <= 0) return;
        const diff = (new Date(m.proximaToma) - ahora) / 60000;
        if (diff > 0 && diff <= 30 && !m.alerta30Enviada) {
            m.alerta30Enviada = true;
            cambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`💊 En ${Math.ceil(diff)} min debes tomar: ${m.nombre}.`);
        }
        if (diff <= 0 && diff >= -20 && !m.alertaHoraEnviada) {
            m.alertaHoraEnviada = true;
            cambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`🚨 ¡Hora de tu medicina! Toma ahora: ${m.nombre}.`);
        }
    });

    if (cambios) await guardarUsuarioEnNubeYLocal(usuario);
}

// =========================================================================
// 10. UTILIDADES GENERALES
// =========================================================================
async function registrarTomaMedicamento(id) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    const med = usuario.medicamentos.find(m => m.id === id);
    if (med && med.cantidad > 0) {
        med.cantidad -= 1;
        med.proximaToma = obtenerHoraFuturaISO(480);
        med.alerta30Enviada = false;
        med.alertaHoraEnviada = false;
        await guardarUsuarioEnNubeYLocal(usuario);
        renderizarTodo();
    }
}

async function eliminarItemUsuario(coleccion, id) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    usuario[coleccion] = usuario[coleccion].filter(x => x.id !== id);
    await guardarUsuarioEnNubeYLocal(usuario);
    renderizarTodo();
}

async function alternarRecomendacionUsuario(id) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    const rec = usuario.recomendaciones.find(r => r.id === id);
    if (rec) {
        rec.completada = !rec.completada;
        await guardarUsuarioEnNubeYLocal(usuario);
        renderizarRecomendaciones(usuario);
    }
}

function abrirModalDocumento(id) {
    const doc = documentosUsuarioActual.find(d => d.id === id);
    if (!doc) return;
    document.getElementById('modalDocTitulo').textContent = `${doc.nombreArchivo} (${doc.fecha})`;
    document.getElementById('modalDocCuerpo').innerHTML = `
        ${doc.imagenDataURL ? `<img src="${doc.imagenDataURL}" style="max-width:100%; border-radius:8px; margin-bottom:10px;">` : ''}
        <pre style="background:#f6faf7; padding:10px; border-radius:8px; white-space:pre-wrap; font-size:12px;">${escaparHTML(doc.textoExtraido)}</pre>
    `;
    document.getElementById('modalDocumento').style.display = 'flex';
}

function cerrarModalDocumento() {
    document.getElementById('modalDocumento').style.display = 'none';
}

function exportarHistorialUsuario() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    const respaldo = { ...usuario, password: '***', documentos: documentosUsuarioActual };
    const blob = new Blob([JSON.stringify(respaldo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MiSalud_${usuario.usuario}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function comprimirImagen(file, maxWidth = 600, quality = 0.7) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function sumarDias(fechaISO, dias) {
    const f = new Date(fechaISO + 'T00:00:00');
    f.setDate(f.getDate() + (parseInt(dias, 10) || 0));
    return f.toISOString().split('T')[0];
}

function obtenerHoraFuturaISO(mins) {
    const f = new Date(Date.now() + mins * 60000);
    return new Date(f.getTime() - f.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function escaparHTML(txt) {
    const div = document.createElement('div');
    div.textContent = txt || '';
    return div.innerHTML;
}

function nuevo_archivo() {
    const fi = document.getElementById('fileInput');
    fi.value = '';
    document.getElementById('dropZoneTexto').textContent = 'Selecciona o arrastra tu archivo aquí (PDF, JPG, PNG)';
    document.getElementById('result').textContent = '';
    document.getElementById('preview').innerHTML = '';
    document.getElementById('panelConfirmacionDatos').style.display = 'none';
    document.getElementById('reiniciar').disabled = true;
    archivoActualDataURL = null;
}