import { RoleInterface } from "./role.interface";

export interface SignUpInterface {
  userName: string;
  firstName: string;
  lastName: string;
  roleId: RoleInterface;
  emailAddress: string;
}
