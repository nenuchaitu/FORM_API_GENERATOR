// src/js/main.js
import { buildFieldConfigs, readFieldsConfig } from "./fields-ui.js";
import { buildResultHtml } from "./result-template.js";

const setFieldsBtn = document.getElementById("setFieldsBtn");
const generateBtn = document.getElementById("generateBtn");
const openBtn = document.getElementById("openBtn");
const fieldCountInput = document.getElementById("fieldCount");
const fieldsContainer = document.getElementById("fieldsContainer");
const httpMethodSelect = document.getElementById("httpMethod");
const apiUrlInput = document.getElementById("apiUrl");
const resultOutput = document.getElementById("resultHtmlOutput");

let lastObjectUrl = null;

// initialize with 2 fields
buildFieldConfigs(fieldsContainer, 2);

setFieldsBtn.addEventListener("click", () => {
  const count = parseInt(fieldCountInput.value, 10);
  if (!count || count < 1) {
    alert("Enter a valid number of fields (at least 1).");
    return;
  }
  buildFieldConfigs(fieldsContainer, count);
});

generateBtn.addEventListener("click", () => {
  const apiUrl = apiUrlInput.value.trim();
  if (!apiUrl) {
    alert("API URL is required.");
    return;
  }
  let fields;
  try {
    fields = readFieldsConfig(fieldsContainer);
  } catch (e) {
    alert(e.message);
    return;
  }

  const config = {
    apiUrl,
    method: httpMethodSelect.value,
    fields,
  };

  const html = buildResultHtml(config);
  resultOutput.value = html;
  openBtn.disabled = false;
});

openBtn.addEventListener("click", () => {
  const html = resultOutput.value;
  if (!html) return;

  const blob = new Blob([html], { type: "text/html" });
  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
  }
  lastObjectUrl = URL.createObjectURL(blob);
  window.open(lastObjectUrl, "_blank");
});
