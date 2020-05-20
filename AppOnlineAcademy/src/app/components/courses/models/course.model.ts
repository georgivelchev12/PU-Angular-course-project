export class CourseModel {
    constructor(
      public title: string,
      public author: string,
      public description: string,
      public categories: Array<string>,
      public imgUrl: string,
      public likes: Array<string>,
      public rating: Array<Object>,
      public date: string
    ) {}
  }
  