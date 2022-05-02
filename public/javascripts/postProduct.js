function update(){
    var select = document.getElementById('dropdown');
    var option = select.options[select.selectedIndex];

    document.getElementById('hidden').value = option.text;
}

update();