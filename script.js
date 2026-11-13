// Documentación JavaScript para Mi Salud - Fase 3 (Multiusuario, Alarmas, EPS y Bienestar)
// Base adaptada de Validador Marketing LAB - Autor: Alejandro Quintero

const DB_USERS_KEY = 'mi_salud_usuarios_v3';
const SESSION_KEY = 'mi_salud_sesion_activa_v3';

// =========================================================================
// 1. BASE DE CONOCIMIENTO DE SALUD (VIDEOS, ALIMENTACIÓN Y DEPORTES)
// =========================================================================
const CONTENIDO_SALUD = {
    general: {
        titulo: 'Prevención y Bienestar Integral',
        videos: [
            { titulo: 'Rutina de movilidad articular diaria (10 min)', urlEmbed: 'https://www.youtube.com/embed/inpok4MKVLM', urlDirecta: 'https://www.youtube.com/results?search_query=rutina+movilidad+articular+10+minutos+salud' },
            { titulo: 'Hábitos clave para fortalecer tu sistema inmune', urlEmbed: 'https://www.youtube.com/embed/5qap5aO4i9A', urlDirecta: 'https://www.youtube.com/results?search_query=habitos+saludables+sistema+inmunologico+medicina' },
            { titulo: 'Higiene del sueño y descanso reparador', urlEmbed: 'https://www.youtube.com/embed/t0kACis_dJE', urlDirecta: 'https://www.youtube.com/results?search_query=higiene+del+sueno+consejos+medicos' }
        ],
        alimentacion: [
            'Prioriza platos balanceados: 50% vegetales variados, 25% proteína magra (pescado, pollo, legumbres) y 25% carbohidratos integrales.',
            'Mantén una hidratación constante de 6 a 8 vasos de agua pura al día.',
            'Reduce el consumo de ultraprocesados, bebidas azucaradas y exceso de sodio.'
        ],
        deportes: [
            { nombre: 'Caminata Rápida', detalle: '30-45 min, 5 veces por semana. Mejora capacidad cardiorrespiratoria sin impacto articular.' },
            { nombre: 'Natación o Hidroterapia', detalle: '40 min, 2-3 veces por semana. Fortalece toda la musculatura protegiendo las articulaciones.' },
            { nombre: 'Ciclismo Recreativo', detalle: '30-60 min, 3 veces por semana. Excelente resistencia cardiovascular y control de peso.' }
        ]
    },
    hipertension: {
        titulo: 'Control de Hipertensión Arterial',
        videos: [
            { titulo: 'Cómo medir correctamente la presión arterial en casa', urlEmbed: 'https://www.youtube.com/embed/inpok4MKVLM', urlDirecta: 'https://www.youtube.com/results?search_query=como+tomar+la+presion+arterial+correctamente+en+casa' },
            { titulo: 'Dieta DASH para bajar la tensión arterial', urlEmbed: 'https://www.youtube.com/embed/t0kACis_dJE', urlDirecta: 'https://www.youtube.com/results?search_query=dieta+dash+hipertension+arterial+explicacion' },
            { titulo: 'Ejercicios seguros para personas hipertensas', urlEmbed: 'https://www.youtube.com/embed/5qap5aO4i9A', urlDirecta: 'https://www.youtube.com/results?search_query=ejercicios+para+hipertensos+cardiologia' }
        ],
        alimentacion: [
            'Aplica la dieta DASH: disminuye la sal (menos de 5g/día) y evita enlatados, embutidos y salsas comerciales.',
            'Aumenta alimentos ricos en potasio y magnesio: banano, aguacate, espinaca, lentejas y nueces sin sal.',
            'Evita el exceso de cafeína y alcohol, ya que elevan la presión sistólica.'
        ],
        deportes: [
            { nombre: 'Caminata Aeróbica Moderada', detalle: '30 min diarios a ritmo constante. Ayuda a dilatar los vasos sanguíneos y reducir la presión.' },
            { nombre: 'Ciclismo Estático Suave', detalle: '25-35 min, 4 veces por semana. Evitar picos de esfuerzo máximo o levantar pesas muy pesadas.' },
            { nombre: 'Yoga y Respiración Guiada', detalle: '20-30 min diarios. Reduce el cortisol y mejora el control nervioso de la frecuencia cardíaca.' }
        ]
    },
    diabetes: {
        titulo: 'Control Glucémico y Diabetes',
        videos: [
            { titulo: 'Índice glucémico: cómo combinar alimentos sin picos de azúcar', urlEmbed: 'https://www.youtube.com/embed/inpok4MKVLM', urlDirecta: 'https://www.youtube.com/results?search_query=indice+glucemico+como+evitar+picos+de+glucosa' },
            { titulo: 'Cuidado diario de los pies en pacientes con diabetes', urlEmbed: 'https://www.youtube.com/embed/t0kACis_dJE', urlDirecta: 'https://www.youtube.com/results?search_query=cuidado+del+pie+diabetico+prevencion' },
            { titulo: 'Actividad física post-comida para regular la glucosa', urlEmbed: 'https://www.youtube.com/embed/5qap5aO4i9A', urlDirecta: 'https://www.youtube.com/results?search_query=caminar+despues+de+comer+glucosa+diabetes' }
        ],
        alimentacion: [
            'Consume primero la fibra (ensalada/verduras), luego la proteína y al final los carbohidratos complejos (avena, quinoa, legumbres).',
            'Elimina azúcares refinados, jugos de fruta colados y harinas blancas.',
            'Respeta horarios regulares de comida para evitar hipoglucemias o hiperglucemias.'
        ],
        deportes: [
            { nombre: 'Caminata Postprandial (15 min)', detalle: 'Caminar 15 minutos después de cada comida principal reduce notablemente el pico de glucosa.' },
            { nombre: 'Entrenamiento de Fuerza Ligera', detalle: '2-3 veces por semana con bandas elásticas. El músculo consume glucosa incluso en reposo.' },
            { nombre: 'Natación / Aquagym', detalle: '30-40 min, 3 veces por semana. Ideal para mejorar sensibilidad a la insulina cuidando los pies.' }
        ]
    },
    osteomuscular: {
        titulo: 'Salud Osteomuscular y Espalda',
        videos: [
            { titulo: 'Pausas activas y ergonomía frente al computador', urlEmbed: 'https://www.youtube.com/embed/inpok4MKVLM', urlDirecta: 'https://www.youtube.com/results?search_query=pausas+activas+dolor+lumbar+y+cuello+fisioterapia' },
            { titulo: 'Estiramientos suaves para aliviar el dolor lumbar', urlEmbed: 'https://www.youtube.com/embed/t0kACis_dJE', urlDirecta: 'https://www.youtube.com/results?search_query=ejercicios+aliviar+dolor+lumbar+fisioterapia' },
            { titulo: 'Fortalecimiento del core para proteger la columna', urlEmbed: 'https://www.youtube.com/embed/5qap5aO4i9A', urlDirecta: 'https://www.youtube.com/results?search_query=fortalecimiento+core+sin+impacto+columna' }
        ],
        alimentacion: [
            'Incluye alimentos antiinflamatorios naturales: pescados azules (salmón, sardina), cúrcuma, jengibre y aceite de oliva.',
            'Asegura aporte de calcio y vitamina D (lácteos bajos en grasa, brócoli, exposición solar segura 15 min).',
            'Mantén un peso saludable para disminuir la carga mecánica sobre rodillas y zona lumbar.'
        ],
        deportes: [
            { nombre: 'Natación (Estilo Espalda/Crol)', detalle: '30-45 min, 3 veces por semana. Elimina la gravedad sobre los discos intervertebrales.' },
            { nombre: 'Pilates Terapéutico', detalle: '30 min, 3 veces por semana. Fortalece la faja abdominal profunda y mejora la postura.' },
            { nombre: 'Caminata en Terreno Plano', detalle: '30 min diarios con calzado amortiguado. Evitar trotar en asfalto o levantar cargas bruscas.' }
        ]
    },
    respiratorio: {
        titulo: 'Cuidado Respiratorio y Capacidad Pulmonar',
        videos: [
            { titulo: 'Técnica correcta de uso de inhaladores', urlEmbed: 'https://www.youtube.com/embed/inpok4MKVLM', urlDirecta: 'https://www.youtube.com/results?search_query=como+usar+inhalador+correctamente+neumologia' },
            { titulo: 'Ejercicios de fisioterapia respiratoria y diafragma', urlEmbed: 'https://www.youtube.com/embed/t0kACis_dJE', urlDirecta: 'https://www.youtube.com/results?search_query=ejercicios+respiracion+diafragmatica+pulmones' },
            { titulo: 'Prevención de crisis alérgicas y control ambiental', urlEmbed: 'https://www.youtube.com/embed/5qap5aO4i9A', urlDirecta: 'https://www.youtube.com/results?search_query=prevencion+asma+control+ambiental+hogar' }
        ],
        alimentacion: [
            'Aumenta el consumo de antioxidantes (vitamina C y E): cítricos, kiwi, pimentón, frutos rojos y semillas.',
            'Bebe abundante agua tibia o infusiones suaves para mantener fluidas las secreciones respiratorias.',
            'Evita alimentos muy fríos o con conservantes (sulfitos) si eres sensible a broncoespasmos.'
        ],
        deportes: [
            { nombre: 'Natación en Piscina Climatizada', detalle: '30-40 min, 2-3 veces por semana. El ambiente húmedo favorece las vías respiratorias.' },
            { nombre: 'Caminata Progresiva', detalle: '30 min diarios realizando calentamiento previo de 5 minutos antes de acelerar el paso.' },
            { nombre: 'Tai Chi o Yoga Respiratorio', detalle: '30 min, 3 veces por semana. Coordina el movimiento con inhalaciones profundas y controladas.' }
        ]
    },
    estres: {
        titulo: 'Salud Mental, Manejo del Estrés y Sueño',
        videos: [
            { titulo: 'Respiración 4-7-8 para calmar la ansiedad en 3 minutos', urlEmbed: 'https://www.youtube.com/embed/inpok4MKVLM', urlDirecta: 'https://www.youtube.com/results?search_query=respiracion+4+7+8+ansiedad+relajacion' },
            { titulo: 'Relajación muscular progresiva guiada', urlEmbed: 'https://www.youtube.com/embed/t0kACis_dJE', urlDirecta: 'https://www.youtube.com/results?search_query=relajacion+muscular+progresiva+de+jacobson' },
            { titulo: 'Desconexión digital y mejora del descanso nocturno', urlEmbed: 'https://www.youtube.com/embed/5qap5aO4i9A', urlDirecta: 'https://www.youtube.com/results?search_query=como+bajar+el+cortisol+y+dormir+mejor' }
        ],
        alimentacion: [
            'Incluye alimentos ricos en triptófano y magnesio: avena, banano, cacao puro, semillas de calabaza y almendras.',
            'Evita la cafeína, bebidas energizantes y pantallas al menos 6 horas antes de dormir.',
            'Incorpora infusiones relajantes naturales como manzanilla, toronjil o tila en la noche.'
        ],
        deportes: [
            { nombre: 'Caminata al Aire Libre (Naturaleza)', detalle: '30-45 min diarios. Reduce significativamente los niveles de cortisol y rumiación mental.' },
            { nombre: 'Yoga Restaurativo', detalle: '30 min, 3-4 veces por semana. Libera tensión acumulada en cuello, hombros y mandíbula.' },
            { nombre: 'Baile o Ciclismo Recreativo', detalle: '30 min, 3 veces por semana. Estimula la liberación de endorfinas y serotonina.' }
        ]
    }
};

