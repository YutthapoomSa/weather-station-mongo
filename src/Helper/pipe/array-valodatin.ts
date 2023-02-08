import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class IsDataArray implements ValidatorConstraintInterface {
    public async validate(authData: any[], args: ValidationArguments) {
        return Array.isArray(authData) && authData.reduce((a, b) => a && typeof b.id === 'number', true);
    }
}
