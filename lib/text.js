//--- Text rendering ---//
function drawChar(x, y, char, hexColor = "#FFFFFFFF", font = fonts.defaultFont) {
  let charFont;
  if (font.chars[char]) {
    if (font.chars[char].width * font.height == font.chars[char].data.length) {
      charFont = font.chars[char];
    } else {
      charFont = font.unknown_char;
    }
  } else {
    charFont = font.unknown_char;
  }

  const color = hexToRgba(hexColor);
  for (let dy = 0; dy < font.height; dy++) {
    for (let dx = 0; dx < charFont.width; dx++) {
      if (charFont.data[dy * charFont.width + dx] == "1")
        setPixel(x + dx, y + dy, color);
    }
  }
}

function drawText(startX, startY, text, hexColor = "#FFFFFFFF", font = fonts.defaultFont, spacing = 1) {
  let x = startX;
  for (const char of text) {
    if (char == '\n') {
      startY += font.height + 1;
      x = startX;
      continue;
    }
    let width;
    if (font.chars[char]) {
      width = font.chars[char].width;
    } else {
      width = font.unknown_char.width;
    }
    drawChar(x, startY, char, hexColor, font);
    x += width + spacing;
  }
}

function getTextWidth(text, font = fonts.defaultFont, spacing = 1) {
  let width = 0;
  for (const char of text) {
    if (char == '\n') {
      break;
    }
    width += spacing;
    if (font.chars[char]) {
      width += font.chars[char].width;
    } else {
      width += font.unknown_char.width;
    }
  }
  return width - 1;
}
