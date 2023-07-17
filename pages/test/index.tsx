import { useEffect } from "react";
export default function Test() {
  useEffect(() => {
    var c = document.getElementById("canvas") as HTMLCanvasElement;
    var ctx = c.getContext("2d") as CanvasRenderingContext2D;
    function resize() {
      //* canvas의 크기를 화면의 크기와 동일하게 맞추기
      var box = c.getBoundingClientRect();
      c.width = box.width;
      c.height = box.height;
    }

    var light = {
      x: 160,
      y: 300,
    };

    //* 박스 색
    var colors = ["#f5c156", "#e6616b", "#5cd3ad", "#ff71f6"];

    function drawLight() {
      ctx.beginPath();
      ctx.arc(light.x, light.y, 10000, 0, 2 * Math.PI);
      var gradient = ctx.createRadialGradient(
        light.x,
        light.y,
        0,
        light.x,
        light.y,
        1000
      );
      gradient.addColorStop(0, "#3b4654");
      gradient.addColorStop(1, "#2c343f");
      ctx.fillStyle = gradient;
      ctx.fill();

      //* 커서
      ctx.beginPath();
      ctx.arc(light.x, light.y, 20, 0, 2 * Math.PI);
      gradient = ctx.createRadialGradient(
        light.x,
        light.y,
        0,
        light.x,
        light.y,
        5
      );
      gradient.addColorStop(0, "#fff");
      gradient.addColorStop(1, "#3b4654");
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    function Box(this: any) {
      this.half_size = Math.floor(Math.random() * 45 + 1);
      this.x = Math.floor(Math.random() * c.width + 1);
      this.y = Math.floor(Math.random() * c.height + 1);
      this.r = Math.random() * Math.PI;
      this.shadow_length = 20000;
      this.color = colors[Math.floor(Math.random() * colors.length)];

      this.getDots = function () {
        var full = (Math.PI * 2) / 4;

        var p1 = {
          x: this.x + this.half_size * Math.sin(this.r),
          y: this.y + this.half_size * Math.cos(this.r),
        };
        var p2 = {
          x: this.x + this.half_size * Math.sin(this.r + full),
          y: this.y + this.half_size * Math.cos(this.r + full),
        };
        var p3 = {
          x: this.x + this.half_size * Math.sin(this.r + full * 2),
          y: this.y + this.half_size * Math.cos(this.r + full * 2),
        };
        var p4 = {
          x: this.x + this.half_size * Math.sin(this.r + full * 3),
          y: this.y + this.half_size * Math.cos(this.r + full * 3),
        };

        return {
          p1: p1,
          p2: p2,
          p3: p3,
          p4: p4,
        };
      };
      //* 이동하는 위치 수정
      this.rotate = function () {
        var speed = (60 - this.half_size) / 20;
        this.r += speed * 0.002;
        this.x += speed;
        this.y += speed;
      };
      this.draw = function () {
        var dots = this.getDots();
        ctx.beginPath();
        ctx.moveTo(dots.p1.x, dots.p1.y);
        ctx.lineTo(dots.p2.x, dots.p2.y);
        ctx.lineTo(dots.p3.x, dots.p3.y);
        ctx.lineTo(dots.p4.x, dots.p4.y);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.y - this.half_size > c.height) {
          this.y -= c.height + 100;
        }
        if (this.x - this.half_size > c.width) {
          this.x -= c.width + 100;
        }
      };
      this.drawShadow = function () {
        var dots = this.getDots();
        var angles = [];
        var points: string | any[] = [];

        for (const dot in dots) {
          var angle = Math.atan2(light.y - dots[dot].y, light.x - dots[dot].x);
          var endX =
            dots[dot].x + this.shadow_length * Math.sin(-angle - Math.PI / 2);
          var endY =
            dots[dot].y + this.shadow_length * Math.cos(-angle - Math.PI / 2);
          angles.push(angle);
          points.push({
            endX: endX,
            endY: endY,
            startX: dots[dot].x,
            startY: dots[dot].y,
          });
        }

        for (var i = points.length - 1; i >= 0; i--) {
          var n = i == 3 ? 0 : i + 1;
          ctx.beginPath();
          ctx.moveTo(points[i].startX, points[i].startY);
          ctx.lineTo(points[n].startX, points[n].startY);
          ctx.lineTo(points[n].endX, points[n].endY);
          ctx.lineTo(points[i].endX, points[i].endY);
          ctx.fillStyle = "#2c343f";
          ctx.fill();
        }
      };
    }

    var boxes: any[] = [];
    function draw() {
      drawLight();

      for (var i = 0; i < boxes.length; i++) {
        boxes[i].rotate();
        boxes[i].drawShadow();
      }
      for (var i = 0; i < boxes.length; i++) {
        // collisionDetection(i);
        boxes[i].draw();
      }
      requestAnimationFrame(draw);
    }

    resize();
    draw();

    while (boxes.length < 50) {
      //@ts-ignore
      boxes.push(new Box());
    }

    window.onresize = resize;
    c.onmousemove = function (e) {
      //@ts-ignore
      light.x = e.offsetX == undefined ? e.layerX : e.offsetX;
      //@ts-ignore
      light.y = e.offsetY == undefined ? e.layerY : e.offsetY;

      for (var i = 0; i < boxes.length; i++) {
        collisionDetection(i, e);
      }
    };
    //* 커서 위치 감지하여 사이즈 줄이기
    function collisionDetection(b: number, e: any) {
      for (var i = boxes.length - 1; i >= 0; i--) {
        if (i != b) {
          var dx =
            boxes[b].x + boxes[b].half_size - (boxes[i].x + boxes[i].half_size);
          var dy =
            boxes[b].y + boxes[b].half_size - (boxes[i].y + boxes[i].half_size);
          var d = Math.sqrt(dx * dx + dy * dy);
          if (
            e.offsetX >= boxes[b].x - 30 &&
            e.offsetX <= boxes[b].x + 30 &&
            e.offsetY >= boxes[b].y - 30 &&
            e.offsetY <= boxes[b].y + 30
          ) {
            boxes[b].half_size =
              boxes[b].half_size > 0 ? boxes[b].half_size - 0.1 : 1;
          }
        }
      }
    }
    // function collisionDetection2(b) {
    //   for (var i = boxes.length - 1; i >= 0; i--) {
    //     if (i != b) {
    //       var dx =
    //         boxes[b].x + boxes[b].half_size - (boxes[i].x + boxes[i].half_size);
    //       var dy =
    //         boxes[b].y + boxes[b].half_size - (boxes[i].y + boxes[i].half_size);
    //       var d = Math.sqrt(dx * dx + dy * dy);
    //       if (d < boxes[b].half_size + boxes[i].half_size) {
    //         boxes[b].half_size =
    //           boxes[b].half_size > 1 ? (boxes[b].half_size -= 1) : 1;
    //         boxes[i].half_size =
    //           boxes[i].half_size > 1 ? (boxes[i].half_size -= 1) : 1;
    //       }
    //     }
    //   }
    // }
  }, []);
  return (
    <>
      {" "}
      <canvas
        style={{ backgroundColor: "#2c343f", width: "100%", height: "100vh" }}
        id="canvas"
      ></canvas>
      {/* <div style={{ display: "none" }}> */}
      <img
        id="source"
        src="/1.png"
        width="300"
        height="227"
        style={{ zIndex: 100 }}
      />
      {/* </div> */}
    </>
  );
}
