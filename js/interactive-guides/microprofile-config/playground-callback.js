var playground = (function() {
    
    var properties = {};

    /**
     * 
     * @param {*} key - 
     * @param {*} value - 
     * @param {*} source - 
     * @param {*} ordinal (optional?) - provided ordinal number. otherwise default based on source
     */
    var playgroundAddConfig = function(key, value, source, ordinal) {
        if (!ordinal) {
            ordinal = __getDefaultOrdinal(source);
        }

        if (properties[key]) {
            var oldOrdinal = properties[key]['ordinal'];
            if (parseInt(ordinal) >= parseInt(oldOrdinal)) {
                properties[key] = {'ordinal': ordinal, 'value': value};
            }
        } else {
            properties[key] = {'ordinal': ordinal, 'value': value};
        }
    };

    var repopulatePlaygroundConfigs = function() {
        properties = {};

        getInjectionProperties();
        getPropertiesFileProperties();
        getEnvironmentProperties();
        getSystemProperties();
    };

    var getInjectionProperties = function() {
        var injectionContent = contentManager.getTabbedEditorContents('DefaultPlayground', 'Injection');

        // Use regex global search to find and store all indices of matches.
        var regexp = /@ConfigProperty/g;
        var match, matches = [];
        while ((match = regexp.exec(injectionContent)) != null) {
            matches.push(match.index);
        }
        
        // For each match, grab string until end of Java code line.
        var lines = [];
        for (var i in matches) {
            var content = injectionContent.substring(matches[i]);
            var endLine = content.indexOf(";");
            var line = content.substring(0, endLine);
            lines.push(line);
        }

        // For each line, grab config value and properties
        for (var i in lines) {
            var lineRegexp = /(?<=\().*(?=\))/g  //grab everything in between the parentheses
            var propertyLine = lineRegexp.exec(lines[i]);

            if (propertyLine) {
                var inlineProperties = propertyLine[0];
                var nameRegexp = /name="(.*?)"/g //match 'name' property, with the property value as substring match
                var defaultValueRegexp = /defaultValue="(.*?)"/g //match 'defaultValue' property, with the property value as substring match
                var name = nameRegexp.exec(inlineProperties);
                var defaultValue = defaultValueRegexp.exec(inlineProperties);
                if (name) {
                    //index 1 is the regex substring match which contains the name property value
                    playgroundAddConfig('name', name[1], 'inject'); 
                }
                if (defaultValue) {
                    //index 1 is the regex substring match which contains the defaultValue property value
                    playgroundAddConfig('defaultValue', defaultValue[1], 'inject');
                }
            }
        }
    };

    var getPropertiesFileProperties = function() {
        var propertiesFileContent = contentManager.getTabbedEditorContents('DefaultPlayground', 'Properties');

        if (propertiesFileContent) {
            var lines = propertiesFileContent.split('\n');
        
            console.log(lines);

            // playgroundAddConfig(propFileKey, propFileValue, 'propFile', ordinal);
        }
    };

    var getEnvironmentProperties = function() {
        var envPropContent = contentManager.getTabbedEditorContents('DefaultPlayground', 'Environment Property');

        if (envPropContent) {
            var lines = envPropContent.split('\n');

            console.log(lines);

            // playgroundAddConfig(propKey, propValue, 'sysProp');
        }
    };

    var getSystemProperties = function() {
        var sysPropContent = contentManager.getTabbedEditorContents('DefaultPlayground', 'System Property');

        if (sysPropContent) {
            var lines = sysPropContent.split('\n');

            console.log(lines);

            // playgroundAddConfig(envKey, envValue, 'envVar');
        }
    };

    var playgroundListenToEditorForChange = function(editor) {
        var __updatePlaygroundEnv = function() {
            repopulatePlaygroundConfigs();
        };
    };

    var __getDefaultOrdinal = function(source) {
        switch(source) {
        case 'inject': return '0';
        case 'propFile': return '100';
        case 'envVar': return '300';
        case 'sysProp': return '400';
        default: return '0';
        }
    };

    var getProperties = function() {
        return properties;
    };

    return {
        repopulatePlaygroundConfigs: repopulatePlaygroundConfigs,
        getInjectionProperties: getInjectionProperties,
        getPropertiesFileProperties: getPropertiesFileProperties,
        getEnvironmentProperties: getEnvironmentProperties,
        getSystemProperties: getSystemProperties,
        getProperties: getProperties,
        playgroundListenToEditorForChange: playgroundListenToEditorForChange
    };

})();
