// Variables de estado global
let currentPokemonId = 1;
let currentView = 'front'; // 'front' o 'back'
let isShiny = false;
let pokemonData = null;

// Elementos del DOM
const screenImage = document.getElementById('screen-left-image');
const numeroDisplay = document.getElementById('pokemon-numero');
const nombreDisplay = document.getElementById('pokemon-title');
const hpDisplay = document.getElementById('pokemon-hp');
const attackDisplay = document.getElementById('pokemon-attack');
const defenseDisplay = document.getElementById('pokemon-defense');
const speedDisplay = document.getElementById('pokemon-speed');
const heightDisplay = document.getElementById('pokemon-height');
const weightDisplay = document.getElementById('pokemon-weight');
const type1Container = document.getElementById('pokemon-type-1');
const type2Container = document.getElementById('pokemon-type-2');

/**
 * Función principal para buscar en PokeAPI
 */
async function buscarPokemon(id = null) {
    const searchId = id || numeroDisplay.innerText;
    
    if (!searchId || searchId < 1 || searchId > 1025) {
        alert("Por favor, introduce un número válido (1 - 1025)");
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchId}`);
        if (!response.ok) throw new Error("Pokemon no encontrado");
        
        pokemonData = await response.json();
        currentPokemonId = pokemonData.id;
        
        // Determinar si es Shiny (Probabilidad baja: ~10%)
        isShiny = Math.random() < 0.10;
        currentView = 'front'; // Resetear vista al buscar
        
        renderPokemon();
    } catch (error) {
        console.error(error);
        alert("Error al conectar con la PokeAPI");
    }
}

/**
 * Dibuja los datos en la interfaz
 */
function renderPokemon() {
    // Info básica
    numeroDisplay.innerText = pokemonData.id;
    nombreDisplay.innerText = pokemonData.name.toUpperCase();
    heightDisplay.innerText = (pokemonData.height / 10) + "m";
    weightDisplay.innerText = (pokemonData.weight / 10) + "kg";

    // Stats
    hpDisplay.innerText = pokemonData.stats[0].base_stat;
    attackDisplay.innerText = pokemonData.stats[1].base_stat;
    defenseDisplay.innerText = pokemonData.stats[2].base_stat;
    speedDisplay.innerText = pokemonData.stats[5].base_stat;

    // Imagen (Shiny o Normal / Frente o Espalda)
    updateSprite();

    // Tipos e Imágenes locales
    renderTypes();
}

/**
 * Actualiza la imagen actual según la vista y si es shiny
 */
function updateSprite() {
    let spriteUrl = "";
    if (isShiny) {
        spriteUrl = currentView === 'front' ? pokemonData.sprites.front_shiny : pokemonData.sprites.back_shiny;
    } else {
        spriteUrl = currentView === 'front' ? pokemonData.sprites.front_default : pokemonData.sprites.back_default;
    }
    
    // Si no hay sprite de espalda, forzar el de frente
    screenImage.src = spriteUrl || pokemonData.sprites.front_default;
}

/**
 * Maneja las imágenes de tipos (Tipo_fuego.png, etc.)
 */
function renderTypes() {
    type1Container.innerHTML = "";
    type2Container.innerHTML = "";

    pokemonData.types.forEach((t, index) => {
        const typeName = t.type.name;
        // Traducción simple para coincidir con tus archivos
        const dictTipos = {
            fire: 'fuego', water: 'agua', grass: 'planta', electric: 'electrico',
            ice: 'hielo', fighting: 'lucha', poison: 'veneno', ground: 'tierra',
            flying: 'volador', psychic: 'psiquico', bug: 'bicho', rock: 'roca',
            ghost: 'fantasma', dragon: 'dragon', dark: 'siniestro', steel: 'acero',
            fairy: 'hada', normal: 'normal'
        };

        const nombreEsp = dictTipos[typeName] || 'desconocido';
        const img = document.createElement('img');
        img.src = `./tipos/Tipo_${nombreEsp}.png`;
        img.style.width = "100%";
        
        if (index === 0) type1Container.appendChild(img);
        else type2Container.appendChild(img);
    });
}

/**
 * Lógica del Teclado Numérico
 */
function asignarNumero(btn) {
    const num = btn.innerText;
    // Si ya hay un número buscado, al presionar uno nuevo limpiamos para empezar de cero
    if (numeroDisplay.innerText.length >= 4) numeroDisplay.innerText = "";
    numeroDisplay.innerText += num;
}

/**
 * Lógica de la Cruceta (Navegación y Rotación)
 */
document.querySelector('.cross-top').onclick = () => {
    if (currentPokemonId > 1) buscarPokemon(currentPokemonId - 1);
    else alert("¡Ya estás en el primer Pokémon!");
};

document.querySelector('.cross-bottom').onclick = () => {
    if (currentPokemonId < 1025) buscarPokemon(currentPokemonId + 1);
    else alert("¡Llegaste al límite de la Pokédex!");
};

document.querySelector('.cross-left').onclick = () => {
    currentView = 'front';
    if (pokemonData) updateSprite();
};

document.querySelector('.cross-right').onclick = () => {
    currentView = 'back';
    if (pokemonData) updateSprite();
};

// Funciones para la tabla (Opcional: Agregar a la lista)
function agregarPokemon() {
    if (!pokemonData) return;
    const tabla = document.getElementById('contenido-tabla');
    const row = `
        <tr>
            <td>${pokemonData.id}</td>
            <td>${pokemonData.name}</td>
            <td>${pokemonData.stats[0].base_stat}</td>
            <td>${pokemonData.stats[2].base_stat}</td>
            <td>${pokemonData.stats[5].base_stat}</td>
            <td><button onclick="this.closest('tr').remove()">Eliminar</button></td>
        </tr>
    `;
    tabla.innerHTML += row;
}