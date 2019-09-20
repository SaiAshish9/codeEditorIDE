var apiUrl =  "https://api.judge0.com";
var stdoutEditor=$("#editor2");
var stdinEditor=$("#editor1");
var sourceEditor=$("#editor");
var pbUrl = "https://pb.judge0.com";
var check_timeout = 200;
var timeEnd;
var timeStart;


$(document).ready(function () {
  $runBtn = $("#run");
  $runBtn.click(function (e) {
      run();
  });

})

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

function handleResult(data) {
    timeEnd = performance.now();
    console.log("It took " + (timeEnd - timeStart) + " ms to get submission result.");

    var status = data.status;
    var stdout = decode(data.stdout);

    stdoutEditor.setValue(stdout);
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

function getIdFromURI() {
  return location.search.substr(1).trim();
}

function save() {
    var content = JSON.stringify({
        source_code: encode(sourceEditor.getValue()),
        language_id: $selectLanguage.val(),
        stdin: encode(stdinEditor.getValue()),
        stdout: encode(stdoutEditor.getValue()),
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
    if (sourceEditor.getValue().trim() === "") {
        return;
    }



    stdoutEditor.setValue("");
    stderrEditor.setValue("");


    var sourceValue = encode(sourceEditor.getValue());
    var stdinValue = encode(stdinEditor.getValue());
    var languageId = $('#option').val();

    if (languageId === "44") {
        sourceValue = sourceEditor.getValue();
    }

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



var sources = {
    1: bashSource,
    2: bashSource,
    3: basicSource,
    4: cSource,
    5: cSource,
    6: cSource,
    7: cSource,
    8: cSource,
    9: cSource,
    10: cppSource,
    11: cppSource,
    12: cppSource,
    13: cppSource,
    14: cppSource,
    15: cppSource,
    16: csharpSource,
    17: csharpSource,
    18: clojureSource,
    19: crystalSource,
    20: elixirSource,
    21: erlangSource,
    22: goSource,
    23: haskellSource,
    24: haskellSource,
    25: insectSource,
    26: javaSource,
    27: javaSource,
    28: javaSource,
    29: javaScriptSource,
    30: javaScriptSource,
    31: ocamlSource,
    32: octaveSource,
    33: pascalSource,
    34: pythonSource,
    35: pythonSource,
    36: pythonSource,
    37: pythonSource,
    38: rubySource,
    39: rubySource,
    40: rubySource,
    41: rubySource,
    42: rustSource,
    43: textSource,
    44: executableSource,
};
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
