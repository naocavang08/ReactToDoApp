export class ToDoDto {
  constructor(id = 0, name = '', isComplete = false) {
    this.id = id;
    this.name = name;
    this.isComplete = isComplete;
  }

  static fromJson(json) {
    return new ToDoDto(json.id, json.name, json.isComplete);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      isComplete: this.isComplete
    };
  }
}