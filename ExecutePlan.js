
function run() {
    if (sourceEditor.getValue().trim() === "") {
        showError("Error", "Source code can't be empty!");
        return;
    } else {
        $runBtn.addClass("loading");
    }

    var pbUrl = "https://pb.judge0.com";

    var apiUrl = localStorageGetItem("api-url") || "https://api.judge0.com";

    function getIdFromURI() {
      return location.search.substr(1).trim();
    }


    function save() {
        var content = JSON.stringify({
            source_code: encode(sourceEditor.getValue()),
            language_id: $selectLanguage.val(),
            stdin: encode(stdinEditor.getValue()),
            stdout: encode(stdoutEditor.getValue()),
            stderr: encode(stderrEditor.getValue()),
            compile_output: encode(compileOutputEditor.getValue()),
            sandbox_message: encode(stderrEditor.getValue()),
            status_line: encode($statusLine.html())
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
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleError(jqXHR, textStatus, errorThrown);
            }
        });
    }

    function downloadSource() {
        var value = parseInt($selectLanguage.val());
        download(sourceEditor.getValue(), fileNames[value], "text/plain");
    }

    function loadSavedSource() {
        snipped_id = getIdFromURI();

        if (snipped_id.length == 36) {
            $.ajax({
                url: apiUrl + "/submissions/" + snipped_id + "?fields=source_code,language_id,stdin,stdout,stderr,compile_output,message,time,memory,status&base64_encoded=true",
                type: "GET",
                success: function(data, textStatus, jqXHR) {
                    sourceEditor.setValue(decode(data["source_code"]));
                    $selectLanguage.dropdown("set selected", data["language_id"]);
                    stdinEditor.setValue(decode(data["stdin"]));
                    stdoutEditor.setValue(decode(data["stdout"]));
                    stderrEditor.setValue(decode(data["stderr"]));
                    compileOutputEditor.setValue(decode(data["compile_output"]));
                    sandboxMessageEditor.setValue(decode(data["message"]));
                    var time = (data.time === null ? "-" : data.time + "s");
                    var memory = (data.memory === null ? "-" : data.memory + "KB");
                    $statusLine.html(`${data.status.description}, ${time}, ${memory}`);
                    changeEditorLanguage();
                },
                error: handleRunError
            });
        } else {
            $.ajax({
                url: pbUrl + "/" + snipped_id + ".json",
                type: "GET",
                success: function (data, textStatus, jqXHR) {
                    sourceEditor.setValue(decode(data["source_code"]));
                    $selectLanguage.dropdown("set selected", data["language_id"]);
                    stdinEditor.setValue(decode(data["stdin"]));
                    stdoutEditor.setValue(decode(data["stdout"]));
                    stderrEditor.setValue(decode(data["stderr"]));
                    compileOutputEditor.setValue(decode(data["compile_output"]));
                    sandboxMessageEditor.setValue(decode(data["sandbox_message"]));
                    $statusLine.html(decode(data["status_line"]));
                    changeEditorLanguage();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showError("Not Found", "Code not found!");
                    window.history.replaceState(null, null, location.origin + location.pathname);
                    loadRandomLanguage();
                }
            });
        }
    }


    stdoutEditor.setValue("");
    stderrEditor.setValue("");
    compileOutputEditor.setValue("");
    sandboxMessageEditor.setValue("");

    var sourceValue = encode(sourceEditor.getValue());
    var stdinValue = encode(stdinEditor.getValue());
    var languageId = $selectLanguage.val();

    if (languageId === "44") {
        sourceValue = sourceEditor.getValue();
    }



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
        },
        error: handleRunError
    });
}

function fetchSubmission(submission_token) {
    $.ajax({
        url: apiUrl + "/submissions/" + submission_token + "?base64_encoded=true",
        type: "GET",
        async: true,
        success: function (data, textStatus, jqXHR) {
            if (data.status.id <= 2) { // In Queue or Processing
                setTimeout(fetchSubmission.bind(null, submission_token), check_timeout);
                return;
            }
            handleResult(data);
        },
        error: handleRunError
    });
}

var data = {
    source_code: sourceValue,
    language_id: languageId,
    stdin: stdinValue
};

var stdinValue = encode(stdinEditor.getValue());

function changeEditorLanguage() {
    monaco.editor.setModelLanguage(sourceEditor.getModel(), $selectLanguage.find(":selected").attr("mode"));
    currentLanguageId = parseInt($selectLanguage.val());
    $(".lm_title")[0].innerText = fileNames[currentLanguageId];
}

function insertTemplate() {
    currentLanguageId = parseInt($selectLanguage.val());
    sourceEditor.setValue(sources[currentLanguageId]);
    changeEditorLanguage();
}

function loadRandomLanguage() {
    $selectLanguage.dropdown("set selected", Math.floor(Math.random() * $selectLanguage[0].length));
    insertTemplate();
}

//create editor depending on source

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

//select language id using filenames object

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
