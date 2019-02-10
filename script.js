var table = null;
var table_build = null;

var wis = 0;
var wis_perc = 0;
var dex = 0;
var dex_perc = 0;
var vit = 0;
var vit_perc = 0;
var atk = 0;
var atk_perc = 0;
var def = 0;
var def_perc = 0;
var spd = 0;
var spd_perc = 0;
var hp = 0;
var hp_perc = 0;
var mp = 0;
var mp_perc = 0;
var eva = 0;
var eva_perc = 0;
var loot_perc = 0;
var rof_perc = 0;

var all_stats = ["wis", "wis_perc", "dex", "dex_perc", "vit", "vit_perc", "atk", "atk_perc", "def", "def_perc", "spd", "spd_perc", "eva", "eva_perc", "loot_perc", "hp", "hp_perc", "mp", "mp_perc", "rof_perc"];
var start_id = [17, 23, 69, 75, 121, 127, 173, 179];
var selectedstart = null;
var selectedids = [];

var nbr_rune = 0;

var json_string = "";

data();
dataBuild();

function data() {
    $.get('table.json', function (data, status) {
        table = data;
        var rowcount = 0;
        var cellcount = 0;
        var pattern_cell = document.getElementById("template_cell").innerHTML;

        var pattern_row = document.getElementById("template_row").innerHTML;

        for (let i = 0; i < table.length; i++) {
            cell = pattern_cell
                .replace(/{{id}}/g, table[i].id)
                .replace(/{{img}}/g, table[i].img)
                .replace(/{{caption}}/g, table[i].placeholder)

            pattern_row = pattern_row
                .replace(/{{index}}/g, rowcount)
                .replace("{{cell" + cellcount + "}}", cell);
            cellcount++;
            if (cellcount > 12) {
                rowcount++;
                cellcount = 0;
                $("#data").append(pattern_row);
                pattern_row = document.getElementById("template_row").innerHTML;
            }
        }
        if (cellcount !== 0) {
            $("#data").append(pattern_row);
        }
    });
}

function dataBuild() {
    $.get('builds.json', function (data, status) {
        table_build = data;
    });
}

function selectitem(id) {
    var stats = table[id - 1].stats;

    if (nbr_rune == 0 && !isStart(id)) {
        return;
    } else if (selectedstart == null) {
        selectedstart = id;
    }

    if (nbr_rune > 0 && !isPossible(id) && selectedstart !== id) {
        return;
    }

    $("#" + id).toggleClass("opacity");

    if (!$("#" + id).hasClass("opacity") && nbr_rune < 82) {
        stats.forEach(function (item) {
            window[item.name] += item.qty;
        });
        selectedids.push(id);
        nbr_rune++;
        json_string += '{ "id": ' + id + ' },';
    } else if (canRemoveId(id) && selectedids.includes(id)) {
        stats.forEach(function (item) {
            window[item.name] -= item.qty;
        });
        selectedids = selectedids.remove(id);
        nbr_rune--;
    } else {
        $("#" + id).toggleClass("opacity");
    }

    if (nbr_rune == 0) {
        selectedstart = null;
    }

    update_show();
}

function isStart(id) {
    for (var i = 0; i < start_id.length; i++) {
        if (start_id[i] == id) {
            return true;
        }
    }

    return false;
}

function isPossible(id) {
    if (isStart(id)) {
        return false;
    }

    return checkPath(selectedids, id);
}

function checkPath(table, id) {
    var col_left = [1, 14, 27, 40, 53, 66, 79, 92, 105, 118, 131, 144, 157, 170, 183];
    var col_right = [13, 26, 39, 52, 65, 78, 91, 104, 117, 130, 143, 156, 169, 182, 195];

    for (let i = 0; i < table.length; i++) {
        if (id - 1 == table[i] && !col_left.includes(id)) {
            return true;
        } else if (id + 1 == table[i] && !col_right.includes(id)) {
            return true;
        } else if (id - 13 == table[i]) {
            return true;
        } else if (id + 13 == table[i]) {
            return true;
        }
    }

    return false;
}

function canRemoveId(id) {
    var temp_table = selectedids.slice();
    var checkNeig = checkNeighbours(temp_table.remove(id), selectedstart);

    if (selectedstart == id && selectedids.length > 1) {
        return false;
    }

    if (checkNeig.length == 0) {
        return true;
    }

    return false;
}

function checkNeighbours(table, id) {
    var list_neighbour = [];
    var temp_table = table.slice();
    for (let i = 0; i < table.length; i++) {
        if (id - 1 == table[i]) {
            list_neighbour.push(table[i]);
        } else if (id + 1 == table[i]) {
            list_neighbour.push(table[i]);
        } else if (id - 13 == table[i]) {
            list_neighbour.push(table[i]);
        } else if (id + 13 == table[i]) {
            list_neighbour.push(table[i]);
        }
    }
    temp_table.remove(id);
    for (let i = 0; i < list_neighbour.length; i++) {
        temp_table = checkNeighbours(temp_table, list_neighbour[i]);
    }
    return temp_table;
}

