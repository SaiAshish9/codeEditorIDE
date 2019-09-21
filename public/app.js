var apiUrl = localStorageGetItem("api-url") || "https://api.judge0.com";
var wait = localStorageGetItem("wait") || false;
var stdoutEditor=$("#editor2");
var stdinEditor=$("#editor1");
var sourceEditor=$("#editor");
var pbUrl = "https://pb.judge0.com";
var check_timeout = 200;
var timeEnd;
var timeStart;


console.log(stdoutEditor.val());

function encode(str) {
    return btoa(unescape(encodeURIComponent(str || "")));
}

function decode(bytes) {
    var escaped = escape(atob(bytes || ""));
    try {
        return decodeURIComponent(escaped);
    } catch {
        return unescape(escaped);
    }
}

function localStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (ignorable) {
  }
}

function localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (ignorable) {
    return null;
  }
}

function handleResult(data) {
    timeEnd = performance.now();
    console.log("It took " + (timeEnd - timeStart) + " ms to get submission result.");

    var status = data.status;
    var stdout = decode(data.stdout);
console.log(stdout);
// alert(stdout);
    // $('input').val(stdout);
    // document.getElementById("editor").value=stdout;
    // stdoutEditor.setValue(stdout);
    // document.getElementById("editor2").innerHTML=stdout;
    // console.log(stdoutEditor.val());
    var textArea = document.getElementById('editor2');

    var editor = CodeMirror.fromTextArea
    (document.getElementById('editor2'),{
      theme:"darcula",
      lineNumbers:true,
      autoCloseTags:true,
      tabMode: "indent",
      overwrite:true
    })
    editor.setSize("608","150");
    editor.getDoc().setValue(stdout);
}


function getIdFromURI() {
  return location.search.substr(1).trim();
}

function save() {
    var content = JSON.stringify({
        source_code: encode(sourceEditor.val()),
        language_id: $selectLanguage.val(),
        stdin: encode(stdinEditor.val()),
        stdout: encode(stdoutEditor.val()),
    });
    var filename = "judge0-ide.json";
    var data = {
        content: content,
        filename: filename
    };

    $.ajax({
        url: pbUrl,
        type: "POST",
        async: true,
        headers: {
            "Accept": "application/json"
        },
        data: data,
        success: function (data, textStatus, jqXHR) {
            if (getIdFromURI() != data["short"]) {
                window.history.replaceState(null, null, location.origin + location.pathname + "?" + data["short"]);
            }
        }
    });
}

function run() {
    if (sourceEditor.val().trim() === "") {
        return;
    }



    stdoutEditor.val("");


    var sourceValue = encode(sourceEditor.val());
    var stdinValue = encode(stdinEditor.val());
    var languageId = $("#option").attr("value");

    // 10;



    var data = {
        source_code: sourceValue,
        language_id: languageId,
        stdin: stdinValue
    };

    timeStart = performance.now();
    $.ajax({
        url: apiUrl + `/submissions?base64_encoded=true&wait=${wait}`,
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
            console.log(`Your submission token is: ${data.token}`);
            if (wait == true) {
                handleResult(data);
            } else {
                setTimeout(fetchSubmission.bind(null, data.token), check_timeout);
            }
        }
    });
}

function fetchSubmission(submission_token) {
    $.ajax({
        url: apiUrl + "/submissions/" + submission_token + "?base64_encoded=true",
        type: "GET",
        async: true,
        success: function (data, textStatus, jqXHR) {
            if (data.status.id <= 2) {
                setTimeout(fetchSubmission.bind(null, submission_token), check_timeout);
                return;
            }
            handleResult(data);
        }    });
}



$(document).ready(function () {
  $runBtn = $("#run");
  console.log(sourceEditor.val());
  $runBtn.click(function (e) {
    console.log("clicked on run");

      run();
  });

})

var fileNames = {
    1: "script.sh",
    2: "script.sh",
    3: "main.bas",
    4: "main.c",
    5: "main.c",
    6: "main.c",
    7: "main.c",
    8: "main.c",
    9: "main.c",
    10: "main.cpp",
    11: "main.cpp",
    12: "main.cpp",
    13: "main.cpp",
    14: "main.cpp",
    15: "main.cpp",
    16: "Main.cs",
    17: "Main.cs",
    18: "main.clj",
    19: "main.cr",
    20: "main.exs",
    21: "main.erl",
    22: "main.go",
    23: "main.hs",
    24: "main.hs",
    25: "main.ins",
    26: "Main.java",
    27: "Main.java",
    28: "Main.java",
    29: "main.js",
    30: "main.js",
    31: "main.ml",
    32: "file.m",
    33: "main.pas",
    34: "main.py",
    35: "main.py",
    36: "main.py",
    37: "main.py",
    38: "main.rb",
    39: "main.rb",
    40: "main.rb",
    41: "main.rb",
    42: "main.rs",
    43: "source.txt",
    44: "a.out"
};
