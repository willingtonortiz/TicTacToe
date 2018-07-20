// window.onload(()=>{
document.getElementById('botonJugar').addEventListener('click', () => {
    let contenedorDatos = document.getElementById('contenedorDatos');
    contenedorDatos.classList.add('container-moveup');

    let animaciones = document.getElementsByClassName('svg-img');
    animaciones[0].setAttribute('class', "shapeshifter svg-img play");
    animaciones[1].setAttribute('class', "shapeshifter svg-img play");

    let imagenes = document.getElementsByClassName('neon-svg');

    for (let i = 0; i < imagenes.length; i++) {
        imagenes[i].classList.add('neonAnimate');
    }

    let recargar = document.getElementById('reload');
    recargar.classList.add('reload-animation');
});

document.getElementById('reload').addEventListener('click', () => {
    let recargar = document.getElementById('reload');
    recargar.classList.remove('reload-animation');

    let contenedorDatos = document.getElementById('contenedorDatos');
    contenedorDatos.classList.remove('container-moveup');
});
