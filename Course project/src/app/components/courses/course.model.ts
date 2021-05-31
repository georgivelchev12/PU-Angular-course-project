export class CourseModel {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public description: string,
    public imgFile: string,
    public date: string,
    public likes: Array<string>,
    public rating: Array<{ email: string; rate: number }>,
    public categories: Array<string>
  ) {}
}
