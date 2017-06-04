
var DataObject = {};
function DisplayData(id, data) {
    var htmlObj, htmlTemplate, html, arr = [], a, l, rowClone, x, j, i, ii, cc, repeat, repeatObj, repeatX = "";
    htmlObj = document.getElementById(id);
    htmlTemplate = InitTemplate(id, htmlObj);
    html = htmlTemplate.cloneNode(true);
    arr = GetElementsByAttribute(html, "repeat");
    l = arr.length;
    for (j = (l - 1); j >= 0; j -= 1) {
        cc = arr[j].getAttribute("repeat").split(" ");
        if (cc.length == 1) {
            repeat = cc[0];
        } else {
            repeatX = cc[0];
            repeat = cc[2];
        }
        arr[j].removeAttribute("repeat");
        repeatObj = data[repeat];
        if (repeatObj && typeof repeatObj == "object" && repeatObj.length != "undefined") {
            i = 0;
            for (x in repeatObj) {
                i += 1;
                rowClone = arr[j];
                rowClone = NeedleInHaystack(rowClone, "element", repeatX, repeatObj[x]);
                a = rowClone.attributes;
                for (ii = 0; ii < a.length; ii += 1) {
                    a[ii].value = NeedleInHaystack(a[ii], "attribute", repeatX, repeatObj[x]).value;
                }
                (i === repeatObj.length) ? arr[j].parentNode.replaceChild(rowClone, arr[j]) : arr[j].parentNode.insertBefore(rowClone, arr[j]);
            }
        } else {
            console.log("repeat must be an array. " + repeat + " is not an array.");
            continue;
        }
    }
    html = NeedleInHaystack(html, "element");
    htmlObj.parentNode.replaceChild(html, htmlObj);
    function InitTemplate(id, obj) {
        var template;
        template = obj.cloneNode(true);
        if (DataObject.hasOwnProperty(id)) {return DataObject[id];}
        DataObject[id] = template;
        return template;
    }
    function GetElementsByAttribute(x, att) {
        var arr = [], arrCount = -1, i, l, y = x.getElementsByTagName("*"), z = att.toUpperCase();
        l = y.length;
        for (i = -1; i < l; i += 1) {
            if (i == -1) {y[i] = x;}
            if (y[i].getAttribute(z) !== null) {arrCount += 1; arr[arrCount] = y[i];}
        }
        return arr;
    }
    function NeedleInHaystack(elmnt, typ, repeatX, x) {
        var value, rowClone, pos1, haystack, pos2, needle = [], needleToReplace, i, cc, r;
        rowClone = elmnt.cloneNode(true);
        pos1 = 0;
        while (pos1 > -1) {
            haystack = (typ == "attribute") ? rowClone.value : rowClone.innerHTML;
            pos1 = haystack.indexOf("{{", pos1);
            if (pos1 === -1) {break;}
            pos2 = haystack.indexOf("}}", pos1 + 1);
            needleToReplace = haystack.substring(pos1 + 2, pos2);
            needle = needleToReplace.split("||");
            value = undefined;
            for (i = 0; i < needle.length; i += 1) {
                needle[i] = needle[i].replace(/^\s+|\s+$/gm, ''); //trim
                //value = ((x && x[needle[i]]) || (data && data[needle[i]]));
                if (x) {value = x[needle[i]];}
                if (value == undefined && data) {value = data[needle[i]];}
                if (value == undefined) {
                    cc = needle[i].split(".");
                    if (cc[0] == repeatX) {value = x[cc[1]]; }
                }
                if (value == undefined) {
                    if (needle[i] == repeatX) {value = x;}
                }
                if (value == undefined) {
                    if (needle[i].substr(0, 1) == '"') {
                        value = needle[i].replace(/"/g, "");
                    } else if (needle[i].substr(0,1) == "'") {
                        value = needle[i].replace(/'/g, "");
                    }
                }
                if (value != undefined) {break;}
            }
            if (value != undefined) {
                r = "{{" + needleToReplace + "}}";
                if (typ == "attribute") {
                    rowClone.value = rowClone.value.replace(r, value);
                } else {
                    ReplaceHTML(rowClone, r, value);
                }
            }
            pos1 = pos1 + 1;
        }
        return rowClone;
    }
    function ReplaceHTML(a, r, result) {
        var b, l, i, a, x, j;
        if (a.hasAttributes()) {
            b = a.attributes;
            l = b.length;
            for (i = 0; i < l; i += 1) {
                if (b[i].value.indexOf(r) > -1) {b[i].value = b[i].value.replace(r, result);}
            }
        }
        x = a.getElementsByTagName("*");
        l = x.length;
        a.innerHTML = a.innerHTML.replace(r, result);
    }
}
function IncludeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          elmnt.innerHTML = this.responseText;
          elmnt.removeAttribute("include-html");
          IncludeHTML();
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}
function Http(target, readyfunc, xml, method) {
    var httpObj;
    if (!method) {method = "GET"; }
    if (window.XMLHttpRequest) {
        httpObj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        httpObj = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (httpObj) {
        if (readyfunc) {httpObj.onreadystatechange = readyfunc;}
        httpObj.open(method, target, true);
        httpObj.send(xml);
    }
}