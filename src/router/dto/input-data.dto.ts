import { IsObject, ValidateNested, IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lon: number;
}

export class InputdataDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  startLocation: LocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  goalLocation: LocationDto;
}