// =========================================================================
// 2. INICIALIZACIÓN DE BASE DE DATOS DE USUARIOS (ADMIN + PACIENTE DEMO)
// =========================================================================
function inicializarBaseUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem(DB_USERS_KEY) || 'null');
    if (!usuarios || usuarios.length === 0) {
        const hoy = new Date().toISOString().split('T')[0];
        usuarios = [
            {
                id: 'usr_admin_1',
                usuario: 'admin',
                password: 'admin123',
                rol: 'admin',
                perfil: {
                    nombre: 'Alejandro Quintero (Admin)',
                    documento: '16.076.155',
                    edad: '34',
                    rh: 'O+',
                    eps: 'Salud Total',
                    enfermedad: 'general',
                    alergias: 'Ninguna',
                    emergencia: '3016629992',
                    foto: './img/ia.jpg'
                },
                medicamentos: [],
                examenes: [],
                documentos: [],
                recomendaciones: [
                    { id: 1, texto: 'Mantener pausas activas cada 2 horas frente al computador', fecha: hoy, completada: false }
                ],
                citas: []
            },
            {
                id: 'usr_pac_1',
                usuario: 'paciente1',
                password: '1234',
                rol: 'paciente',
                perfil: {
                    nombre: 'María Gómez',
                    documento: '43.987.654',
                    edad: '52',
                    rh: 'A+',
                    eps: 'Savia Salud',
                    enfermedad: 'hipertension',
                    alergias: 'Penicilina',
                    emergencia: '3001234567',
                    foto: './img/ia.jpg'
                },
                medicamentos: [
                    {
                        id: 101,
                        nombre: 'Losartán 50 mg',
                        frecuencia: 'Cada 12 horas',
                        cantidad: 28,
                        fechaInicio: hoy,
                        fechaFin: sumarDias(hoy, 14),
                        proximaToma: obtenerHoraFuturaISO(25), // En 25 min para probar alerta de 30 min
                        alerta30Enviada: false,
                        alertaHoraEnviada: false
                    }
                ],
                examenes: [
                    {
                        id: 201,
                        sector: 'Laboratorio Clínico',
                        titulo: 'Perfil Lipídico y Glucosa Basal',
                        fecha: hoy,
                        resultado: 'Glucosa: 94 mg/dL (Normal) | Colesterol Total: 185 mg/dL'
                    }
                ],
                documentos: [],
                recomendaciones: [
                    { id: 301, texto: 'Reducir consumo de sal y tomar la presión arterial en ayunas', fecha: hoy, completada: false }
                ],
                citas: []
            }
        ];
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(usuarios));
    }
    return usuarios;
}

