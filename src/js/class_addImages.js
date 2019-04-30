/* eslint-disable no-loop-func */
import API from './api';

export default class AddImages {
  constructor() {
    this.fileEl = document.querySelector('[data-id=file]'); // input file
    this.form = document.querySelector('[data-id=upload-form]');
    this.overlapEl = document.querySelector('[data-id=overlap]');
    this.dropEl = document.querySelector('[data-id=drop-area]');
    this.imagesContainer = document.querySelector('[data-holder=imagesContainer]');
  }

  create() {
    this.loadTasks();

    this.addListeners();
    this.addDnDListenters();
    this.addCrossListenter();
  }

  addImgs(files) {
    this.idCount = 0;
    this.imagesContainer = document.querySelector('[data-holder=imagesContainer]');
    this.fileEl = document.querySelector('[data-id=file]');

    for (let i = 0; i < files.length; i += 1) {
      const imgEl = document.createElement('div');
      imgEl.className = 'imgHolder';
      imgEl.id = this.idCount;

      const previewEl = document.createElement('img');
      previewEl.src = URL.createObjectURL(files[i]);
      previewEl.className = 'img';
      imgEl.innerHTML = '<div data-btn="delete" class="deleteBtn"></div>';


      const formData = new FormData(this.form);
      const xhr = new XMLHttpRequest();


      xhr.open('POST', 'https://seven-three.herokuapp.com');
      // TODO: subscribe to response

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          URL.revokeObjectURL(`https://seven-three.herokuapp.com${xhr.response}`);

          this.idCount += 1;

          this.imagesContainer.appendChild(imgEl);
          imgEl.appendChild(previewEl);

          this.fileEl.value = '';
        }
      });

      xhr.send(formData);
    }
  }

  addListeners() {
    // события для запуска окна выбора файлов
    this.overlapEl.addEventListener('click', () => {
      this.fileEl.dispatchEvent(new MouseEvent('click'));
    });

    this.fileEl.addEventListener('change', (evt) => {
      const filesArr = Array.from(evt.currentTarget.files);
      this.addImgs(filesArr);
    });
  }

  // события для drag and drop
  addDnDListenters() {
    this.dropEl.addEventListener('dragover', (evt) => {
      evt.preventDefault();
    });

    this.dropEl.addEventListener('drop', (evt) => {
      evt.preventDefault();
      const filesArr = Array.from(evt.dataTransfer.files);
      this.addImgs(filesArr);
    });
  }

  // событие на крестик для удаления
  addCrossListenter() {
    const api = new API('https://seven-three.herokuapp.com/imagesArr');

    async function a(idEl) {
      // eslint-disable-next-line no-unused-vars
      const images = await api.remove(idEl);
    }

    this.imagesContainer.addEventListener('click', (event) => {
      if (event.toElement.className === 'deleteBtn') {
        const img = document.getElementById(event.toElement.parentElement.id);
        console.log(img.id);
        a(img.id);
        img.remove();
      }
    });
  }


  // eslint-disable-next-line class-methods-use-this
  loadTasks() {
    console.log('Загружаю с сервера данные...');
    const api = new API('https://seven-three.herokuapp.com/imagesArr');

    async function a(imagesContainer) {
      const images = await api.load();
      const data = await images.json();
      // console.log(data);
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].name !== '.gitkeep') {
          const imgEl = document.createElement('div');
          imgEl.className = 'imgHolder';
          imgEl.id = data[i].name;

          const previewEl = document.createElement('img');
          previewEl.src = `https://seven-three.herokuapp.com/${data[i].name}`;
          previewEl.className = 'img';
          imgEl.innerHTML = '<div data-btn="delete" class="deleteBtn"></div>';

          imagesContainer.appendChild(imgEl);
          imgEl.appendChild(previewEl);
        }
      }
    }

    a(this.imagesContainer);
  }
}
