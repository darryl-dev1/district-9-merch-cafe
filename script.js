
document.addEventListener("DOMContentLoaded", function () {

    // PAGE TRANSITION
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (
                href &&
                href.endsWith(".html") &&
                !this.target &&
                !e.ctrlKey &&
                !e.shiftKey &&
                !e.metaKey
            ) {
                e.preventDefault();

                document.body.classList.add("fade-out");

                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            }
        });
    });

    // SCROLL REVEAL ANIMATION
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // ACTIVE NAVIGATION
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll("nav a").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

});