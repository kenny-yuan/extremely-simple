const EDGE     =  [ 0, -4,  0,
                   -4, 16, -4,
                    0, -4,  0 ];

const EDGE_H   =  [ 1,  2,  1,
                    0,  0,  0,
                   -1, -2, -1 ];

const EDGE_V   =  [ 1,  0, -1,
                    2,  0, -2,
                    1,  0, -1 ];

function getIndex(x, y, strider) {
  return (y * strider + x) * 4;
}

function copyPixel(src, target, x, y, strider) {
  const i = getIndex(x, y, strider);
  target[i + 0] = src[i + 0];
  target[i + 1] = src[i + 1];
  target[i + 2] = src[i + 2];
  target[i + 3] = src[i + 3];
}

function calcPixel(src, target, x, y, width, height, kernel) {
  const strider = width; // Assumimg 128, 256, 512...
  const k = kernel;

  function s(dx, dy) {
    return src[getIndex(x + dx, y + dy, strider)];
  }

  let v = k[0]*s(-1, -1) + k[1]*s( 0, -1) + k[2]*s(1, -1)
        + k[3]*s(-1,  0) + k[4]*s( 0,  0) + k[5]*s(1,  0)
        + k[6]*s(-1,  1) + k[7]*s( 0,  1) + k[8]*s(1,  1);

  const i = getIndex(x, y, strider);
  target[i + 0] = v;
  target[i + 1] = v;
  target[i + 2] = v;
  target[i + 3] = 255;
}

function convolution(src, target, width, height, kernel) {
  for (let y = 1; y < height - 1; ++ y) {
    for (let x = 1; x < width - 1; ++ x) {
      // copyPixel(src, target, x, y, width);
      calcPixel(src, target, x, y, width, height, kernel);
    }
  }
}

function drawResult(id, data, width, height) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.putImageData(new ImageData(data, width, height), 0, 0);
}

function main() {
  // Prepare image
  const preview = document.getElementById('preview');

  // Draw original image
  const canvas = document.getElementById('src');
  const ctx = canvas.getContext('2d');
  ctx.drawImage(preview, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, 512, 512);
  const rawData = imageData.data;

  // Process image #1
  let edgeData = new Uint8ClampedArray(rawData.length);
  convolution(rawData, edgeData, 512, 512, EDGE);
  // Display the processed-image
  drawResult('edge', edgeData, 512, 512);

  // Process image #2
  let edgeHData = new Uint8ClampedArray(rawData.length);
  convolution(rawData, edgeHData, 512, 512, EDGE_H);
  drawResult('edge_h', edgeHData, 512, 512);

  // Process image #3
  let edgeVData = new Uint8ClampedArray(rawData.length);
  convolution(rawData, edgeVData, 512, 512, EDGE_V);
  drawResult('edge_v', edgeVData, 512, 512);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(main, 100);
});
