fetch('/nav.html').then(response => response.text()).then(data => {
    let old_element = document.getElementById('nav');
    let new_element = document.createElement('div');
    new_element.innerHTML = data;
    old_element.parentNode.replaceChild(new_element, old_element);
});
