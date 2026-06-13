const BACKEND_ENDPOINT = "";

const testimonials = [
  {
    text: "I learned a lot about being proactive and setting goals from the leadership camp, and had lots of fun!",
    source: "A student from Sharon, MA says..."
  },
  {
    text: "This initiative is helping many kids and is very impactful. Thank you for doing this!",
    source: "A parent from Newton, MA says..."
  },
  {
    text: "The camp is an entertaining and fun camp for new learners and leaders",
    source: "A student from Sharon, MA says..."
  },
  {
    text: "IT'S SO FUN! DO IT!",
    source: "A student from Sharon, MA says..."
  },
  {
    text: "This is an interesting camp with helpful instructors",
    source: "A student from Sharon, MA says..."
  }
];

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("[data-menu]");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const slide = document.querySelector("[data-slide]");
const dotsContainer = document.querySelector("[data-dots]");
let activeTestimonial = 0;

function renderTestimonial(index) {
  if (!slide || !dotsContainer) return;
  activeTestimonial = (index + testimonials.length) % testimonials.length;
  const testimonial = testimonials[activeTestimonial];
  slide.querySelector(".quote-text").textContent = `"${testimonial.text}"`;
  slide.querySelector(".quote-source").textContent = testimonial.source;

  dotsContainer.querySelectorAll("button").forEach((button, dotIndex) => {
    button.setAttribute("aria-current", String(dotIndex === activeTestimonial));
  });
}

if (slide && dotsContainer) {
  testimonials.forEach((testimonial, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => renderTestimonial(index));
    dotsContainer.append(dot);
  });

  document.querySelector("[data-prev]")?.addEventListener("click", () => {
    renderTestimonial(activeTestimonial - 1);
  });

  document.querySelector("[data-next]")?.addEventListener("click", () => {
    renderTestimonial(activeTestimonial + 1);
  });

  renderTestimonial(0);
}

const signupForm = document.querySelector("[data-signup-form]");
const formStatus = document.querySelector("[data-form-status]");

async function submitSignup(email) {
  if (!BACKEND_ENDPOINT) {
    const savedEmails = JSON.parse(localStorage.getItem("creativeClassroomSignupQueue") || "[]");
    savedEmails.push({ email, createdAt: new Date().toISOString() });
    localStorage.setItem("creativeClassroomSignupQueue", JSON.stringify(savedEmails));
    return { ok: true, localOnly: true };
  }

  const response = await fetch(BACKEND_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  return { ok: response.ok };
}

if (signupForm && formStatus) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const email = String(formData.get("email") || "").trim();

    formStatus.className = "form-note";

    if (!email || !signupForm.email.validity.valid) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.classList.add("error");
      signupForm.email.focus();
      return;
    }

    signupForm.querySelector("button").disabled = true;
    formStatus.textContent = "Joining...";

    try {
      const result = await submitSignup(email);
      if (!result.ok) throw new Error("Signup failed");
      formStatus.textContent = result.localOnly
        ? "Thank you! Your email is saved locally until a backend is connected."
        : "Thank you!";
      formStatus.classList.add("success");
      signupForm.reset();
    } catch {
      formStatus.textContent = "Something went wrong. Please email us directly for now.";
      formStatus.classList.add("error");
    } finally {
      signupForm.querySelector("button").disabled = false;
    }
  });
}
