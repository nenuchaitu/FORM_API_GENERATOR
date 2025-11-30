// src/js/result-template.js

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildResultHtml(config) {
  const fieldsHtml = config.fields
    .map(
      (f) => `      <div class="field-row">
        <label for="${f.id}">${escapeHtml(f.label)}</label>
        <input id="${f.id}" type="text" />
      </div>`
    )
    .join("\n");

  const configJson = JSON.stringify(config).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Result HTML – API Form</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; margin: 0;
           min-height: 100vh; display: flex; align-items: center; justify-content: center;
           background: #0f172a; color: #e5e7eb; padding: 20px; }
    .container { max-width: 600px; width: 100%; background: #020617; border-radius: 10px;
                 border: 1px solid rgba(148,163,184,0.7); padding: 16px 18px; }
    .field-row { margin-bottom: 10px; }
    label { display:block; margin-bottom:3px; font-size:0.8rem; color:#cbd5f5; }
    input[type="text"] { width:100%; box-sizing:border-box; padding:6px 8px; border-radius:6px;
                         border:1px solid rgba(148,163,184,0.7); background:#020617;
                         color:#e5e7eb; font-size:0.85rem; }
    button { padding:7px 14px; border-radius:999px; border:none; background:#38bdf8;
             color:#0b1120; font-size:0.85rem; font-weight:500; cursor:pointer; margin-top:4px; }
    .status { font-size:0.8rem; color:#9ca3af; margin-top:8px; }
    pre { margin-top:8px; background:#020617; border-radius:8px;
          border:1px solid rgba(148,163,184,0.7); padding:8px; font-size:0.8rem;
          max-height:250px; overflow:auto; white-space:pre-wrap; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Result HTML – API Form</h1>
    <p>This form sends an HTTP ${config.method.toUpperCase()} request to:<br/>
       <code>${escapeHtml(config.apiUrl)}</code></p>
    <form id="apiForm">
${fieldsHtml}
      <button type="submit">Send request</button>
    </form>
    <div class="status" id="status">Idle.</div>
    <pre id="response"></pre>
  </div>
  <script id="config" type="application/json">${configJson}<` + `/script>
  <script>
    (function () {
      var cfgEl = document.getElementById("config");
      var cfg = JSON.parse(cfgEl.textContent || cfgEl.innerText || "{}");
      var form = document.getElementById("apiForm");
      var statusEl = document.getElementById("status");
      var responseEl = document.getElementById("response");
      var endpoint = cfg.apiUrl;
      var method = (cfg.method || "GET").toUpperCase();

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        statusEl.textContent = "Sending request...";
        responseEl.textContent = "";

        var payload = {};
        (cfg.fields || []).forEach(function (field) {
          var input = document.getElementById(field.id);
          if (input && field.payloadName) {
            payload[field.payloadName] = input.value;
          }
        });

        var options = { method: method, headers: {} };
        var urlToCall = endpoint;

        if (method === "GET" || method === "DELETE") {
          var params = new URLSearchParams();
          for (var key in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
              params.append(key, payload[key]);
            }
          }
          var qs = params.toString();
          if (qs) {
            urlToCall = endpoint.indexOf("?") === -1 ? endpoint + "?" + qs : endpoint + "&" + qs;
          }
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(payload);
        }

        fetch(urlToCall, options)
          .then(function (res) {
            statusEl.textContent = "Response status: " + res.status;
            return res.text();
          })
          .then(function (text) {
            responseEl.textContent = text;
          })
          .catch(function (err) {
            statusEl.textContent = "Request failed.";
            responseEl.textContent = String(err);
          });
      });
    })();
  <` + `/script>
</body>
</html>`;
}
