import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsRutConstraint implements ValidatorConstraintInterface {
  validate(rut: any, args: ValidationArguments) {
    if (typeof rut !== 'string') {
      return false;
    }

    rut = rut.replace(/\./g, '').replace(/-/g, '');

    if (rut.length < 2) {
      return false;
    }

    const body = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      const digit = parseInt(body[i], 10);
      if (isNaN(digit)) {
        return false;
      }
      sum += digit * multiplier;
      multiplier++;
      if (multiplier > 7) {
        multiplier = 2;
      }
    }

    const calculatedDv = 11 - (sum % 11);
    let expectedDv = '';

    if (calculatedDv === 11) {
      expectedDv = '0';
    } else if (calculatedDv === 10) {
      expectedDv = 'K';
    } else {
      expectedDv = calculatedDv.toString();
    }

    return expectedDv === dv;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El RUT ($value) no es válido';
  }
}

export function IsRut(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRutConstraint,
    });
  };
}
