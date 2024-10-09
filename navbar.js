let navbar;
let navbarTitle = "RealWizardVHS"
let navbarLinks = [
    {name: "Home", url: "index.html"},
    {name: "Projects", url: "projects.html"},
]

document.addEventListener('DOMContentLoaded', function() {
    navbar =document.getElementById('navbar');
    
    //let title = document.createElement('p');
    //title.id = "navbar-title";
    //title.innerHTML = navbarTitle;

    let links = document.createElement('ul');
    links.id = "navbar-links";

   // navbar.appendChild(title);
    navbar.appendChild(links);

    for(let i = 0; i < navbarLinks.length; i++){
        let link = document.createElement('li');
        let a = document.createElement('a');
        a.className = "navbar-link";
        a.href = navbarLinks[i].url;
        a.innerHTML = navbarLinks[i].name;

        link.appendChild(a);
        links.appendChild(link);
    }




});