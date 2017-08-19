/* This is my first React.js program, well my first React.js program that is beyond 
   a simple Hello World program. I have to admit that it took me a while (about 60 hours)
   to get this thing working. It was a tough project for a first project, so I suspect
   the approach I've taken is probably completely wrong, but it does work. I'd like to 
   revisit this routine after I've done a few more React routines, and I have a better 
   handle on what I'm doing. Yeah... the chances of me actually doing so are slim. Once 
   I have a better handle on what I'm doing, I'll be writing real programs. ;-) */

   var Markup = React.createClass({
    getInitialState: function () {
      var textLeft = "Below are examples of headers--";
      textLeft += "\n#H1 Header Example";
      textLeft += "\n##H2 Header Example";
      textLeft += "\n###H3 Header Example";
      textLeft += "\n####H4 Header Example";
      textLeft += "\n#####H5 Header Example";
      textLeft += "\n######H6 Header Example";
      textLeft += "\nBelow are examples of emphasis--";
      textLeft += "\nEmphasis, aka italics, with *asterisks* or _underscores_.";
      textLeft += "\nStrong emphasis, aka bold, with **asterisks** or __underscores__.";
      textLeft += "\nCombined emphasis with **asterisks and _underscores_**.";
      textLeft += "\n ";
      textLeft += "\n[I'm an example of a link](https://www.google.com)";
      textLeft += "\n ";
      textLeft += "\nBelow is an example of an image--";
      textLeft += "\n![Alt Text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)";
      textLeft += "\n ";
      textLeft += "\nBelow are examples of horizontal rules--";
      textLeft += "\nThree or more hyphens--";
      textLeft += "\n---";
      textLeft += "\nThree or more asterisks--";
      textLeft += "\n***";
      textLeft += "\nThree or more underscores--";
      textLeft += "\n___";
      textLeft += "\n ";    
      textLeft += "\nI'm an example of inline `code` with `back-ticks around` it.";
      textLeft += "\n ";
      textLeft += "\n```";
      textLeft += "\n<script>";
      textLeft += "\n  alert( 'I'm an example of block code formatting.' );";
      textLeft += "\n<\/script>";
      textLeft += "\n\/\/I'm also assuming that language syntax highlighting is beyond the scope of this project.";
      textLeft += "\n```";
      textLeft += "\n ";
      textLeft += "\nBelow is an example of a blockquote--";
      textLeft += "\n> Blockquotes are similar to block code, but the styling is a little different.";
      textLeft += "\n> This has the solid line on the left and isn't intended for code.";
      textLeft += "\n";
      textLeft += "\nBelow is an example of an Unordered List--";
      textLeft += "\n* Item 1";
      textLeft += "\n* Item 2";
      textLeft += "\n  * Item 2a";
      textLeft += "\n  * Item 2b";
      textLeft += "\n";
      textLeft += "\nBelow is an example of an Ordered List--";
      textLeft += "\n1. Item 1";
      textLeft += "\n1. Item 2";
      textLeft += "\n1. Item 3";
      textLeft += "\n   1. Item 3a";
      textLeft += "\n   1. Item 3b";
      textLeft += "\n";
      textLeft += "\nHere is an example of a table (opening and closing pipes are optional)--";
      textLeft += "\n| First Header  | Second Header | Third Header |";
      textLeft += "\n| ------------- |-------------| -----|";
      textLeft += "\n| row 1 col 1   | row 1 col 2 | row 1 col 3 |";
      textLeft += "\n| row 2 col 1   | row 2 col 2 | row 2 col 3 |";
      textLeft += "\n| row 3 col 1   | row 3 col 2 | row 3 col 3 |";  
      return {txtBoxContent: textLeft, currentIndex: 0};
    },
    
    txtBoxChanged: function (entry) {
      this.setState({txtBoxContent: this.refs.newText.value});
    },
    
    render: function() {
      var linesArray = [];
      this.state.txtBoxContent.split("\n").map(line => {
        linesArray.push(line);
      });
  
      function blockMarkdown(line, linesArray, index) {
        if (line == "~~ignore~~") {
          return;
        }
        var nextLine = linesArray[index+1] || "";
        var pipesInLine = (line.match(/\|/g) || []).length;
        var pipesInNextLine = (nextLine.match(/\|/g) || []).length;
        var newLine = "";
        var rows = [];
        var patt = /^(\d+)\. /g;
        if (line.substring(0, 6)=="######") {
          newLine = <h6>{line.substring(6, line.length)}</h6>;
        } else if (line.substring(0, 5)=="#####") {
          newLine = <h5>{line.substring(5, line.length)}</h5>;
        } else if (line.substring(0, 4)=="####") {
          newLine = <h4>{line.substring(4, line.length)}</h4>;
        } else if (line.substring(0, 3)=="###") {
          newLine = <h3>{line.substring(3, line.length)}</h3>;
        } else if (line.substring(0, 2)=="##") {
          newLine = <h2>{line.substring(2, line.length)}</h2>;
        } else if (line.substring(0, 1)=="#") {
          newLine = <h1>{line.substring(1, line.length)}</h1>;
        } else if (line.substring(0, 3)=="---") {
          newLine = <hr />;
        } else if (line.substring(0, 3)=="***") {
          newLine = <hr />;
        } else if (line.substring(0, 3)=="___") {
          newLine = <hr />;
        } else if (line.substring(0, 3) == "```") {
          newLine = codeBlock(line, linesArray, index, rows);
        } else if (line.substring(0, 1)==">" && nextLine.substring(0, 1)==">") {
          newLine = backquoteMarkdown(line, linesArray, index, rows);
        } else if (line.substring(0, 2) == "* ") {
          newLine = <ul>{ULMarkdown(line, linesArray, index)}</ul>;
        } else if (patt.test(line)) {
          newLine = <ol>{OLMarkdown(line, linesArray, index)}</ol>;
        } else if (pipesInLine != 0 && pipesInLine == pipesInNextLine) {
          newLine = tableMarkdown(line, linesArray, index, rows);
        } else {
          newLine = <div>{inlineMarkdown(line)}</div>;
        }
        return newLine;
      }
      
      function tableMarkdown(line, linesArray, index, rows) {
        var nextLine = linesArray[index + 1] || "";
        var pipesInLine = (line.match(/\|/g) || []).length;
        var doneFlag = (pipesInLine == 0) ? true : false;
        if (line.substring(0, 1) == "|") {
          line = line.substring(line.indexOf("|") + 1, line.length);
          pipesInLine--;
        }
        if (line.substring(line.length - 1, line.length) == "|") {
          line = line.substring(0, line.length - 1);
          pipesInLine--;
        }
        linesArray[index] = "~~ignore~~";
        if (doneFlag) {
          return <table>{rows.map((line) => {return line;})}</table>;
        } else {
          if (line.replace(/[-\| ]/g,"").length != 0) {
            var tds = [];
            for (var i = 0; i < pipesInLine + 1; i++) {
              var piece = line.indexOf("|") != -1 ? line.substring(0,line.indexOf("|")).trim() : line.trim();
              line = line.indexOf("|") != -1 ? line.substring(line.indexOf("|") + 1, line.length) : "";
              if (nextLine !="" && nextLine.replace(/[-\| ]/g,"").length == 0) {
                tds.push(<th>{piece}</th>);
              } else {
                tds.push(<td>{piece}</td>);
              }
            }
            rows.push(<tr>{tds.map((line) => {return line;})}</tr>);
          }
          return tableMarkdown(nextLine, linesArray, index+1, rows);
        }
      }
      
      function OLMarkdown(line, linesArray, index) {
        var nextLine = linesArray[index+1];
        var item = line.substring(line.indexOf(". ")+2, line.length);
        var patt = /^(\d+)\. /g;
        var currLineIsNormList = (line == line.trim()) ? true : false;
        var nextLineIsNotList = (nextLine.trim().match(patt) == null) ? true : false;
        var nextLineIsSubList = (nextLine != nextLine.trim() && nextLine.trim().match(patt) != null) ? true : false;
        linesArray[index] = "~~ignore~~";
        if (nextLineIsNotList) {
          return <li>{item}</li>;
        } else if (currLineIsNormList && nextLineIsSubList) {
          return <span><li>{item}</li><ol>{OLMarkdown(nextLine, linesArray, index+1)}</ol></span>;
        } else {
          return <span><li>{item}</li>{OLMarkdown(nextLine, linesArray, index+1)}</span>;
        }
      }
      
      function ULMarkdown(line, linesArray, index) {
        var nextLine = linesArray[index+1];
        var item = line.trim().substring(2, line.length);
        linesArray[index] = "~~ignore~~";
        if (nextLine.trim().substring(0, 2) != "* ") {
          return <li>{item}</li>;
        } else if (line.substring(0, 2) == "* " && nextLine.substring(0, 2) != "* ") {
          return <span><li>{item}</li><ul>{ULMarkdown(nextLine, linesArray, index+1)}</ul></span>;
        } else {
          return <span><li>{item}</li>{ULMarkdown(nextLine, linesArray, index+1)}</span>;
        }
      }
      
      function codeBlock(line, linesArray, index, rows) {
        var nextLine = linesArray[index+1];
        linesArray[index] = "~~ignore~~";
        if (nextLine.substring(0, 3) == "```") {
          linesArray[index+1] = "~~ignore~~";
          return <div className="codeBlock">{rows.map((line) => {return line;})}</div>;
        } else {
          rows.push(<div>{nextLine}</div>);
          return codeBlock(nextLine, linesArray, index+1, rows);
        }
      }
      
      function backquoteMarkdown(line, linesArray, index, rows) {
        var newLine = line.substring(0, 2) == "> " ? line.substring(2, line.length) : line.substring(1, line.length);
        var nextLine = linesArray[index+1];
        linesArray[index] = "~~ignore~~";
        if (nextLine.substring(0, 1) != ">") {
          rows.push(<div>{newLine}</div>);
          return <blockquote>{rows.map((line) => {return line;})}</blockquote>;
        } else {
          rows.push(<div>{newLine}</div>);
          return backquoteMarkdown(nextLine, linesArray, index+1, rows);
        }
      }
      
      function inlineMarkdown(line) {
        // This if () section handles links
        if (line.indexOf("[") != -1 &&
           line.indexOf("![") == -1 &&
           line.indexOf("](") != -1 &&
           line.indexOf("](") > line.indexOf("[") &&
           line.indexOf(")") > line.indexOf("](")) {
          var text = line.substring(line.indexOf("[")+1, line.indexOf("]("));
          var link = line.substring(line.indexOf("](")+2, line.indexOf(")"));
          return <a href={link}>{text}</a>;
          //TODO: call inlineMarkdown for left and right of link
        }
        
        // This if () section handles images
        if (line.indexOf("![") != -1 &&
           line.indexOf("](") != -1 &&
           line.indexOf("](") > line.indexOf("![") &&
           line.indexOf(")") > line.indexOf("](")) {
          var text = line.substring(line.indexOf("![")+2, line.indexOf("]("));
          var link = line.substring(line.indexOf("](")+2, line.indexOf(")"));
          return <img src={link} alt={text} />;
          //TODO: call inlineMarkdown for left and right of link
        }
        
        //Inline `code` has `back-ticks around` it.
        if (line.indexOf("`") != -1 && line.indexOf("`", line.indexOf("`") + 1) != 1) {
          var newLine = "";
          var leftLine = line.substring(0,line.indexOf("`"));
          var midLine = line.substring(line.indexOf("`")+1,line.indexOf("`", line.indexOf("`") + 1));
          var rightLine = line.substring(line.indexOf("`", line.indexOf("`") + 1)+1,line.length);
          newLine = <span><span>{inlineMarkdown(leftLine)}</span><span className="code">{midLine}</span><span>{inlineMarkdown(rightLine)}</span></span>;
          return newLine;
        }
        
        var startBold = line.indexOf("**");
        var endBold = line.indexOf("**",line.indexOf("**")+1);
        var startAltBold = line.indexOf("__");
        var endAltBold = line.indexOf("__",line.indexOf("__")+1);
        if (startBold == -1) {
          startBold = startAltBold;
          endBold = endAltBold;
        } else if (startBold > startAltBold && startAltBold != -1 && endAltBold !=-1) {
          startBold = startAltBold;
          endBold = endAltBold;
        }
        
        var tmpLine = line.replace(/\*\*/g, "^^");
        tmpLine = tmpLine.replace(/__/g, "^^");
        var startItalic = tmpLine.indexOf("*");
        var endItalic = tmpLine.indexOf("*",tmpLine.indexOf("*")+1);
        var startAltItalic = tmpLine.indexOf("_");
        var endAltItalic = tmpLine.indexOf("_",tmpLine.indexOf("_")+1);
        if (startItalic == -1) {
          startItalic = startAltItalic;
          endItalic = endAltItalic;
        } else if (startItalic > startAltItalic &&  startAltItalic != -1 &&  endAltItalic !=-1) {
          startItalic = startAltItalic;
          endItalic = endAltItalic;
        }
        
        if (endBold == -1 && endItalic == -1) {
          // no bold or italics left, so we are done
          return line;
        } else if (endItalic == -1) {
          // no italics left, so do bold and make recursive calls
          var newLine = "";
          var leftLine = line.substring(0,startBold);
          var midLine = line.substring(startBold+2,endBold);
          var rightLine = line.substring(endBold+2,line.length);
          newLine = <span>{inlineMarkdown(leftLine)}<b>{inlineMarkdown(midLine)}</b>{inlineMarkdown(rightLine)}</span>;
          return newLine;
        } else if (endBold == -1) {
          // no bold left, so do italic and make recursive calls
          var newLine = "";
          var leftLine = line.substring(0,startItalic);
          var midLine = line.substring(startItalic+1,endItalic);
          var rightLine = line.substring(endItalic+1,line.length);
          newLine = <span>{inlineMarkdown(leftLine)}<i>{inlineMarkdown(midLine)}</i>{inlineMarkdown(rightLine)}</span>;
          return newLine;
        } else if (startBold < startItalic) {
          // we have bold and italic with bold starting first, so do bold and make recursive calls
          var newLine = "";
          var leftLine = line.substring(0,startBold);
          var midLine = line.substring(startBold+2,endBold);
          var rightLine = line.substring(endBold+2,line.length);
          newLine = <span>{inlineMarkdown(leftLine)}<b>{inlineMarkdown(midLine)}</b>{inlineMarkdown(rightLine)}</span>;
          return newLine;
        } else {
          // we have bold and italic with italic starting first, so do italic and make recursive calls
          var newLine = "";
          var leftLine = line.substring(0,startItalic);
          var midLine = line.substring(startItalic+1,endItalic);
          var rightLine = line.substring(endItalic+1,line.length);
          newLine = <span>{inlineMarkdown(leftLine)}<i>{inlineMarkdown(midLine)}</i>{inlineMarkdown(rightLine)}</span>;
          return newLine;
        }
      }
  
      return (
        <div id="wrapper">
          <div id="leftSide">
            <textarea id="txtBox" ref="newText" onKeyUp={this.txtBoxChanged} rows={linesArray.length +3}>{this.state.txtBoxContent}</textarea>
          </div>
          <div id="rightSide">
            {linesArray.map((line, index) => {
              line = blockMarkdown(line, linesArray, index);
              return line;
            })}
          </div>
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <Markup />,
    document.getElementById("root")
  );