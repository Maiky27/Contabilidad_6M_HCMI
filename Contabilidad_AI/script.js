// script.js

// Paso 1: Catálogo de Cuentas y su estructura de saldos
const catalogoCuentas = [
    { id: '1.1.1', cuenta: 'Caja', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.1.2', cuenta: 'Bancos', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.1.3', cuenta: 'Inventario', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.1.4', cuenta: 'IVA pagado', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.1.5', cuenta: 'IVA por acreditar', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.1.6', cuenta: 'Papelería', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.1.7', cuenta: 'Publicidad', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.1.8', cuenta: 'Rentas pagadas por anticipado', tipo: 'Activo', subtipo: 'Activo Circulante' },
    { id: '1.2.1', cuenta: 'Terrenos', tipo: 'Activo', subtipo: 'Activo No Circulante' },
    { id: '1.2.2', cuenta: 'Edificios', tipo: 'Activo', subtipo: 'Activo No Circulante' },
    { id: '1.2.3', cuenta: 'Equipo de cómputo', tipo: 'Activo', subtipo: 'Activo No Circulante' },
    { id: '1.2.4', cuenta: 'Mobiliario y equipo', tipo: 'Activo', subtipo: 'Activo No Circulante' },
    { id: '2.1.1', cuenta: 'Documentos por pagar', tipo: 'Pasivo', subtipo: 'Pasivo Circulante' },
    { id: '2.1.2', cuenta: 'Acreedores', tipo: 'Pasivo', subtipo: 'Pasivo Circulante' },
    { id: '2.1.3', cuenta: 'Anticipo de clientes', tipo: 'Pasivo', subtipo: 'Pasivo Circulante' },
    { id: '2.1.4', cuenta: 'IVA trasladado', tipo: 'Pasivo', subtipo: 'Pasivo Circulante' },
    { id: '3.1.1', cuenta: 'Capital social', tipo: 'Capital Contable', subtipo: 'Capital contribuidor' }
];

// Asiento de Apertura inicial
const saldosCuentas = {
    'Caja': 100000,
    'Bancos': 100000,
    'Inventario': 3000,
    'IVA pagado': 0,
    'IVA por acreditar': 0,
    'Papelería': 0,
    'Publicidad': 3000,
    'Rentas pagadas por anticipado': 0,
    'Terrenos': 750000,
    'Edificios': 750000,
    'Equipo de cómputo': 28000,
    'Mobiliario y equipo': 6000,
    'Documentos por pagar': 0,
    'Acreedores': 0,
    'Anticipo de clientes': 0,
    'IVA trasladado': 0,
    'Capital social': 1740000
};

// **Línea 45 corregida:** se elimina la declaración de tipos de TypeScript
let transacciones = []; // Array para guardar el historial de transacciones

// Paso 2: Funciones para renderizar la página
function renderSelectOptions() {
    const select = document.getElementById('cuenta');
    catalogoCuentas.forEach(item => {
        const option = document.createElement('option');
        option.value = item.cuenta;
        option.textContent = `${item.id} - ${item.cuenta} (${item.tipo})`;
        select.appendChild(option);
    });
}

function renderBalance() {
    const activoContainer = document.getElementById('activo-container');
    const pasivoCapitalContainer = document.getElementById('pasivo-capital-container');
    
    activoContainer.innerHTML = '';
    pasivoCapitalContainer.innerHTML = '';

    let totalActivo = 0;
    let totalPasivoCapital = 0;

    // Llenar la sección de Activos
    const activos = catalogoCuentas.filter(c => c.tipo === 'Activo');
    activos.forEach(item => {
        const saldo = saldosCuentas[item.cuenta] || 0;
        if (saldo > 0) {
            const div = document.createElement('div');
            div.classList.add('cuenta-item');
            div.innerHTML = `<span>${item.cuenta}</span><span>$${saldo.toFixed(2)}</span>`;
            activoContainer.appendChild(div);
            totalActivo += saldo;
        }
    });

    // Llenar la sección de Pasivos y Capital
    const pasivos = catalogoCuentas.filter(c => c.tipo === 'Pasivo');
    pasivos.forEach(item => {
        const saldo = saldosCuentas[item.cuenta] || 0;
        if (saldo > 0) {
            const div = document.createElement('div');
            div.classList.add('cuenta-item');
            div.innerHTML = `<span>${item.cuenta}</span><span>$${saldo.toFixed(2)}</span>`;
            pasivoCapitalContainer.appendChild(div);
            totalPasivoCapital += saldo;
        }
    });

    const capital = catalogoCuentas.filter(c => c.tipo === 'Capital Contable');
    capital.forEach(item => {
        const saldo = saldosCuentas[item.cuenta] || 0;
        if (saldo > 0) {
            const div = document.createElement('div');
            div.classList.add('cuenta-item');
            div.innerHTML = `<span>${item.cuenta}</span><span>$${saldo.toFixed(2)}</span>`;
            pasivoCapitalContainer.appendChild(div);
            totalPasivoCapital += saldo;
        }
    });

    // Mostrar totales y verificar balance
    document.getElementById('total-activo').innerText = `$${totalActivo.toFixed(2)}`;
    document.getElementById('total-pasivo-capital').innerText = `$${totalPasivoCapital.toFixed(2)}`;
    
    const balanceCheck = document.getElementById('balance-check');
    const diferencia = Math.abs(totalActivo - totalPasivoCapital);
    if (diferencia < 0.01) { // Pequeña tolerancia para errores de flotantes
        balanceCheck.innerText = "¡El balance está equilibrado! ✅";
        balanceCheck.classList.add('valid');
        balanceCheck.classList.remove('invalid');
    } else {
        balanceCheck.innerText = `¡El balance no está equilibrado! ❌ Diferencia: $${diferencia.toFixed(2)}`;
        balanceCheck.classList.add('invalid');
        balanceCheck.classList.remove('valid');
    }
}

function renderHistory() {
    const historyBody = document.getElementById('history-body');
    historyBody.innerHTML = '';
    transacciones.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.fecha}</td>
            <td>${tx.cuenta}</td>
            <td>$${tx.cargo.toFixed(2)}</td>
            <td>$${tx.abono.toFixed(2)}</td>
        `;
        historyBody.appendChild(row);
    });
}

// Paso 3: Manejar el envío del formulario
const form = document.getElementById('registro-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cuenta = document.getElementById('cuenta').value;
    const cargo = parseFloat(document.getElementById('cargo').value) || 0;
    const abono = parseFloat(document.getElementById('abono').value) || 0;

    // Verificar que solo se ingrese cargo o abono, no ambos
    if ((cargo > 0 && abono > 0) || (cargo === 0 && abono === 0)) {
        alert("Por favor, ingrese un valor en Cargo o Abono, pero no en ambos.");
        return;
    }

    // Actualizar el saldo de la cuenta
    const tipoCuenta = catalogoCuentas.find(c => c.cuenta === cuenta).tipo;
    if (tipoCuenta === 'Activo' || tipoCuenta === 'Pasivo' || tipoCuenta === 'Capital Contable') {
        let saldoActual = saldosCuentas[cuenta] || 0;
        
        // Reglas contables
        if (tipoCuenta === 'Activo') {
            saldoActual += (cargo - abono);
        } else if (tipoCuenta === 'Pasivo' || tipoCuenta === 'Capital Contable') {
            saldoActual += (abono - cargo);
        }
        saldosCuentas[cuenta] = saldoActual;

        // Añadir a historial
        const fecha = new Date().toLocaleDateString();
        transacciones.push({ fecha, cuenta, cargo, abono });
        
        // Actualizar la interfaz
        renderBalance();
        renderHistory();

        // Limpiar el formulario
        form.reset();
        document.getElementById('cargo').value = 0;
        document.getElementById('abono').value = 0;

    } else {
        alert("Cuenta no válida. Por favor, seleccione una cuenta de la lista.");
    }
});

// Paso 4: Cargar la aplicación al iniciar
window.onload = () => {
    renderSelectOptions();
    renderBalance();
};