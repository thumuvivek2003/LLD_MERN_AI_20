export class Book {
  constructor(data) {
    this._id = data._id;
    this.title = data.title;
    this.author = data.author;
    this.isbn = data.isbn;
    this.totalCopies = data.totalCopies;
    this.availableCopies = data.availableCopies;
  }

  increaseCopies() {
    this.availableCopies += 1;
  }

  decreaseCopies() {
    if (this.availableCopies <= 0) throw new Error('No copies available');
    this.availableCopies -= 1;
  }

  isAvailable() {
    return this.availableCopies > 0;
  }
}
