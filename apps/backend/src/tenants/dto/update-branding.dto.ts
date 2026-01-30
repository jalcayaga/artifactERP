import { IsHexColor, IsOptional, IsUrl, IsObject } from 'class-validator'

export class UpdateBrandingDto {
  @IsOptional()
  @IsUrl()
  logoUrl?: string

  @IsOptional()
  @IsUrl()
  secondaryLogoUrl?: string

  @IsOptional()
  @IsHexColor()
  primaryColor?: string

  @IsOptional()
  @IsHexColor()
  secondaryColor?: string

  @IsOptional()
  @IsHexColor()
  accentColor?: string

  @IsOptional()
  @IsObject()
  lightTheme?: Record<string, unknown>

  @IsOptional()
  @IsObject()
  darkTheme?: Record<string, unknown>

  @IsOptional()
  @IsObject()
  homeSections?: unknown

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, unknown>
}
