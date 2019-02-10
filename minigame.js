var boss_table = null;
var stuff_table = null;
var consumable_table = null;

var player = {
    damage_min: 0,
    damage_max: 0,
    shots: 0,
    experience: 0,
    level: 1,
    atk: 0,
    def: 0,
    spd: 0,
    dex: 0,
    vit: 0,
    wis: 0
}

var ennemy = {
    name: null,
    hp: 0,
    current_hp: 0,
    experience: 0
}

getDataBosses();
getDataStuff();
getDataConsumable();


function getDataBosses() {
    $.get('boss.json', function (data, status) {
        boss_table = data;
    });
}

function getDataStuff() {
    $.get('stuff.json', function (data, status) {
        stuff_table = data;
    });
}

function getDataConsumable() {
    $.get('consumable.json', function (data, status) {
        consumable_table = data;
    });
}

$(function (document) {
    getStatsChampion();
    levelUp();
});

function getStatsChampion() {
    var slots = ["weapon", "ability", "armor", "ring"];
    var stats = ["damage_min", "damage_max", "shots", "def"];
    var stats_princ = ["atk", "def", "spd", "dex", "vit", "wis"];

    for (let i = 0; i < stats.length; i++) {
        player[stats[i]] = 0;
    }

    for (let k = 0; k < slots.length; k++) {
        var slot = document.getElementById(slots[k]).src.split('/');
        var sl = slot[slot.length - 1].split('.');

        for (let i = 0; i < stuff_table.length; i++) {
            if (stuff_table[i].id == sl[0]) {
                for (let j = 0; j < stats.length; j++) {
                    if(stuff_table[i][stats[j]] !== undefined){
                        player[stats[j]] += stuff_table[i][stats[j]];
                    }
                }
            }
        }
    }

    for (let i = 0; i < stats_princ.length; i++) {
        document.getElementById(stats_princ[i]).innerHTML = player[stats_princ[i]];
    }
}

function teleportation() {
    var teleporter = document.getElementById('boss');

    if (teleporter.src.includes("clicker/nexus.png")) {
        $("#portal").html('<img src="clicker/home.png" /> HOME !');
        newBoss();
    } else {
        teleporter.src = "clicker/nexus.png";
        document.getElementById('boss-hp').innerHTML = "";
        $("#portal").html('<img src="clicker/portal.png" /> FIGHT !');
    }
}

function newBoss() {
    var boss_name = [];
    for (let i = 0; i < boss_table.length; i++) {
        if (player.level >= boss_table[i].level_min && player.level <= boss_table[i].level_max) {
            boss_name.push(boss_table[i].name);
        }
    }

    var rand_boss = boss_name[Math.floor(Math.random() * boss_name.length)];
    boss(rand_boss);
}

function boss(boss_name) {
    var boss = document.getElementById('boss');
    boss.src = "clicker/bosses/" + boss_name + ".png";

    for (let i = 0; i < boss_table.length; i++) {
        if (boss_table[i].name == boss_name) {
            var hp_min = boss_table[i].hp_min;
            var hp_max = boss_table[i].hp_max;
            var damage = boss_table[i].damage;
            ennemy.experience = boss_table[i].experience;
            ennemy.name = boss_table[i].name;
        }
    }

    ennemy.hp = Math.floor(Math.random() * (hp_max - hp_min + 1) + hp_min);
    ennemy.current_hp = ennemy.hp;

    updateBoss(0);
}

function updateBoss(damage_done) {
    ennemy.current_hp -= damage_done;
    perc_hp = (ennemy.current_hp * 100) / ennemy.hp;
    if (ennemy.current_hp > 0) {
        document.getElementById('boss-hp').innerHTML = "<br><div class='progress'><div id='boss-hp' class='progress-bar bg-danger' style='width: " + perc_hp + "%;' aria-valuenow='" + ennemy.current_hp + "' aria-valuemin='0' aria-valuemax='" + ennemy.hp + "'><span>" + ennemy.current_hp + " HP</span></div></div>";
    } else {
        player.experience += ennemy.experience;
        levelUp();
        rollLoot();
        newBoss();
    }
}

function damaging(element) {
    if (!element.src.includes('nexus.png')) {
        var current_damage = Math.floor(Math.random() * (player.damage_max - player.damage_min + 1) + player.damage_min);
        updateBoss(current_damage);
    }
}

