module.exports = class CommandlineArgumentExtractor {

    constructor(argv) {
        this._argv = argv;
    }

    _get(key, isFlag) {
        let option = this._argv.find(arg => arg.startsWith(key + '='));
        let index = this._argv.findIndex(arg => arg === key);

        if(isFlag) {
            return index > -1 || option !== undefined;
        }

        if(option) {
            let value = option.split('=')[1];
            return !value ? undefined : value;
        }

        if(index > -1 && index + 1 < this._argv.length) {
            let value = this._argv[index + 1];
            return value.startsWith('-') ? undefined : value;
        }

        return undefined;
    }

    /**
     * Extract <Configuration> compatible options from the arguments provided through the commandline
     */
    get options() {
        // TODO: remove this developer check and add command line args to npm script when starting in developer mode ...
        if(require('path').basename(process.execPath).startsWith('electron')) {
            return {
                applicationUpdateURL: 'DISABLED',
                applicationCacheDirectory: '../web'
            };
        } else {
            return {
                proxyRules:                   this._get('--proxy-server'),
                applicationUpdateURL:         this._get('--update-url') || this._get('-u'),
                applicationStartupURL:        this._get('--startup-url'),
                applicationCacheDirectory:    this._get('--cache-directory') || this._get('-c'),
                applicationUserDataDirectory: this._get('--user-directory')
            };
        }
    }
}