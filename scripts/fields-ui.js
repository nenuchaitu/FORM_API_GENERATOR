// src/js/fields-ui.js

export function buildFieldConfigs(containerEl, count) {
  containerEl.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "field-config";

    const title = document.createElement("div");
    title.className = "field-config-title";
    title.textContent = `Field ${i + 1}`;
    wrapper.appendChild(title);

    const labelLabel = document.createElement("label");
    labelLabel.textContent = "Field label (displayed to user)";
    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.className = "field-label";
    labelInput.placeholder = i === 0 ? "Name" : i === 1 ? "Email" : `Field ${i + 1}`;

    const payloadLabel = document.createElement("label");
    payloadLabel.textContent = "Payload name (used as key in API payload)";
    const payloadInput = document.createElement("input");
    payloadInput.type = "text";
    payloadInput.className = "payload-name";
    payloadInput.placeholder =
      i === 0 ? "user_name" : i === 1 ? "user_email" : `field_${i + 1}`;

    wrapper.appendChild(labelLabel);
    wrapper.appendChild(labelInput);
    wrapper.appendChild(payloadLabel);
    wrapper.appendChild(payloadInput);

    containerEl.appendChild(wrapper);
  }
}

export function readFieldsConfig(containerEl) {
  const configs = [];
  const configDivs = containerEl.querySelectorAll(".field-config");

  if (!configDivs.length) {
    throw new Error("Define at least one field.");
  }

  configDivs.forEach((div, index) => {
    const labelInput = div.querySelector(".field-label");
    const payloadInput = div.querySelector(".payload-name");

    const label = (labelInput.value || "").trim();
    const payloadName = (payloadInput.value || "").trim();

    if (!label || !payloadName) {
      throw new Error("All fields must have a label and a payload name.");
    }

    configs.push({
      id: `field_${index}`,
      label,
      payloadName,
    });
  });

  return configs;
}
