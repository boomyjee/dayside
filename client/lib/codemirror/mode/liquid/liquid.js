CodeMirror.defineMode("liquid", function(config, parserConfig) {
  var liquidOverlay = {
    token: function(stream, state) {

      // Variables.
      if (stream.match("{{")) {
        while ((ch = stream.next()) != null)
          if (ch == "}" && stream.next() == "}") break;
        return "liquid-variable";
      }
      
      // Tags.
      if(stream.match("{%")) {
        while ((ch = stream.next()) != null)
          if (ch == "%" && stream.next() == "}") break;
        return "liquid-tag";
      }
      
      while (stream.next() != null && !stream.match("{{", false) && !stream.match("{%", false)) {}
      return null;
    }
  };
  return CodeMirror.overlayParser(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), liquidOverlay);
});