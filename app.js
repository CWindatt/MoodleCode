var args = process.argv.slice(2);

if (args.length === 0 || typeof args[0] !== 'string'){
    console.log("Usage: node app \"<code-snippet>\"");
    return;
    // args[0] = "/* Block comment */\n\tprivate var foo = Map<Iterator>();\n // Line comment"
}

var conversion = require('./lib/conversion');
var libSyntax = require('./lib/lib/syntax').getLibSyntax();
var cSharpSyntax = require('./lib/csharp/syntax').getCSharpSyntax();

var snippet = args[0];
var output = conversion.convert(snippet, [libSyntax, cSharpSyntax]);
console.log(output);