function obtenerUsuarios() {
    return inicializarBaseUsuarios();
}

function guardarUsuarios(listaUsuarios) {
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(listaUsuarios));
}

function obtenerUsuarioActivo() {
    const idActivo = localStorage.getItem(SESSION_KEY);
    if (!idActivo) return null;
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.id === idActivo) || null;
}

function actualizarUsuarioActivo(usuarioModificado) {
    const usuarios = obtenerUsuarios();
    const idx = usuarios.findIndex(u => u.id === usuarioModificado.id);
    if (idx !== -1) {
        usuarios[idx] = usuarioModificado;
        guardarUsuarios(usuarios);
    }
}

// =========================================================================
// 3. CONTROL DE LOGIN, LOGOUT Y PANEL ADMINISTRADOR
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarBaseUsuarios();
    configurarLogin();
    configurarNavegacion();
    configurarPerfilYFoto();
    configurarCitas();
    configurarAdminCrearUsuario();

    const usuario = obtenerUsuarioActivo();
    if (usuario) {
        mostrarAplicacion(usuario);
    }

    // Iniciar monitor de alarmas cada 30 segundos
    setInterval(verificarAlarmasTiempoReal, 30000);
});

function configurarLogin() {
    const formLogin = document.getElementById('formLogin');
    if (!formLogin) return;

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = document.getElementById('loginUsuario').value.trim();
        const passInput = document.getElementById('loginPassword').value.trim();
        const errorEl = document.getElementById('loginError');

        const usuarios = obtenerUsuarios();
        const encontrado = usuarios.find(u => u.usuario === userInput && u.password === passInput);

        if (!encontrado) {
            errorEl.textContent = '❌ Usuario o contraseña incorrectos.';
            return;
        }

        errorEl.textContent = '';
        localStorage.setItem(SESSION_KEY, encontrado.id);
        mostrarAplicacion(encontrado);
    });
}

function mostrarAplicacion(usuario) {
    document.getElementById('pantallaLogin').style.display = 'none';
    document.getElementById('appPrincipal').style.display = 'block';

    // Mostrar botón Admin solo si su rol es admin
    const btnAdmin = document.getElementById('btnNavAdmin');
    if (btnAdmin) {
        btnAdmin.style.display = (usuario.rol === 'admin') ? 'block' : 'none';
    }

    cargarDatosEnFormularioPerfil(usuario);
    renderizarTodo();
    verificarAlarmasTiempoReal();
}

function cerrarSesion() {
    localStorage.removeItem(SESSION_KEY);
    document.getElementById('appPrincipal').style.display = 'none';
    document.getElementById('pantallaLogin').style.display = 'flex';
    document.getElementById('formLogin').reset();
}

function configurarAdminCrearUsuario() {
    const formAdmin = document.getElementById('formCrearUsuario');
    if (!formAdmin) return;

    formAdmin.addEventListener('submit', (e) => {
        e.preventDefault();
        const actual = obtenerUsuarioActivo();
        if (!actual || actual.rol !== 'admin') return;

        const username = document.getElementById('nuevoUsuario').value.trim();
        const usuarios = obtenerUsuarios();

        if (usuarios.some(u => u.usuario.toLowerCase() === username.toLowerCase())) {
            alert('⚠️ Ese nombre de usuario ya existe. Elige otro.');
            return;
        }

        const nuevoUser = {
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
            documentos: [],
            recomendaciones: [],
            citas: []
        };

        usuarios.push(nuevoUser);
        guardarUsuarios(usuarios);
        formAdmin.reset();
        renderizarListaUsuariosAdmin();
        alert(`✅ Usuario "${nuevoUser.perfil.nombre}" (${nuevoUser.usuario}) registrado correctamente.`);
    });
}

function renderizarListaUsuariosAdmin() {
    const contenedor = document.getElementById('listaUsuariosAdmin');
    const actual = obtenerUsuarioActivo();
    if (!contenedor || !actual || actual.rol !== 'admin') return;

    const usuarios = obtenerUsuarios();
    contenedor.innerHTML = usuarios.map(u => `
        <div class="tarjeta-medica" style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${u.perfil.foto || './img/ia.jpg'}" style="width:42px; height:42px; border-radius:50%; object-fit:cover;">
                <div>
                    <strong>${escaparHTML(u.perfil.nombre)}</strong> 
                    <span style="font-size:11px; background:#1a5632; color:#fff; padding:2px 6px; border-radius:8px;">${u.rol.toUpperCase()}</span><br>
                    <small>Usuario: <code>${escaparHTML(u.usuario)}</code> | Clave: <code>${escaparHTML(u.password)}</code> | EPS: ${escaparHTML(u.perfil.eps)} | Edad: ${u.perfil.edad || '--'} años</small>
                </div>
            </div>
            ${u.id !== actual.id ? `<button type="button" onclick="eliminarUsuarioAdmin('${u.id}')" class="btn-salir">Eliminar</button>` : '<small style="color:#1a5632; font-weight:bold;">Sesión actual</small>'}
        </div>
    `).join('');
}

function eliminarUsuarioAdmin(idUsuario) {
    if (!confirm('¿Seguro que deseas eliminar este usuario y todo su historial clínico?')) return;
    let usuarios = obtenerUsuarios().filter(u => u.id !== idUsuario);
    guardarUsuarios(usuarios);
    renderizarListaUsuariosAdmin();
}

// =========================================================================
// 4. NAVEGACIÓN Y RENDERIZADO GENERAL
// =========================================================================
function configurarNavegacion() {
    const botonesVista = document.querySelectorAll('[data-vista]');
    const secciones = {
        carga: document.getElementById('vista-carga'),
        medicamentos: document.getElementById('vista-medicamentos'),
        examenes: document.getElementById('vista-examenes'),
        bienestar: document.getElementById('vista-bienestar'),
        admin: document.getElementById('vista-admin')
    };

    botonesVista.forEach(boton => {
        boton.addEventListener('click', () => {
            const destino = boton.getAttribute('data-vista');
            Object.keys(secciones).forEach(clave => {
                if (secciones[clave]) {
                    secciones[clave].style.display = (clave === destino) ? 'block' : 'none';
                }
            });
            if (destino === 'bienestar') renderizarBienestar();
            if (destino === 'admin') renderizarListaUsuariosAdmin();
        });
    });
}

function renderizarTodo() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    renderizarEncabezadoPerfil(usuario);
    renderizarMedicamentos(usuario);
    renderizarExamenes(usuario, 'Todos');
    renderizarGaleriaDocumentos(usuario);
    renderizarCitas(usuario);
    renderizarRecomendaciones(usuario);
    renderizarBienestar();
    if (usuario.rol === 'admin') renderizarListaUsuariosAdmin();
}

