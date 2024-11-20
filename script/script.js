const pastelColors = [
    '#FFFFFF', '#cc5ef5', '#461791'
];
  
createCircles = () => {
    const section = document.getElementById('bubbles');
    const circles = document.createElement('span');

    const size = Math.random();

    const maxOpacity = 40 + Math.random() * 60
    const blur = 1 + size * 4


    circles.style.width = 10 + (size * 25) + 'px';
    circles.style.height = 10 + (size * 25) + 'px';

    circles.style.top = Math.random() * innerHeight + 'px';
    circles.style.left = Math.random() * innerWidth + 'px';

    circles.style.filter = `blur(${blur}px)`;
    circles.style['--max-opacity'] = `${maxOpacity}%`;

    circles.style.background = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    section.appendChild(circles);

    setTimeout(() => {
        circles.remove()
    }, 5000);
}

setInterval(createCircles, 150);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav__link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            
            // Get the target element from the 'href' attribute
            const targetID = this.getAttribute('href');
            const targetElement = document.querySelector(targetID);
        
            if (targetElement) {
            // Smooth scroll to the target element's position
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
            }
        });
    });

    //Page beging visited
    const sections = document.querySelectorAll('[data-page]');
    const nav = document.querySelectorAll('#myMenu a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const page = entry.target.getAttribute('data-page');
            const isIntersecting = entry.isIntersecting;
    
            if (isIntersecting) {
                document.body.className = page;
    
                nav.forEach(item => {
                    if (item.getAttribute('data-content') === page) {
                        item.setAttribute('aria-current', 'page');
                    } else {
                        item.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, {
        threshold: 0.25
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    window.addEventListener('scroll', function() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                const page = section.getAttribute('data-page');
                document.body.className = page;
                nav.forEach(item => {
                    if (item.getAttribute('data-content') === page) {
                        item.setAttribute('aria-current', 'page');
                    } else {
                        item.removeAttribute('aria-current');
                    }
                });
            }
        });
    });
    
    const body = document.querySelector('body');
    const togglenav = document.getElementById('togglenav');
    const menu = document.getElementById('menu');
    const menuNav = document.getElementById('myMenu');
    
    togglenav.addEventListener('change', function() {
        const isChecked = togglenav.checked;

        togglenav.setAttribute('aria-expanded', isChecked ? 'true' : 'false');
        menu.setAttribute('aria-expanded', isChecked ? 'true' : 'false');

        body.dataset.menuOpen = isChecked ? 'true' : 'false';
        
        menuNav.classList.remove('mobile');
    });

    menuNav.addEventListener('click', function() {
        togglenav.click();
    });

    const logoNav = document.getElementById('logoLink');
    const goHome = document.getElementById('goHome');

    logoNav.addEventListener('click', function(e) {
        e.preventDefault();
        goHome.click();

        const isChecked = togglenav.checked;

        if(isChecked){
            togglenav.click();
        }
    });

    //Send the contact email
    const form = document.getElementById("myContact");
  
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById("myStatus");
        const data = new FormData(event.target);

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
        }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "Thanks for your submission!";
                form.reset();
            } else {
                response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form"
                }
                })
            }
        }).catch(error => {
            status.innerHTML = "Oops! There was a problem submitting your form"
        });
    }
    form.addEventListener("submit", handleSubmit);
});
