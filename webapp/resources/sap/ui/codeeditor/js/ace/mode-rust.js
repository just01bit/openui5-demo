ace.define("ace/mode/rust_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text_highlight_rules").TextHighlightRules;var s=/\\(?:[nrt0'"\\]|x[\da-fA-F]{2}|u\{[\da-fA-F]{6}\})/.source;var R=function(){this.$rules={start:[{token:'variable.other.source.rust',regex:'\'[a-zA-Z_][a-zA-Z0-9_]*(?![\\\'])'},{token:'string.quoted.single.source.rust',regex:"'(?:[^'\\\\]|"+s+")'"},{stateName:"bracketedComment",onMatch:function(v,c,a){a.unshift(this.next,v.length-1,c);return"string.quoted.raw.source.rust";},regex:/r#*"/,next:[{onMatch:function(v,c,a){var t="string.quoted.raw.source.rust";if(v.length>=a[1]){if(v.length>a[1])t="invalid";a.shift();a.shift();this.next=a.shift();}else{this.next="";}return t;},regex:/"#*/,next:"start"},{defaultToken:"string.quoted.raw.source.rust"}]},{token:'string.quoted.double.source.rust',regex:'"',push:[{token:'string.quoted.double.source.rust',regex:'"',next:'pop'},{token:'constant.character.escape.source.rust',regex:s},{defaultToken:'string.quoted.double.source.rust'}]},{token:['keyword.source.rust','text','entity.name.function.source.rust'],regex:'\\b(fn)(\\s+)([a-zA-Z_][a-zA-Z0-9_]*)'},{token:'support.constant',regex:'\\b[a-zA-Z_][\\w\\d]*::'},{token:'keyword.source.rust',regex:'\\b(?:abstract|alignof|as|become|box|break|catch|continue|const|crate|default|do|dyn|else|enum|extern|for|final|if|impl|in|let|loop|macro|match|mod|move|mut|offsetof|override|priv|proc|pub|pure|ref|return|self|sizeof|static|struct|super|trait|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\\b'},{token:'storage.type.source.rust',regex:'\\b(?:Self|isize|usize|char|bool|u8|u16|u32|u64|u128|f16|f32|f64|i8|i16|i32|i64|i128|str|option|either|c_float|c_double|c_void|FILE|fpos_t|DIR|dirent|c_char|c_schar|c_uchar|c_short|c_ushort|c_int|c_uint|c_long|c_ulong|size_t|ptrdiff_t|clock_t|time_t|c_longlong|c_ulonglong|intptr_t|uintptr_t|off_t|dev_t|ino_t|pid_t|mode_t|ssize_t)\\b'},{token:'variable.language.source.rust',regex:'\\bself\\b'},{token:'comment.line.doc.source.rust',regex:'//!.*$'},{token:'comment.line.double-dash.source.rust',regex:'//.*$'},{token:'comment.start.block.source.rust',regex:'/\\*',stateName:'comment',push:[{token:'comment.start.block.source.rust',regex:'/\\*',push:'comment'},{token:'comment.end.block.source.rust',regex:'\\*/',next:'pop'},{defaultToken:'comment.block.source.rust'}]},{token:'keyword.operator',regex:/\$|[-=]>|[-+%^=!&|<>]=?|[*/](?![*/])=?/},{token:"punctuation.operator",regex:/[?:,;.]/},{token:"paren.lparen",regex:/[\[({]/},{token:"paren.rparen",regex:/[\])}]/},{token:'constant.language.source.rust',regex:'\\b(?:true|false|Some|None|Ok|Err)\\b'},{token:'support.constant.source.rust',regex:'\\b(?:EXIT_FAILURE|EXIT_SUCCESS|RAND_MAX|EOF|SEEK_SET|SEEK_CUR|SEEK_END|_IOFBF|_IONBF|_IOLBF|BUFSIZ|FOPEN_MAX|FILENAME_MAX|L_tmpnam|TMP_MAX|O_RDONLY|O_WRONLY|O_RDWR|O_APPEND|O_CREAT|O_EXCL|O_TRUNC|S_IFIFO|S_IFCHR|S_IFBLK|S_IFDIR|S_IFREG|S_IFMT|S_IEXEC|S_IWRITE|S_IREAD|S_IRWXU|S_IXUSR|S_IWUSR|S_IRUSR|F_OK|R_OK|W_OK|X_OK|STDIN_FILENO|STDOUT_FILENO|STDERR_FILENO)\\b'},{token:'meta.preprocessor.source.rust',regex:'\\b\\w\\(\\w\\)*!|#\\[[\\w=\\(\\)_]+\\]\\b'},{token:'constant.numeric.source.rust',regex:/\b(?:0x[a-fA-F0-9_]+|0o[0-7_]+|0b[01_]+|[0-9][0-9_]*(?!\.))(?:[iu](?:size|8|16|32|64|128))?\b/},{token:'constant.numeric.source.rust',regex:/\b(?:[0-9][0-9_]*)(?:\.[0-9][0-9_]*)?(?:[Ee][+-][0-9][0-9_]*)?(?:f32|f64)?\b/}]};this.normalizeRules();};R.metaData={fileTypes:['rs','rc'],foldingStartMarker:'^.*\\bfn\\s*(\\w+\\s*)?\\([^\\)]*\\)(\\s*\\{[^\\}]*)?\\s*$',foldingStopMarker:'^\\s*\\}',name:'Rust',scopeName:'source.rust'};o.inherits(R,T);e.RustHighlightRules=R;});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(r,e,a){"use strict";var o=r("../../lib/oop");var R=r("../../range").Range;var B=r("./fold_mode").FoldMode;var F=e.FoldMode=function(c){if(c){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+c.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+c.end));}};o.inherits(F,B);(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/;this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/;this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/;this._getFoldWidgetBase=this.getFoldWidget;this.getFoldWidget=function(s,f,b){var l=s.getLine(b);if(this.singleLineBlockCommentRe.test(l)){if(!this.startRegionRe.test(l)&&!this.tripleStarBlockCommentRe.test(l))return"";}var c=this._getFoldWidgetBase(s,f,b);if(!c&&this.startRegionRe.test(l))return"start";return c;};this.getFoldWidgetRange=function(s,f,b,c){var l=s.getLine(b);if(this.startRegionRe.test(l))return this.getCommentRegionBlock(s,l,b);var m=l.match(this.foldingStartMarker);if(m){var i=m.index;if(m[1])return this.openingBracketBlock(s,m[1],b,i);var d=s.getCommentFoldRange(b,i+m[0].length,1);if(d&&!d.isMultiLine()){if(c){d=this.getSectionRange(s,b);}else if(f!="all")d=null;}return d;}if(f==="markbegin")return;var m=l.match(this.foldingStopMarker);if(m){var i=m.index+m[0].length;if(m[1])return this.closingBracketBlock(s,m[1],b,i);return s.getCommentFoldRange(b,i,-1);}};this.getSectionRange=function(s,b){var l=s.getLine(b);var c=l.search(/\S/);var d=b;var f=l.length;b=b+1;var g=b;var m=s.getLength();while(++b<m){l=s.getLine(b);var i=l.search(/\S/);if(i===-1)continue;if(c>i)break;var h=this.getFoldWidgetRange(s,"all",b);if(h){if(h.start.row<=d){break;}else if(h.isMultiLine()){b=h.end.row;}else if(c==i){break;}}g=b;}return new R(d,f,g,s.getLine(g).length);};this.getCommentRegionBlock=function(s,l,b){var c=l.search(/\s*$/);var d=s.getLength();var f=b;var g=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;var h=1;while(++b<d){l=s.getLine(b);var m=g.exec(l);if(!m)continue;if(m[1])h--;else h++;if(!h)break;}var i=b;if(i>f){return new R(f,c,i,l.length);}};}).call(F.prototype);});ace.define("ace/mode/rust",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/rust_highlight_rules","ace/mode/folding/cstyle"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text").Mode;var R=r("./rust_highlight_rules").RustHighlightRules;var F=r("./folding/cstyle").FoldMode;var M=function(){this.HighlightRules=R;this.foldingRules=new F();this.$behaviour=this.$defaultBehaviour;};o.inherits(M,T);(function(){this.lineCommentStart="//";this.blockComment={start:"/*",end:"*/",nestable:true};this.$quotes={'"':'"'};this.$id="ace/mode/rust";}).call(M.prototype);e.Mode=M;});(function(){ace.require(["ace/mode/rust"],function(m){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=m;}});})();