// =========================================================================
// 5. PERFIL PERSONAL Y SUBIDA DE FOTO DE PERFIL
// =========================================================================
function cargarDatosEnFormularioPerfil(usuario) {
    const p = usuario.perfil;
    document.getElementById('pacienteNombre').value = p.nombre || '';
    document.getElementById('pacienteDocumento').value = p.documento || '';
    document.getElementById('pacienteEdad').value = p.edad || '';
    document.getElementById('pacienteRH').value = p.rh || '';
    document.getElementById('pacienteEPS').value = p.eps || 'Salud Total';
    document.getElementById('pacienteEnfermedad').value = p.enfermedad || 'general';
    document.getElementById('pacienteAlergias').value = p.alergias || '';
    document.getElementById('pacienteEmergencia').value = p.emergencia || '';

    const foto = p.foto || './img/ia.jpg';
    document.getElementById('perfilAvatarPreview').src = foto;
    document.getElementById('headerAvatar').src = foto;
}

function configurarPerfilYFoto() {
    const formPerfil = document.getElementById('formDatosPersonales');
    const inputFoto = document.getElementById('inputFotoPerfil');

    if (inputFoto) {
        inputFoto.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const usuario = obtenerUsuarioActivo();
            if (!usuario) return;

            const fotoComprimida = await comprimirImagen(file, 250, 0.75);
            usuario.perfil.foto = fotoComprimida;
            actualizarUsuarioActivo(usuario);

            document.getElementById('perfilAvatarPreview').src = fotoComprimida;
            document.getElementById('headerAvatar').src = fotoComprimida;
            alert('✅ Foto de perfil actualizada.');
        });
    }

    if (formPerfil) {
        formPerfil.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = obtenerUsuarioActivo();
            if (!usuario) return;

            usuario.perfil.nombre = document.getElementById('pacienteNombre').value.trim();
            usuario.perfil.documento = document.getElementById('pacienteDocumento').value.trim();
            usuario.perfil.edad = document.getElementById('pacienteEdad').value.trim();
            usuario.perfil.rh = document.getElementById('pacienteRH').value.trim().toUpperCase();
            usuario.perfil.eps = document.getElementById('pacienteEPS').value;
            usuario.perfil.enfermedad = document.getElementById('pacienteEnfermedad').value;
            usuario.perfil.alergias = document.getElementById('pacienteAlergias').value.trim();
            usuario.perfil.emergencia = document.getElementById('pacienteEmergencia').value.trim();

            actualizarUsuarioActivo(usuario);
            renderizarTodo();
            alert('✅ Perfil clínico actualizado. Los videos, alimentación y deportes se adaptaron a tu perfil.');
        });
    }
}

function renderizarEncabezadoPerfil(usuario) {
    const p = usuario.perfil;
    const badge = document.getElementById('resumenPacienteHeader');
    if (!badge) return;

    const infoEnfermedad = CONTENIDO_SALUD[p.enfermedad]?.titulo || 'Salud General';
    badge.textContent = `${p.nombre} | ${p.edad ? p.edad + ' años' : ''} | RH: ${p.rh || '--'} | EPS: ${p.eps} | ${infoEnfermedad}`;
}

// =========================================================================
// 6. LECTURA DE FÓRMULAS/EXÁMENES Y GUARDADO EN HISTORIAL DEL USUARIO
// =========================================================================
let archivoActualDataURL = null;

document.getElementById('fileForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const result = document.getElementById('result');
    const preview = document.getElementById('preview');
    const panelConfirmacion = document.getElementById('panelConfirmacionDatos');
    const file = fileInput.files[0];

    const validImageFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validTextFormats = ['text/plain'];
    const validPDFFormats = ['application/pdf'];

    preview.innerHTML = '';
    panelConfirmacion.style.display = 'none';
    archivoActualDataURL = null;

    if (!file) {
        result.textContent = 'Por favor, selecciona una foto o PDF de tu fórmula o examen.';
        result.style.color = '#1a5632';
        return;
    }

    if (validImageFormats.includes(file.type)) {
        result.textContent = '⏳ Analizando imagen y preparando respaldo en tu historial...';
        result.style.color = '#1a5632';

        // Comprimir imagen para guardarla en el historial del paciente
        archivoActualDataURL = await comprimirImagen(file, 700, 0.65);

        preview.innerHTML = `
            <img src="${archivoActualDataURL}" alt="Documento médico" style="max-width: 100%; max-height: 250px; border-radius: 8px; border: 1px solid #ccc;">
        `;

        Tesseract.recognize(archivoActualDataURL, 'spa', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    result.textContent = `⏳ Leyendo documento... ${Math.round(m.progress * 100)}%`;
                }
            }
        }).then(({ data: { text } }) => {
            result.textContent = '✅ Lectura completada. Confirma los datos para guardarlos en tu perfil.';
            result.style.color = 'green';
            procesarYMostrarConfirmacion(text, file.name, 'imagen');
        }).catch(() => {
            result.textContent = '⚠️ Imagen cargada. Completa los campos manualmente para guardarla.';
            procesarYMostrarConfirmacion('', file.name, 'imagen');
        });

    } else if (validPDFFormats.includes(file.type)) {
        result.textContent = '⏳ Extrayendo texto del PDF...';
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const typedArray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
                let textPromises = [];
                for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 5); pageNum++) {
                    textPromises.push(
                        pdf.getPage(pageNum)
                            .then(page => page.getTextContent())
                            .then(content => content.items.map(i => i.str).join(' '))
                    );
                }
                Promise.all(textPromises).then(pagesText => {
                    const fullText = pagesText.join('\n');
                    result.textContent = '✅ PDF procesado. Verifica los datos antes de guardar.';
                    result.style.color = 'green';
                    procesarYMostrarConfirmacion(fullText, file.name, 'pdf');
                });
            });
        };
        fileReader.readAsArrayBuffer(file);

    } else if (validTextFormats.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = function (event) {
            result.textContent = '✅ Archivo de texto procesado.';
            procesarYMostrarConfirmacion(event.target.result, file.name, 'texto');
        };
        reader.readAsText(file);
    } else {
        result.textContent = 'Formato no soportado. Usa JPG, PNG o PDF.';
        result.style.color = 'red';
        return;
    }

    document.getElementById('reiniciar').disabled = false;
});

