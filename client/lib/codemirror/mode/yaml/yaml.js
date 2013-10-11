CodeMirror.defineMode("yaml", function(config) {

  var cons = ['true', 'false', 'on', 'off', 'yes', 'no'];
  var keywordRegex = new RegExp("\\b(("+cons.join(")|(")+"))$", 'i');
  var htmlMode = CodeMirror.getMode(config, "text/html");

  return {
    token: function(stream, state) {
      var ch = stream.peek();
      var esc = state.escaped;
      state.escaped = false;
      /* comments */
      if (ch == "#" && (stream.pos == 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))) {
        stream.skipToEnd(); return "comment";
      }
        
      if (state.inlineLiteral) {
          if (stream.sol() || stream.eol()) {
              state.inlineLiteral = false;
              state.literal = true;
          } else {
              return htmlMode.token(stream, state.htmlState);
          }
      }
        
      if (state.literal && stream.indentation() > state.keyCol) {
        return htmlMode.token(stream, state.htmlState);
      } else if (state.literal) { state.literal = false; }
          
      if (stream.sol()) {
        state.keyCol = 0;
        state.pair = false;
        state.pairStart = false;
        /* document start */
        if(stream.match(/---/)) { return "def"; }
        /* document end */
        if (stream.match(/\.\.\./)) { return "def"; }
        /* array list item */
        if (stream.match(/\s*-\s+/)) { return 'meta'; }
      }
      /* inline pairs/lists */
      if (stream.match(/^(\{|\}|\[|\])/)) {
        if (ch == '{')
          state.inlinePairs++;
        else if (ch == '}')
          state.inlinePairs--;
        else if (ch == '[')
          state.inlineList++;
        else
          state.inlineList--;
        return 'meta';
      }

      /* list seperator */
      if (state.inlineList > 0 && !esc && ch == ',') {
        stream.next();
        return 'meta';
      }
      /* pairs seperator */
      if (state.inlinePairs > 0 && !esc && ch == ',') {
        state.keyCol = 0;
        state.pair = false;
        state.pairStart = false;
        stream.next();
        return 'meta';
      }

      /* start of value of a pair */
      if (state.pairStart) {
        /* block literals */
        if (
            stream.match(/^\s*(\||\>)\s*/)
            || stream.match(/^\s*(\||\-)\s*/)
        ) { 
            state.htmlState = CodeMirror.startState(htmlMode);
            state.literal = true; 
            return 'meta'; 
        };
          
        state.htmlState = CodeMirror.startState(htmlMode);
        state.inlineLiteral = true; 
        return 'meta';
      }

      /* pairs (associative arrays) -> key */
      var keyRegexp = /^\s*\S+(?=\s*:($|\s))/i;
      var match;
      if (!state.pair && (match = stream.match(keyRegexp,true))) {
          var key = match[0];
          
          var idx = key.indexOf("#");
          if (idx==0) {
              state.pair = true;
              state.keyCol = stream.indentation();
              return "hr";
          }
          else if (idx==-1) {
              state.pair = true;
              state.keyCol = stream.indentation();
              return "atom";
          }

          stream.backUp(key.length - idx);
          return "tag";
      }
      if (state.pair && stream.match(/^:\s*/)) { state.pairStart = true; return 'meta'; }

      /* nothing found, continue */
      state.pairStart = false;
      state.escaped = (ch == '\\');
      stream.next();
      return null;
    },
    startState: function() {
      return {
        pair: false,
        pairStart: false,
        keyCol: 0,
        inlinePairs: 0,
        inlineList: 0,
        literal: false,
        escaped: false
      };
    }
  };
});

CodeMirror.defineMIME("text/x-yaml", "yaml");