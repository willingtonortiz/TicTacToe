
var moveContainerUp = function(){
    var _svgAnimation = document.getElementsByClassName('svg-img');
    var _svgNeon = document.getElementsByClassName('neon-svg');
    var _reload = document.getElementsByClassName('reload')[0];
    var _buttonJugar= document.getElementById('botonJugar');
    var _containerDatos = document.getElementsByClassName('container-datos')[0];

    _buttonJugar.addEventListener('click',e =>{        
        _containerDatos.classList.add('container-moveup');
        _svgAnimation[0].setAttribute("class", "shapeshifter svg-img play");
        _svgAnimation[1].setAttribute("class", "shapeshifter svg-img play");
        
        for( var  q = 0 ;  q< _svgNeon.length;q++){
            _svgNeon[q].classList.add('neonAnimate');
        }
        _reload.classList.add('reload-animation');
        _reload.addEventListener('click',f =>{
            _reload.classList.remove('reload-animation');
            _containerDatos.classList.remove('container-moveup');

        })
    })
    

} 