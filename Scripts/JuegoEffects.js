window.onload = function(){
    moveContainerUp();
}
var moveContainerUp = function(){
    var _svgAnimation = document.getElementsByClassName('svg-img');
    var _svgNeon = document.getElementsByClassName('neon-svg');
    var _containerDatos = document.getElementsByClassName('container-datos')[0];
    var _buttonJugar= document.getElementById('botonJugar');
    _buttonJugar.addEventListener('click',e =>{        
        _containerDatos.classList.add('container-moveup');
        _svgAnimation[0].setAttribute("class", "shapeshifter svg-img play");
        _svgAnimation[1].setAttribute("class", "shapeshifter svg-img play");
        
        for( var  q = 0 ;  q< _svgNeon.length;q++){
            _svgNeon[q].classList.add('neonAnimate');
        }
    })
} 