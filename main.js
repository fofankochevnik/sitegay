const API = "https://sitelesbi.onrender.com";

const text = document.getElementById("text");
const file = document.getElementById("file");
const send = document.getElementById("send");
const messages = document.getElementById("messages");

async function loadMessages(){

    const req = await fetch(API + "/messages");
    const data = await req.json();

    messages.innerHTML = "";

    data.reverse().forEach(msg => {

        const div = document.createElement("div");
        div.className = "message";

        if(msg.text){

            const textDiv = document.createElement("div");
            textDiv.className = "message-text";

            let short = msg.text;

            if(msg.text.length > 100){
                short = msg.text.slice(0,100) + "...";
            }

            textDiv.textContent = short;

            div.appendChild(textDiv);

            if(msg.text.length > 100){

                const expand = document.createElement("div");
                expand.className = "expand";
                expand.textContent = "Развернуть";

                let opened = false;

                expand.onclick = () => {

                    opened = !opened;

                    if(opened){
                        textDiv.textContent = msg.text;
                        expand.textContent = "Свернуть";
                    }else{
                        textDiv.textContent = short;
                        expand.textContent = "Развернуть";
                    }
                };

                div.appendChild(expand);
            }

            const copy = document.createElement("button");
            copy.className = "action";
            copy.textContent = "Скопировать";

            copy.onclick = () => {
                navigator.clipboard.writeText(msg.text);
            };

            div.appendChild(copy);
        }

        if(msg.file){

            const fileName = document.createElement("div");
            fileName.className = "file-name";
            fileName.textContent = msg.file;

            div.appendChild(fileName);

            const download = document.createElement("a");
            download.className = "action";
            download.href = API + "/uploads/" + msg.file;
            download.textContent = "Скачать";
            download.download = msg.file;

            div.appendChild(download);
        }

        messages.appendChild(div);

    });

}

send.onclick = async () => {

    const form = new FormData();

    form.append("text", text.value);

    if(file.files[0]){
        form.append("file", file.files[0]);
    }

    await fetch(API + "/send", {
        method:"POST",
        body:form
    });

    text.value = "";
    file.value = "";

    loadMessages();
};

loadMessages();

setInterval(loadMessages, 3000);