function analizarTextoMedico(texto) {
    const hoy = new Date().toISOString().split('T')[0];
    const textoLimpio = (texto || '').replace(/\r/g, '');
    const lineas = textoLimpio.split('\n').map(l => l.trim()).filter(l => l.length > 2);

    let fechaDetectada = hoy;
    const matchISO = textoLimpio.match(/\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/);
    const matchLatam = textoLimpio.match(/\b(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](20\d{2})\b/);
    if (matchISO) fechaDetectada = `${matchISO[1]}-${matchISO[2]}-${matchISO[3]}`;
    else if (matchLatam) fechaDetectada = `${matchLatam[3]}-${matchLatam[2]}-${matchLatam[1]}`;

    const regexMed = /\b(\d+\s*(mg|g|ml|mcg|ui)|tabletas?|c[aá]psulas?|gotas|jarabe|cada\s+\d+\s*h|posolog[ií]a|f[oó]rmula)\b/i;
    const regexExam = /\b(hemograma|glucosa|colesterol|triglic[eé]ridos|creatinina|tsh|orina|laboratorio|ecograf[ií]a|radiograf[ií]a|rayos\s*x|resonancia|electrocardiograma|resultado)\b/i;

    const esMedicamento = regexMed.test(textoLimpio);
    const esExamen = regexExam.test(textoLimpio);
    const tipo = (esExamen && !esMedicamento) ? 'examen' : 'formula';

    const lineaMed = lineas.find(l => /\b\d+\s*(mg|g|ml|mcg|ui)\b/i.test(l)) || '';
    const matchFrec = textoLimpio.match(/(cada\s+\d+\s*(horas?|h|d[ií]as?)|una\s+vez\s+al\s+d[ií]a)/i);
    const matchCant = textoLimpio.match(/(\d+)\s*(tabletas?|c[aá]psulas?|unidades?|pastillas?|frascos?)/i);
    const matchDias = textoLimpio.match(/por\s+(\d+)\s*d[ií]as?/i);

    const diasDuracion = matchDias ? parseInt(matchDias[1], 10) : 7;

    let sectorExamen = 'Laboratorio Clínico';
    if (/ecograf[ií]a|radiograf[ií]a|rayos\s*x|resonancia|tomograf[ií]a/i.test(textoLimpio)) sectorExamen = 'Imágenes Diagnósticas';
    else if (/electrocardiograma|ecocardiograma|cardiolog[ií]a|presi[oó]n/i.test(textoLimpio)) sectorExamen = 'Cardiología';
    else if (/optometr[ií]a|oftalmolog[ií]a/i.test(textoLimpio)) sectorExamen = 'Oftalmología';
    else if (!esExamen) sectorExamen = 'Medicina General';

    const lineaResultado = lineas.find(l => regexExam.test(l)) || (lineas[0] || '');
    const lineasRec = lineas.filter(l => /\b(recomendaci[oó]n|indicaci[oó]n|evitar|ayunas|dieta|reposo|control|alarma)\b/i.test(l));

    return {
        tipo,
        fecha: fechaDetectada,
        textoCompleto: textoLimpio,
        medicamento: {
            nombre: lineaMed.substring(0, 60),
            frecuencia: matchFrec ? matchFrec[0] : 'Cada 8 horas',
            cantidad: matchCant ? parseInt(matchCant[1], 10) : 14,
            fechaFin: sumarDias(fechaDetectada, diasDuracion),
            proximaToma: obtenerHoraFuturaISO(60)
        },
        examen: {
            sector: sectorExamen,
            titulo: lineaResultado.substring(0, 60),
            resultado: textoLimpio.substring(0, 250)
        },
        recomendaciones: lineasRec.slice(0, 3).join('\n')
    };
}

function procesarYMostrarConfirmacion(textoExtraido, nombreArchivo, formato) {
    const datos = analizarTextoMedico(textoExtraido);
    const panel = document.getElementById('panelConfirmacionDatos');

    panel.style.display = 'block';
    panel.innerHTML = `
        <h3 style="margin-top:0; color:#1a5632;">📋 Guardar en Historial Personal (${escaparHTML(nombreArchivo)})</h3>
        <div style="display:grid; gap:10px; margin-top:10px;">
            <label style="font-size:13px; font-weight:bold;">Tipo de Documento:
                <select id="confTipo" class="campo-salud">
                    <option value="formula" ${datos.tipo === 'formula' ? 'selected' : ''}>Fórmula Médica (Medicamentos y Alarma)</option>
                    <option value="examen" ${datos.tipo === 'examen' ? 'selected' : ''}>Examen / Resultado Médico</option>
                </select>
            </label>

            <label style="font-size:13px; font-weight:bold;">Fecha del Documento:
                <input type="date" id="confFecha" value="${datos.fecha}" class="campo-salud">
            </label>

            <!-- Bloque Fórmula -->
            <div id="bloqueConfFormula" style="display:${datos.tipo === 'formula' ? 'grid' : 'none'}; gap:8px; background:#fff; padding:10px; border-radius:8px; border:1px solid #d5e8dc;">
                <strong style="color:#1a5632; font-size:14px;">💊 Medicamento y Programación de Alarma</strong>
                <input type="text" id="confMedNombre" value="${escaparHTML(datos.medicamento.nombre)}" placeholder="Nombre y dosis (ej. Ibuprofeno 400mg)" class="campo-salud">
                <input type="text" id="confMedFrecuencia" value="${escaparHTML(datos.medicamento.frecuencia)}" placeholder="Frecuencia (ej. Cada 8 horas)" class="campo-salud">
                <div style="display:flex; gap:8px;">
                    <label style="flex:1; font-size:12px;">Cantidad:
                        <input type="number" id="confMedCantidad" value="${datos.medicamento.cantidad}" min="1" class="campo-salud">
                    </label>
                    <label style="flex:1; font-size:12px;">Fecha Fin:
                        <input type="date" id="confMedFin" value="${datos.medicamento.fechaFin}" class="campo-salud">
                    </label>
                </div>
                <label style="font-size:12px; font-weight:bold; color:#1a5632;">⏰ Próxima Toma Programada (Aviso 30 min antes y hora exacta):
                    <input type="datetime-local" id="confMedProximaToma" value="${datos.medicamento.proximaToma}" class="campo-salud">
                </label>
            </div>

            <!-- Bloque Examen -->
            <div id="bloqueConfExamen" style="display:${datos.tipo === 'examen' ? 'grid' : 'none'}; gap:8px; background:#fff; padding:10px; border-radius:8px; border:1px solid #d5e8dc;">
                <strong style="color:#1a5632; font-size:14px;">🔬 Sector y Resultado del Examen</strong>
                <select id="confExamSector" class="campo-salud">
                    <option value="Laboratorio Clínico" ${datos.examen.sector === 'Laboratorio Clínico' ? 'selected' : ''}>Laboratorio Clínico</option>
                    <option value="Imágenes Diagnósticas" ${datos.examen.sector === 'Imágenes Diagnósticas' ? 'selected' : ''}>Imágenes Diagnósticas</option>
                    <option value="Cardiología" ${datos.examen.sector === 'Cardiología' ? 'selected' : ''}>Cardiología</option>
                    <option value="Oftalmología" ${datos.examen.sector === 'Oftalmología' ? 'selected' : ''}>Oftalmología</option>
                    <option value="Medicina General" ${datos.examen.sector === 'Medicina General' ? 'selected' : ''}>Medicina General</option>
                </select>
                <input type="text" id="confExamTitulo" value="${escaparHTML(datos.examen.titulo)}" placeholder="Nombre del examen" class="campo-salud">
                <textarea id="confExamResultado" rows="3" placeholder="Resultados obtenidos" class="campo-salud">${escaparHTML(datos.examen.resultado)}</textarea>
            </div>

            <label style="font-size:13px; font-weight:bold;">Recomendaciones Médicas:
                <textarea id="confRecomendaciones" rows="2" placeholder="Indicaciones de cuidado..." class="campo-salud">${escaparHTML(datos.recomendaciones)}</textarea>
            </label>

            <button type="button" id="btnConfirmarGuardar" class="container__boton_info" style="height:40px;">
                Guardar Documento y Activar Seguimiento
            </button>
        </div>
    `;

    document.getElementById('confTipo').addEventListener('change', (e) => {
        const esFormula = e.target.value === 'formula';
        document.getElementById('bloqueConfFormula').style.display = esFormula ? 'grid' : 'none';
        document.getElementById('bloqueConfExamen').style.display = esFormula ? 'none' : 'grid';
    });

    document.getElementById('btnConfirmarGuardar').addEventListener('click', () => {
        const usuario = obtenerUsuarioActivo();
        if (!usuario) return;

        const tipoFinal = document.getElementById('confTipo').value;
        const fechaDoc = document.getElementById('confFecha').value;

        // 1. Guardar respaldo del documento/imagen en el historial del paciente
        usuario.documentos.unshift({
            id: Date.now(),
            nombreArchivo: nombreArchivo,
            tipo: tipoFinal,
            fecha: fechaDoc,
            imagenDataURL: archivoActualDataURL,
            textoExtraido: textoExtraido || 'Documento registrado manualmente'
        });

        // 2. Guardar en Medicamentos o Exámenes
        if (tipoFinal === 'formula') {
            const nombreMed = document.getElementById('confMedNombre').value.trim();
            if (nombreMed) {
                usuario.medicamentos.unshift({
                    id: Date.now() + 1,
                    nombre: nombreMed,
                    frecuencia: document.getElementById('confMedFrecuencia').value.trim(),
                    cantidad: parseInt(document.getElementById('confMedCantidad').value, 10) || 1,
                    fechaInicio: fechaDoc,
                    fechaFin: document.getElementById('confMedFin').value || fechaDoc,
                    proximaToma: document.getElementById('confMedProximaToma').value,
                    alerta30Enviada: false,
                    alertaHoraEnviada: false
                });
            }
        } else {
            usuario.examenes.unshift({
                id: Date.now() + 2,
                sector: document.getElementById('confExamSector').value,
                titulo: document.getElementById('confExamTitulo').value.trim() || 'Examen médico',
                fecha: fechaDoc,
                resultado: document.getElementById('confExamResultado').value.trim()
            });
        }

        // 3. Guardar recomendaciones
        const recTexto = document.getElementById('confRecomendaciones').value.trim();
        if (recTexto) {
            recTexto.split('\n').map(r => r.trim()).filter(Boolean).forEach((linea, idx) => {
                usuario.recomendaciones.unshift({
                    id: Date.now() + 10 + idx,
                    texto: linea,
                    fecha: fechaDoc,
                    completada: false
                });
            });
        }

        actualizarUsuarioActivo(usuario);
        renderizarTodo();
        panel.innerHTML = `<p style="color:#1a5632; font-weight:bold; margin:0;">✅ Documento guardado en tu historial y alarmas programadas correctamente.</p>`;
    });
}

