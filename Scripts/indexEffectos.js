
window.onload =  function(){
    displayContainerMenu();
}

var  displayContainerMenu = ()=>{
    var _containerMenu = document.getElementsByClassName('MenuContainers');
    var _itemLinks = document.getElementsByClassName('item-link');
    var _closeButtons =  document.getElementsByClassName('close');
    for(var i  = 0 ; i< _itemLinks.length; i++){
        _itemLinks[i].addEventListener('click',e=>{
            var _key = e.target.parentNode.getAttribute("data-target");
            for(var q = 0; q<_containerMenu.length;q++){
                if( _containerMenu[q].getAttribute("data-target") === _key){
                    _containerMenu[q].classList.add('showContainer');
                }
                else{
                    _containerMenu[q].classList.remove('showContainer');
                }
            }
        })
    }
    
    for(var i = 0 ; i< _closeButtons.length;i++){
        _closeButtons[i].addEventListener('click', e=>{
            e.target.parentNode.parentNode.classList.remove('showContainer');
        })
    }

}