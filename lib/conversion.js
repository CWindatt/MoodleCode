function colorConversion(matchName){
    if (typeof matchName === 'string'){
        if (matchName.indexOf('comment') > -1){
            return 'green';
        }
        if (matchName.indexOf('punctuation') > -1){
            return 'blue';
        }
        if (matchName.indexOf('keyword') > -1){
            return 'darkblue';
        }
        if (matchName.indexOf('preprocessor') > -1){
            return 'darkpurple';
        }
    }
    return "";
}

function styleLineRecurse(syntax, line, edits){
    if (typeof syntax.match === 'string'){
        var matcher = RegExp(syntax.match);
        var matchResult = matcher.exec(line);
        if (matchResult){
            var color = colorConversion(syntax.name);
            if (color){
                edits.push({offset: matchResult.index, text: '<span style="color: ' + color + '">'});
                edits.push({offset: matchResult.index + matchResult[0].length, text: '</span>'});
                return true;
            }
        }
    } else if (syntax.grammars){
        for (var i=0; i<syntax.grammars.length; i++){
            styleLineRecurse(syntax.grammars[i], line, edits);
        }
    } else if (syntax.patterns){
        for (var i=0; i<syntax.patterns.length; i++){
            styleLineRecurse(syntax.patterns[i], line, edits);
        }
    } else if (syntax.repository){
        for (var key in syntax.repository) {
            if (syntax.repository.hasOwnProperty(key)) {
                styleLineRecurse(syntax.repository[key], line, edits);
            }
        }
    }
    return edits;
}

function convert(snippet, syntaxList){
    var lines = snippet.split('\n');
    var output = '<pre>\n';
    lines.forEach(function(line) {
        var edits = [];
        for (var i = 0; i < syntaxList.length; i++) {
            edits = styleLineRecurse(syntaxList[i], line, edits);
        }
        edits = edits.sort(function(a, b){
            return a.offset - b.offset;
        });
        if (edits.length > 0){
            var baseIndex = 0;
            for (var i = 0; i < edits.length; i++) {
                var edit = edits[i];
                // console.log(edit);
                var pre = line.slice(0, edit.offset-baseIndex);
                output += pre;
                output += edit.text;
                baseIndex += pre.length;
                line = line.slice(pre.length);
            }
            output += line + '\n';
        } else {
            output += line + '\n';
        }
    }, this);
    output = output.replace(/\t/g, '  ');
    output += '</pre>\n';
    return output;
}

if (typeof exports === 'object'){
    exports.convert = convert;
}