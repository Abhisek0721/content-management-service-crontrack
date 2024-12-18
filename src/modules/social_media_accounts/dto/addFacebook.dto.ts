import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddFacebookPageDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  pageId: string;

  @IsNotEmpty()
  @IsString()
  pageName: string;

  @IsNotEmpty()
  @IsString()
  pageCategory: string;

  @IsOptional()
  @IsString()
  profilePicture: string;
}
