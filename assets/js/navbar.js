document.addEventListener("DOMContentLoaded", function () {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScrollY = window.scrollY;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        mobileMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
    });

    // Close menu when clicking on links
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      });
    });
  }

  // Intersection Observer for animations
  // rootMargin positivo permite que a animação comece ANTES do elemento entrar na viewport
  const observerOptions = {
    threshold: 0.05, // Reduzido para detectar mais cedo (5% visível)
    rootMargin: "100px 0px -50px 0px", // 100px positivo no topo = dispara 100px ANTES do elemento aparecer
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(
      ".specialty-card, .step, .testimonial-card, .appointment-card, .contact-item",
    )
    .forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      // Reduzido o delay entre elementos para animação mais rápida
      const delay = Math.min(index * 0.08, 0.4); // Máximo de 0.4s de delay total
      el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
      observer.observe(el);
    });

  // Form submission - Envio via email (PHP)
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    // Garante que o formulário tem action e method corretos
    if (!contactForm.getAttribute("action")) {
      contactForm.setAttribute("action", "enviar.php");
    }
    if (!contactForm.getAttribute("method")) {
      contactForm.setAttribute("method", "POST");
    }

    // Feedback visual durante o envio
    contactForm.addEventListener("submit", (e) => {
      const submitBtn =
        contactForm.querySelector('button[type="submit"]') ||
        contactForm.querySelector("#submitBtn");

      // Validação básica (HTML5 já valida, mas garantimos)
      const nome = contactForm.querySelector('input[name="nome"]').value.trim();
      const whatsapp = contactForm
        .querySelector('input[name="whatsapp"]')
        .value.trim();
      const modalidade = contactForm.querySelector(
        'select[name="modalidade"]',
      ).value;

      if (!nome || !whatsapp || !modalidade) {
        e.preventDefault();
        return false;
      }

      // Salva a posição de scroll antes de enviar
      sessionStorage.setItem(
        "formScrollPosition",
        window.pageYOffset.toString(),
      );

      // Feedback visual (NÃO bloqueia o envio)
      if (submitBtn) {
        submitBtn.innerHTML = "Enviando...";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
      }

      // CRÍTICO: NÃO usar preventDefault() aqui - permite o envio normal do formulário
      // O formulário será enviado normalmente para enviar.php via POST
      // O navegador fará o submit natural do formulário
    });

    // Tratamento de mensagens de sucesso/erro via URL (quando PHP redireciona)
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const msg = urlParams.get("msg");
    const formMessage = document.getElementById("formMessage");

    if (status && formMessage) {
      // Restaura a posição de scroll antes de mostrar a mensagem
      const scrollPosition = sessionStorage.getItem("formScrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem("formScrollPosition");
      }

      if (status === "success") {
        formMessage.style.display = "block";
        formMessage.style.background = "rgba(16, 185, 129, 0.1)";
        formMessage.style.border = "1px solid #10b981";
        formMessage.style.color = "#10b981";
        formMessage.style.padding = "12px 16px";
        formMessage.style.borderRadius = "8px";
        formMessage.style.marginBottom = "20px";
        formMessage.innerHTML =
          "✓ <strong>Mensagem enviada com sucesso!</strong> Entraremos em contato em breve.";

        // Limpa o formulário
        contactForm.reset();

        // Remove a mensagem após 5 segundos
        setTimeout(() => {
          formMessage.style.display = "none";
        }, 5000);
      } else if (status === "error") {
        formMessage.style.display = "block";
        formMessage.style.background = "rgba(239, 68, 68, 0.1)";
        formMessage.style.border = "1px solid #ef4444";
        formMessage.style.color = "#ef4444";
        formMessage.style.padding = "12px 16px";
        formMessage.style.borderRadius = "8px";
        formMessage.style.marginBottom = "20px";
        const errorMsg = msg
          ? decodeURIComponent(msg)
          : "Erro ao enviar mensagem. Tente novamente.";
        formMessage.innerHTML = "✗ <strong>Erro:</strong> " + errorMsg;
      }

      // Limpa os parâmetros da URL sem recarregar a página
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // Parallax effect for hero decoration
  const heroDecoration = document.querySelector(".hero-decoration");
  if (heroDecoration) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      heroDecoration.style.transform = `translate(${scrolled * 0.05}px, ${scrolled * 0.1}px)`;
    });
  }

  // Add active class to nav links based on scroll position
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
