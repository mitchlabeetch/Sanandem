## 2025-05-22 - Form Wizard Navigation & Accessibility
**Learning:** Multi-step forms (wizards) using `button[type="button"]\ for "Next" steps break standard form submission behavior (Enter key) and bypass validation if not carefully handled. Also, `ScrollReveal` components should respect `prefers-reduced-motion`.
**Action:** When building wizards, intercept `Enter` on the form to trigger `nextStep()` and ensure `reportValidity()` is called before proceeding. Use CSS media queries to disable animations in `ScrollReveal`.
