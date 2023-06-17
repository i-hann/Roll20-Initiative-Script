on('ready', function () {

    on('chat:message', async function (msg) {
        if ((msg.type === 'api') && (msg.content.match(/^!init/i)) && (typeof msg.selected != 'undefined') && (playerIsGM(msg.playerid))) {
            for (var i = 0; i < (msg.selected).length; i++) {
                /*   msg.selected is an array of objects that look like this: 
                            {
                                 _type: <typename> ,
                                _id: <id> 
                            }
                */
                //Get selected token object
                var tokenId = msg.selected[i]._id;
                var tokenObj = await getObj('graphic', tokenId);

                //Get string from bar 1 and convert to number
                var bar1 = tokenObj.get('bar1_value');
                var initMod = Number(bar1);

                //Get name
                var name = tokenObj.get('name');

                //Roll initiative
                var d20 = randomInteger(20);
                var result = d20 + initMod;

                //Display it
                var displayMessage = "&{template:default}{{name=" + name + "}}{{Initiative=(" + d20 + ") + " + initMod + " = " + result + "}}";
                sendChat("initiative.js", displayMessage);

                //Get the turn order
                var turnorder;
                if (Campaign().get("turnorder") == "") {
                    turnorder = [];
                } else {
                    turnorder = JSON.parse(Campaign().get("turnorder"));
                }

                //Add to turn order
                turnorder.push({
                    id: tokenId,
                    pr: result,
                    custom: "",
                    _pageid: Campaign().get("playerpageid")
                });
                Campaign().set("turnorder", JSON.stringify(turnorder));

            }
        }
    })

})