function update_show() {
    var html = "";
    $("#nbr_rune").html(nbr_rune);

    all_stats.forEach(function (item) {
        word = item.split('_');
        perc = "";

        if (word[1] !== undefined) {
            perc = "%";
        }

        if (window[item] !== 0) {
            html += window[item] + perc + " " + word[0] + "<br>";
        }
    });

    $("#stats").html(html);

}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


function defaultBuild(id) {
    resetTree();

    for (let i = 0; i < table_build.length; i++) {
        if (id == table_build[i].id) {
            for (let j = 0; j < table_build[i].ids.length; j++) {
                selectitem(table_build[i].ids[j].id);
            }

            for (let j = 0; j < table_build[i].runes.length; j++) {
                last_rune_selected = table_build[i].runes[j].rune_id;
                updateRune(table_build[i].runes[j].name);
            }
        }
    }
}

function resetTree() {
    var img = "";

    all_stats.forEach(function (item) {
        window[item] = 0;
    });

    for (let i = 1; i < 196; i++) {
        if (!$("#" + i).hasClass("opacity")) {
            $("#" + i).toggleClass("opacity");
        }
    }

    selectedstart = null;
    selectedids = [];
    nbr_rune = 0;

    if (document.getElementById("cbx").checked) {
        img = "images/empty_rune_dmode.png";
    } else {
        img = "images/empty_rune.png";
    }

    for (let i = 1; i < 5; i++) {
        document.getElementById("rune" + i).getElementsByTagName('img')[0].src = img;
        document.getElementById("rune" + i).getElementsByTagName('figcaption')[0].innerHTML = "";
        document.getElementById("stats_rune").innerHTML = "";
    }

    last_red = null;
    last_green = null;
    last_blue = null;
    last_yellow = null;

    update_show();
}

function initClasses() {
    var classes = [];

    html = "<option id='class0' selected value> -- select a class -- </option>";
    for (let i = 0; i < table_build.length; i++) {
        if (!classes.includes(table_build[i].class)) {
            html += "<option id='class" + table_build[i].id + "'>" + table_build[i].class + "</option>"
        }
        classes.push(table_build[i].class);
    }

    document.getElementById('classes').innerHTML = html;
}

$(function (document) {
    $("#classes").change(function () {
        var classChose = $('#classes').find(":selected").html();
        html = "<option id='build0' selected value> -- select a build -- </option>";

        if (classChose == ' -- select a class -- ') {
            resetTree();
            $('#builds_box').attr("hidden",true);
            return;
        }
        
        $('#builds_box').attr("hidden",false);

        for (let i = 0; i < table_build.length; i++) {
            if (classChose == table_build[i].class) {
                html += "<option id='build" + table_build[i].id + "'>" + table_build[i].name + "</option>"
            }
        }

        $('#builds').html(html);
    });
});

$(function (document) {
    $("#builds").change(function () {
        var conceptName = $('#builds').find(":selected").attr("id");
        var splitName = conceptName.split('build');
        if (splitName[1] == 0) {
            resetTree();
            return;
        }
        defaultBuild(splitName[1]);
    });
});


$(function (document) {
    initClasses();
});

$(function (document) {
    $("#cbx").change(function () {
        var wmode = "images/empty_rune.png";
        var dmode = "images/empty_rune_dmode.png";
        var rune1 = $("#rune1 img")[0];
        var rune2 = $("#rune2 img")[0];
        var rune3 = $("#rune3 img")[0];
        var rune4 = $("#rune4 img")[0];

        if (rune1.src.includes(wmode) || rune1.src.includes(dmode)) {
            if (rune1.src.includes(dmode)) {
                rune1.src = wmode;
            } else {
                rune1.src = dmode;
            }
        }

        if (rune2.src.includes(wmode) || rune2.src.includes(dmode)) {
            if (rune2.src.includes(dmode)) {
                rune2.src = wmode;
            } else {
                rune2.src = dmode;
            }
        }

        if (rune3.src.includes(wmode) || rune3.src.includes(dmode)) {
            if (rune3.src.includes(dmode)) {
                rune3.src = wmode;
            } else {
                rune3.src = dmode;
            }
        }

        if (rune4.src.includes(wmode) || rune4.src.includes(dmode)) {
            if (rune4.src.includes(dmode)) {
                rune4.src = wmode;
            } else {
                rune4.src = dmode;
            }
        }


        $("body").toggleClass('darkmode');

    });
});