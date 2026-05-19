document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const msgBox = document.getElementById("formMessage");
    const btn = document.getElementById("submitBtn");

    // honeypot anti-spam
    if (form.website.value !== "") return;

    btn.disabled = true;
    btn.innerText = "Enviando...";

    emailjs
      .send("service_3x1mlqs", "template_1x0lmol", {
        nome: form.nome.value,
        whatsapp: form.whatsapp.value,
        modalidade: form.modalidade.value,
        mensagem: form.mensagem.value,
      })
      .then(() => {
        msgBox.style.display = "block";
        msgBox.className = "form-message success";
        msgBox.innerHTML =
          "Mensagem enviada com sucesso! Em breve entraremos em contato.";
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        msgBox.style.display = "block";
        msgBox.className = "form-message error";
        msgBox.innerHTML =
          "Erro ao enviar. Tente novamente ou chame no WhatsApp.";
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerText = "Enviar mensagem";
      });
  });
});