// =========================================================================
// 7. MOTOR DE SONIDO (WEB AUDIO API) Y ALERTAS DE CITAS / MEDICINAS
// =========================================================================
function reproducirSonidoAlerta() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const notas = [523.25, 659.25, 783.99, 1046.50]; // Acorde de alerta clínica (Do-Mi-Sol-Do)

        notas.forEach((frecuencia, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frecuencia, ctx.currentTime + i * 0.18);
            gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.18);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.18);
            osc.stop(ctx.currentTime + i * 0.18 + 0.36);
        });
    } catch (e) {
        console.warn('Audio bloqueado hasta interacción del usuario:', e);
    }
}

function probarSonidoAlerta() {
    reproducirSonidoAlerta();
    mostrarBannerAlerta('🔔 Prueba de Alarma Activa: Así sonarán tus recordatorios 1 día antes y 30 min antes de citas y medicinas.');
}

function mostrarBannerAlerta(mensaje) {
    const banner = document.getElementById('bannerAlertaGlobal');
    const texto = document.getElementById('textoAlertaGlobal');
    if (!banner || !texto) return;
    texto.textContent = mensaje;
    banner.style.display = 'flex';
}

function cerrarBannerAlerta() {
    const banner = document.getElementById('bannerAlertaGlobal');
    if (banner) banner.style.display = 'none';
}

function verificarAlarmasTiempoReal() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    const ahora = new Date();
    let huboCambios = false;

    // 1. Verificar Citas (Aviso 1 día antes y 30 minutos antes)
    usuario.citas.forEach(cita => {
        if (!cita.fecha || !cita.hora) return;
        const fechaCita = new Date(`${cita.fecha}T${cita.hora}:00`);
        const diffMinutos = (fechaCita - ahora) / (1000 * 60);

        // Aviso 1 día antes (entre 31 min y 1440 min = 24 horas)
        if (diffMinutos > 30 && diffMinutos <= 1440 && !cita.alerta1DiaEnviada) {
            cita.alerta1DiaEnviada = true;
            huboCambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`📅 RECORDATORIO (1 DÍA ANTES): Tienes cita de ${cita.especialidad} el ${cita.fecha} a las ${cita.hora} en ${cita.lugar}.`);
        }

        // Aviso 30 minutos antes (entre 0 y 30 min)
        if (diffMinutos > 0 && diffMinutos <= 30 && !cita.alerta30MinEnviada) {
            cita.alerta30MinEnviada = true;
            huboCambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`⏰ ¡URGENTE (30 MIN ANTES)! Tu cita de ${cita.especialidad} es a las ${cita.hora} (${cita.lugar}).`);
        }
    });

    // 2. Verificar Medicamentos (Aviso 30 minutos antes y hora exacta)
    usuario.medicamentos.forEach(med => {
        if (!med.proximaToma || med.cantidad <= 0) return;
        const fechaToma = new Date(med.proximaToma);
        const diffMinutos = (fechaToma - ahora) / (1000 * 60);

        if (diffMinutos > 0 && diffMinutos <= 30 && !med.alerta30Enviada) {
            med.alerta30Enviada = true;
            huboCambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`💊 PRÓXIMA MEDICINA (EN ${Math.ceil(diffMinutos)} MIN): Prepárate para tomar ${med.nombre}.`);
        }

        if (diffMinutos <= 0 && diffMinutos >= -20 && !med.alertaHoraEnviada) {
            med.alertaHoraEnviada = true;
            huboCambios = true;
            reproducirSonidoAlerta();
            mostrarBannerAlerta(`🚨 ¡HORA DE TU MEDICINA! Debes tomar ahora: ${med.nombre} (${med.frecuencia}).`);
        }
    });

    if (huboCambios) {
        actualizarUsuarioActivo(usuario);
        renderizarCitas(usuario);
        renderizarMedicamentos(usuario);
    }
}

