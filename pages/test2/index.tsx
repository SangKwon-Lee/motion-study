import { useEffect } from "react";

export default function Test2() {
  useEffect(() => {
    window.requestAnimationFrame = (function () {
      return (
        window.requestAnimationFrame ||
        function (a) {
          window.setTimeout(a, 1e3 / 60);
        }
      );
    })();

    document.onselectstart = function () {
      return false;
    };
    var c = document.getElementById("c") as HTMLCanvasElement;
    var ctx = c.getContext("2d") as CanvasRenderingContext2D;
    var dpr = window.devicePixelRatio;
    var cw = window.innerWidth;
    var ch = window.innerHeight;
    c.width = cw * dpr;
    c.height = ch * dpr;
    ctx.scale(dpr, dpr);
    var rand = function (rMi: any, rMa: any) {
      return ~~(Math.random() * (rMa - rMi + 1) + rMi);
    };
    ctx.lineCap = "round";
    var orbs: any = [];
    var orbCount = 30;
    var radius;

    function createOrb(mx: any, my: any) {
      var dx = cw / 2 - mx;
      var dy = ch / 2 - my;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var angle = Math.atan2(dy, dx);
      orbs.push({
        x: mx,
        y: my,
        lastX: mx,
        lastY: my,
        hue: 0,
        colorAngle: 0,
        angle: angle + Math.PI / 2,
        //size: .5+dist/250,
        // size: rand(1, 3),
        centerX: cw / 2,
        centerY: ch / 2,
        radius: dist,
        speed: (rand(5, 10) / 1000) * (dist / 750) + 0.035,
        alpha: 1 - Math.abs(dist) / cw,
        draw: function () {
          ctx.strokeStyle = "hsla(" + this.colorAngle + ",100%,50%,1)";
          ctx.lineWidth = this.size;
          ctx.beginPath();
          ctx.moveTo(this.lastX, this.lastY);
          ctx.lineTo(this.x, this.y);
          ctx.stroke();
        },
        update: function () {
          var mx = this.x;
          var my = this.y;
          this.lastX = this.x;
          this.lastY = this.y;
          var x1 = cw / 2;
          var y1 = ch / 2;
          var x2 = mx;
          var y2 = my;
          var rise = y1 - y2;
          var run = x1 - x2;
          var slope = -(rise / run);
          var radian = Math.atan(slope);
          var angleH = Math.floor(radian * (180 / Math.PI));
          if (x2 < x1 && y2 < y1) {
            angleH += 180;
          }
          if (x2 < x1 && y2 > y1) {
            angleH += 180;
          }
          if (x2 > x1 && y2 > y1) {
            angleH += 360;
          }
          //@ts-ignore
          if (y2 < y1 && slope == "-Infinity") {
            angleH = 90;
          }
          //@ts-ignore
          if (y2 > y1 && slope == "Infinity") {
            angleH = 270;
          }
          //@ts-ignore
          if (x2 < x1 && slope == "0") {
            angleH = 180;
          }
          if (isNaN(angleH)) {
            angleH = 0;
          }

          this.colorAngle = angleH;
          this.x = this.centerX + Math.sin(this.angle * -1) * this.radius;
          this.y = this.centerY + Math.cos(this.angle * -1) * this.radius;
          this.angle += this.speed + 0.005;
        },
      });
    }

    function orbGo(e) {
      var mx = e.pageX - c.offsetLeft;
      var my = e.pageY - c.offsetTop;
      createOrb(mx, my);
    }

    function turnOnMove() {
      c.addEventListener("mousemove", orbGo, false);
    }

    function turnOffMove() {
      c.removeEventListener("mousemove", orbGo, false);
    }

    function clear() {
      orbs = [];
    }

    c.addEventListener("mousedown", orbGo, false);
    c.addEventListener("mousedown", turnOnMove, false);
    c.addEventListener("mouseup", turnOffMove, false);

    var count = 5;
    while (count--) {
      createOrb(cw / 2, ch / 2 + count * 100);
    }

    var loop = function () {
      window.requestAnimationFrame(loop);
      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, cw, ch);
      // ctx.clearRect(0, 0, cw, ch);
      var i = orbs.length;
      while (i--) {
        var orb = orbs[i];
        var updateCount = 3;
        while (updateCount--) {
          orb.update();
          orb.draw(ctx);
        }
      }
    };

    loop();
  }, []);

  return (
    <canvas
      id="c"
      style={{ height: "100vh", width: "100%", background: "#000" }}
    ></canvas>
  );
}
