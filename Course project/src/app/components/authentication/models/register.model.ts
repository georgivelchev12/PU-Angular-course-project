export class RegisterModel {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public date: string
  ) {}
}
