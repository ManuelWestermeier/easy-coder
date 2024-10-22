export default function getIframeUrl(
  htmlBody: string,
  js: string,
  css: string
) {
  const jsBlob = new Blob([js], { type: "text/javascript" });
  const jsFileSrc = URL.createObjectURL(jsBlob);

  const cssBlob = new Blob([css], { type: "text/css" });
  const cssFileSrc = URL.createObjectURL(cssBlob);

  const outputPage = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="${cssFileSrc}">
        <script src="${jsFileSrc}" defer></script>
        </head>
      <body>
        ${htmlBody}
      </body>
    </html>`;

  const pageBlob = new Blob([outputPage], { type: "text/html" });

  console.clear();
  return URL.createObjectURL(pageBlob);
}
