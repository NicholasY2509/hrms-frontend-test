export interface PassportClient {
  id: number;
  name: string;
  secret: string;
  redirect: string;
}

export interface PassportRole {
  id: number;
  client_id: number;
  name: string;
}

export interface PassportRolePayload {
  roles: PassportRole[];
}