function levelUp() {
    var exp_table = [0, 50, 200, 450, 800, 1250, 1800, 2450, 3200, 4050, 5000, 6050, 7200, 8450, 9800, 11250, 12800, 14450, 16200, 18050];
    var count = 0;

    exp_table.forEach(function (item) {
        if (player.experience >= item) {
            count++;
        }
    });

    player.level = count;

    if (count < 20) {
        var exp_now = player.experience - exp_table[count - 1];
        var exp_max = exp_table[count] - exp_table[count - 1];
        var perc_exp = (exp_now * 100) / exp_max;
        document.getElementById('char_exp').innerHTML = "<div class='progress' style='height: 30px;'><div id='char_exp' class='progress-bar bg-warning' style='width: " + perc_exp + "%;' aria-valuenow='" + exp_now + "' aria-valuemin='0' aria-valuemax='" + exp_max + "'><span>Level " + count + " : " + exp_now + " / " + exp_max + "</span></div></div>";
    } else {
        document.getElementById('char_exp').innerHTML = "<div class='progress' style='height: 30px;'><div id='char_exp' class='progress-bar bg-warning' style='width: 100%;' aria-valuenow='18050' aria-valuemin='0' aria-valuemax='18050'><span>Level 20</span></div></div>";
    }

}

function rollLoot() {
    var loot = [];
    var chance = [];

    var cumulativ = 0;
    var count = 0;

    var loot_gave = false;

    for (let i = 0; i < boss_table.length; i++) {
        if (boss_table[i].name == ennemy.name) {
            for (let j = 0; j < boss_table[i].loots.length; j++) {
                loot.push(boss_table[i].loots[j].name);
                chance.push(boss_table[i].loots[j].chance);
            }
        }
    }

    var random = Math.floor(Math.random() * 100) + 1;

    chance.forEach(function (item) {
        cumulativ += item;
        if (random < cumulativ && !loot_gave) {
            var res = isStuff(loot[count]);
            if (res !== "null") {
                giveLoot(loot[count], "classes/" + res.split('_')[2] + "/");
                loot_gave = true;
            } else {
                giveLoot(loot[count]);
                loot_gave = true;
            }
        }
        count++;
    });
}

function isStuff(name) {
    for (let i = 0; i < stuff_table.length; i++) {
        if (stuff_table[i].id == name) {
            return stuff_table[i].id + "_" + stuff_table[i].class;
        }
    }

    return "null";
}

function giveLoot(name, url = "") {
    var inventory = ["8", "7", "6", "5", "4", "3", "2", "1"];
    var id_empty = "";

    inventory.forEach(function (item) {
        var inv = "inv" + item;
        if (document.getElementById(inv).getAttribute("item") == "null") {
            id_empty = inv;
        }
    });

    if (id_empty !== "") {
        document.getElementById(id_empty).src = "clicker/" + url + name + ".png";
        document.getElementById(id_empty).setAttribute("item", name);
    }
}

function activateItem(element) {
    var loot_table = [];
    var chance_table = [];
    var item_selected = document.getElementById(element.id).getAttribute("item");

    if (item_selected !== null) {
        for (let i = 0; i < consumable_table.length; i++) {
            if (consumable_table[i].name == item_selected) {
                for (let j = 0; j < consumable_table[i].loots.length; j++) {
                    loot_table.push(consumable_table[i].loots[j].name);
                    chance_table.push(consumable_table[i].loots[j].chance);
                }
            }
        }
    }

    if (loot_table.length !== 0 && chance_table.length !== 0) {
        var item = rollLootItem(loot_table, chance_table);
        var item_split = item.split("/");
        var item_name = item_split[0];
        var item_url = "classes/" + item_split[1] + "/";
        document.getElementById(element.id).src = "";
        document.getElementById(element.id).setAttribute("item", "null");
        giveLoot(item_name, item_url);
    } else {
        var itm = document.getElementById(element.id).getAttribute("src").split('/');
        var itm_name = itm[3].split('.')[0];
        var itm_class = itm[2];
        equipItem(element.id, itm_name, itm_class);
    }
}

function rollLootItem(loot, chance) {
    var random = Math.floor(Math.random() * 100) + 1;
    var cumulativ = 0;
    var finish = false;
    var res = "";

    for (let i = 0; i < chance.length; i++) {
        cumulativ += chance[i];
        if (random <= cumulativ && !finish) {
            res = loot[i];
            finish = true;
        }
    }

    return res;
}

function equipItem(id, item_name, item_class) {
    var item_slot = item_name.split('_')[0];
    var equip_slot = "";

    if (item_slot == "weapon") {
        equip_slot = "weapon";
    } else if (item_slot == "ability") {
        equip_slot = "ability";
    } else if (item_slot == "armor") {
        equip_slot = "armor";
    } else if (item_slot == "ring") {
        equip_slot = "ring";
    }

    var last_equip = document.getElementById(equip_slot).getAttribute("src");
    var new_equip = "clicker/classes/" + item_class + "/" + item_name + ".png";

    document.getElementById(equip_slot).src = new_equip;
    document.getElementById(id).src = last_equip;

    if (last_equip == "") {
        document.getElementById(id).setAttribute("item", "null");
    }

    getStatsChampion();
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    document.getElementById(data).src = "";
    document.getElementById(data).setAttribute("item", "null");
}