// src/lib/planParser.js
export async function extractPlanText(pdfFile) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const pdfjsLib = await import("pdfjs-dist/build/pdf");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        const textContent = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          const pageText = text.items.map((item) => item.str).join(" ");
          textContent.push({ page: i, text: pageText });
        }

        resolve(textContent);
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsArrayBuffer(pdfFile);
  });
}
