//--- Text rendering ---//
function drawChar(x, y, char, color = "#FFFFFFFF", font = defaultFont) {
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

  for (let dy = 0; dy < font.height; dy++) {
    for (let dx = 0; dx < charFont.width; dx++) {
      if (charFont.data[dy * charFont.width + dx] == "1")
        setPixel(x + dx, y + dy, color);
    }
  }
}

function drawText(startX, startY, text, color = "#FFFFFFFF", font = defaultFont, spacing = 1) {
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
    drawChar(x, startY, char, color, font);
    x += width + spacing;
  }
}
