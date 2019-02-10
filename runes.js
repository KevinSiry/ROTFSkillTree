var last_rune_selected = null;

var datas = null;

var last_red = null;
var last_green = null;
var last_blue = null;
var last_yellow = null;

data_red();
data_green();
data_blue();

function getData(name) {
    var res = "";

    for (let i = 0; i < datas.length; i++) {
        if (name == datas[i].name) {
            res = datas[i].fullname;
            return res;
        }
    }

    return res;
}

function data_red() {
    $.get('runes.json', function (data, status) {
        datas = data;

        var red_rune = document.getElementById("template_red_rune").innerHTML;
        var title = "";

        for (let i = 0; i < datas.length; i++) {
            if (datas[i].color == "red") {
                title = datas[i].fullname + "\n\n" + datas[i].bonuses + "\n" + datas[i].drawbacks;
                red = red_rune
                    .replace(/{{id}}/g, datas[i].id)
                    .replace(/{{name}}/g, datas[i].name)
                    .replace(/{{title}}/g, title)
                    .replace(/{{caption}}/g, datas[i].fullname)

                $(".rune_red").append(red);
            }
        }
    });
}

function data_green() {
    $.get('runes.json', function (data, status) {
        datas = data;

        var green_rune = document.getElementById("template_green_rune").innerHTML;
        var title = "";

        for (let i = 0; i < datas.length; i++) {
            if (datas[i].color == "green") {
                title = datas[i].fullname + "\n\n" + datas[i].bonuses + "\n" + datas[i].drawbacks;
                green = green_rune
                    .replace(/{{id}}/g, datas[i].id)
                    .replace(/{{name}}/g, datas[i].name)
                    .replace(/{{title}}/g, title)
                    .replace(/{{caption}}/g, datas[i].fullname)

                $(".rune_green").append(green);
            }
        }
    });
}

function data_blue() {
    $.get('runes.json', function (data, status) {
        datas = data;

        var blue_rune = document.getElementById("template_blue_rune").innerHTML;
        var title = "";

        for (let i = 0; i < datas.length; i++) {
            if (datas[i].color == "blue") {
                title = datas[i].fullname + "\n\n" + datas[i].bonuses + "\n" + datas[i].drawbacks;
                blue = blue_rune
                    .replace(/{{id}}/g, datas[i].id)
                    .replace(/{{name}}/g, datas[i].name)
                    .replace(/{{title}}/g, title)
                    .replace(/{{caption}}/g, datas[i].fullname)

                $(".rune_blue").append(blue);
            }
        }
    });
}

function updateStatsRune() {
    var html_bonuses = "";
    var html_drawbacks = "";

    $.get('runes.json', function (data, status) {
        table_rune = data;

        for (let i = 0; i < table_rune.length; i++) {
            if (last_red == table_rune[i].name) {
                html_bonuses += "• " + table_rune[i].bonuses + "<br>";
                html_drawbacks += "• " + table_rune[i].drawbacks + "<br>";
            } else if (last_green == table_rune[i].name) {
                html_bonuses += "• " + table_rune[i].bonuses + "<br>";
                html_drawbacks += "• " + table_rune[i].drawbacks + "<br>";
            } else if (last_blue == table_rune[i].name) {
                html_bonuses += "• " + table_rune[i].bonuses + "<br>";
                html_drawbacks += "• " + table_rune[i].drawbacks + "<br>";
            } else if (last_yellow == table_rune[i].name) {
                html_bonuses += "• " + table_rune[i].bonuses + "<br>";
                html_drawbacks += "• " + table_rune[i].drawbacks + "<br>";
            }
        }
        if (html_bonuses !== "") {
            html_bonuses = "<h1>Bonuses</h1>" + html_bonuses;
        }

        if (html_drawbacks !== "") {
            html_drawbacks = "<h1>Drawbacks</h1>" + html_drawbacks;
        }


        document.getElementById('stats_rune').innerHTML = html_bonuses + html_drawbacks;
    });

}

