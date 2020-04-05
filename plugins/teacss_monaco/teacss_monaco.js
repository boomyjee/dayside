(()=>{

const language = {
	defaultToken: '',
	tokenPostfix: '.tea',

	identifier: '-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',
	identifierPlus: '-?-?([a-zA-Z:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-:.]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*',

    ws: '[ \t\n\r\f]*', 

	brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.bracket' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' },
		{ open: '<', close: '>', token: 'delimiter.angle' }
	],    

	tokenizer: {
		root:[
			{ include: '@inlineJSBegin' },
            { include: '@nestedJSBegin' },

			['[ \\t\\r\\n]+', ''],

			{ include: '@comments' },
			{ include: '@strings' },
			{ include: '@numbers' },
			['[*_]?[a-zA-Z\\-\\s]+(?=:.*(;|(\\\\$)))', 'attribute.name', '@attribute'],

			['url(\\-prefix)?\\(', { token: 'tag', next: '@urldeclaration' }],

			['[{}()\\[\\]]', '@brackets'],
			['[,:;]', 'delimiter'],

			['#@identifierPlus', 'tag.id'],
			['&', 'tag'],

			['\\.@identifierPlus(?=\\()', 'tag.class', '@attribute'],
			['\\.@identifierPlus', 'tag.class'],

			['@identifierPlus', 'tag'],

			['@(@identifier(?=[:,\\)]))', 'variable', '@attribute'],
			['@(@identifier)', 'variable'],
			['@', 'key', '@atRules']
		],

        inlineJSBegin: [
            ['@ws@ ', { token: 'keyword', next: '@inlineJSEnd', nextEmbedded: 'text/javascript' }]
        ],

        inlineJSEnd: [
            [".*?$", { token:"js",next: '@pop', nextEmbedded: '@pop' }]
        ],

		nestedJSBegin: [
			['@{', { token: 'attribute.name', next: '@nestedJS', nextEmbedded: 'text/javascript' }],
		],

        nestedJS: [
            ["@{", {token:"keyword",next:"@nestedTea",nextEmbedded:"@pop"}],
            ["}", {token:"attribute.name",next:"@pop",nextEmbedded:"@pop"}],
            ["{","js","@nestedJSInside"],
            [".","js"]
        ],

        nestedJSInside: [
            ["{","js","@nestedJSInside"],
            ["}","js","@pop"],
            ["@{", {token:"keyword",next:"@nestedTea",nextEmbedded:"@pop"}],
            ["js","number"]
        ],

        nestedTea: [
            ["}", {token:"keyword",next:"@pop", nextEmbedded: 'text/javascript'}],
            ["{", {token:"@brackets",next:"@nestedTeaInside"}],
            { include: "@root" }
        ],

        nestedTeaInside: [
            ["{", {token:"@brackets",next:"@nestedTeaInside"}],
            ["}", {token:"@brackets",next:"@pop"}],
            { include: "@root" }
        ],

		urldeclaration: [
			{ include: '@strings' },
			['[^)\r\n]+', 'string'],
			['\\)', { token: 'tag', next: '@pop' }],
		],

		attribute:[
			{ include: '@nestedJSBegin' },
			{ include: '@comments' },
			{ include: '@strings' },
			{ include: '@numbers' },

			['[a-zA-Z\\-]+(?=\\()', 'attribute.value', '@attribute'],
			['>', 'operator', '@pop'],
			['@identifier', 'attribute.value'],
			['@(@identifier)', 'variable'],

			['[)\\}]', '@brackets', '@pop'],
			['[{}()\\[\\]>]', '@brackets'],

			['[;]', 'delimiter', '@pop'],
			['[,=:]', 'delimiter'],

			['\\s', ''],
			['.', 'attribute.value']
		],

		comments: [
			['\\/\\*', 'comment', '@comment'],
			['\\/\\/+.*', 'comment'],
		],

		comment: [
			['\\*\\/', 'comment', '@pop'],
			['.', 'comment'],
		],

		numbers: [
			['(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?', { token: 'attribute.value.number', next: '@units' }],
			['#[0-9a-fA-F_]+(?!\\w)', 'attribute.value.hex']
		],

		units: [
			['(em|ex|ch|rem|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?', 'attribute.value.unit', '@pop']
		],

		strings: [
			['~?"', { token: 'string.delimiter', next: '@stringsEndDoubleQuote' }],
			['~?\'', { token: 'string.delimiter', next: '@stringsEndQuote' }]
		],

		stringsEndDoubleQuote: [
			['\\\\"', 'string'],
			['"', { token: 'string.delimiter', next: '@popall' }],
			['.', 'string']
		],

		stringsEndQuote: [
			['\\\\\'', 'string'],
			['\'', { token: 'string.delimiter', next: '@popall' }],
			['.', 'string']
		],

		atRules:[
			{ include: '@comments' },
			{ include: '@strings' },
			['[()]', 'delimiter'],
			['[\\{;]', 'delimiter', '@pop'],
			['.', 'key']
		]
	},    
};


dayside.plugins.teacss_monaco = () => {
    dayside.ready(()=>{
        monaco.languages.register({id:"teacss",extensions:[".tea"]});
        monaco.languages.setMonarchTokensProvider('teacss',language);

        // monkey patch tokenizer due to bug https://github.com/microsoft/monaco-editor/issues/1877
        dayside.editor.bind("editorCreated",(b,e)=>{
            var model = e.editor.getModel();
            var tokenizer = model._tokens.tokenizationSupport;

            if (tokenizer && tokenizer._modeId=="teacss") {
                let tc;
                tokenizer._nestedTokenize = function (line,lineState,offsetDelta,tokensCollector) {
                    var popOffset = -1;

                    tc = tc || new tokensCollector.__proto__.constructor(tokensCollector._modeService,tokensCollector._theme);
                    tc.emit = (offset,type)=>{
                        if (type!="js.tea" && popOffset==-1) {
                            popOffset = offset - offsetDelta;
                        }
                    }
                    var res = this._myTokenize(line,lineState,offsetDelta,tc);

                    if (popOffset === -1) {
                        tokensCollector.nestedModeTokenize(line, lineState.embeddedModeData, offsetDelta);
                    } else {
                        let nestedModeLine = line.substring(0, popOffset);
                        if (nestedModeLine.length > 0) {
                            tokensCollector.nestedModeTokenize(nestedModeLine, lineState.embeddedModeData, offsetDelta);
                        }
                        let restOfTheLine = line.substring(popOffset);
                        this._myTokenize(restOfTheLine, lineState, offsetDelta + popOffset, tokensCollector);
                    }
                    return res;
                }
            }
        });
    });
}

})();