// =========================================================================
// 8. RENDERIZADO DE MEDICAMENTOS, EXÁMENES, GALERÍA, CITAS Y BIENESTAR
// =========================================================================
function renderizarMedicamentos(usuario) {
    const contenedor = document.getElementById('listaMedicamentos');
    if (!contenedor) return;

    if (usuario.medicamentos.length === 0) {
        contenedor.innerHTML = '<p class="texto-suave">Aún no tienes medicamentos registrados.</p>';
        return;
    }

    contenedor.innerHTML = usuario.medicamentos.map(med => `
        <div class="tarjeta-medica" style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <div>
                <strong style="color:#1a5632; font-size:15px;">💊 ${escaparHTML(med.nombre)}</strong>
                <p style="margin:3px 0; font-size:13px;">⏱️ <strong>Frecuencia:</strong> ${escaparHTML(med.frecuencia)} | 📦 <strong>Restantes:</strong> ${med.cantidad} und.</p>
                <p style="margin:3px 0; font-size:13px;">📅 <strong>Tratamiento:</strong> ${med.fechaInicio} al ${med.fechaFin}</p>
                <p style="margin:3px 0; font-size:13px; color:#0e3b5c;">⏰ <strong>Próxima alarma:</strong> ${med.proximaToma ? med.proximaToma.replace('T', ' ') : 'Sin programar'}</p>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <button type="button" onclick="registrarTomaMedicamento(${med.id})" class="btn-secundario">✅ Tomar Dosis</button>
                <button type="button" onclick="eliminarItemUsuario('medicamentos', ${med.id})" class="btn-salir">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function registrarTomaMedicamento(idMed) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    const med = usuario.medicamentos.find(m => m.id === idMed);
    if (med && med.cantidad > 0) {
        med.cantidad -= 1;
        // Reprogramar siguiente toma sumando horas según frecuencia (por defecto 8 horas)
        const matchHoras = med.frecuencia.match(/(\d+)/);
        const horas = matchHoras ? parseInt(matchHoras[1], 10) : 8;
        med.proximaToma = obtenerHoraFuturaISO(horas * 60);
        med.alerta30Enviada = false;
        med.alertaHoraEnviada = false;
        actualizarUsuarioActivo(usuario);
        renderizarMedicamentos(usuario);
        alert(`✅ Toma registrada. Quedan ${med.cantidad} unidades. Próxima alarma en ${horas} horas.`);
    }
}

function renderizarExamenes(usuario, sectorFiltro = 'Todos') {
    const contenedor = document.getElementById('listaExamenes');
    const filtros = document.getElementById('filtrosSector');
    if (!contenedor || !filtros) return;

    if (usuario.examenes.length === 0) {
        filtros.innerHTML = '';
        contenedor.innerHTML = '<p class="texto-suave">No hay exámenes registrados todavía.</p>';
        return;
    }

    const sectores = ['Todos', ...new Set(usuario.examenes.map(e => e.sector))];
    filtros.innerHTML = sectores.map(sec => `
        <button type="button" onclick="filtrarSectorExamenes('${sec}')"
            style="margin:3px; padding:6px 12px; border-radius:15px; border:1px solid #1a5632; cursor:pointer;
            background:${sectorFiltro === sec ? '#1a5632' : '#fff'}; color:${sectorFiltro === sec ? '#fff' : '#1a5632'}; font-weight:bold;">
            ${sec}
        </button>
    `).join('');

    const lista = sectorFiltro === 'Todos' ? usuario.examenes : usuario.examenes.filter(e => e.sector === sectorFiltro);

    contenedor.innerHTML = lista.map(ex => `
        <div class="tarjeta-medica" style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div>
                <span style="background:#e1f2e8; color:#1a5632; padding:2px 8px; border-radius:10px; font-size:12px; font-weight:bold;">${escaparHTML(ex.sector)}</span>
                <span style="font-size:12px; color:#555; margin-left:6px;">📅 ${ex.fecha}</span>
                <h4 style="margin:6px 0 4px 0;">${escaparHTML(ex.titulo)}</h4>
                <p style="margin:0; font-size:13px; white-space:pre-wrap;">${escaparHTML(ex.resultado)}</p>
            </div>
            <button type="button" onclick="eliminarItemUsuario('examenes', ${ex.id})" class="btn-salir">✕</button>
        </div>
    `).join('');
}

function filtrarSectorExamenes(sector) {
    const usuario = obtenerUsuarioActivo();
    if (usuario) renderizarExamenes(usuario, sector);
}

function renderizarGaleriaDocumentos(usuario) {
    const galeria = document.getElementById('galeriaDocumentos');
    if (!galeria) return;

    if (!usuario.documentos || usuario.documentos.length === 0) {
        galeria.innerHTML = '<p class="texto-suave">Las fotos y documentos que subas quedarán archivados aquí.</p>';
        return;
    }

    galeria.innerHTML = usuario.documentos.map(doc => `
        <div class="doc-card">
            ${doc.imagenDataURL
                ? `<img src="${doc.imagenDataURL}" alt="${escaparHTML(doc.nombreArchivo)}">`
                : `<div style="height:110px; background:#e1f2e8; display:flex; align-items:center; justify-content:center; border-radius:6px; margin-bottom:6px; font-weight:bold; color:#1a5632;">📄 PDF / TEXTO</div>`
            }
            <strong>${escaparHTML(doc.nombreArchivo)}</strong><br>
            <span style="color:#555;">📅 ${doc.fecha} | ${doc.tipo.toUpperCase()}</span><br>
            <div style="display:flex; gap:5px; margin-top:6px;">
                <button type="button" onclick="abrirModalDocumento(${doc.id})" class="btn-eps" style="flex:1;">Ver</button>
                <button type="button" onclick="eliminarItemUsuario('documentos', ${doc.id})" class="btn-salir" style="padding:4px 8px;">✕</button>
            </div>
        </div>
    `).join('');
}

function abrirModalDocumento(idDoc) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    const doc = usuario.documentos.find(d => d.id === idDoc);
    if (!doc) return;

    document.getElementById('modalDocTitulo').textContent = `${doc.nombreArchivo} (${doc.fecha})`;
    document.getElementById('modalDocCuerpo').innerHTML = `
        ${doc.imagenDataURL ? `<img src="${doc.imagenDataURL}" style="max-width:100%; border-radius:8px; margin-bottom:12px;">` : ''}
        <h4>Texto Extraído / Registro:</h4>
        <pre style="background:#f4fbf7; padding:10px; border-radius:8px; white-space:pre-wrap; font-size:13px;">${escaparHTML(doc.textoExtraido)}</pre>
    `;
    document.getElementById('modalDocumento').style.display = 'flex';
}

function cerrarModalDocumento() {
    document.getElementById('modalDocumento').style.display = 'none';
}

// =========================================================================
// 9. CITAS MÉDICAS Y RECOMENDACIONES
// =========================================================================
function configurarCitas() {
    const formCitas = document.getElementById('formCitas');
    if (!formCitas) return;

    formCitas.addEventListener('submit', (e) => {
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
        actualizarUsuarioActivo(usuario);
        renderizarCitas(usuario);
        formCitas.reset();
        verificarAlarmasTiempoReal();
    });
}

function renderizarCitas(usuario) {
    const contenedor = document.getElementById('listaCitas');
    if (!contenedor) return;

    if (usuario.citas.length === 0) {
        contenedor.innerHTML = '<p class="texto-suave">No tienes citas programadas.</p>';
        return;
    }

    contenedor.innerHTML = usuario.citas.map(cita => `
        <div style="background:#f4fbf7; border-left:4px solid #1a5632; padding:8px; margin-bottom:8px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong style="color:#1a5632;">${escaparHTML(cita.especialidad)}</strong><br>
                <span style="font-size:12px;">📅 ${cita.fecha} | 🕒 ${cita.hora}</span><br>
                <span style="font-size:12px; color:#555;">📍 ${escaparHTML(cita.lugar)}</span><br>
                <span style="font-size:11px; color:#0e3b5c;">🔔 Alerta: 1 día y 30 min antes</span>
            </div>
            <button type="button" onclick="eliminarItemUsuario('citas', ${cita.id})" style="background:transparent; border:none; color:#c0392b; font-weight:bold; cursor:pointer;">✕</button>
        </div>
    `).join('');
}

function renderizarRecomendaciones(usuario) {
    const contenedor = document.getElementById('listaRecomendaciones');
    if (!contenedor) return;

    if (usuario.recomendaciones.length === 0) {
        contenedor.innerHTML = '<p class="texto-suave">Sin indicaciones médicas pendientes.</p>';
        return;
    }

    contenedor.innerHTML = usuario.recomendaciones.map(rec => `
        <div style="display:flex; align-items:flex-start; gap:6px; padding:6px; border-bottom:1px solid #eee;">
            <input type="checkbox" ${rec.completada ? 'checked' : ''} onchange="alternarRecomendacionUsuario(${rec.id})" style="margin-top:3px; cursor:pointer;">
            <span style="flex:1; font-size:13px; text-decoration:${rec.completada ? 'line-through' : 'none'}; color:${rec.completada ? '#888' : '#222'};">
                ${escaparHTML(rec.texto)}
            </span>
            <button type="button" onclick="eliminarItemUsuario('recomendaciones', ${rec.id})" style="background:transparent; border:none; color:#c0392b; cursor:pointer;">✕</button>
        </div>
    `).join('');
}

// =========================================================================
// 10. MÓDULO DE BIENESTAR: 3 VIDEOS, ALIMENTACIÓN Y DEPORTES POR PERFIL
// =========================================================================
function renderizarBienestar() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    const condicion = usuario.perfil.enfermedad || 'general';
    const edad = parseInt(usuario.perfil.edad, 10) || 30;
    const plan = CONTENIDO_SALUD[condicion] || CONTENIDO_SALUD.general;

    // Adaptación adicional por rango de edad
    let notaEdad = 'Adulto joven/medio: mantén intensidad moderada y constante.';
    if (edad >= 60) {
        notaEdad = `Adulto mayor (${edad} años): prioriza ejercicios de bajo impacto, equilibrio y control médico previo.`;
    } else if (edad < 18) {
        notaEdad = `Etapa juvenil (${edad} años): enfócate en deportes recreativos, hidratación y desarrollo postural.`;
    }

    document.getElementById('encabezadoBienestar').innerHTML = `
        <strong style="color:#1a5632; font-size:16px;">🎯 Plan Personalizado: ${plan.titulo}</strong>
        <p style="margin:5px 0 0 0; font-size:13px; color:#333;"><strong>Enfoque por edad (${edad} años):</strong> ${notaEdad}</p>
    `;

    // 1. Renderizar 3 Videos de Salud
    document.getElementById('contenedorVideosSalud').innerHTML = plan.videos.map((vid, idx) => `
        <div class="video-card">
            <iframe src="${vid.urlEmbed}" title="${escaparHTML(vid.titulo)}" allowfullscreen loading="lazy"></iframe>
            <div style="padding:10px;">
                <span style="font-size:11px; color:#1a5632; font-weight:bold;">VIDEO ${idx + 1} DE 3</span>
                <h4 style="margin:4px 0 8px 0; font-size:14px;">${escaparHTML(vid.titulo)}</h4>
                <a href="${vid.urlDirecta}" target="_blank" rel="noopener">
                    <button type="button" class="btn-eps">Abrir en YouTube ↗</button>
                </a>
            </div>
        </div>
    `).join('');

    // 2. Renderizar Alimentación y Cuidados
    document.getElementById('contenedorAlimentacion').innerHTML = `
        <ul style="margin:0; padding-left:20px; line-height:1.6; font-size:14px;">
            ${plan.alimentacion.map(tip => `<li>${escaparHTML(tip)}</li>`).join('')}
        </ul>
    `;

    // 3. Renderizar Deportes Recomendados
    document.getElementById('contenedorDeportes').innerHTML = plan.deportes.map(dep => `
        <div class="deporte-card">
            <h4 style="margin:0 0 6px 0; color:#1a5632;">🏅 ${escaparHTML(dep.nombre)}</h4>
            <p style="margin:0; font-size:13px; color:#333;">${escaparHTML(dep.detalle)}</p>
        </div>
    `).join('');
}

// =========================================================================
// 11. UTILIDADES, COMPRESIÓN DE IMÁGENES Y EXPORTACIÓN
// =========================================================================
function comprimirImagen(file, maxWidth = 600, quality = 0.7) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function eliminarItemUsuario(coleccion, id) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    usuario[coleccion] = usuario[coleccion].filter(item => item.id !== id);
    actualizarUsuarioActivo(usuario);
    renderizarTodo();
}

function alternarRecomendacionUsuario(id) {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    const item = usuario.recomendaciones.find(r => r.id === id);
    if (item) {
        item.completada = !item.completada;
        actualizarUsuarioActivo(usuario);
        renderizarRecomendaciones(usuario);
    }
}

function exportarHistorialUsuario() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;
    const copiaSegura = { ...usuario, password: '***' };
    const blob = new Blob([JSON.stringify(copiaSegura, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Historial_MiSalud_${usuario.usuario}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function sumarDias(fechaISO, dias) {
    const fecha = new Date(fechaISO + 'T00:00:00');
    fecha.setDate(fecha.getDate() + (parseInt(dias, 10) || 0));
    return fecha.toISOString().split('T')[0];
}

function obtenerHoraFuturaISO(minutosASumar) {
    const fecha = new Date(Date.now() + minutosASumar * 60000);
    const offset = fecha.getTimezoneOffset() * 60000;
    return new Date(fecha.getTime() - offset).toISOString().slice(0, 16);
}

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto || '';
    return div.innerHTML;
}

function nuevo_archivo() {
    const fileInput = document.getElementById('fileInput');
    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);

    document.getElementById('result').textContent = '';
    document.getElementById('preview').innerHTML = '';
    document.getElementById('panelConfirmacionDatos').style.display = 'none';
    document.getElementById('reiniciar').disabled = true;
    archivoActualDataURL = null;
}