import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse.js';
import {Errors} from '@fusionauth/typescript-client';
import chalk from 'chalk';

/**
 * Checks if the response is a client response
 * @param response
 */
export const isClientResponse = (response: any): response is ClientResponse.default<any> => {
    return response.wasSuccessful !== undefined;
}

/**
 * Checks if the response is an error response
 * @param response
 */
export const isErrors = (response: any): response is Errors => {
    return response.fieldErrors !== undefined || response.generalErrors !== undefined;
}

/**
 * Reports an error to the console
 * @param msg   The message to report
 * @param error The error to report
 */
export const reportError = (msg: string, error?: any): void => {
    console.error(chalk.red(msg));
    if (!error) {
        return;
    }

    if (isClientResponse(error) && error.exception) {
        error = error.exception;
    }
    if (isErrors(error)) {
        const {fieldErrors, generalErrors} = error;

        if (fieldErrors) {
            Object.entries(fieldErrors)
                .forEach(([field, fieldError]) => {
                    console.error(chalk.red(chalk.underline(field) + ': ' + fieldError
                        .map((fieldError) => fieldError.message)
                        .join(', ')));
                });
        }

        if (generalErrors) {
            generalErrors.forEach((generalError) => {
                console.error(chalk.red(generalError.message));
            });
        }

        return;
    }

    if (typeof error === 'string') {
        console.error(chalk.red(error));
        return;
    }

    if ('message' in error) {
        console.error(chalk.red(error.message));
        return;
    }

    console.error(chalk.red(toJson(error)));
}

/**
 * Gets the locale from a path
 * @param path
 */
export const getLocaleFromLocalizedMessageFileName = (path: string): string | undefined => {
    const matches = path.match(/localizedMessages\.([a-z]{2}(?:_[A-Z]{2})?)\.txt/);
    if (!matches) return;
    return matches[1];
}

/**
 * Returns the error message for a given email template id
 * @param action
 * @param emailTemplateId
 */
export const getEmailErrorMessage = (action: string, emailTemplateId: string | undefined) => {
    let templateIdMessage = 'templates';
    if (emailTemplateId) {
        templateIdMessage = `template ${emailTemplateId}`
    }
    return `Error ${action} email ${templateIdMessage}`
}

/**
 * Returns the success message for a given email template id
 * @param emailTemplateId
 * @param output
 */
export const getEmailSuccessMessage = (emailTemplateId: string | undefined, output: string) => {
    let templateIdMessage = 'templates';
    if (emailTemplateId) {
        templateIdMessage = `template ${emailTemplateId}`
    }
    return `Successfully downloaded email ${templateIdMessage} to ${output}`;
}

/**
 * Returns the error message for a given message template id
 * @param action
 * @param messageTemplateId
 */
export const getMessageErrorMessage = (action: string, messageTemplateId: string | undefined) => {
    let templateIdMessage = 'templates';
    if (messageTemplateId) {
        templateIdMessage = `template ${messageTemplateId}`
    }
    return `Error ${action} message ${templateIdMessage}`
}

/**
 * Returns the success message for a given message template id
 * @param messageTemplateId
 * @param output
 */
export const getMessageSuccessMessage = (messageTemplateId: string | undefined, output: string) => {
    let templateIdMessage = 'templates';
    if (messageTemplateId) {
        templateIdMessage = `template ${messageTemplateId}`
    }
    return `Successfully downloaded message ${templateIdMessage} to ${output}`;
}

/**
 * Returns the given item if it is not undefined, otherwise returns an empty string
 */
export function toString(item: string | undefined): string {
    return item ?? '';
}

/**
 * Returns the given object as a JSON string
 * @param item The item to convert to JSON
 */
export function toJson(item: unknown): string {
    return JSON.stringify(item ?? {}, null, 4)
}

/**
 * Reports an error and exits the process
 * @param message
 * @param error
 */
export function errorAndExit(message: string, error?: any) {
    reportError(message, error);
    process.exit(1);
}
