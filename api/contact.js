<form id="contactForm">
  <input type="text" name="name" placeholder="Name" style="width:100%;padding:12px;margin:10px 0;border:1px solid #E2E2E2;background:#fff;">
  <input type="email" name="email" placeholder="Email*" required style="width:100%;padding:12px;margin:10px 0;border:1px solid #E2E2E2;background:#fff;">
  <textarea name="message" placeholder="What are you building / what pressure are you under?*" required rows="5" style="width:100%;padding:12px;margin:10px 0;border:1px solid #E2E2E2;background:#fff;"></textarea>
  <button class="button" type="submit">Request Early Access</button>
  <div id="formStatus" style="margin-top:14px;color:#6B6B6B;"></div>
</form>

<script>
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending…";

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok || !data.ok) {
        statusEl.textContent = "Failed to send. Try again or email infra@sim95.com.";
        return;
      }

      statusEl.textContent = "Received. We’ll reply by email.";
      form.reset();
    } catch (err) {
      statusEl.textContent = "Failed to send. Try again or email infra@sim95.com.";
    }
  });
</script>
