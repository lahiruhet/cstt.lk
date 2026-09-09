import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import {
  createIcons,
  ArrowUpRight,
  ArrowRight,
  Phone,
  MapPin,
  Route,
  CalendarRange,
  UsersRound,
  FileCheck2,
  Handshake,
  ClipboardList,
  Milestone,
  Mail,
} from "lucide";

createIcons({
  icons: {
    ArrowUpRight,
    ArrowRight,
    Phone,
    MapPin,
    Route,
    CalendarRange,
    UsersRound,
    FileCheck2,
    Handshake,
    ClipboardList,
    Milestone,
    Mail,
  },
  nameAttr: "data-icon",
  attrs: { "aria-hidden": "true" },
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("open");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  navigation.classList.toggle("open", open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header")) closeMenu();
});
window.matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);

const fleet = {
  vans: {
    text: "Discuss passenger capacity, daily routes and driver requirements. We’ll work with you to define the right van arrangement.",
    cta: "Enquire about vans",
    enquiry: "Vans and crew transport",
    position: "75% center",
    alt: "Illustrative corporate passenger van with supporting vehicles",
  },
  cars: {
    text: "Share your travel patterns, locations and contract period. We’ll discuss compact and passenger car options for your business.",
    cta: "Enquire about cars",
    enquiry: "Cars and compact vehicles",
    position: "5% center",
    alt: "Illustrative fleet scene including a compact car for business travel",
  },
  cabs: {
    text: "Tell us about your site locations, team size and working conditions so we can discuss a suitable double cab or utility vehicle.",
    cta: "Enquire about double cabs",
    enquiry: "Double cabs and utility vehicles",
    position: "35% center",
    alt: "Illustrative fleet scene including a double cab for field operations",
  },
};
document.querySelectorAll("[data-fleet]").forEach((button) =>
  button.addEventListener("click", () => {
    const selection = fleet[button.dataset.fleet];
    document.querySelectorAll("[data-fleet]").forEach((item) => {
      item.classList.toggle("selected", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelector("#fleet-detail-text").textContent = selection.text;
    const link = document.querySelector("#fleet-enquiry");
    link.firstChild.textContent = `${selection.cta} `;
    link.dataset.enquiry = selection.enquiry;
    const image = document.querySelector("#fleet-image");
    image.style.objectPosition = selection.position;
    image.alt = selection.alt;
  }),
);

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-enquiry]");
  if (link)
    document.querySelector("#service-select").value = link.dataset.enquiry;
});

document.querySelector("#enquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const details = new FormData(form);
  const subject = `Transport enquiry: ${details.get("service")}`;
  const body = [
    "Hello CSTT team,",
    "",
    `I’m interested in: ${details.get("service")}`,
    "",
    `Name: ${details.get("name").trim()}`,
    `Organisation: ${details.get("company").trim() || "Not specified"}`,
    `Email: ${details.get("email").trim()}`,
    `Phone: ${details.get("phone").trim() || "Not specified"}`,
    "",
    "Requirements:",
    details.get("message").trim(),
    "",
    "Thank you.",
  ].join("\r\n");
  window.location.href = `mailto:info@cstt.lk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector("#form-status").textContent =
    "Your email draft is ready to open. Send it from your email app to complete the enquiry. If no app opens, email info@cstt.lk or call +94 11 280 3702. Your details remain here for reference.";
});
document.querySelector("#year").textContent = new Date().getFullYear();
