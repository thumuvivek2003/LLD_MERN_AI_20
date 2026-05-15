export class PriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    this.items = [];
    this.comparator = comparator;
  }

  enqueue(item) {
    this.items.push(item);
    this.items.sort(this.comparator);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  contains(predicate) {
    return this.items.some(predicate);
  }

  remove(predicate) {
    this.items = this.items.filter((it) => !predicate(it));
  }

  size() {
    return this.items.length;
  }

  toArray() {
    return [...this.items];
  }

  clear() {
    this.items = [];
  }
}
