export default class API {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  load() {
    return fetch(this.url);
  }

  add(images) {
    // this.url = http://localhost:7075/images
    return fetch(this.url, {
      body: JSON.stringify(images),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  remove(id) {
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    });
  }
}
