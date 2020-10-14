export class PlatformUtils {

    static isTest() {
        return !window.hasOwnProperty('cordova');
    }

    static isIos() {
        return window.hasOwnProperty('ios');
    }
}
