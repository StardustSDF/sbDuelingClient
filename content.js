if (window.location.href.startsWith("https://starblast.io")) {
  console.log("Running script on:", window.location.href);

  fetch(browser.runtime.getURL("index.html"))
    .then(response => response.text())
    .then(customHtml => {
      const runtimeGetURL = browser.runtime.getURL;
      const modifiedHtml = customHtml.replace(/readyForUrl/g, runtimeGetURL('scripts'));
      document.open();
      document.write(modifiedHtml);
      document.close();

      applyCustomCursor();
    })
    .catch(error => console.error("Failed to fetch custom HTML:", error));
} else {
  console.log("Script running on an unexpected page:", window.location.href);
}

function applyCustomCursor() {
  const cursorTrailCount = 2;
  const trailElements = [];
  const trailDelay = 5;
  const edgeThreshold = 3;

  window.addEventListener("generatorValueUpdate", (event) => {
    trailElements.forEach((trail) => {
      trail.style.backgroundImage = !event.detail[1]
        ? `url(${browser.runtime.getURL("crosshair.png")})`
        : `url(${browser.runtime.getURL("depletedCrosshair.png")})`;
    });
  });

  for (let i = 0; i < cursorTrailCount; i++) {
    const trail = document.createElement("div");
    trail.style.position = "fixed";
    trail.style.width = "24px";
    trail.style.height = "24px";
    trail.style.backgroundImage = `url(${browser.runtime.getURL("crosshair.png")})`;
    trail.style.backgroundSize = "contain";
    trail.style.pointerEvents = "none";
    trail.style.opacity = "1";
    trail.style.transform = "translate(-50%, -50%)";
    trail.style.zIndex = "69420";
    document.body.appendChild(trail);
    trailElements.push(trail);
  }

  let mouseX = 0,
    mouseY = 0;
  let trailPositions = Array(cursorTrailCount).fill({ x: 0, y: 0 });

  function updateCursorTrail() {
    trailPositions = [{ x: mouseX, y: mouseY }, ...trailPositions.slice(0, cursorTrailCount - 1)];

    trailElements.forEach((trail, index) => {
      setTimeout(() => {
        trail.style.left = `${trailPositions[index].x}px`;
        trail.style.top = `${trailPositions[index].y}px`;
      }, index * trailDelay);
    });

    requestAnimationFrame(updateCursorTrail);
  }

  updateCursorTrail();

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const style = document.createElement("style");
  style.innerHTML = `
      * {
          cursor: none !important;
      }
      .sbg-crosshair {
          visibility: none !important;
      }
  `;
  document.head.appendChild(style);
}
