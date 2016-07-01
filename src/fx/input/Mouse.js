Primrose.Input.Mouse = (function () {
  "use strict";

  const EULER = new THREE.Euler();

  pliny.class({
    parent: "Primrose.Input",
      name: "Mouse",
      baseClass: "Primrose.InputProcessor",
      description: "| [under construction]"
  });
  class Mouse extends Primrose.InputProcessor {
    constructor(DOMElement, parent, commands, socket) {
      super("Mouse", parent, commands, socket);

      DOMElement = DOMElement || window;

      DOMElement.addEventListener("mousedown", (event) => {
        this.setButton(event.button, true);
        this.BUTTONS = event.buttons << 10;
        this.update();
      }, false);

      DOMElement.addEventListener("mouseup", (event) => {
        this.setButton(event.button, false);
        this.BUTTONS = event.buttons << 10;
        this.update();
      }, false);

      DOMElement.addEventListener("mousemove", (event) => {
        this.BUTTONS = event.buttons << 10;
        if (Mouse.Lock.isActive) {
          var mx = event.movementX,
            my = event.movementY;

          if (mx === undefined) {
            mx = event.webkitMovementX || event.mozMovementX || 0;
            my = event.webkitMovementY || event.mozMovementY || 0;
          }
          this.setMovement(mx, my);
        }
        else {
          this.setLocation(event.layerX, event.layerY);
        }
        this.update();
      }, false);

      DOMElement.addEventListener("wheel", (event) => {
        if (isChrome) {
          this.W += event.deltaX;
          this.Z += event.deltaY;
        }
        else if (event.shiftKey) {
          this.W += event.deltaY;
        }
        else {
          this.Z += event.deltaY;
        }
        event.preventDefault();
        this.update();
      }, false);
    }

    updatePosition() {}

    updateVelocity() {
      var head = this,
        x = 0,
        z = 0;
      while (head) {
        x += head.getValue("strafe");
        z += head.getValue("drive");
        head = head.parent;
      }

      this.velocity.x = x;
      this.velocity.z = z;
    }

    updateOrientation(excludePitch) {
      var p = 0,
        h = 0;
      var head = this;
      while (head) {
        p += head.getValue("pitch");
        h += head.getValue("heading");
        head = head.parent;
      }
      EULER.set(
        excludePitch || this.inVR ? 0 : p,
        h,
        0,
        "YXZ"
      );
      this.quaternion.setFromEuler(EULER);
    }

    setLocation(x, y) {
      this.X = x;
      this.Y = y;
    }

    setMovement(dx, dy) {
      this.X += dx;
      this.Y += dy;
    }
  }


  var elementName = findProperty(document, ["pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"]),
    changeEventName = findProperty(document, ["onpointerlockchange", "onmozpointerlockchange", "onwebkitpointerlockchange"]),
    errorEventName = findProperty(document, ["onpointerlockerror", "onmozpointerlockerror", "onwebkitpointerlockerror"]),
    requestMethodName = findProperty(document.documentElement, ["requestPointerLock", "mozRequestPointerLock", "webkitRequestPointerLock", "webkitRequestPointerLock"]),
    exitMethodName = findProperty(document, ["exitPointerLock", "mozExitPointerLock", "webkitExitPointerLock", "webkitExitPointerLock"]),
    changeTimeout = null;

  changeEventName = changeEventName && changeEventName.substring(2);
  errorEventName = errorEventName && errorEventName.substring(2);

  Mouse.Lock = {
    addChangeListener: (thunk, bubbles) => document.addEventListener(changeEventName, thunk, bubbles),
    removeChangeListener: (thunk) => document.removeEventListener(changeEventName, thunk),
    addErrorListener: (thunk, bubbles) => document.addEventListener(errorEventName, thunk, bubbles),
    removeErrorListener: (thunk) => document.removeEventListener(errorEventName, thunk),
    withChange: (act) => {
      return new Promise((resolve, reject) => {
        var onPointerLock,
          onPointerLockError,
          stop = () => {
            if (changeTimeout !== null) {
              clearTimeout(changeTimeout);
              changeTimeout = null;
            }
          },
          tearDown = () => {
            stop();
            Mouse.Lock.removeChangeListener(onPointerLock);
            Mouse.Lock.removeErrorListener(onPointerLockError);
          };

        onPointerLock = () => {
          setTimeout(tearDown);
          resolve(Mouse.Lock.element);
        };

        onPointerLockError = (evt) => {
          setTimeout(tearDown);
          reject(evt);
        };

        Mouse.Lock.addChangeListener(onPointerLock, false);
        Mouse.Lock.addErrorListener(onPointerLockError, false);

        if (act()) {
          tearDown();
          resolve();
        }
        else {
          // Timeout wating on the pointer lock to happen, for systems like iOS that
          // don't properly support it, even though they say they do.
          stop();
          changeTimeout = setTimeout(() => {
            tearDown();
            reject("Pointer Lock state did not change in allotted time");
          }, 1000);
        }
      });
    },
    request: (elem) => {
      return Mouse.Lock.withChange(() => {
        if (!requestMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        }
        else if (Mouse.Lock.isActive) {
          return true;
        }
        else {
          elem[requestMethodName]();
        }
      });
    },
    exit: () => {
      return Mouse.Lock.withChange(() => {
        if (!exitMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        }
        else if (!Mouse.Lock.isActive) {
          return true;
        }
        else {
          document[exitMethodName]();
        }
      });
    }
  };

  Object.defineProperties(Mouse.Lock, {
    element: {
      get: () => document[elementName]
    },
    isActive: {
      get: () => !!Mouse.Lock.element
    }
  });


  Primrose.InputProcessor.defineAxisProperties(Mouse, ["X", "Y", "Z", "W", "BUTTONS"]);

  return Mouse;
})();