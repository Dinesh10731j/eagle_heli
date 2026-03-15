import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function CountryCodeValidation(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "countryCodeValidation",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {}, 
      validator: {
        validate(value: string) {
          if (!value || typeof value !== "string") return false;

          const regex = /^\+[1-9]\d{7,14}$/; // E.164 format
          return regex.test(value);
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid international phone number (e.g., +9779812345678, +12025550123).`;
        },
      },
    });
  };
}