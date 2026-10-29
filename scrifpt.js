
const PROFILE = {
  name: "Sabbir Ahmad",
  email: "sa581827346@gmail.com",
  whatsapp: "8801951332282",
  linkedin: "https://www.linkedin.com/in/sabbirahmad82/?isSelfProfile=true",
  facebook: "https://www.facebook.com/SabbirDigitalStudio1",
  portfolio: "https://sabbirahmad82-portfolio.netlify.app/",
  behance: "https://sabbirahmad82-portfolio.netlify.app/",
  aiEndpoint: "/.netlify/functions/ai-chat"
};

// মোবাইল মেনু
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation"
  );
});

mainNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// স্ক্রল অ্যানিমেশন
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// বর্তমান সেকশন অনুযায়ী নেভিগেশন হাইলাইট
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => sectionObserver.observe(section));
}

// ফুটারে স্বয়ংক্রিয় বছর
document.getElementById("year").textContent = new Date().getFullYear();

const reviewStatus = document.getElementById("reviewStatus");
if (reviewStatus && new URLSearchParams(window.location.search).get("review") === "submitted") {
  reviewStatus.textContent = "Thanks for sharing your review. It will be checked before being published.";
  reviewStatus.hidden = false;
}

// যোগাযোগের ফর্ম: ইমেইল অ্যাপে বার্তা তৈরি করবে
const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", event => {
  event.preventDefault();

  const form = new FormData(contactForm);
  const subject = encodeURIComponent(
    `Video editing inquiry — ${form.get("service")}`
  );

  const body = encodeURIComponent(
    `Name: ${form.get("name")}\n` +
    `Email: ${form.get("email")}\n` +
    `Service: ${form.get("service")}\n\n` +
    `Project details:\n${form.get("message")}`
  );

  window.location.href =
    `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
});

// এআই চ্যাট
const aiLauncher = document.getElementById("aiLauncher");
const aiChat = document.getElementById("aiChat");
const aiClose = document.getElementById("aiClose");
const aiForm = document.getElementById("aiForm");
const aiInput = document.getElementById("aiInput");
const aiMessages = document.getElementById("aiMessages");

function toggleAI(open) {
  aiChat.classList.toggle("open", open);
  aiChat.setAttribute("aria-hidden", String(!open));
  aiLauncher.setAttribute("aria-expanded", String(open));

  if (open) {
    setTimeout(() => aiInput.focus(), 100);
  }
}

aiLauncher?.addEventListener("click", () => {
  toggleAI(!aiChat.classList.contains("open"));
});

aiClose?.addEventListener("click", () => toggleAI(false));

function addChatBubble(message, type = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = message;
  aiMessages.appendChild(bubble);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return bubble;
}

aiForm?.addEventListener("submit", async event => {
  event.preventDefault();

  const question = aiInput.value.trim();
  if (!question) return;

  addChatBubble(question, "user");
  aiInput.value = "";

  const pending = addChatBubble("Thinking…", "bot");
  const sendButton = aiForm.querySelector("button");
  sendButton.disabled = true;

  try {
    const response = await fetch(PROFILE.aiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "AI service is not available.");
    }

    pending.textContent =
      data.reply || "Please contact Sabbir for more details.";

  } catch (error) {
    pending.classList.add("error");
    pending.textContent =
      "The AI service is not connected yet. Contact Sabbir at " +
      PROFILE.email + " or WhatsApp 01951332282.";
  } finally {
    sendButton.disabled = false;
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }
});
