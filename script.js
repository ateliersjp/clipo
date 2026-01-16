if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (error) => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

function clearPDF() {
  document.querySelectorAll('#content form input[type="file"]').forEach((target) => {
    target.form.classList.remove('selected');
  });

  document.querySelector('#current-file').textContent = '';
  document.querySelector('#file-counter').textContent = '0';
}

function inputPDF() {
  const { form } = this;
  const i = form.querySelector('i.fa-file-pdf');
  const file = this.files[0];
  if (i && file && file.type === 'application/pdf') {
    form.classList.remove('selected');
    i.classList.remove('fa-file-pdf');
    i.classList.add('fa-spinner', 'fa-spin');

    const fileReader = new FileReader();
    fileReader.onload = function() {
      const pdfData = new Uint8Array(this.result);

      pdfjsLib.getDocument({
        data: pdfData,
        cMapUrl: '/web/cmaps/',
        cMapPacked: true
      }).promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
          const scale = 300 / 72;
          const viewport = page.getViewport({ scale });

          const canvas = form.querySelector('canvas');
          const context = canvas.getContext('2d');
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          page.render({
            canvasContext: context,
            viewport,
          }).promise.then(function() {
            i.classList.remove('fa-spinner', 'fa-spin');
            i.classList.add('fa-file-pdf');
            form.classList.add('selected');
            document.querySelector('#current-file').textContent = file.name;
            document.querySelector('#file-counter').textContent = document.querySelectorAll('form.selected').length;
          });
        });
      }).catch(function() {
        i.classList.remove('fa-spinner', 'fa-spin');
        i.classList.add('fa-file-pdf');
        alert('PDFファイルを選択してください');
      });
    }

    fileReader.readAsArrayBuffer(file);
  } else {
    alert('PDFファイルを選択してください');
  }
}