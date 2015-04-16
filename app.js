(function() {

  // init stats.js
  var stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);

  var appEl = document.getElementById('app');

  console.log("App loaded");

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var width = 200;
  var height = (width * 9 / 16) | 0;

  appEl.appendChild(canvas);

  canvas.width = width;
  canvas.height = height;

  canvas.style.width = '100%';

  ctx.strokeStyle = '#000';
  ctx.fillStyle= "#bada55";

  //ctx.rect(1, 1, width, height);
  ctx.fillRect(0, 0, width, height);

  var imgData = ctx.getImageData(0, 0, width, height);

  var pixels = new Uint32Array(imgData.data.buffer);

  console.log(imgData.data.length / pixels.length);

  var board = [];

  var resetCounter = 0;
  var resetLimit = 6;
  function reset() {
    var r = Math.random();
    var type = (resetCounter++) % resetLimit;
    console.log("type: %s", type);
    for (var i = 0; i < width; i++) {
      board[i] = [];
      for (var j = 0; j < height; j++) {
        var p = .5;
        switch (type) {
          case 0:
            p = (width - i) / width + (height - j * 1) / height;
            p *= Math.random();
            break;
          case 1:
            p = (width - i) / width + (height - j * 1) / height;
            p *= ((ticks % 100)) / 100;
            break;
          case 2:
            p = (width - i) / width * 2 + (height - j * 1) / (height * 2);
            break;
          case 3:
            p = (width - i) / width;
            p *= 0.2;
            break;
          case 4:
            p = (height - i) / width;
            break;
          case 5:
            p = (height - j) / height;
            break;
          case 6:
            p = (height - (i + j)) / height;
            break;
        }
        p = Math.abs(p);
        board[i][j] = Math.random() < p ? true : false;
      }
    }
  };
  reset();

  //console.log(board);

  for (var i = 0; i < pixels.length; i++) {
    pixels[i] = 0xFF55BADA * Math.random();
  };

  ctx.putImageData(imgData, 0, 0);

  function render() {
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        var cell = board[i][j];
        var dp = i + j * width; // destination pointer
        pixels[dp] = cell ? 0xFF000000 : 0xFF55BADA;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  render();

  // step forward in game of life
  function step() {
    var boardCopy = [];
    for (var i = 0; i < width; i++) {
      boardCopy[i] = [];
      for (var j = 0; j < height; j++) {
        boardCopy[i][j] = board[i][j];
      }
    }

    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        var cell = boardCopy[i][j];
        var neighbours = 0;
        for (var x = -1; x <= 1; x++) {
          for (var y = -1; y <= 1; y++) {
            if (x == 0 && y == 0) // skip self
              continue;
            var xx = (i + x);
            var yy = (j + y);
            // wrap sides
            if (xx < 0) xx += width;
            if (yy < 0) yy += height;
            if (xx >= width) xx -= width;
            if (yy >= height) yy -= height;
            if (boardCopy[xx][yy])
              neighbours++;
          }
        }

        var lives = true;
        if (true) { // is alive
          if (neighbours < 2 || neighbours > 3) {
            lives = false;
          }
        }
        if (!cell) {
          if (neighbours == 3)
            lives = true;
          else
            lives = false;
        }
        board[i][j] = lives;
      }
    };
  };

  var ticks = 0;
  var limit = 150;
  var fps = 30;
  var msPerFrame = 1000 / fps;
  function update() {
    stats.begin();
    ticks++;
    if (ticks % limit == 0)
      reset();

    step();
    render();
    stats.end();
    setTimeout(update, msPerFrame);
  };
  update();


})();





