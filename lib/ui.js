const layout = [
  {
    type: "box",
    x: 1, y: 120,
    label: {
      text: "Test",
      font: "defaultFont",
      color: "#F00"
    },
    w: null, h: null,
    normal: { fill: null, border: null },
    icon: null,
  },
  {
    type: "button",
    hovering: false, pressed: false,
    x: 1, y: 20,
    label: {
      text: "Up",
      font: "defaultFont",
      color: "#AAA"
    },
    w: 15, h: 13,
    normal: { fill: "#020", border: "#099" },
    press: { fill: "#010", border: "#066" },
    hover: { fill: "#060", border: "#0EE" },
    icon: null,
    pressFn: null, // Triggered immediately after press
    // holdFn: null,
    releaseFn: () => cube.position.y += 0.25 // Triggered only if hovering and released
  },
  {
    type: "button",
    hovering: false, pressed: false,
    x: 1, y: 34,
    w: 27, h: 13,
    label: {
      text: "Down",
      font: "defaultFont",
      color: "#AAA"
    },
    normal: { fill: "#020", border: "#099" },
    press: { fill: "#010", border: "#066" },
    hover: { fill: "#060", border: "#0EE" },
    icon: null,
    pressFn: null,
    // holdFn: null,
    releaseFn: () => cube.position.y -= 0.25
  },
  {
    type: "button",
    hovering: false, pressed: false,
    x: 1, y: 48,
    w: 25, h: 13,
    label: {
      text: "Left",
      font: "defaultFont",
      color: "#AAA"
    },
    normal: { fill: "#020", border: "#099" },
    press: { fill: "#010", border: "#066" },
    hover: { fill: "#060", border: "#0EE" },
    icon: null,
    pressFn: null,
    // holdFn: null,
    releaseFn: () => cube.position.x -= 0.25
  },
  {
    type: "button",
    hovering: false, pressed: false,
    x: 1, y: 62,
    w: 27, h: 13,
    label: {
      text: "Right",
      font: "defaultFont",
      color: "#AAA"
    },
    normal: { fill: "#020", border: "#099" },
    press: { fill: "#010", border: "#066" },
    hover: { fill: "#060", border: "#0EE" },
    icon: null,
    pressFn: null,
    // holdFn: null,
    releaseFn: () => cube.position.x += 0.25
  },
  {
    type: "button",
    hovering: false, pressed: false,
    x: 1, y: 76,
    w: 61, h: 13,
    label: {
      text: "Toggle Icon",
      font: "defaultFont",
      color: "#AAA"
    },
    normal: { fill: "#020", border: "#099" },
    press: { fill: "#010", border: "#066" },
    hover: { fill: "#060", border: "#0EE" },
    icon: null,
    pressFn: null,
    // holdFn: null,
    releaseFn: () => icon = !icon
  }
]

function drawUi(delta) {
  for (const e of layout) {
    if (e.type == "button") {
      if (e.pressed) {
        if (e.press.fill) {
          fillRect(e.x + 1, e.y + 1, e.w, e.h, e.press.fill);
        }
        if (e.press.border) {
          outlineRect(e.x + 1, e.y + 1, e.w, e.h, e.press.border);
        }
        if (e.label) {
          drawText(e.x + 3, Math.round(e.y + e.h / 2 - fonts[e.label.font].height / 2) + 1, e.label.text, e.label.color, fonts[e.label.font]);
        }
        continue;
      }
      if (e.hovering) {
        if (e.hover.fill) {
          fillRect(e.x, e.y, e.w, e.h, e.hover.fill);
        }
        if (e.hover.border) {
          outlineRect(e.x, e.y, e.w, e.h, e.hover.border);
        }
        if (e.label) {
          drawText(e.x + 2, Math.round(e.y + e.h / 2 - fonts[e.label.font].height / 2), e.label.text, e.label.color, fonts[e.label.font]);
        }
        continue;
      }
      if (e.normal.fill) {
        fillRect(e.x, e.y, e.w, e.h, e.normal.fill);
      }
      if (e.normal.border) {
        outlineRect(e.x, e.y, e.w, e.h, e.normal.border);
      }
      if (e.label) {
        drawText(e.x + 2, Math.round(e.y + e.h / 2 - fonts[e.label.font].height / 2), e.label.text, e.label.color, fonts[e.label.font]);
      }
    }
    if (e.type == "box") {
      if (!e.w || !e.h) {
        if (e.label.text) {
          drawText(e.x, e.y, e.label.text, e.label.color, fonts[e.label.font]);
        }
        if (e.icon) {
          drawIcon(e.icon, e.x, e.y);
        }
      }
    }
  };
}

function updateUi() {
  let pointerOnButton = false;
  for (let i = 0; i < layout.length; i++) {
    if (layout[i].type == "button") {
      if (pointer.getX() >= layout[i].x && pointer.getY() >= layout[i].y && pointer.getX() < layout[i].x + layout[i].w && pointer.getY() < layout[i].y + layout[i].h) {
        pointer.icon = icons.pointer;
        pointerOnButton = true;
        if (layout[i].pressed && pointer.click.lmb) {
          if (layout[i].releaseFn) {
            layout[i].releaseFn();
          }
          pointer.click.lmb = false;
        }
        if (!pointer.down.lmb) {
          layout[i].hovering = true;
          layout[i].pressed = false;
        } else if (!layout[i].pressed == true && layout[i].hovering == true) {
          layout[i].pressed = true;
          if (layout[i].pressFn && layout[i].pressed) {
            layout[i].pressFn();
          }
        }
      } else {
        layout[i].hovering = false;
        if (!pointerOnButton) pointer.icon = icons.cursor;
        if (!pointer.down.lmb) {
          layout[i].pressed = false;
        }
      }
      //      if (layout[i].holdFn && layout[i].pressed) {
      //        layout[i].holdFn(); // Needs continuous input updates to run
      //      }
    }
  }
  pointer.click.lmb = false;
  pointer.click.mmb = false;
  pointer.click.rmb = false;
}
