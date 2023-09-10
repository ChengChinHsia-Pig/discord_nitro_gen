(function () {
    var oldLog = console.log;
    console.log = function (message) {
        document.getElementById('a').value += message
        oldLog.apply(arguments);
    };
})();

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
var textarea = document.getElementById('a')
if (navigator.userAgent.indexOf('Mobile') !== -1) {
    document.getElementById('save').style.display = "none";
    textarea.style.height = "500px";
} //resize for mobile

// check the url is available
function checkCodeValidity(code) {
    return fetch("https://discordapp.com/api/v6/entitlements/gift-codes/" + code + "?with_application=false&with_subscription_plan=true")
        .then(function (response) {
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        })
        .catch(function (error) {
            console.error(error);
            return false;
        });
}

function generate() {
    var triesPerSecond = document.getElementById('speed').value //self explanatory

    function getGiftCode() {
        let code = '';
        let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (var i = 0; i < 16; i++) {
            code = code + dict.charAt(Math.floor(Math.random() * dict.length));
        }

        checkCodeValidity(code).then(function (isCodeValid) {
            if (isCodeValid) {
                console.log('https://discord.gift/' + code + " (Available)\n");
            } else {
                console.log('https://discord.gift/' + code + " (Unavailable)\n");
            }
        });

        code += '\n'
        document.getElementById('b').value += "https://discord.gift/" + code;
    } //generates codes

    getGiftCode();

    document.getElementById('stop').addEventListener("click", stop); //binds button stop to function stop
    function stop() {
        clearInterval(gInterval);
        clearInterval(interval)
    } //stop generating and stop console scroll loop

    var gInterval = setInterval(() => {
        getGiftCode();
    }, (1 / triesPerSecond) * 1000);
    //repeat making codes

    function scroll() {
        document.getElementById("a").scrollTop = document.getElementById("a").scrollHeight
    }; // auto scroll
    var interval = setInterval(scroll, 100) //keep on making "console" scroll
    document.getElementById('clear').addEventListener("click", stop);
}

document.getElementById('generate').addEventListener("click", generate);