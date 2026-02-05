let playerTeam = JSON.parse(localStorage.getItem('pokedex_team')) || [];
let enemyTeam = [];
let playerIdx = 0;
let enemyIdx = 0;

// Al cargar, generamos el rival
window.onload = async () => {
    if (playerTeam.length < 6) {
        alert("Necesitas 6 Pokémon para pelear.");
        window.location.href = "index.html";
        return;
    }
    await generarEquipoRival();
    actualizarInterfaz();
};

async function generarEquipoRival() {
    for (let i = 0; i < 6; i++) {
        const id = Math.floor(Math.random() * 1010) + 1;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        enemyTeam.push({
            nombre: data.name,
            hpMax: 100, hpActual: 100,
            ataque: data.stats[1].base_stat,
            defensa: data.stats[2].base_stat,
            sprite: data.sprites.front_default
        });
    }
}

function actualizarInterfaz() {
    const p = playerTeam[playerIdx];
    const e = enemyTeam[enemyIdx];

    document.getElementById('player-name').innerText = p.nombre.toUpperCase();
    document.getElementById('player-sprite').src = p.sprite;
    document.getElementById('player-hp-bar').style.width = (p.hpActual / p.hpMax * 100) + "%";
    document.getElementById('player-hp-num').innerText = `${p.hpActual}/${p.hpMax}`;

    document.getElementById('enemy-name').innerText = e.nombre.toUpperCase();
    document.getElementById('enemy-sprite').src = e.sprite;
    document.getElementById('enemy-hp-bar').style.width = (e.hpActual / e.hpMax * 100) + "%";
    document.getElementById('enemy-hp-num').innerText = `${e.hpActual}/${e.hpMax}`;
}

function atacar(tipo) {
    const p = playerTeam[playerIdx];
    const e = enemyTeam[enemyIdx];
    let daño = 0;

    if (tipo === 'rapido') daño = 15 + (p.ataque / 10);
    if (tipo === 'fuerte') daño = 30 + (p.ataque / 10);
    if (tipo === 'especial') daño = 45;

    e.hpActual = Math.max(0, e.hpActual - Math.floor(daño));
    document.getElementById('battle-message').innerText = `¡${p.nombre} usó ataque ${tipo}!`;
    
    actualizarInterfaz();

    if (e.hpActual <= 0) {
        document.getElementById('battle-message').innerText = `¡${e.nombre} debilitado!`;
        siguienteEnemigo();
    } else {
        setTimeout(turnoEnemigo, 1000);
    }
}

function turnoEnemigo() {
    const p = playerTeam[playerIdx];
    const e = enemyTeam[enemyIdx];
    let dañoEnemigo = 15 + (e.ataque / 10);

    p.hpActual = Math.max(0, p.hpActual - Math.floor(dañoEnemigo));
    document.getElementById('battle-message').innerText = `¡${e.nombre} enemigo contraataca!`;
    
    actualizarInterfaz();

    if (p.hpActual <= 0) {
        alert(`${p.nombre} se ha debilitado.`);
        playerIdx++;
        if (playerIdx >= 6) {
            alert("Has perdido la batalla...");
            window.location.href = "index.html";
        }
    }
}

function curar() {
    const p = playerTeam[playerIdx];
    p.hpActual = Math.min(p.hpMax, p.hpActual + 30);
    document.getElementById('battle-message').innerText = `¡Has curado a ${p.nombre}!`;
    actualizarInterfaz();
    setTimeout(turnoEnemigo, 1000);
}

function siguienteEnemigo() {
    enemyIdx++;
    if (enemyIdx >= 6) {
        alert("¡GANASTE LA BATALLA!");
        window.location.href = "index.html";
    } else {
        setTimeout(actualizarInterfaz, 1000);
    }
}