function modal(element, color) {
    var modal_red = document.getElementById('modal_red');
    var modal_green = document.getElementById('modal_green');
    var modal_blue = document.getElementById('modal_blue');
    var modal_yellow = document.getElementById('modal_yellow');
    var dmode = "";
    last_rune_selected = element;

    if(document.getElementById('cbx').checked){
        dmode = "images/empty_rune_dmode.png";
    } else {
        dmode = "images/empty_rune.png";
    }

    if (color == 'red' && document.getElementById('rune1').getElementsByTagName('img')[0].src.includes('empty_rune')) {
        modal_red.style.display = "block";
    } else if(color == 'red'){
        document.getElementById('rune1').getElementsByTagName('img')[0].src = dmode;
        document.getElementById('rune1').getElementsByTagName('figcaption')[0].innerHTML = "";
        last_red = null;
    }

    if (color == 'green' && document.getElementById('rune2').getElementsByTagName('img')[0].src.includes('empty_rune')) {
        modal_green.style.display = "block";
    } else if(color == 'green') {
        document.getElementById('rune2').getElementsByTagName('img')[0].src = dmode;
        document.getElementById('rune2').getElementsByTagName('figcaption')[0].innerHTML = "";
        last_green = null;
    }

    if (color == 'blue' && document.getElementById('rune3').getElementsByTagName('img')[0].src.includes('empty_rune')) {
        modal_blue.style.display = "block";
    } else if(color == 'blue') {
        document.getElementById('rune3').getElementsByTagName('img')[0].src = dmode;
        document.getElementById('rune3').getElementsByTagName('figcaption')[0].innerHTML = "";
        last_blue = null;
    }

    if (color == 'yellow' && document.getElementById('rune4').getElementsByTagName('img')[0].src.includes('empty_rune')) {
        modal_yellow.style.display = "block";
    } else if(color == 'yellow') {
        document.getElementById('rune4').getElementsByTagName('img')[0].src = dmode;
        document.getElementById('rune4').getElementsByTagName('figcaption')[0].innerHTML = "";
        last_yellow = null;
    }

    updateStatsRune();
}

window.onclick = function (event) {
    var modal_red = document.getElementById('modal_red');
    var modal_green = document.getElementById('modal_green');
    var modal_blue = document.getElementById('modal_blue');
    var modal_yellow = document.getElementById('modal_yellow');

    if (event.target == modal_red) {
        modal_red.style.display = "none";
    } else if (event.target == modal_green) {
        modal_green.style.display = "none";
    } else if (event.target == modal_blue) {
        modal_blue.style.display = "none";
    } else if (event.target == modal_yellow) {
        modal_yellow.style.display = "none";
    }
}

function updateRune(name) {
    var modal_red = document.getElementById('modal_red');
    var modal_green = document.getElementById('modal_green');
    var modal_blue = document.getElementById('modal_blue');
    var modal_yellow = document.getElementById('modal_yellow');

    var rune = document.getElementById(last_rune_selected);
    var myImg = rune.getElementsByTagName('img')[0];

    if (name == last_red || name == last_blue || name == last_green || name == last_yellow) {
        return;
    }

    var fullname = getData(name);

    if (last_rune_selected == 'rune1') {
        last_red = name;
        document.getElementById('last_r').innerHTML = fullname;
    } else if (last_rune_selected == 'rune2') {
        last_green = name;
        document.getElementById('last_g').innerHTML = fullname;
    } else if (last_rune_selected == 'rune3') {
        last_blue = name;
        document.getElementById('last_b').innerHTML = fullname;
    } else if (last_rune_selected == 'rune4') {
        last_yellow = name;
        document.getElementById('last_y').innerHTML = fullname;
    }


    myImg.src = "images/" + name + ".png";
    updateStatsRune();

    modal_red.style.display = "none";
    modal_green.style.display = "none";
    modal_blue.style.display = "none";
    modal_yellow.style.display = "none";
}