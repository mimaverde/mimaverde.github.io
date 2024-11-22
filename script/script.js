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

    // Select the form and the status message element
    const form = document.getElementById("myContact");
    const status = document.getElementById("myStatus");

    // Function to handle form submission
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get the reCAPTCHA token
        const recaptchaToken = grecaptcha.getResponse();
        if (!recaptchaToken) {
            // If reCAPTCHA is not completed, show an error message
            status.innerHTML = "Please complete the reCAPTCHA.";
            return;
        }

        // Prepare the form data
        const data = new FormData(event.target);
        // Add the reCAPTCHA token to the form data
        data.append('g-recaptcha-response', recaptchaToken);

        // Send the form data using Fetch API
        fetch(event.target.action, {
            method: form.method, // Use the method defined in the form (POST)
            body: data, // Attach the form data
            headers: {
                'Accept': 'application/json' // Expect JSON response
            }
        })
            .then(response => {
                if (response.ok) {
                    // If submission is successful, show a success message
                    status.innerHTML = "Thanks for your submission!";
                    form.reset(); // Reset the form fields
                    grecaptcha.reset(); // Reset the reCAPTCHA widget
                } else {
                    // If there's an error, handle it
                    response.json().then(data => {
                        if (data.errors) {
                            // Show specific error messages if available
                            status.innerHTML = data.errors.map(error => error.message).join(", ");
                        } else {
                            // Show a general error message
                            status.innerHTML = "Oops! There was a problem submitting your form.";
                        }
                    });
                }
            })
            .catch(error => {
                // Handle any network or unexpected errors
                status.innerHTML = "Oops! There was a problem submitting your form.";
            });
    }

    // Attach the submit event listener to the form
    form.addEventListener("submit", handleSubmit);
});
